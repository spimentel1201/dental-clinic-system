import { AppSidebar } from '@/components/app-sidebar'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-svh">
      <AppSidebar />
      <div className="flex min-h-svh flex-col lg:pl-60">{children}</div>
    </div>
  )
}
