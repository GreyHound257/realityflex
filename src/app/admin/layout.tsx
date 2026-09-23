import { cookies } from 'next/headers'
import { db } from '@/prisma/db'
import { AppProvider } from '@/lib/store'
import { redirect } from 'next/navigation'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies()
  const sessionId = cookieStore.get('admin_session')?.value
  
  if (!sessionId) {
    return <>{children}</>
  }
  
  const session = await db.orm.public.Session.where({ id: sessionId }).include("admin").first()
  if (!session || (session.expiresAt as any).epochMilliseconds < Date.now()) {
    return <>{children}</>
  }

  const buyers = await db.orm.public.Buyer.orderBy((b) => b.date.desc()).all()
  const referrers = await db.orm.public.Referrer.all()
  const activities = await db.orm.public.Activity.orderBy((a) => a.time.desc()).all()

  return (
    <AppProvider
      serverAdmin={session.admin as any}
      serverBuyers={buyers as any}
      serverReferrers={referrers as any}
      serverActivities={activities as any}
    >
      {children}
    </AppProvider>
  )
}
