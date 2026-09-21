export type LeadStatus = 'verified' | 'pending' | 'registered'

export interface Lead {
  id: string
  name: string
  email: string
  code: string
  referredBy: string | null
  date: string
  status: LeadStatus
  color: string
}

export interface Activity {
  id: string
  type: 'registration' | 'verification' | 'update'
  name: string
  detail: string
  time: string
}

export const DEMO_TODAY = '2026-09-21'
export const avatarColors = ['lavender', 'peach', 'blue', 'rose', 'mint', 'sand']

const featured: Lead[] = [
  { id: 'lead-1', name: 'Olivia Rhye', email: 'olivia.rhye@gmail.com', code: 'RF3-AWZ3', referredBy: 'RF3-KP92', date: '2026-09-21T10:42:00', status: 'verified', color: 'lavender' },
  { id: 'lead-2', name: 'Phoenix Baker', email: 'phoenix.baker@gmail.com', code: 'RF3-BXK7', referredBy: 'RF3-AWZ3', date: '2026-09-21T09:30:00', status: 'pending', color: 'peach' },
  { id: 'lead-3', name: 'Lana Steiner', email: 'lana.steiner@gmail.com', code: 'RF3-CM48', referredBy: 'RF3-AWZ3', date: '2026-09-20T16:20:00', status: 'verified', color: 'blue' },
  { id: 'lead-4', name: 'Demi Wilkinson', email: 'demi.wilkinson@gmail.com', code: 'RF3-DN65', referredBy: null, date: '2026-09-20T14:15:00', status: 'registered', color: 'rose' },
  { id: 'lead-5', name: 'Drew Cano', email: 'drew.cano@gmail.com', code: 'RF3-EQ21', referredBy: 'RF3-BXK7', date: '2026-09-20T11:05:00', status: 'verified', color: 'mint' },
  { id: 'lead-6', name: 'Natali Craig', email: 'natali.craig@gmail.com', code: 'RF3-FV83', referredBy: 'RF3-AWZ3', date: '2026-09-19T15:40:00', status: 'pending', color: 'sand' },
  { id: 'lead-7', name: 'Orlando Diggs', email: 'orlando.diggs@gmail.com', code: 'RF3-GY09', referredBy: 'RF3-CM48', date: '2026-09-19T10:20:00', status: 'verified', color: 'lavender' },
  { id: 'lead-8', name: 'Andi Lane', email: 'andi.lane@gmail.com', code: 'RF3-HZ54', referredBy: null, date: '2026-09-18T16:35:00', status: 'registered', color: 'peach' },
  { id: 'lead-9', name: 'Kate Morrison', email: 'kate.morrison@gmail.com', code: 'RF3-KP92', referredBy: null, date: '2026-09-18T09:15:00', status: 'verified', color: 'blue' },
  { id: 'lead-10', name: 'Sienna Hewitt', email: 'sienna.hewitt@gmail.com', code: 'RF3-LR26', referredBy: 'RF3-CM48', date: '2026-09-17T13:10:00', status: 'verified', color: 'rose' },
  { id: 'lead-11', name: 'Daniel Wu', email: 'daniel.wu@gmail.com', code: 'RF3-MT74', referredBy: 'RF3-AWZ3', date: '2026-09-17T10:00:00', status: 'verified', color: 'mint' },
  { id: 'lead-12', name: 'Amara Okafor', email: 'amara.okafor@gmail.com', code: 'RF3-NV19', referredBy: 'RF3-BXK7', date: '2026-09-16T11:45:00', status: 'pending', color: 'sand' },
]

const firstNames = ['James', 'Emma', 'Noah', 'Isabella', 'Liam', 'Sophia', 'Ethan', 'Ava', 'Lucas', 'Mia', 'Oliver', 'Charlotte', 'Aiden', 'Harper', 'Elijah', 'Amelia', 'Arjun', 'Grace', 'Leo', 'Zoe', 'Theo', 'Chloe', 'Oscar', 'Maya', 'Henry', 'Ella', 'Felix', 'Ruby']
const lastNames = ['Wilson', 'Chen', 'Patel', 'Anderson', 'Martinez', 'Taylor', 'Johnson', 'Williams', 'Brown', 'Davis', 'Garcia', 'Thomas', 'Moore', 'Jackson', 'Martin', 'Lee', 'Walker', 'Hall', 'Allen', 'Young', 'King', 'Wright', 'Scott', 'Green', 'Baker', 'Adams', 'Nelson', 'Carter']

export function makeSeedLeads(): Lead[] {
  return [
    ...featured,
    ...Array.from({ length: 112 }, (_, i): Lead => {
      const name = `${firstNames[i % firstNames.length]} ${lastNames[(i * 3 + Math.floor(i / 28)) % lastNames.length]}`
      const day = Math.max(1, 16 - Math.floor(i / 8))
      const parent = i < 10 ? featured[0] : i < 17 ? featured[2] : i < 23 ? featured[1] : i < 29 ? featured[8] : featured[(i * 7) % featured.length]
      return {
        id: `lead-${i + 13}`,
        name,
        email: `${name.toLowerCase().replace(' ', '.')}${i > 83 ? i : ''}@gmail.com`,
        code: `RF3-${(1500 + i * 137).toString(36).toUpperCase().padStart(4, 'A')}`,
        referredBy: i > 91 && i % 3 === 0 ? null : parent.code,
        date: `2026-09-${String(day).padStart(2, '0')}T${String(8 + (i % 10)).padStart(2, '0')}:20:00`,
        status: i < 79 ? 'verified' : i < 99 ? 'pending' : 'registered',
        color: avatarColors[i % avatarColors.length],
      }
    }),
  ]
}

export const seedActivities: Activity[] = [
  { id: 'a-1', type: 'verification', name: 'Olivia Rhye', detail: 'Payment has been verified', time: '12 min ago' },
  { id: 'a-2', type: 'registration', name: 'Phoenix Baker', detail: 'Registered with a referral code', time: '38 min ago' },
  { id: 'a-3', type: 'verification', name: 'Lana Steiner', detail: 'Payment has been verified', time: '1 hour ago' },
  { id: 'a-4', type: 'registration', name: 'Demi Wilkinson', detail: 'Joined the referral program', time: '2 hours ago' },
  { id: 'a-5', type: 'verification', name: 'Drew Cano', detail: 'Payment has been verified', time: '3 hours ago' },
  { id: 'a-6', type: 'registration', name: 'Natali Craig', detail: 'Registered with a referral code', time: 'Yesterday' },
]

export function initials(name: string) {
  return name.split(' ').map(part => part[0]).slice(0, 2).join('').toUpperCase()
}

export function formatDate(date: string, compact = false) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: '2-digit', ...(compact ? {} : { year: 'numeric' }) }).format(new Date(date))
}

export function matchesPeriod(lead: Lead, period: string) {
  if (period === 'All time') return true
  if (period === 'Last 7 days') return lead.date.slice(0, 10) >= '2026-09-15' && lead.date.slice(0, 10) <= DEMO_TODAY
  return lead.date.slice(0, 7) === DEMO_TODAY.slice(0, 7)
}

export const statusLabels: Record<LeadStatus, string> = { verified: 'Payment Verified', pending: 'Pending Payment', registered: 'Registered' }
