'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getGameProgress() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('game_progress')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        return { error: error.message }
    }

    return { data }
}

export async function updateGameProgress(progress: {
    currentLevel?: number
    levelsCompleted?: number[]
    missionsCompleted?: string[]
    totalStars?: number
    totalPlaytime?: number
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('game_progress')
        .upsert({
            user_id: user.id,
            ...progress,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/game')
    return { data }
}

export async function saveMissionScore(missionData: {
    levelId: number
    missionId: string
    starsEarned: number
    timeTaken: number
    perfectScore: boolean
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('mission_scores')
        .insert({
            user_id: user.id,
            level_id: missionData.levelId,
            mission_id: missionData.missionId,
            stars_earned: missionData.starsEarned,
            time_taken: missionData.timeTaken,
            perfect_score: missionData.perfectScore,
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function unlockAchievement(achievement: {
    achievementType: 'badge' | 'alien_unlock' | 'milestone'
    achievementName: string
    achievementData?: any
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('achievements')
        .insert({
            user_id: user.id,
            achievement_type: achievement.achievementType,
            achievement_name: achievement.achievementName,
            achievement_data: achievement.achievementData || {},
        })
        .select()
        .single()

    if (error) {
        // Ignore duplicate achievements
        if (error.code === '23505') {
            return { data: null, skipped: true }
        }
        return { error: error.message }
    }

    return { data }
}

export async function getAchievements() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', user.id)
        .order('earned_at', { ascending: false })

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function trackDailyHabit(habit: {
    habitName: string
    habitCategory: string
    completed: boolean
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('daily_habits')
        .insert({
            user_id: user.id,
            habit_name: habit.habitName,
            habit_category: habit.habitCategory,
            completed: habit.completed,
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function getDailyHabits(date?: Date) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const targetDate = date || new Date()
    const dateStr = targetDate.toISOString().split('T')[0]

    const { data, error } = await supabase
        .from('daily_habits')
        .select('*')
        .eq('user_id', user.id)
        .gte('completion_date', dateStr)
        .lt('completion_date', new Date(targetDate.getTime() + 86400000).toISOString().split('T')[0])

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function getMissionScores(levelId?: number) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    let query = supabase
        .from('mission_scores')
        .select('*')
        .eq('user_id', user.id)
        .order('completed_at', { ascending: false })

    if (levelId) {
        query = query.eq('level_id', levelId)
    }

    const { data, error } = await query

    if (error) {
        return { error: error.message }
    }

    return { data }
}

export async function getParentSettings() {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('parent_settings')
        .select('*')
        .eq('user_id', user.id)
        .single()

    if (error && error.code !== 'PGRST116') {
        return { error: error.message }
    }

    return { data }
}

export async function updateParentSettings(settings: {
    screenTimeLimit?: number
    customHabits?: any[]
    notificationsEnabled?: boolean
}) {
    const supabase = await createClient()
    const {
        data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Not authenticated' }
    }

    const { data, error } = await supabase
        .from('parent_settings')
        .upsert({
            user_id: user.id,
            ...settings,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single()

    if (error) {
        return { error: error.message }
    }

    revalidatePath('/dashboard/parent')
    return { data }
}
