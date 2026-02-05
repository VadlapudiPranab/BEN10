'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import Link from 'next/link'
import { logout } from '@/app/actions/auth'

interface Profile {
  id: string
  first_name: string | null
  last_name: string | null
  bio: string | null
  avatar_url: string | null
}

export default function Home() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
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

        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single()

        if (data) {
          setProfile(data)
        }
      } catch (error) {
        console.error('Error:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleSignOut = async () => {
    await logout()
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const displayName = profile
    ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim()
    : user.email

  const getInitials = () => {
    const first = profile?.first_name?.charAt(0) || ''
    const last = profile?.last_name?.charAt(0) || ''
    return (first + last).toUpperCase() || 'U'
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Welcome</h1>
          <Button onClick={handleSignOut} variant="outline">
            Sign Out
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarImage src={profile?.avatar_url || ''} />
                    <AvatarFallback>{getInitials()}</AvatarFallback>
                  </Avatar>
                  <div>
                    <CardTitle>Hello, {displayName}!</CardTitle>
                    <CardDescription>{user.email}</CardDescription>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {profile?.bio && (
                <div>
                  <h3 className="font-semibold mb-2">Bio</h3>
                  <p className="text-sm text-muted-foreground">{profile.bio}</p>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Account Details</h3>
                  <div className="space-y-2 text-sm">
                    <p>
                      <span className="text-muted-foreground">Email:</span> {user.email}
                    </p>
                    <p>
                      <span className="text-muted-foreground">Status:</span>{' '}
                      {user.email_confirmed_at ? 'Verified' : 'Pending'}
                    </p>
                  </div>
                </div>
              </div>

              <Button asChild className="w-full">
                <Link href="/protected/profile">Edit Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}
