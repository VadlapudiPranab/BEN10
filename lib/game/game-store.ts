import { create } from 'zustand'
import { GameState, Alien } from './types'
import { ALIENS } from './game-data'

interface GameStore extends GameState {
    // Actions
    setLevel: (level: number) => void
    setMission: (mission: number) => void
    selectAlien: (alien: Alien | null) => void
    addScore: (points: number) => void
    earnStar: () => void
    loseLife: () => void
    resetLives: () => void
    pauseGame: () => void
    resumeGame: () => void
    endGame: () => void
    resetGame: () => void
}

export const useGameStore = create<GameStore>((set) => ({
    // Initial state
    currentLevel: 1,
    currentMission: 0,
    selectedAlien: null,
    score: 0,
    stars: 0,
    lives: 3,
    isPaused: false,
    isGameOver: false,

    // Actions
    setLevel: (level) => set({ currentLevel: level }),
    setMission: (mission) => set({ currentMission: mission }),
    selectAlien: (alien) => set({ selectedAlien: alien }),
    addScore: (points) => set((state) => ({ score: state.score + points })),
    earnStar: () => set((state) => ({ stars: Math.min(state.stars + 1, 3) })),
    loseLife: () =>
        set((state) => {
            const newLives = state.lives - 1
            return {
                lives: newLives,
                isGameOver: newLives <= 0,
            }
        }),
    resetLives: () => set({ lives: 3 }),
    pauseGame: () => set({ isPaused: true }),
    resumeGame: () => set({ isPaused: false }),
    endGame: () => set({ isGameOver: true }),
    resetGame: () =>
        set({
            score: 0,
            stars: 0,
            lives: 3,
            isPaused: false,
            isGameOver: false,
        }),
}))

// Audio Manager
interface AudioStore {
    isMuted: boolean
    volume: number
    currentMusic: string | null
    toggleMute: () => void
    setVolume: (volume: number) => void
    playMusic: (track: string) => void
    stopMusic: () => void
    playSound: (sound: string) => void
}

export const useAudioStore = create<AudioStore>((set) => ({
    isMuted: false,
    volume: 0.7,
    currentMusic: null,
    toggleMute: () => set((state) => ({ isMuted: !state.isMuted })),
    setVolume: (volume) => set({ volume: Math.max(0, Math.min(1, volume)) }),
    playMusic: (track) => set({ currentMusic: track }),
    stopMusic: () => set({ currentMusic: null }),
    playSound: (sound) => {
        // Sound effect logic will be implemented
        console.log('Playing sound:', sound)
    },
}))
