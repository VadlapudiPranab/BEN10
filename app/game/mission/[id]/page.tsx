'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getMissionById, ALIENS, getAlienById } from '@/lib/game/game-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGameStore } from '@/lib/game/game-store'
import { ArrowLeft, CheckCircle2, Star, Zap, Lock } from 'lucide-react'
import { getGameProgress, updateGameProgress, saveMissionScore } from '@/app/actions/game'
import { MissionGame } from '@/components/game/mini-games/mission-game'
import { Badge } from '@/components/ui/badge'

export default function MissionPage() {
    const { id } = useParams()
    const router = useRouter()
    const missionId = id as string
    const mission = getMissionById(missionId)

    const { selectedAlien, selectAlien, resetGame } = useGameStore()

    const [gameState, setGameState] = useState<'briefing' | 'transformation' | 'playing' | 'result'>('briefing')
    const [unlockedAliens, setUnlockedAliens] = useState<string[]>([])
    const [loading, setLoading] = useState(true)
    const [result, setResult] = useState({ stars: 0, score: 0 })

    useEffect(() => {
        async function loadProgress() {
            const res = await getGameProgress()
            // Default unlocked aliens for new users if progress not found
            const completed = res.data?.levelsCompleted || []
            const unlocked = ['heatblast', 'four-arms']
            if (completed.includes(1)) unlocked.push('xlr8')
            if (completed.includes(2)) unlocked.push('grey-matter')
            if (completed.includes(3)) unlocked.push('upgrade')
            if (completed.includes(4)) unlocked.push('diamondhead')

            setUnlockedAliens(unlocked)
            setLoading(false)
        }
        loadProgress()
        resetGame()
    }, [resetGame])

    const handleStartMission = () => {
        setGameState('transformation')
    }

    const handleTransform = (alienId: string) => {
        const alien = getAlienById(alienId)
        if (alien) {
            selectAlien(alien)
            setGameState('playing')
        }
    }

    const handleFinishMission = async () => {
        if (!mission) return

        // Save score
        await saveMissionScore({
            levelId: mission.levelId,
            missionId: mission.id,
            starsEarned: result.stars,
            timeTaken: 0,
            perfectScore: result.stars === 3,
        })

        // Update progress
        const currentProgress = await getGameProgress()
        const completedMissions = [...(currentProgress.data?.missionsCompleted || [])]
        if (!completedMissions.includes(mission.id)) {
            completedMissions.push(mission.id)
        }

        const totalStars = (currentProgress.data?.totalStars || 0) + result.stars
        const levelsCompleted = [...(currentProgress.data?.levelsCompleted || [])]

        // Check if all missions in this level are completed
        const levelMissions = getMissionById(mission.id)?.levelId
        // Simple logic: if mission completed, level is partially completed
        if (result.stars >= 1 && !levelsCompleted.includes(mission.levelId)) {
            // For now, let's say Level 1 is complete if mission 3 is done
            if (mission.id.includes('help-parents') || mission.levelId === 1) { // Placeholder logic
                if (!levelsCompleted.includes(mission.levelId)) {
                    levelsCompleted.push(mission.levelId)
                }
            }
        }

        await updateGameProgress({
            missionsCompleted: completedMissions,
            totalStars: totalStars,
            levelsCompleted: levelsCompleted
        })
    }

    if (!mission) return <div className="p-8">Mission not found</div>
    if (loading) return <div className="p-8 text-center">Loading Mission...</div>

    return (
        <div className="min-h-screen bg-black text-white p-4 md:p-8 flex flex-col">
            {/* HUD Header */}
            <div className="flex justify-between items-center mb-8 pb-4 border-b border-green-500/30">
                <Button
                    variant="outline"
                    size="sm"
                    className="bg-transparent border-green-500 text-green-500 hover:bg-green-500/10"
                    onClick={() => router.push(`/game/level/${mission.levelId}`)}
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Abort Mission
                </Button>
                <div className="flex items-center gap-4">
                    <div className="text-right">
                        <p className="text-xs text-green-500 font-mono uppercase tracking-widest">Mission Status</p>
                        <p className="text-sm font-bold uppercase">{gameState}</p>
                    </div>
                    <div className="w-10 h-10 border-2 border-green-500 rounded-full flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(34,197,94,0.5)]">
                        <div className="w-6 h-6 bg-green-500 rounded-sm rotate-45"></div>
                    </div>
                </div>
            </div>

            <div className="flex-1 max-w-4xl mx-auto w-full flex flex-col justify-center">
                {gameState === 'briefing' && (
                    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="text-center">
                            <Badge className="bg-green-500 mb-4 px-4 py-1 text-sm">BRIEFING IN PROGRESS</Badge>
                            <h1 className="text-4xl md:text-5xl font-black mb-4">{mission.title}</h1>
                            <p className="text-xl text-gray-400 max-w-2xl mx-auto">{mission.description}</p>
                        </div>

                        <Card className="bg-zinc-900 border-zinc-800 text-white p-6 md:p-8">
                            <div className="grid md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-green-500 font-mono uppercase tracking-tighter mb-4 flex items-center gap-2">
                                        <CheckCircle2 className="w-5 h-5" />
                                        Primary Objective
                                    </h3>
                                    <p className="text-lg mb-6">{mission.objective}</p>

                                    <h3 className="text-green-500 font-mono uppercase tracking-tighter mb-4 flex items-center gap-2">
                                        <Zap className="w-5 h-5" />
                                        Required Hero Skill
                                    </h3>
                                    <div className="flex items-center gap-4 bg-zinc-800 p-4 rounded-lg">
                                        <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center border border-green-500/30">
                                            <span className="text-2xl">🦸</span>
                                        </div>
                                        <div>
                                            <p className="font-bold">{mission.requiredAlien ? getAlienById(mission.requiredAlien)?.habit : "Versatility"}</p>
                                            <p className="text-sm text-gray-400">Transform to use this power</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-green-500/5 border border-green-500/10 rounded-xl p-6 flex flex-col justify-center items-center text-center">
                                    <p className="text-xs text-green-500 font-mono mb-4 uppercase tracking-widest">Potential Rewards</p>
                                    <div className="flex gap-2 mb-4">
                                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                                        <Star className="w-8 h-8 text-yellow-400 fill-yellow-400" />
                                    </div>
                                    <p className="text-sm text-gray-400">+ Skill Experience</p>
                                    <p className="text-sm text-gray-400">+ Progress to next level</p>
                                </div>
                            </div>
                        </Card>

                        <div className="flex justify-center pt-8">
                            <Button
                                onClick={handleStartMission}
                                className="bg-green-600 hover:bg-green-500 text-white font-black px-12 py-8 text-2xl rounded-full shadow-[0_0_30px_rgba(34,197,94,0.3)] hover:scale-105 transition-all"
                            >
                                IT'S HERO TIME!
                            </Button>
                        </div>
                    </div>
                )}

                {gameState === 'transformation' && (
                    <div className="text-center animate-in zoom-in duration-300">
                        <h2 className="text-3xl font-black mb-12 text-green-500 uppercase tracking-tighter">SELECT HERO FORM</h2>

                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                            {ALIENS.map((alien) => {
                                const isLocked = !unlockedAliens.includes(alien.id)

                                return (
                                    <button
                                        key={alien.id}
                                        disabled={isLocked}
                                        onClick={() => handleTransform(alien.id)}
                                        className={`group relative flex flex-col items-center p-6 rounded-2xl border-2 transition-all hover:scale-105 ${isLocked
                                            ? 'border-zinc-800 bg-zinc-900 overflow-hidden cursor-not-allowed grayscale'
                                            : 'border-green-500 shadow-[0_0_20px_rgba(34,197,94,0.1)] hover:shadow-[0_0_30px_rgba(34,197,94,0.3)] bg-zinc-900/50'
                                            }`}
                                    >
                                        {isLocked && (
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center z-10">
                                                <Lock className="w-8 h-8 text-white/50" />
                                            </div>
                                        )}
                                        <div className="text-5xl mb-4 group-hover:scale-110 transition-transform duration-300">
                                            {alien.id === 'heatblast' ? '🔥' :
                                                alien.id === 'four-arms' ? '💪' :
                                                    alien.id === 'xlr8' ? '🏃' :
                                                        alien.id === 'grey-matter' ? '🧠' :
                                                            alien.id === 'upgrade' ? '⚙️' : '💎'}
                                        </div>
                                        <span className="font-bold uppercase tracking-wider">{alien.name}</span>
                                        <span className="text-[10px] text-green-500 font-mono mt-1 opacity-70">{alien.power}</span>
                                    </button>
                                )
                            })}
                        </div>

                        <p className="mt-12 text-gray-500 font-mono text-sm animate-pulse">SYSTEM UNAVAILABLE FOR NON-UNLOCKED FORMS</p>
                    </div>
                )}

                {gameState === 'playing' && (
                    <div className="bg-zinc-900 border-2 border-green-500 rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(34,197,94,0.2)] aspect-video flex flex-col relative">
                        <MissionGame
                            type={mission.miniGame}
                            onComplete={(stars, score) => {
                                setResult({ stars, score })
                                setGameState('result')
                            }}
                            onFail={() => {
                                setGameState('briefing')
                            }}
                        />

                        <div className="p-4 bg-black/60 border-t border-green-500/20 backdrop-blur-md flex justify-between items-center">
                            <div className="flex items-center gap-4">
                                <div className="text-red-500 flex gap-1">
                                    {[1, 2, 3].map(i => <div key={i} className="w-5 h-5 border-2 border-red-500 rounded-sm rotate-45 flex items-center justify-center"><div className="w-2 h-2 bg-red-500 rounded-full"></div></div>)}
                                </div>
                                <span className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">Vitality Levels</span>
                            </div>
                            <div className="bg-black/40 px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-2">
                                <p className="text-[10px] text-green-500 font-mono uppercase">Hero</p>
                                <p className="text-xs font-bold">{selectedAlien?.name}</p>
                            </div>
                        </div>
                    </div>
                )}

                {gameState === 'result' && (
                    <div className="animate-in fade-in duration-700 text-center">
                        <div className="w-24 h-24 bg-green-500 rounded-full mx-auto mb-6 flex items-center justify-center shadow-[0_0_40px_rgba(34,197,94,0.5)]">
                            <Star className={`w-12 h-12 text-white ${result.stars >= 1 ? 'fill-white' : ''}`} />
                        </div>
                        <h2 className="text-5xl font-black mb-2 text-green-500">{result.stars >= 1 ? 'MISSION SUCCESS!' : 'MISSION COMPLETE'}</h2>
                        <p className="text-xl text-gray-400 mb-12">{result.stars >= 2 ? 'YOU HAVE PROVEN YOUR HEROISM' : 'PRACTICE MAKES PERFECT'}</p>

                        <div className="bg-zinc-900 border border-green-500/30 rounded-2xl p-8 max-w-sm mx-auto mb-12">
                            <p className="text-xs text-green-500 font-mono uppercase tracking-widest mb-4">Educational Report</p>
                            <h3 className="text-2xl font-bold mb-2">{selectedAlien?.habit}</h3>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">By choosing clean actions and heroism, you make the world better for everyone!</p>

                            <div className="flex justify-center gap-2">
                                {[1, 2, 3].map(i => (
                                    <Star key={i} className={`w-10 h-10 ${i <= result.stars ? 'text-yellow-400 fill-yellow-400 animate-bounce' : 'text-zinc-700'}`} />
                                ))}
                            </div>
                            <p className="font-bold text-yellow-500 mt-2">{result.stars} STARS EARNED</p>
                            <p className="text-xs text-gray-500 mt-1">SCORE: {result.score}</p>
                        </div>

                        <div className="flex flex-col md:flex-row justify-center gap-4">
                            <Button
                                onClick={() => setGameState('playing')}
                                variant="outline"
                                className="bg-transparent border-white text-white hover:bg-white/10 h-14 px-8"
                            >
                                TRY FOR 3 STARS
                            </Button>
                            <Button
                                onClick={async () => {
                                    await handleFinishMission()
                                    router.push(`/game/level/${mission.levelId}`)
                                }}
                                className="bg-green-600 hover:bg-green-500 text-white font-bold h-14 px-12 text-lg"
                            >
                                BACK TO MISSION SELECT
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}
