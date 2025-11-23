// ============================================
// CLIENT-SIDE OPTIMIZATION UTILITIES
// ============================================
// Use these utilities to cache data and reduce database calls

import { createClient } from '@/lib/supabase/client'

// Simple in-memory cache
const cache = new Map<string, { data: any; timestamp: number }>()
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

/**
 * Cached query wrapper
 * Caches query results for a specified duration to reduce database calls
 */
export async function cachedQuery<T>(
    key: string,
    queryFn: () => Promise<T>,
    cacheDuration: number = CACHE_DURATION
): Promise<T> {
    const now = Date.now()
    const cached = cache.get(key)

    // Return cached data if still valid
    if (cached && now - cached.timestamp < cacheDuration) {
        return cached.data as T
    }

    // Execute query and cache result
    const data = await queryFn()
    cache.set(key, { data, timestamp: now })
    return data
}

/**
 * Clear cache for a specific key or all cache
 */
export function clearCache(key?: string) {
    if (key) {
        cache.delete(key)
    } else {
        cache.clear()
    }
}

/**
 * Batch fetch multiple items by IDs
 * More efficient than multiple individual queries
 */
export async function batchFetch<T>(
    table: string,
    ids: string[],
    select: string = '*'
): Promise<T[]> {
    if (ids.length === 0) return []

    const supabase = createClient()
    const { data, error } = await supabase
        .from(table)
        .select(select)
        .in('id', ids)

    if (error) throw error
    return (data as T[]) || []
}

/**
 * Prefetch data in the background
 * Useful for data you know will be needed soon
 */
export function prefetchData<T>(
    key: string,
    queryFn: () => Promise<T>
): void {
    // Run in background without blocking
    queryFn().then(data => {
        cache.set(key, { data, timestamp: Date.now() })
    }).catch(err => {
        console.error('Prefetch error:', err)
    })
}

/**
 * Debounced search function
 * Prevents too many database calls during typing
 */
export function debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number
): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return function executedFunction(...args: Parameters<T>) {
        const later = () => {
            timeout = null
            func(...args)
        }

        if (timeout) clearTimeout(timeout)
        timeout = setTimeout(later, wait)
    }
}

/**
 * Optimized job search with caching
 */
export async function searchJobs(params: {
    search?: string
    location?: string
    jobType?: string
    limit?: number
    offset?: number
}) {
    const cacheKey = `jobs:${JSON.stringify(params)}`

    return cachedQuery(cacheKey, async () => {
        const supabase = createClient()
        let query = supabase
            .from('jobs')
            .select('id, title, company, location, job_type, salary_min, salary_max, created_at, views_count')
            .eq('status', 'active')

        if (params.search) {
            query = query.or(`title.ilike.%${params.search}%,description.ilike.%${params.search}%,company.ilike.%${params.search}%`)
        }

        if (params.location) {
            query = query.ilike('location', `%${params.location}%`)
        }

        if (params.jobType) {
            query = query.eq('job_type', params.jobType)
        }

        query = query
            .order('created_at', { ascending: false })
            .limit(params.limit || 20)
            .range(params.offset || 0, (params.offset || 0) + (params.limit || 20) - 1)

        const { data, error } = await query

        if (error) throw error
        return data
    }, 2 * 60 * 1000) // Cache for 2 minutes
}

/**
 * Get user profile with caching
 */
export async function getUserProfile(userId: string) {
    const cacheKey = `profile:${userId}`

    return cachedQuery(cacheKey, async () => {
        const supabase = createClient()
        // Try to fetch from the unified view first
        const { data, error } = await supabase
            .from('all_users')
            .select('*')
            .eq('id', userId)
            .single()

        if (error) throw error
        return data
    }, 10 * 60 * 1000) // Cache for 10 minutes
}

/**
 * Invalidate user profile cache (call after updates)
 */
export function invalidateUserProfile(userId: string) {
    clearCache(`profile:${userId}`)
}

/**
 * Get dashboard stats with caching
 */
export async function getDashboardStats() {
    return cachedQuery('dashboard:stats', async () => {
        const supabase = createClient()

        // Use the materialized view if available
        const { data: statsView } = await supabase
            .from('dashboard_stats')
            .select('*')
            .single()

        if (statsView) return statsView

        // Fallback to individual queries if materialized view doesn't exist
        const [jobsRes, blogsRes, insightsRes, companiesRes] = await Promise.all([
            supabase.from('jobs').select('id, views_count', { count: 'exact' }),
            supabase.from('blogs').select('id, views_count', { count: 'exact' }),
            supabase.from('career_insights').select('id, views_count', { count: 'exact' }),
            supabase.from('company_profiles').select('id', { count: 'exact' })
        ])

        return {
            active_jobs: jobsRes.count || 0,
            total_blogs: blogsRes.count || 0,
            total_insights: insightsRes.count || 0,
            total_companies: companiesRes.count || 0,
            total_job_views: (jobsRes.data || []).reduce((sum: number, job: any) => sum + (job.views_count || 0), 0),
            total_blog_views: (blogsRes.data || []).reduce((sum: number, blog: any) => sum + (blog.views_count || 0), 0),
            total_insight_views: (insightsRes.data || []).reduce((sum: number, insight: any) => sum + (insight.views_count || 0), 0),
        }
    }, 5 * 60 * 1000) // Cache for 5 minutes
}
