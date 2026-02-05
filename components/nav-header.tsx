'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { logout } from '@/app/actions/auth'
import { createClient } from '@/lib/supabase/client'

export default function NavHeader() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const supabase = createClient()
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user)
      setIsLoading(false)
    }

    getUser()
  }, [])

  const handleLogout = async () => {
    await logout()
  }

  if (isLoading) return null

  return (
    <header className="border-b bg-background">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-8">
          <h1 className="text-2xl font-bold">MyApp</h1>
          {user && (
            <nav className="flex gap-6">
              <button
                onClick={() => router.push('/protected/profile')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Profile
              </button>
              <button
                onClick={() => router.push('/')}
                className="text-sm font-medium hover:text-primary transition-colors"
              >
                Home
              </button>
            </nav>
          )}
        </div>
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              Logout
            </Button>
          </div>
        )}
      </div>
    </header>
  )
}
