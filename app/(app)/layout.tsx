'use client'

import { AppSidebar } from '@/components/app-sidebar'
import { ProtectedLayout } from './protected-layout'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <ProtectedLayout>
      <div className="min-h-svh">
        <AppSidebar />
        <div className="flex min-h-svh flex-col lg:pl-60">{children}</div>
      </div>
    </ProtectedLayout>
  )
}
