'use client'

import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Play, MessageSquare, FileText, Settings, Youtube } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === 'loading') return
    if (session) {
      router.push('/dashboard')
    }
  }, [session, status, router])

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-red-600 rounded-full">
              <Youtube className="h-12 w-12 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            YouTube Companion Dashboard
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your YouTube videos with advanced features including comment management, 
            video updates, and personal notes for content improvement.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Play className="h-8 w-8 text-blue-600 mb-2" />
              <CardTitle>Video Management</CardTitle>
              <CardDescription>
                Upload and manage your unlisted YouTube videos with real-time statistics
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <MessageSquare className="h-8 w-8 text-green-600 mb-2" />
              <CardTitle>Comment System</CardTitle>
              <CardDescription>
                View, add, reply to, and delete comments on your videos
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <Settings className="h-8 w-8 text-purple-600 mb-2" />
              <CardTitle>Video Updates</CardTitle>
              <CardDescription>
                Change video titles and descriptions directly from the dashboard
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <FileText className="h-8 w-8 text-orange-600 mb-2" />
              <CardTitle>Notes System</CardTitle>
              <CardDescription>
                Keep personal notes and ideas for improving your video content
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        <div className="text-center">
          <Card className="max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Get Started</CardTitle>
              <CardDescription>
                Sign in with your Google account to access your YouTube dashboard
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/api/auth/signin">
                <Button size="lg" className="w-full">
                  <Youtube className="mr-2 h-5 w-5" />
                  Sign in with Google
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

