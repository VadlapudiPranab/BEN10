'use client'

import React, { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Star, CheckCircle2, AlertCircle } from 'lucide-react'
import { useGameStore } from '@/lib/game/game-store'

interface GameComponentProps {
    type: string
    onComplete: (stars: number, score: number) => void
    onFail: () => void
}

export function MissionGame({ type, onComplete, onFail }: GameComponentProps) {
    const { selectedAlien, addScore, earnStar } = useGameStore()
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'completing'>('intro')

    // Renders the specific mini-game
    switch (type) {
        case 'cleaning-game':
            return <CleaningGame onComplete={onComplete} />
        case 'sorting-game':
            return <SortingGame onComplete={onComplete} />
        case 'helping-game':
            return <HelpingGame onComplete={onComplete} />
        default:
            return (
                <div className="flex flex-col items-center justify-center p-12 text-center">
                    <AlertCircle className="w-12 h-12 text-yellow-500 mb-4" />
                    <h3 className="text-xl font-bold">Game Mode "{type}" under development</h3>
                    <Button className="mt-6" onClick={() => onComplete(2, 500)}>Simulate Success</Button>
                </div>
            )
    }
}

// LEVEL 1 - MISSION 1: BRUSH TEETH (Cleaning Game)
function CleaningGame({ onComplete }: { onComplete: (stars: number, score: number) => void }) {
    const [dirtySpots, setDirtySpots] = useState([
        { id: 1, x: 20, y: 30, cleaned: false },
        { id: 2, x: 60, y: 25, cleaned: false },
        { id: 3, x: 40, y: 55, cleaned: false },
        { id: 4, x: 80, y: 40, cleaned: false },
        { id: 5, x: 30, y: 70, cleaned: false },
    ])

    const [timer, setTimer] = useState(15)
    const allCleaned = dirtySpots.every(s => s.cleaned)

    useEffect(() => {
        if (timer > 0 && !allCleaned) {
            const interval = setInterval(() => setTimer(t => t - 1), 1000)
            return () => clearInterval(interval)
        } else if (timer === 0 && !allCleaned) {
            // Failed to clean on time? Or just give fewer stars
        }
    }, [timer, allCleaned])

    const cleanSpot = (id: number) => {
        setDirtySpots(spots => spots.map(s => s.id === id ? { ...s, cleaned: true } : s))
    }

    useEffect(() => {
        if (allCleaned) {
            const stars = timer > 10 ? 3 : timer > 5 ? 2 : 1
            setTimeout(() => onComplete(stars, 1000 + timer * 10), 1000)
        }
    }, [allCleaned, timer, onComplete])

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-white p-6">
            <div className="mb-4 text-center">
                <h3 className="text-2xl font-bold mb-1">BRUSHING HERO!</h3>
                <p className="text-green-500 font-mono">TIME REMAINING: {timer}s</p>
            </div>

            <div className="relative w-full max-w-lg aspect-square bg-zinc-800 rounded-3xl border-4 border-zinc-700 overflow-hidden shadow-inner">
                {/* Mouth/Teeth Graphic Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                    <span className="text-[200px]">👄</span>
                </div>

                {dirtySpots.map(spot => (
                    !spot.cleaned && (
                        <button
                            key={spot.id}
                            className="absolute w-16 h-16 bg-yellow-500/80 rounded-full blur-md animate-pulse cursor-pointer hover:scale-110 transition-transform"
                            style={{ left: `${spot.x}%`, top: `${spot.y}%` }}
                            onClick={() => cleanSpot(spot.id)}
                        >
                            <span className="text-2xl italic">细菌</span>
                        </button>
                    )
                ))}

                {allCleaned && (
                    <div className="absolute inset-0 bg-green-500/20 flex flex-col items-center justify-center animate-in zoom-in">
                        <CheckCircle2 className="w-32 h-32 text-green-500 mb-4" />
                        <p className="text-3xl font-black">SPARKLING CLEAN!</p>
                    </div>
                )}
            </div>

            <p className="mt-8 text-gray-400 italic">Click the yellow spots to brush them away!</p>
        </div>
    )
}

// LEVEL 1 - MISSION 2: CLEAN ROOM (Sorting Game)
function SortingGame({ onComplete }: { onComplete: (stars: number, score: number) => void }) {
    const [items, setItems] = useState([
        { id: 1, name: 'Toy Car', type: 'toy', x: 10, y: 70 },
        { id: 2, name: 'T-Shirt', type: 'clothes', x: 25, y: 75 },
        { id: 3, name: 'Robot', type: 'toy', x: 40, y: 80 },
        { id: 4, name: 'Socks', type: 'clothes', x: 55, y: 70 },
        { id: 5, name: 'Book', type: 'toy', x: 70, y: 75 },
    ])

    const [bins, setBins] = useState({ toy: 0, clothes: 0 })
    const totalItems = items.length

    const sortItem = (id: number, type: string) => {
        setItems(items.filter(i => i.id !== id))
        setBins(prev => ({ ...prev, [type]: prev[type as keyof typeof prev] + 1 }))
    }

    useEffect(() => {
        if (items.length === 0) {
            setTimeout(() => onComplete(3, 1500), 1000)
        }
    }, [items, onComplete])

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-white p-6 b">
            <h3 className="text-2xl font-bold mb-8">SORTING MASTERY</h3>

            <div className="w-full flex justify-around mb-12">
                <div className="border-4 border-blue-500 p-8 rounded-2xl bg-blue-500/10 text-center w-40">
                    <span className="text-4xl block mb-2">📦</span>
                    <p className="font-bold">TOY BOX</p>
                    <p className="text-blue-500">{bins.toy}</p>
                </div>
                <div className="border-4 border-purple-500 p-8 rounded-2xl bg-purple-500/10 text-center w-40">
                    <span className="text-4xl block mb-2">🧺</span>
                    <p className="font-bold">BASKET</p>
                    <p className="text-purple-500">{bins.clothes}</p>
                </div>
            </div>

            <div className="flex gap-4 flex-wrap justify-center">
                {items.map(item => (
                    <div key={item.id} className="bg-zinc-800 p-4 rounded-xl border-2 border-zinc-700 flex flex-col items-center gap-3">
                        <span className="text-3xl">{item.type === 'toy' ? '🧸' : '👕'}</span>
                        <p className="text-sm font-bold">{item.name}</p>
                        <div className="flex gap-2">
                            <Button size="sm" variant="outline" onClick={() => sortItem(item.id, 'toy')}>Box</Button>
                            <Button size="sm" variant="outline" onClick={() => sortItem(item.id, 'clothes')}>Basket</Button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}

// LEVEL 1 - MISSION 3: HELP PARENTS (Helping Game)
function HelpingGame({ onComplete }: { onComplete: (stars: number, score: number) => void }) {
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Mom needs help with groceries', completed: false, emote: '🛍️' },
        { id: 2, text: 'Dad is fixing the shelf', completed: false, emote: '🔨' },
        { id: 3, text: 'Grandpa wants to read', completed: false, emote: '📖' },
    ])

    const completeTask = (id: number) => {
        setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t))
    }

    useEffect(() => {
        if (tasks.every(t => t.completed)) {
            setTimeout(() => onComplete(3, 2000), 1000)
        }
    }, [tasks, onComplete])

    return (
        <div className="flex-1 flex flex-col items-center justify-center text-white p-6">
            <h3 className="text-2xl font-bold mb-8">KINDNESS IN ACTION</h3>

            <div className="space-y-4 w-full max-w-md">
                {tasks.map(task => (
                    <div key={task.id} className={`p-6 rounded-2xl border-2 flex items-center justify-between transition-all ${task.completed ? 'border-green-500 bg-green-500/10' : 'border-zinc-700 bg-zinc-800'
                        }`}>
                        <div className="flex items-center gap-4">
                            <span className="text-4xl">{task.emote}</span>
                            <p className={`font-medium ${task.completed ? 'text-gray-400 line-through' : ''}`}>{task.text}</p>
                        </div>
                        {!task.completed && (
                            <Button
                                onClick={() => completeTask(task.id)}
                                className="bg-yellow-600 hover:bg-yellow-500 text-white"
                            >
                                Help!
                            </Button>
                        )}
                        {task.completed && <CheckCircle2 className="text-green-500 w-8 h-8" />}
                    </div>
                ))}
            </div>
        </div>
    )
}
