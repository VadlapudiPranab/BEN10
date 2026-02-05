'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
    LayoutDashboard,
    BarChart3,
    Settings,
    Heart,
    Calendar,
    Award,
    Clock,
    CheckCircle2,
    Lock,
    Eye
} from 'lucide-react'
import {
    getGameProgress,
    getDailyHabits,
    getMissionScores,
    getAchievements,
    getParentSettings,
    updateParentSettings
} from '@/app/actions/game'
import { useRouter } from 'next/navigation'

export default function ParentDashboard() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [progress, setProgress] = useState<any>(null)
    const [habits, setHabits] = useState<any[]>([])
    const [scores, setScores] = useState<any[]>([])
    const [achievements, setAchievements] = useState<any[]>([])
    const [settings, setSettings] = useState<any>(null)

    useEffect(() => {
        async function loadData() {
            setLoading(true)
            const [progRes, habitRes, scoreRes, achRes, setRes] = await Promise.all([
                getGameProgress(),
                getDailyHabits(),
                getMissionScores(),
                getAchievements(),
                getParentSettings()
            ])

            setProgress(progRes.data)
            setHabits(habitRes.data || [])
            setScores(scoreRes.data || [])
            setAchievements(achRes.data || [])
            setSettings(setRes.data)
            setLoading(false)
        }
        loadData()
    }, [])

    if (loading) return <div className="p-8 text-center bg-gray-50 min-h-screen">Loading Insights...</div>

    return (
        <div className="min-h-screen bg-slate-50">
            {/* Header */}
            <header className="bg-white border-b px-6 py-4 flex justify-between items-center sticky top-0 z-10">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <LayoutDashboard className="text-white w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-slate-900">Parent Guardian Hub</h1>
                        <p className="text-xs text-slate-500 font-medium lowercase">Insights for Hero of Habits</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => router.push('/game')} className="text-indigo-600 border-indigo-200">
                        <Eye className="w-4 h-4 mr-2" />
                        View Game
                    </Button>
                    <Button size="sm" className="bg-slate-900">
                        <Settings className="w-4 h-4 mr-2" />
                        Settings
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-6 py-8 pb-20">
                {/* Stats Overview */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-indigo-50 rounded-lg"><Award className="text-indigo-600 w-5 h-5" /></div>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold text-indigo-600 bg-indigo-50 border-none">Stars Earned</Badge>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">{progress?.totalStars || 0}</h3>
                            <p className="text-xs text-slate-500 mt-1">Global ranking: Top 15%</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-emerald-50 rounded-lg"><CheckCircle2 className="text-emerald-600 w-5 h-5" /></div>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold text-emerald-600 bg-emerald-50 border-none">Habits Tracked</Badge>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">{habits.filter(h => h.completed).length}/{habits.length || '—'}</h3>
                            <p className="text-xs text-slate-500 mt-1">Today's completion rate</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-amber-50 rounded-lg"><Clock className="text-amber-600 w-5 h-5" /></div>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold text-amber-600 bg-amber-50 border-none">Screen Time</Badge>
                            </div>
                            <h3 className="text-3xl font-black text-slate-900">22<span className="text-sm font-medium text-slate-400">m</span></h3>
                            <p className="text-xs text-slate-500 mt-1">Limit: 1h 00m</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-white border-slate-200 shadow-sm">
                        <CardContent className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-2 bg-rose-50 rounded-lg"><Heart className="text-rose-600 w-5 h-5" /></div>
                                <Badge variant="secondary" className="text-[10px] uppercase font-bold text-rose-600 bg-rose-50 border-none">Current Level</Badge>
                            </div>
                            <h3 className="text-2xl font-black text-slate-900">LEVEL {progress?.currentLevel || 1}</h3>
                            <p className="text-xs text-slate-500 mt-1">Home Responsibility</p>
                        </CardContent>
                    </Card>
                </div>

                <Tabs defaultValue="report" className="space-y-6">
                    <TabsList className="bg-slate-200/50 p-1">
                        <TabsTrigger value="report" className="px-8 font-bold text-xs uppercase tracking-widest"><BarChart3 className="w-4 h-4 mr-2" /> Report Card</TabsTrigger>
                        <TabsTrigger value="habits" className="px-8 font-bold text-xs uppercase tracking-widest"><Calendar className="w-4 h-4 mr-2" /> Daily Habits</TabsTrigger>
                        <TabsTrigger value="achievements" className="px-8 font-bold text-xs uppercase tracking-widest"><Award className="w-4 h-4 mr-2" /> Achievements</TabsTrigger>
                    </TabsList>

                    <TabsContent value="report" className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <div className="grid md:grid-cols-2 gap-8">
                            <Card className="border-none shadow-xl bg-white overflow-hidden">
                                <div className="bg-indigo-600 p-6 text-white">
                                    <h3 className="text-2xl font-black mb-1">Habit Report Card</h3>
                                    <p className="text-indigo-100/70 text-sm">Last 30 days of character development</p>
                                </div>
                                <CardContent className="p-8 space-y-8">
                                    {[
                                        { label: 'Cleanliness & Hygiene', score: 85, color: 'bg-indigo-500', desc: 'Improving remarkably!' },
                                        { label: 'Teamwork & Helping', score: 92, color: 'bg-emerald-500', desc: 'Outstanding cooperation.' },
                                        { label: 'Time Management', score: 65, color: 'bg-amber-500', desc: 'Needs slight focus.' },
                                        { label: 'Honesty & Integrity', score: 100, color: 'bg-rose-500', desc: 'A true hero of truth.' },
                                    ].map((item, i) => (
                                        <div key={i} className="space-y-2">
                                            <div className="flex justify-between items-end">
                                                <div>
                                                    <p className="font-bold text-slate-900">{item.label}</p>
                                                    <p className="text-xs text-slate-500">{item.desc}</p>
                                                </div>
                                                <span className="text-xl font-black text-slate-900">{item.score}%</span>
                                            </div>
                                            <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                                                <div className={`h-full ${item.color} transition-all duration-1000`} style={{ width: `${item.score}%` }}></div>
                                            </div>
                                        </div>
                                    ))}
                                </CardContent>
                            </Card>

                            <div className="space-y-6">
                                <Card className="border-none shadow-lg bg-white p-8">
                                    <h3 className="text-lg font-bold text-slate-900 mb-6 flex items-center gap-2">
                                        <Award className="text-indigo-600" />
                                        Educational Insights
                                    </h3>
                                    <div className="space-y-6">
                                        <div className="flex gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                            <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-2xl">🧠</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Problem Solving</p>
                                                <p className="text-xs text-slate-500">Player prefers logic-based mini-games. High engagement in 'Grey Matter' levels.</p>
                                            </div>
                                        </div>
                                        <div className="flex gap-4 p-4 bg-white rounded-2xl border border-slate-100">
                                            <div className="w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center text-2xl">🌍</div>
                                            <div>
                                                <p className="text-sm font-bold text-slate-900">Social Responsibility</p>
                                                <p className="text-xs text-slate-500">Regularly chooses helpful actions in Level 1 Story Mode.</p>
                                            </div>
                                        </div>
                                    </div>
                                    <Button className="w-full mt-10 bg-indigo-600 hover:bg-indigo-700 text-white font-bold h-12">Download Full PDF Report</Button>
                                </Card>

                                <Card className="bg-indigo-900 border-none text-white p-8 relative overflow-hidden">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-800 rounded-full -mr-16 -mt-16 opacity-50 blur-2xl"></div>
                                    <h4 className="text-indigo-200 text-xs font-mono uppercase tracking-widest mb-2">Teacher Recommendation</h4>
                                    <p className="text-lg font-medium leading-relaxed italic">"Encourage more discussion about punctuality this week. The game data shows some struggle with beating the clock missions."</p>
                                    <div className="mt-6 flex items-center gap-3">
                                        <div className="w-10 h-10 bg-indigo-800 rounded-full border border-indigo-700 flex items-center justify-center text-sm">💡</div>
                                        <p className="text-xs text-indigo-300">Tip: Set the kitchen timer to help them practice at home!</p>
                                    </div>
                                </Card>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="habits" className="space-y-6">
                        <Card className="p-0 border-none shadow-xl overflow-hidden">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 border-b border-slate-100">
                                    <tr>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Habit Name</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                        <th className="px-8 py-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-right">Last Completed</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-50">
                                    {habits.length > 0 ? habits.map((habit, i) => (
                                        <tr key={i} className="hover:bg-indigo-50/10 transition-colors">
                                            <td className="px-8 py-6 font-bold text-slate-900">{habit.habitName}</td>
                                            <td className="px-8 py-6">
                                                <Badge variant="outline" className="capitalize text-slate-600 border-slate-200 bg-white">{habit.habitCategory}</Badge>
                                            </td>
                                            <td className="px-8 py-6">
                                                {habit.completed ? (
                                                    <Badge className="bg-emerald-500 text-white border-none px-3 py-1">Success</Badge>
                                                ) : (
                                                    <Badge variant="secondary" className="bg-slate-100 text-slate-400 border-none px-3 py-1">Incomplete</Badge>
                                                )}
                                            </td>
                                            <td className="px-8 py-6 text-right text-slate-500 text-sm font-medium">
                                                {habit.completionDate ? new Date(habit.completionDate).toLocaleDateString() : 'Never'}
                                            </td>
                                        </tr>
                                    )) : (
                                        <tr>
                                            <td colSpan={4} className="px-8 py-12 text-center text-slate-400 italic">No habit data recorded yet</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </Card>
                        <div className="flex justify-center">
                            <Button variant="outline" className="border-indigo-200 text-indigo-600">+ Add Custom Home Habit</Button>
                        </div>
                    </TabsContent>

                    <TabsContent value="achievements" className="grid md:grid-cols-3 gap-6">
                        {achievements.length > 0 ? achievements.map((ach, i) => (
                            <Card key={i} className="border-none shadow-md hover:shadow-lg transition-all text-center p-8 bg-white">
                                <div className="w-20 h-20 bg-indigo-50 rounded-2xl mx-auto flex items-center justify-center mb-4 text-3xl">
                                    {ach.achievementType === 'badge' ? '🎖️' : '👽'}
                                </div>
                                <h4 className="font-black text-slate-900 text-xl">{ach.achievementName}</h4>
                                <p className="text-sm text-slate-500 mt-1 uppercase font-bold tracking-tighter">Unlocked {new Date(ach.earnedAt).toLocaleDateString()}</p>
                                <div className="mt-6 pt-6 border-t border-slate-50">
                                    <Badge className="bg-indigo-100 text-indigo-600 border-none text-[10px] uppercase font-black">Verified Success</Badge>
                                </div>
                            </Card>
                        )) : (
                            <div className="col-span-full py-20 text-center space-y-4">
                                <div className="w-24 h-24 bg-slate-100 rounded-full mx-auto flex items-center justify-center mb-6">
                                    <Award className="w-12 h-12 text-slate-300" />
                                </div>
                                <h4 className="text-xl font-bold text-slate-400">No achievements yet</h4>
                                <p className="text-slate-500 max-w-xs mx-auto">Encourage your child to complete Level 1 to earn their first Badge!</p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </main>

            {/* Bottom Floating Tip */}
            <div className="fixed bottom-6 right-6 z-50">
                <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-in slide-in-from-right duration-500">
                    <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center animate-bounce">
                        <Lock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-indigo-400 uppercase tracking-widest">Safety Check</p>
                        <p className="text-sm font-medium">Session secured by Parent PIN</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
