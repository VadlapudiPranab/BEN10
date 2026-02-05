'use client'

import { useParams, useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { getLevelById, getAlienById } from '@/lib/game/game-data'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { useGameStore } from '@/lib/game/game-store'
import { ArrowLeft, Shield, Sword, Zap, Heart, Trophy } from 'lucide-react'
import { getGameProgress, updateGameProgress, unlockAchievement } from '@/app/actions/game'
import { Badge } from '@/components/ui/badge'

export default function BossPage() {
    const { id } = useParams()
    const router = useRouter()
    const levelId = parseInt(id as string)
    const level = getLevelById(levelId)

    const { selectedAlien, selectAlien } = useGameStore()
    const [gameState, setGameState] = useState<'intro' | 'playing' | 'victory' | 'fail'>('intro')
    const [bossHealth, setBossHealth] = useState(100)
    const [playerHealth, setPlayerHealth] = useState(3)
    const [currentQuestion, setCurrentQuestion] = useState(0)

    // Boss challenge is a "Battle Quiz" - answer correctly to damage boss
    const questions = [
        { q: "Why is it important to brush your teeth every morning?", a: ["To make them sparkle", "To remove germs and prevent cavities", "To taste the toothpaste"], correct: 1 },
        { q: "What should you do with your toys after playing?", a: ["Leave them on the floor", "Put them in the toy box", "Throw them under the bed"], correct: 1 },
        { q: "How can you help your parents at home?", a: ["By asking for more toys", "By helping with small chores like setting the table", "By watching TV all day"], correct: 1 },
    ]

    useEffect(() => {
        if (bossHealth <= 0) {
            setGameState('victory')
            handleVictory()
        }
        if (playerHealth <= 0) {
            setGameState('fail')
        }
    }, [bossHealth, playerHealth])

    const handleAnswer = (index: number) => {
        if (index === questions[currentQuestion].correct) {
            setBossHealth(h => Math.max(0, h - 34))
            setCurrentQuestion(q => (q + 1) % questions.length)
        } else {
            setPlayerHealth(h => h - 1)
        }
    }

    const handleVictory = async () => {
        const progress = await getGameProgress()
        const completedLevels = [...(progress.data?.levelsCompleted || [])]
        if (!completedLevels.includes(levelId)) {
            completedLevels.push(levelId)
        }

        await updateGameProgress({
            levelsCompleted: completedLevels,
            currentLevel: levelId + 1
        })

        await unlockAchievement({
            achievementType: 'badge',
            achievementName: level?.badge || 'Level Master',
            achievementData: { levelId }
        })
    }

    if (!level) return <div className="p-8">Level not found</div>

    return (
        <div className="min-h-screen bg-zinc-950 text-white p-4 md:p-8 flex flex-col items-center justify-center">
            {gameState === 'intro' && (
                <div className="max-w-2xl w-full text-center space-y-12 animate-in zoom-in duration-500">
                    <div className="relative inline-block">
                        <div className="absolute inset-0 bg-red-500 blur-3xl opacity-20 animate-pulse"></div>
                        <h1 className="text-6xl md:text-8xl font-black text-red-600 tracking-tighter uppercase italic">Warning!</h1>
                    </div>

                    <div className="flex flex-col items-center gap-6">
                        <div className="w-48 h-48 bg-zinc-900 rounded-full border-8 border-red-600/20 flex items-center justify-center relative shadow-[0_0_50px_rgba(220,38,38,0.3)]">
                            <span className="text-8xl">😈</span>
                            <div className="absolute -bottom-4 bg-red-600 px-6 py-2 rounded-full font-black text-white italic transform -rotate-2">
                                {level.boss.name.toUpperCase()}
                            </div>
                        </div>
                        <p className="text-2xl text-gray-400 font-medium">"{level.boss.name} is spreading {level.boss.represents}! You must stop them!"</p>
                    </div>

                    <div className="bg-zinc-900 border border-zinc-800 p-8 rounded-3xl space-y-6">
                        <p className="text-zinc-500 font-mono uppercase tracking-widest text-sm">Recommended Transformation</p>
                        <div className="flex justify-center gap-4">
                            {level.boss.weakAgainst.map(alienId => (
                                <Badge key={alienId} variant="outline" className="text-lg py-2 px-6 border-green-500 text-green-500 capitalize">
                                    {alienId}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={() => setGameState('playing')}
                        className="bg-red-600 hover:bg-red-500 text-white font-black text-3xl px-16 py-10 rounded-full shadow-[0_10px_40px_rgba(220,38,38,0.4)] transition-all hover:scale-110 active:scale-95"
                    >
                        BATTLE!
                    </Button>
                </div>
            )}

            {gameState === 'playing' && (
                <div className="max-w-4xl w-full space-y-8">
                    {/* Battle HUD */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-zinc-900 p-6 rounded-2xl border-2 border-green-500/30">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="text-xl">🦸</span>
                                    <span className="font-bold">BEN TENNYSON</span>
                                </div>
                                <div className="flex gap-1">
                                    {[1, 2, 3].map(i => <Heart key={i} className={`w-5 h-5 ${i <= playerHealth ? 'text-red-500 fill-red-500' : 'text-zinc-800'}`} />)}
                                </div>
                            </div>
                            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-green-500 transition-all duration-500" style={{ width: `${(playerHealth / 3) * 100}%` }}></div>
                            </div>
                        </div>

                        <div className="bg-zinc-900 p-6 rounded-2xl border-2 border-red-500/30">
                            <div className="flex justify-between items-center mb-2">
                                <div className="flex items-center gap-2">
                                    <span className="font-bold uppercase tracking-tighter text-red-500">{level.boss.name}</span>
                                    <span className="text-xl">😈</span>
                                </div>
                                <span className="text-xs font-mono text-red-500">{bossHealth}% HP</span>
                            </div>
                            <div className="h-4 bg-zinc-800 rounded-full overflow-hidden">
                                <div className="h-full bg-red-600 transition-all duration-500" style={{ width: `${bossHealth}%` }}></div>
                            </div>
                        </div>
                    </div>

                    {/* Battle Arena */}
                    <Card className="bg-zinc-900 border-zinc-800 overflow-hidden min-h-[400px] flex flex-col">
                        <div className="p-8 border-b border-zinc-800 flex justify-between items-center bg-zinc-800/30">
                            <h2 className="text-xl font-bold text-green-500 flex items-center gap-2 uppercase tracking-tighter">
                                <Zap className="w-5 h-5" />
                                Battle Challenge: Phase {currentQuestion + 1}
                            </h2>
                        </div>
                        <CardContent className="flex-1 flex flex-col p-8 md:p-12 items-center justify-center text-center">
                            <h3 className="text-3xl md:text-4xl font-black mb-12 max-w-2xl leading-tight">
                                {questions[currentQuestion].q}
                            </h3>

                            <div className="grid gap-4 w-full max-w-xl">
                                {questions[currentQuestion].a.map((answer, i) => (
                                    <Button
                                        key={i}
                                        onClick={() => handleAnswer(i)}
                                        variant="outline"
                                        className="h-20 text-xl font-bold bg-zinc-800/50 border-zinc-700 hover:border-green-500 hover:bg-green-500/10 transition-all"
                                    >
                                        <span className="w-10 h-10 rounded-full bg-zinc-700 flex items-center justify-center mr-4 text-sm font-mono">{String.fromCharCode(65 + i)}</span>
                                        {answer}
                                    </Button>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-center">
                        <Button
                            variant="ghost"
                            onClick={() => router.push(`/game/level/${levelId}`)}
                            className="text-zinc-600 hover:text-zinc-400"
                        >
                            Abort Battle
                        </Button>
                    </div>
                </div>
            )}

            {gameState === 'victory' && (
                <div className="text-center space-y-8 animate-in fly-in-from-bottom duration-700">
                    <div className="w-40 h-40 bg-yellow-500 rounded-full mx-auto flex items-center justify-center shadow-[0_0_80px_rgba(234,179,8,0.4)] animate-bounce">
                        <Trophy className="w-24 h-24 text-white" />
                    </div>
                    <div>
                        <h2 className="text-7xl font-black text-yellow-500 tracking-tighter uppercase mb-2">Victory!</h2>
                        <p className="text-2xl text-gray-400">You defeated {level.boss.name} and saved the level!</p>
                    </div>

                    <Card className="bg-zinc-900 border-yellow-500/50 p-8 max-w-md mx-auto">
                        <p className="text-yellow-500 font-mono text-sm uppercase mb-4 tracking-widest">Achievement Unlocked</p>
                        <div className="flex items-center gap-4 justify-center">
                            <div className="w-16 h-16 bg-yellow-500/10 rounded-2xl border border-yellow-500/30 flex items-center justify-center">
                                <Shield className="w-10 h-10 text-yellow-500" />
                            </div>
                            <div className="text-left">
                                <h4 className="text-xl font-bold text-white">{level.badge}</h4>
                                <p className="text-sm text-gray-400 italic">For showing extreme heroism</p>
                            </div>
                        </div>
                    </Card>

                    <div className="space-x-4 pt-8">
                        <Button
                            onClick={() => router.push('/game')}
                            className="bg-green-600 hover:bg-green-500 text-white font-black text-xl px-12 py-8 rounded-full"
                        >
                            RETURN TO HUB
                        </Button>
                    </div>
                </div>
            )}

            {gameState === 'fail' && (
                <div className="text-center space-y-8">
                    <div className="text-9xl mb-8">💀</div>
                    <h2 className="text-6xl font-black text-red-600 uppercase italic">Defeated...</h2>
                    <p className="text-xl text-gray-400">Don't give up! Ben 10 always tries again!</p>
                    <Button
                        onClick={() => {
                            setGameState('playing')
                            setPlayerHealth(3)
                            setBossHealth(100)
                            setCurrentQuestion(0)
                        }}
                        className="bg-red-600 hover:bg-red-500 text-white font-black text-xl px-12 py-8 rounded-full"
                    >
                        RETRY BATTLE
                    </Button>
                </div>
            )}
        </div>
    )
}
