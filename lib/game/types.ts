// Game Types
export interface Alien {
    id: string
    name: string
    power: string
    habit: string
    color: string
    unlocked: boolean
}

export interface Villain {
    id: string
    name: string
    represents: string
    weakAgainst: string[]
    difficulty: number
}

export interface Mission {
    id: string
    levelId: number
    title: string
    description: string
    objective: string
    miniGame: string
    requiredAlien?: string
    difficulty: number
    maxStars: number
}

export interface Level {
    id: number
    title: string
    description: string
    environment: string
    missions: Mission[]
    boss: Villain
    badge: string
    unlockRequirement: number
}

export interface GameProgress {
    id: string
    userId: string
    currentLevel: number
    levelsCompleted: number[]
    missionsCompleted: string[]
    totalStars: number
    totalPlaytime: number
    lastPlayed: Date
}

export interface Achievement {
    id: string
    userId: string
    achievementType: 'badge' | 'alien_unlock' | 'milestone'
    achievementName: string
    achievementData: any
    earnedAt: Date
}

export interface DailyHabit {
    id: string
    userId: string
    habitName: string
    habitCategory: 'cleanliness' | 'respect' | 'environment' | 'safety'
    completed: boolean
    completionDate: Date
}

export interface MissionScore {
    id: string
    userId: string
    levelId: number
    missionId: string
    starsEarned: number
    timeTaken: number
    perfectScore: boolean
    completedAt: Date
}

export interface ParentSettings {
    id: string
    userId: string
    screenTimeLimit: number
    customHabits: CustomHabit[]
    notificationsEnabled: boolean
}

export interface CustomHabit {
    name: string
    category: string
    frequency: 'daily' | 'weekly'
}

export interface GameState {
    currentLevel: number
    currentMission: number
    selectedAlien: Alien | null
    score: number
    stars: number
    lives: number
    isPaused: boolean
    isGameOver: boolean
}

export interface PlayerStats {
    totalMissions: number
    totalStars: number
    perfectScores: number
    habitsCompleted: number
    playtime: number
    level: number
}
