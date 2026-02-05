'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'
import { Award, Gamepad2, ShieldCheck, Heart, LayoutDashboard } from 'lucide-react'

export default function Home() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          router.push('/auth/login')
          return
        }

        setUser(user)
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [router, supabase.auth])

  const handleSignOut = async () => {
    await logout()
    router.push('/auth/login')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-green-500 font-mono animate-pulse">OMNITRIX INITIALIZING...</div>
      </div>
    )
  }

  if (!user) return null

  return (
    <div className="min-h-screen bg-zinc-950 text-white overflow-hidden relative">
      {/* Dynamic Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-green-900/20 via-black to-blue-900/20 z-0"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-green-500/10 blur-[120px] rounded-full z-0 animate-pulse"></div>

      <header className="relative z-10 container mx-auto px-6 py-6 flex justify-between items-center border-b border-white/5">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-green-500 rounded-sm rotate-45 flex items-center justify-center shadow-[0_0_15px_rgba(34,197,94,0.5)]">
            <div className="w-4 h-4 bg-black rounded-sm"></div>
          </div>
          <span className="font-black text-xl tracking-tighter italic uppercase">Ben 10: <span className="text-green-500">Hero of Habits</span></span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden md:inline-block font-mono uppercase tracking-widest">{user.email}</span>
          <Button onClick={handleSignOut} variant="ghost" size="sm" className="text-gray-400 hover:text-white hover:bg-white/5">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="relative z-10 container mx-auto px-6 pt-20 pb-20 flex flex-col items-center">
        <div className="text-center mb-16 space-y-4 max-w-3xl">
          <div className="inline-block bg-green-500/10 text-green-500 border border-green-500/20 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            Educational Adventure Activated
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase italic leading-none">
            It's <span className="text-green-500">Hero</span> Time!
          </h1>
          <p className="text-xl text-gray-400 font-medium">
            Transform your habits, unlock your powers, and save the world through kindness and responsibility.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
          {/* Play Game Card */}
          <Link href="/game" className="group">
            <Card className="bg-zinc-900/50 border-white/5 overflow-hidden transition-all duration-300 group-hover:border-green-500/50 group-hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] group-hover:-translate-y-2 pointer-events-auto">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-green-600 to-emerald-800 flex items-center justify-center relative">
                  <Gamepad2 className="w-24 h-24 text-white/20 absolute -bottom-4 -right-4 rotate-12" />
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center border border-white/20">
                      <Gamepad2 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic">Enter Game Hub</h3>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-gray-400 font-medium">Start level missions, transform into aliens, and earn habit badges.</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-green-500 uppercase tracking-widest">
                      <Award className="w-4 h-4" />
                      4 Levels
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-green-500 uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4" />
                      6 Heroes
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Parent Portal Card */}
          <Link href="/parent" className="group">
            <Card className="bg-zinc-900/50 border-white/5 overflow-hidden transition-all duration-300 group-hover:border-indigo-500/50 group-hover:shadow-[0_0_40px_rgba(79,70,229,0.15)] group-hover:-translate-y-2 pointer-events-auto">
              <CardContent className="p-0">
                <div className="aspect-video bg-gradient-to-br from-indigo-600 to-violet-800 flex items-center justify-center relative">
                  <LayoutDashboard className="w-24 h-24 text-white/20 absolute -bottom-4 -right-4 rotate-12" />
                  <div className="text-center space-y-4">
                    <div className="w-20 h-20 bg-white/10 backdrop-blur-md rounded-3xl mx-auto flex items-center justify-center border border-white/20">
                      <LayoutDashboard className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-black text-white uppercase italic">Parent Guardian</h3>
                  </div>
                </div>
                <div className="p-8 space-y-4">
                  <p className="text-gray-400 font-medium">Track development insights, habit report cards, and manage game settings.</p>
                  <div className="flex gap-4">
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      <Heart className="w-4 h-4" />
                      Insights
                    </div>
                    <div className="flex items-center gap-1 text-xs font-bold text-indigo-400 uppercase tracking-widest">
                      <ShieldCheck className="w-4 h-4" />
                      Guardian Tools
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="mt-20 pt-10 border-t border-white/5 w-full flex flex-col md:flex-row justify-between items-center gap-8 text-gray-500 text-sm font-medium">
          <div className="flex gap-8">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Help Center</Link>
          </div>
          <p className="font-mono text-[10px] uppercase tracking-widest">© 2026 HERO OF HABITS PROJECT • SUPABASE POWERED</p>
        </div>
      </main>
    </div>
  )
}
