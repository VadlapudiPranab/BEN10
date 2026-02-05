'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getLevelById } from '@/lib/game/game-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Star, Play, Lock } from 'lucide-react'
import { getGameProgress, getMissionScores } from '@/app/actions/game'

export default function LevelPage() {
    const { id } = useParams()
    const router = useRouter()
    const levelId = parseInt(id as string)
    const level = getLevelById(levelId)

    const [progress, setProgress] = useState<any>(null)
    const [missionScores, setMissionScores] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadData() {
            const progressRes = await getGameProgress()
            const scoresRes = await getMissionScores(levelId)

            setProgress(progressRes.data)
            setMissionScores(scoresRes.data || [])
            setLoading(false)
        }
        loadData()
    }, [levelId])

    if (!level) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-4">Level not found!</h2>
                    <Button onClick={() => router.push('/game')}>Return to Hub</Button>
                </div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
        )
    }

    const missionsCompleted = progress?.missionsCompleted || []

    // Function to get stars for a specific mission
    const getStarsForMission = (missionId: string) => {
        const scores = missionScores.filter(s => s.missionId === missionId)
        if (scores.length === 0) return 0
        return Math.max(...scores.map(s => s.starsEarned))
    }

    return (
        <div className={`min-h-screen bg-gradient-to-b ${level.environment === 'home' ? 'from-orange-100 to-red-100' :
            level.environment === 'school' ? 'from-blue-100 to-indigo-100' :
                level.environment === 'park' ? 'from-green-100 to-emerald-100' :
                    'from-yellow-100 to-orange-100'
            }`}>
            <div className="container mx-auto px-4 py-8">
                <Button
                    variant="ghost"
                    onClick={() => router.push('/game')}
                    className="mb-6 flex items-center gap-2"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to Hub
                </Button>

                <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl font-bold mb-2">{level.title}</h1>
                        <p className="text-xl text-gray-600">{level.description}</p>
                    </div>

                    <div className="flex items-center gap-4 bg-white/50 backdrop-blur-sm p-4 rounded-xl shadow-sm border">
                        <TrophyIcon className="w-8 h-8 text-yellow-500" />
                        <div>
                            <p className="text-sm font-semibold text-gray-500 uppercase">Level Reward</p>
                            <p className="text-lg font-bold">{level.badge}</p>
                        </div>
                    </div>
                </div>

                {/* Missions Grid */}
                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {level.missions.map((mission, index) => {
                        const stars = getStarsForMission(mission.id)
                        const isFirstMission = index === 0
                        const prevMissionCompleted = isFirstMission || missionsCompleted.includes(level.missions[index - 1].id)
                        const isLocked = !prevMissionCompleted

                        return (
                            <Card key={mission.id} className={`relative transition-all hover:shadow-lg ${isLocked ? 'opacity-75 bg-gray-50' : ''}`}>
                                <CardHeader>
                                    <div className="flex justify-between items-center mb-2">
                                        <Badge variant="outline">Mission {index + 1}</Badge>
                                        <div className="flex gap-1">
                                            {[1, 2, 3].map(i => (
                                                <Star key={i} className={`w-4 h-4 ${i <= stars ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <CardTitle className="text-xl">{mission.title}</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 mb-6 line-clamp-2">{mission.description}</p>

                                    <div className="flex items-center justify-between">
                                        <div className="flex -space-x-2">
                                            {/* Show required alien if any */}
                                            {mission.requiredAlien && (
                                                <div
                                                    className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center bg-primary text-white text-xs font-bold"
                                                    title={`Requires ${mission.requiredAlien}`}
                                                >
                                                    {mission.requiredAlien.charAt(0).toUpperCase()}
                                                </div>
                                            )}
                                        </div>

                                        <Button
                                            disabled={isLocked}
                                            onClick={() => !isLocked && router.push(`/game/mission/${mission.id}`)}
                                            className={isLocked ? 'bg-gray-400' : 'bg-green-600 hover:bg-green-700'}
                                        >
                                            {isLocked ? (
                                                <>
                                                    <Lock className="w-4 h-4 mr-2" />
                                                    Locked
                                                </>
                                            ) : (
                                                <>
                                                    <Play className="w-4 h-4 mr-2" />
                                                    {stars > 0 ? 'Replay' : 'Start'}
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Boss Section */}
                <div className="max-w-3xl mx-auto mt-16">
                    <Card className={`border-2 border-red-200 overflow-hidden ${!missionsCompleted.includes(level.missions[level.missions.length - 1].id) ? 'opacity-50 grayscale' : ''}`}>
                        <div className="bg-red-500 text-white px-6 py-4 flex items-center justify-between">
                            <h3 className="text-xl font-bold flex items-center gap-2">
                                <AlertTriangleIcon className="w-6 h-6" />
                                Final Challenge: {level.boss.name}
                            </h3>
                            {missionsCompleted.includes(level.missions[level.missions.length - 1].id) ? (
                                <Badge className="bg-white text-red-500">Ready!</Badge>
                            ) : (
                                <Badge className="bg-red-700 text-white italic">Complete all missions first</Badge>
                            )}
                        </div>
                        <CardContent className="p-6 flex flex-col md:flex-row items-center gap-8">
                            <div className="w-32 h-32 bg-gray-200 rounded-full flex items-center justify-center border-4 border-red-500/20">
                                {/* Villain Image Placeholder */}
                                <span className="text-4xl">😈</span>
                            </div>
                            <div className="flex-1 text-center md:text-left">
                                <p className="text-gray-600 mb-2">The villain <strong>{level.boss.name}</strong> represents <strong>{level.boss.represents}</strong>. Use your hero powers to defeat them!</p>
                                <div className="flex flex-wrap gap-2 mb-4 justify-center md:justify-start">
                                    {level.boss.weakAgainst.map((alienId: string) => (
                                        <Badge key={alienId} variant="secondary" className="capitalize">{alienId}</Badge>
                                    ))}
                                </div>
                                <Button
                                    disabled={!missionsCompleted.includes(level.missions[level.missions.length - 1].id)}
                                    className="w-full md:w-auto bg-red-600 hover:bg-red-700 h-10 px-8"
                                    onClick={() => router.push(`/game/boss/${level.id}`)}
                                >
                                    Challenge {level.boss.name}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    )
}

function TrophyIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
            <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
            <path d="M4 22h16" />
            <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
            <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
            <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
        </svg>
    )
}

function AlertTriangleIcon(props: any) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
            <path d="M12 9v4" />
            <path d="M12 17h.01" />
        </svg>
    )
}
