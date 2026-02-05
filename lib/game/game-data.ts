import { Alien, Villain, Level, Mission } from './types'

// All 6 Aliens with Educational Powers
export const ALIENS: Alien[] = [
    {
        id: 'heatblast',
        name: 'Heatblast',
        power: 'Clean Fire',
        habit: 'Cleanliness & Hygiene',
        color: '#FF6B35',
        unlocked: true, // Starting alien
    },
    {
        id: 'four-arms',
        name: 'Four Arms',
        power: 'Strength',
        habit: 'Helping Elders & Teamwork',
        color: '#C1121F',
        unlocked: true, // Starting alien
    },
    {
        id: 'xlr8',
        name: 'XLR8',
        power: 'Speed',
        habit: 'Time Management & Punctuality',
        color: '#4361EE',
        unlocked: false,
    },
    {
        id: 'grey-matter',
        name: 'Grey Matter',
        power: 'Intelligence',
        habit: 'Studying & Problem-Solving',
        color: '#6A994E',
        unlocked: false,
    },
    {
        id: 'upgrade',
        name: 'Upgrade',
        power: 'Repair',
        habit: 'Saving Resources & Recycling',
        color: '#023047',
        unlocked: false,
    },
    {
        id: 'diamondhead',
        name: 'Diamondhead',
        power: 'Protection',
        habit: 'Honesty & Integrity',
        color: '#06FFA5',
        unlocked: false,
    },
]

// All 5 Villains representing Bad Habits
export const VILLAINS: Villain[] = [
    {
        id: 'lazytron',
        name: 'Lazytron',
        represents: 'Laziness',
        weekAgainst: ['heatblast', 'four-arms'],
        difficulty: 1,
    },
    {
        id: 'trash-king',
        name: 'Trash King',
        represents: 'Pollution',
        weakAgainst: ['heatblast', 'upgrade'],
        difficulty: 3,
    },
    {
        id: 'time-thief',
        name: 'Time Thief',
        represents: 'Wasting Time',
        weakAgainst: ['xlr8'],
        difficulty: 2,
    },
    {
        id: 'bully-beast',
        name: 'Bully Beast',
        represents: 'Bullying',
        weakAgainst: ['four-arms', 'diamondhead'],
        difficulty: 2,
    },
    {
        id: 'greed-lord',
        name: 'Greed Lord',
        represents: 'Selfishness',
        weakAgainst: ['grey-matter', 'diamondhead'],
        difficulty: 4,
    },
]

// Level 1: Home Responsibility
const LEVEL_1_MISSIONS: Mission[] = [
    {
        id: 'home-brush-teeth',
        levelId: 1,
        title: 'Morning Routine Hero',
        description: 'Help Ben brush his teeth properly!',
        objective: 'Complete the brushing sequence correctly',
        miniGame: 'cleaning-game',
        requiredAlien: 'heatblast',
        difficulty: 1,
        maxStars: 3,
    },
    {
        id: 'home-clean-room',
        levelId: 1,
        title: 'Room Cleanup Champion',
        description: 'Clean and organize the messy room',
        objective: 'Sort all items into correct places',
        miniGame: 'sorting-game',
        requiredAlien: 'heatblast',
        difficulty: 1,
        maxStars: 3,
    },
    {
        id: 'home-help-parents',
        levelId: 1,
        title: 'Family Helper',
        description: 'Help parents with household chores',
        objective: 'Complete 3 helping tasks',
        miniGame: 'helping-game',
        requiredAlien: 'four-arms',
        difficulty: 1,
        maxStars: 3,
    },
]

// Level 2: School Hero
const LEVEL_2_MISSIONS: Mission[] = [
    {
        id: 'school-punctuality',
        levelId: 2,
        title: 'Beat the Clock',
        description: 'Get to class on time!',
        objective: 'Complete morning routine within time limit',
        miniGame: 'time-challenge',
        requiredAlien: 'xlr8',
        difficulty: 2,
        maxStars: 3,
    },
    {
        id: 'school-respect',
        levelId: 2,
        title: 'Respect & Learn',
        description: 'Show respect to teachers and classmates',
        objective: 'Make correct respectful choices',
        miniGame: 'quiz-game',
        requiredAlien: 'grey-matter',
        difficulty: 2,
        maxStars: 3,
    },
    {
        id: 'school-anti-bullying',
        levelId: 2,
        title: 'Stop the Bully',
        description: 'Stand up against bullying',
        objective: 'Help victims and promote kindness',
        miniGame: 'helping-game',
        requiredAlien: 'four-arms',
        difficulty: 2,
        maxStars: 3,
    },
]

// Level 3: Society & Environment
const LEVEL_3_MISSIONS: Mission[] = [
    {
        id: 'env-plant-trees',
        levelId: 3,
        title: 'Green Warrior',
        description: 'Plant trees to save the environment',
        objective: 'Plant and water 5 trees correctly',
        miniGame: 'planting-game',
        requiredAlien: 'four-arms',
        difficulty: 2,
        maxStars: 3,
    },
    {
        id: 'env-clean-park',
        levelId: 3,
        title: 'Park Cleanup Mission',
        description: 'Clean up litter from the park',
        objective: 'Collect and sort all trash',
        miniGame: 'sorting-game',
        requiredAlien: 'upgrade',
        difficulty: 2,
        maxStars: 3,
    },
    {
        id: 'env-save-water',
        levelId: 3,
        title: 'Water Conservation',
        description: 'Learn to save water',
        objective: 'Fix leaks and make smart choices',
        miniGame: 'puzzle-game',
        requiredAlien: 'upgrade',
        difficulty: 3,
        maxStars: 3,
    },
]

// Level 4: Road & Safety
const LEVEL_4_MISSIONS: Mission[] = [
    {
        id: 'safety-traffic',
        levelId: 4,
        title: 'Traffic Safety Hero',
        description: 'Follow traffic rules correctly',
        objective: 'Navigate safely through traffic',
        miniGame: 'traffic-game',
        requiredAlien: 'xlr8',
        difficulty: 3,
        maxStars: 3,
    },
    {
        id: 'safety-help-injured',
        levelId: 4,
        title: 'First Responder',
        description: 'Help injured people safely',
        objective: 'Provide correct first aid',
        miniGame: 'helping-game',
        requiredAlien: 'four-arms',
        difficulty: 3,
        maxStars: 3,
    },
    {
        id: 'safety-emergency',
        levelId: 4,
        title: 'Emergency Response',
        description: 'Handle emergency situations',
        objective: 'Make quick, smart decisions',
        miniGame: 'quiz-game',
        requiredAlien: 'grey-matter',
        difficulty: 3,
        maxStars: 3,
    },
]

// All 4 Levels
export const LEVELS: Level[] = [
    {
        id: 1,
        title: 'Home Responsibility',
        description: 'Learn good habits at home',
        environment: 'home',
        missions: LEVEL_1_MISSIONS,
        boss: VILLAINS[0], // Lazytron
        badge: 'Habit Badge',
        unlockRequirement: 0,
    },
    {
        id: 2,
        title: 'School Hero',
        description: 'Be a responsible student',
        environment: 'school',
        missions: LEVEL_2_MISSIONS,
        boss: VILLAINS[3], // Bully Beast
        badge: 'Knowledge Badge',
        unlockRequirement: 1,
    },
    {
        id: 3,
        title: 'Society & Environment',
        description: 'Protect our planet',
        environment: 'park',
        missions: LEVEL_3_MISSIONS,
        boss: VILLAINS[1], // Trash King
        badge: 'Green Hero Badge',
        unlockRequirement: 2,
    },
    {
        id: 4,
        title: 'Road & Safety',
        description: 'Stay safe in the city',
        environment: 'city',
        missions: LEVEL_4_MISSIONS,
        boss: VILLAINS[2], // Time Thief
        badge: 'Safety Shield',
        unlockRequirement: 3,
    },
]

// Helper functions
export function getAlienById(id: string): Alien | undefined {
    return ALIENS.find((alien) => alien.id === id)
}

export function getVillainById(id: string): Villain | undefined {
    return VILLAINS.find((villain) => villain.id === id)
}

export function getLevelById(id: number): Level | undefined {
    return LEVELS.find((level) => level.id === id)
}

export function getMissionById(missionId: string): Mission | undefined {
    for (const level of LEVELS) {
        const mission = level.missions.find((m) => m.id === missionId)
        if (mission) return mission
    }
    return undefined
}

export function getUnlockedAliens(levelsCompleted: number[]): Alien[] {
    const unlockedIds = new Set<string>(['heatblast', 'four-arms']) // Starting aliens

    if (levelsCompleted.includes(1)) {
        unlockedIds.add('xlr8')
    }
    if (levelsCompleted.includes(2)) {
        unlockedIds.add('grey-matter')
    }
    if (levelsCompleted.includes(3)) {
        unlockedIds.add('upgrade')
    }
    if (levelsCompleted.includes(4)) {
        unlockedIds.add('diamondhead')
    }

    return ALIENS.map((alien) => ({
        ...alien,
        unlocked: unlockedIds.has(alien.id),
    }))
}
