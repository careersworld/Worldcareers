'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Users, TrendingUp, Clock, UserCheck } from 'lucide-react'

interface UserAnalytics {
  id: string
  email: string
  role: string
  first_name: string | null
  last_name: string | null
  created_at: string
  last_sign_in_at: string | null
}

export function UserAnalytics() {
  const [users, setUsers] = useState<UserAnalytics[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalUsers: 0,
    newToday: 0,
    activeToday: 0,
    candidates: 0,
    employers: 0,
    admins: 0
  })

  useEffect(() => {
    fetchUserAnalytics()
  }, [])

  const fetchUserAnalytics = async () => {
    try {
      const { createClient } = await import('@/lib/supabase/client')
      const supabase = createClient()

      // Fetch all users from the unified view
      const { data: profiles, error: profileError } = await supabase
        .from('all_users')
        .select('*')
        .order('created_at', { ascending: false })

      if (profileError) throw profileError

      // Use profiles as the source of truth
      const mergedUsers = profiles?.map((profile: any) => {
        return {
          id: profile.id,
          email: profile.email || 'N/A',
          role: profile.role || 'candidate',
          first_name: profile.first_name || (profile.company_name ? profile.company_name : null),
          last_name: profile.last_name || null,
          created_at: profile.created_at,
          last_sign_in_at: null // Not available in this view
        }
      }) || []

      setUsers(mergedUsers)

      // Calculate stats
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      const stats = {
        totalUsers: mergedUsers.length,
        newToday: mergedUsers.filter(u => new Date(u.created_at) >= today).length,
        activeToday: mergedUsers.filter(u => u.last_sign_in_at && new Date(u.last_sign_in_at) >= today).length,
        candidates: mergedUsers.filter(u => u.role === 'candidate').length,
        employers: mergedUsers.filter(u => u.role === 'employer').length,
        admins: mergedUsers.filter(u => u.role === 'admin').length
      }

      setStats(stats)
    } catch (error) {
      console.error('Error fetching user analytics:', error)
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (date: string | null) => {
    if (!date) return 'Never'
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800'
      case 'employer': return 'bg-blue-100 text-blue-800'
      case 'candidate': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return <div className="text-center py-12">Loading user analytics...</div>
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Users</p>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </div>
            <Users className="w-10 h-10 text-blue-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">New Today</p>
              <p className="text-3xl font-bold">{stats.newToday}</p>
            </div>
            <TrendingUp className="w-10 h-10 text-green-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Active Today</p>
              <p className="text-3xl font-bold">{stats.activeToday}</p>
            </div>
            <UserCheck className="w-10 h-10 text-purple-500 opacity-50" />
          </div>
        </Card>

        <Card className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">By Role</p>
              <p className="text-sm">
                <span className="font-semibold text-green-600">{stats.candidates}</span> Candidates
                <span className="mx-2">•</span>
                <span className="font-semibold text-blue-600">{stats.employers}</span> Employers
              </p>
            </div>
            <Clock className="w-10 h-10 text-orange-500 opacity-50" />
          </div>
        </Card>
      </div>

      {/* User Table */}
      <Card>
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">Registered Users</h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Email</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead>Last Login</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map(user => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">{user.email}</TableCell>
                    <TableCell>
                      {user.first_name && user.last_name
                        ? `${user.first_name} ${user.last_name}`
                        : <span className="text-gray-400">Not set</span>
                      }
                    </TableCell>
                    <TableCell>
                      <Badge className={getRoleBadgeColor(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{formatDate(user.created_at)}</TableCell>
                    <TableCell className="text-sm">
                      {user.last_sign_in_at ? (
                        <span className="text-green-600">{formatDate(user.last_sign_in_at)}</span>
                      ) : (
                        <span className="text-gray-400">Never</span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </Card>
    </div>
  )
}
