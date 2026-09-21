import { cookies } from 'next/headers'
import { db } from '@/prisma/db'
import { AppProvider } from '@/lib/store'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('admin_session')?.value
  
  if (!sessionId) {
    return <>{children}</>
  }
  
  const session = await db.orm.public.Session.where({ id: sessionId }).first()
  if (!session || new Date(session.expiresAt) < new Date()) {
    return <>{children}</>
  }

  const leads = await db.orm.public.Lead.orderBy((l) => l.date.desc()).all()
  const activities = await db.orm.public.Activity.orderBy((a) => a.time.desc()).all()

  return (
    <AppProvider serverLeads={leads as any} serverActivities={activities as any}>
      {children}
    </AppProvider>
  )
}
