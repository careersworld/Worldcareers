// ============================================
// VIEW TRACKING UTILITIES
// ============================================
// Use these functions to track views for jobs, blogs, and career insights

import { createClient } from '@/lib/supabase/client'

/**
 * Track a view for content (job, blog, or career insight)
 * Automatically prevents duplicate counts within 1 hour
 */
export async function trackView(
    contentType: 'job' | 'blog' | 'career_insight',
    contentId: string,
    userId?: string
): Promise<boolean> {
    try {
        const supabase = createClient()

        // Get IP address and user agent (client-side approximation)
        const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : null

        // Call the database function to track the view
        const { data, error } = await supabase.rpc('track_content_view', {
            p_content_type: contentType,
            p_content_id: contentId,
            p_user_id: userId || null,
            p_ip_address: null, // IP address should be set server-side for security
            p_user_agent: userAgent
        })

        if (error) {
            // Check if it's a missing function error
            if (error.message?.includes('function') || error.code === '42883') {
                console.warn('⚠️ View tracking not configured. Run scripts/07-realtime-tracking.sql to enable view tracking.')
                return false
            }
            console.error('Error tracking view:', {
                message: error.message,
                code: error.code,
                details: error.details,
                hint: error.hint
            })
            return false
        }

        return data as boolean
    } catch (error: any) {
        // Don't spam console with errors if tracking is not set up
        if (error?.message?.includes('function') || error?.code === '42883') {
            // Silently fail if function doesn't exist
            return false
        }
        console.error('Error tracking view:', error)
        return false
    }
}

/**
 * Increment view count directly (simpler method, no deduplication)
 * Use this if you don't need view tracking analytics
 */
export async function incrementViewCount(
    contentType: 'job' | 'blog' | 'career_insight',
    contentId: string
): Promise<boolean> {
    try {
        const supabase = createClient()

        const tableName = contentType === 'career_insight' ? 'career_insights' : `${contentType}s`

        const { error } = await supabase
            .from(tableName)
            .update({ views_count: supabase.raw('COALESCE(views_count, 0) + 1') })
            .eq('id', contentId)

        if (error) {
            console.error('Error incrementing view count:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('Error incrementing view count:', error)
        return false
    }
}

/**
 * Get view statistics for content
 */
export async function getViewStats(
    contentType: 'job' | 'blog' | 'career_insight',
    contentId: string
) {
    try {
        const supabase = createClient()

        // Get total views
        const tableName = contentType === 'career_insight' ? 'career_insights' : `${contentType}s`
        const { data: content } = await supabase
            .from(tableName)
            .select('views_count')
            .eq('id', contentId)
            .single()

        // Get views in last 7 days
        const { count: recentViews } = await supabase
            .from('content_views')
            .select('*', { count: 'exact', head: true })
            .eq('content_type', contentType)
            .eq('content_id', contentId)
            .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

        return {
            totalViews: content?.views_count || 0,
            recentViews: recentViews || 0
        }
    } catch (error) {
        console.error('Error getting view stats:', error)
        return {
            totalViews: 0,
            recentViews: 0
        }
    }
}

/**
 * Subscribe to real-time view count updates
 */
export function subscribeToViewUpdates(
    contentType: 'job' | 'blog' | 'career_insight',
    contentId: string,
    callback: (viewCount: number) => void
) {
    const supabase = createClient()
    const tableName = contentType === 'career_insight' ? 'career_insights' : `${contentType}s`

    const channel = supabase
        .channel(`${contentType}-${contentId}-views`)
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: tableName,
                filter: `id=eq.${contentId}`
            },
            (payload: any) => {
                if (payload.new?.views_count !== undefined) {
                    callback(payload.new.views_count)
                }
            }
        )
        .subscribe()

    // Return cleanup function
    return () => {
        supabase.removeChannel(channel)
    }
}

/**
 * Track job application (increments applications_count automatically via trigger)
 */
export async function trackJobApplication(
    jobId: string,
    userId: string,
    applicationData: {
        resume_url?: string
        cover_letter?: string
        status?: string
    }
): Promise<boolean> {
    try {
        const supabase = createClient()

        const { error } = await supabase
            .from('job_applications')
            .insert({
                job_id: jobId,
                user_id: userId,
                applied_at: new Date().toISOString(),
                status: applicationData.status || 'pending',
                resume_url: applicationData.resume_url,
                cover_letter: applicationData.cover_letter
            })

        if (error) {
            console.error('Error tracking application:', error)
            return false
        }

        return true
    } catch (error) {
        console.error('Error tracking application:', error)
        return false
    }
}

/**
 * Get application statistics for a job
 */
export async function getApplicationStats(jobId: string) {
    try {
        const supabase = createClient()

        // Get total applications
        const { data: job } = await supabase
            .from('jobs')
            .select('applications_count')
            .eq('id', jobId)
            .single()

        // Get applications in last 7 days
        const { count: recentApplications } = await supabase
            .from('job_applications')
            .select('*', { count: 'exact', head: true })
            .eq('job_id', jobId)
            .gte('applied_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

        // Get application status breakdown
        const { data: statusBreakdown } = await supabase
            .from('job_applications')
            .select('status')
            .eq('job_id', jobId)

        const statusCounts = statusBreakdown?.reduce((acc: any, app: any) => {
            acc[app.status] = (acc[app.status] || 0) + 1
            return acc
        }, {}) || {}

        return {
            totalApplications: job?.applications_count || 0,
            recentApplications: recentApplications || 0,
            statusBreakdown: statusCounts
        }
    } catch (error) {
        console.error('Error getting application stats:', error)
        return {
            totalApplications: 0,
            recentApplications: 0,
            statusBreakdown: {}
        }
    }
}

/**
 * Track a profile view
 * Automatically prevents duplicate counts within 1 hour
 */
export async function trackProfileView(
    profileId: string,
    viewerId?: string
): Promise<boolean> {
    try {
        const supabase = createClient()

        // Get user agent (client-side approximation)
        const userAgent = typeof window !== 'undefined' ? window.navigator.userAgent : null

        // Call the database function to track the profile view
        const { data, error } = await supabase.rpc('track_profile_view', {
            p_profile_id: profileId,
            p_viewer_id: viewerId || null,
            p_ip_address: null, // IP address should be set server-side for security
            p_user_agent: userAgent
        })

        if (error) {
            // Check if it's a missing function error
            if (error.message?.includes('function') || error.code === '42883') {
                console.warn('⚠️ Profile view tracking not configured. Run scripts/08-add-profile-views-tracking.sql to enable profile view tracking.')
                return false
            }
            console.error('Error tracking profile view:', error)
            return false
        }

        return data as boolean
    } catch (error: any) {
        // Don't spam console with errors if tracking is not set up
        if (error?.message?.includes('function') || error?.code === '42883') {
            // Silently fail if function doesn't exist
            return false
        }
        console.error('Error tracking profile view:', error)
        return false
    }
}

/**
 * Get profile view statistics
 */
export async function getProfileViewStats(profileId: string) {
    try {
        const supabase = createClient()

        // Get total profile views
        const { data: profile } = await supabase
            .from('candidate_profiles')
            .select('profile_views')
            .eq('id', profileId)
            .single()

        // Get views in last 7 days
        const { count: recentViews } = await supabase
            .from('profile_views')
            .select('*', { count: 'exact', head: true })
            .eq('profile_id', profileId)
            .gte('viewed_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString())

        return {
            totalViews: profile?.profile_views || 0,
            recentViews: recentViews || 0
        }
    } catch (error) {
        console.error('Error getting profile view stats:', error)
        return {
            totalViews: 0,
            recentViews: 0
        }
    }
}
