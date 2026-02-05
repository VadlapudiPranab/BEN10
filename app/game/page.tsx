'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Lock, Star, Trophy } from 'lucide-react'
import { LEVELS } from '@/lib/game/game-data'
import { useEffect, useState } from 'react'
import { getGameProgress, getAchievements } from '@/app/actions/game'

export default function GameHub() {
    const router = useRouter()
    const [progress, setProgress] = useState<any>(null)
    const [achievements, setAchievements] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadProgress() {
            const progressRes = await getGameProgress()
            const achievementsRes = await getAchievements()

            setProgress(progressRes.data)
            setAchievements(achievementsRes.data || [])
            setLoading(false)
        }
        loadProgress()
    }, [])

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-blue-500 to-purple-600 flex items-center justify-center">
                <div className="text-white text-2xl font-bold">Loading...</div>
            </div>
        )
    }

    const levelsCompleted = progress?.levelsCompleted || []
    const totalStars = progress?.totalStars || 0

    return (
        <div className="min-h-screen bg-gradient-to-b from-blue-500 via-purple-600 to-pink-500">
            {/* Header */}
            <div className="container mx-auto px-4 py-8">
                <div className="text-center mb-8">
                    <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        Ben 10: Hero of Habits
                    </h1>
                    <p className="text-xl text-white/90">
                        Transform into heroes and learn good habits!
                    </p>

                    {/* Stats */}
                    <div className="flex justify-center gap-8 mt-6">
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                            <div className="flex items-center gap-2">
                                <Star className="w-6 h-6 text-yellow-400 fill-yellow-400" />
                                <span className="text-white text-xl font-bold">{totalStars} Stars</span>
                            </div>
                        </div>
                        <div className="bg-white/20 backdrop-blur-sm px-6 py-3 rounded-full">
                            <div className="flex items-center gap-2">
                                <Trophy className="w-6 h-6 text-orange-400" />
                                <span className="text-white text-xl font-bold">{achievements.length} Achievements</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Levels */}
                <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
                    {LEVELS.map((level) => {
                        const isUnlocked =
                            level.unlockRequirement === 0 ||
                            levelsCompleted.includes(level.unlockRequirement)
                        const isCompleted = levelsCompleted.includes(level.id)

                        return (
                            <Card
                                key={level.id}
                                className={`relative overflow-hidden transition-all hover:scale-105 ${!isUnlocked ? 'opacity-60' : 'cursor-pointer'
                                    }`}
                            >
                                <div
                                    className={`absolute inset-0 pointer-events-none bg-gradient-to-br ${level.id === 1
                                        ? 'from-orange-400 to-red-500'
                                        : level.id === 2
                                            ? 'from-blue-400 to-indigo-500'
                                            : level.id === 3
                                                ? 'from-green-400 to-emerald-500'
                                                : 'from-yellow-400 to-orange-500'
                                        } opacity-20`}
                                />

                                <CardHeader className="relative z-10">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <CardTitle className="text-2xl">Level {level.id}</CardTitle>
                                            <CardDescription className="text-lg mt-1">{level.title}</CardDescription>
                                        </div>
                                        {!isUnlocked && <Lock className="w-6 h-6 text-gray-400" />}
                                        {isCompleted && (
                                            <Badge className="bg-green-500 text-white">
                                                <Trophy className="w-4 h-4 mr-1" />
                                                Complete
                                            </Badge>
                                        )}
                                    </div>
                                </CardHeader>

                                <CardContent className="relative z-10">
                                    <p className="text-gray-600 mb-4">{level.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3].map((star) => (
                                                <Star
                                                    key={star}
                                                    className="w-5 h-5 text-yellow-400 fill-yellow-400"
                                                />
                                            ))}
                                            <span className="ml-2 text-sm text-gray-600">
                                                {level.missions.length} Missions
                                            </span>
                                        </div>

                                        <Button
                                            onClick={() => isUnlocked && router.push(`/game/level/${level.id}`)}
                                            disabled={!isUnlocked}
                                            className="bg-gradient-to-r from-green-400 to-blue-500 text-white relative z-20"
                                        >
                                            {isCompleted ? 'Play Again' : 'Start Level'}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Quick Actions */}
                <div className="mt-12 flex justify-center gap-4">
                    <Button
                        onClick={() => router.push('/game/aliens')}
                        className="bg-white text-purple-600 hover:bg-purple-100"
                    >
                        View Aliens
                    </Button>
                    <Button
                        onClick={() => router.push('/game/achievements')}
                        className="bg-white text-purple-600 hover:bg-purple-100"
                    >
                        Achievements
                    </Button>
                    <Button
                        onClick={() => router.push('/parent')}
                        className="bg-white text-purple-600 hover:bg-purple-100"
                    >
                        Parent Dashboard
                    </Button>
                </div>
            </div>
        </div>
    )
}
