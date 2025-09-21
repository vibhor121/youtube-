'use client'

import { useSession, signOut } from 'next-auth/react'
import { Button } from '@/components/ui/button'
import { Youtube, LogOut, User } from 'lucide-react'
import Link from 'next/link'

export function DashboardHeader() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <div className="p-2 bg-red-600 rounded-lg">
              <Youtube className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">
              YouTube Dashboard
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            {session?.user && (
              <div className="flex items-center space-x-2">
                <div className="p-2 bg-gray-100 rounded-full">
                  <User className="h-4 w-4 text-gray-600" />
                </div>
                <span className="text-sm font-medium text-gray-700">
                  {session.user.name}
                </span>
              </div>
            )}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut()}
            >
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}

