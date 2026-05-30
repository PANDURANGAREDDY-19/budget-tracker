export const mockStats = {
  totals: {
    totalProjects: 48,
    activeProjects: 26,
    completedProjects: 15,
    delayedProjects: 5,
    verifiedProjects: 32,
    citizenReports: 121
  },
  overview: [
    { title: 'Total Projects', value: 48, change: '+8% over last month', icon: 'Layers' },
    { title: 'Active Projects', value: 26, change: '+6%', icon: 'Clock3' },
    { title: 'Completed Projects', value: 15, change: '+12%', icon: 'CheckCircle2' },
    { title: 'Delayed Projects', value: 5, change: '-10%', icon: 'AlertTriangle' },
    { title: 'Verified Projects', value: 32, change: '+18%', icon: 'ShieldCheck' },
    { title: 'Reports Submitted', value: 121, change: '+24%', icon: 'MessageCircle' }
  ]
}

export const departmentBudget = [
  { name: 'Infrastructure', allocated: 12500000, spent: 9400000, color: '#2563eb' },
  { name: 'Education', allocated: 8200000, spent: 7100000, color: '#0ea5e9' },
  { name: 'Health', allocated: 6300000, spent: 5400000, color: '#22c55e' },
  { name: 'Parks', allocated: 3100000, spent: 2200000, color: '#eab308' },
  { name: 'Transportation', allocated: 10300000, spent: 8900000, color: '#6366f1' }
]

export const mockProjects = [
  {
    id: 1,
    name: 'West End Stormwater Upgrade',
    department: 'Infrastructure',
    location: 'West District',
    budget: 1800000,
    spent: 1220000,
    completion: 68,
    status: 'In Progress',
    verified: true,
    description: 'Upgrade stormwater drainage and flood control along the West End corridor.',
    timeline: 'Jan 2024 - Nov 2025',
    feedback: 8,
    verificationHistory: ['Inspection 1 passed', 'Photo evidence verified'],
    category: 'Public Works'
  },
  {
    id: 2,
    name: 'Riverfront Community Park',
    department: 'Parks & Recreation',
    location: 'River District',
    budget: 950000,
    spent: 680000,
    completion: 72,
    status: 'In Progress',
    verified: false,
    description: 'Create playgrounds, walking trails, and gardens for the Riverfront community.',
    timeline: 'Feb 2024 - Sep 2025',
    feedback: 12,
    verificationHistory: ['Site visit scheduled'],
    category: 'Parks'
  },
  {
    id: 3,
    name: 'Eastside School Renovation',
    department: 'Education',
    location: 'East District',
    budget: 3200000,
    spent: 3100000,
    completion: 96,
    status: 'Completed',
    verified: true,
    description: 'Renovate school classrooms, labs, and student amenities with green upgrades.',
    timeline: 'Jul 2023 - Apr 2024',
    feedback: 18,
    verificationHistory: ['Final review complete', 'Certificate issued'],
    category: 'Education'
  },
  {
    id: 4,
    name: 'City Transit Expansion',
    department: 'Transportation',
    location: 'North District',
    budget: 5700000,
    spent: 1800000,
    completion: 30,
    status: 'Planned',
    verified: false,
    description: 'Plan and deploy new bus routes and transit hubs to reduce commute times.',
    timeline: 'May 2024 - Dec 2026',
    feedback: 5,
    verificationHistory: ['Planning approved'],
    category: 'Transportation'
  },
  {
    id: 5,
    name: 'Downtown Health Hub',
    department: 'Health',
    location: 'Central District',
    budget: 4200000,
    spent: 4100000,
    completion: 98,
    status: 'Completed',
    verified: true,
    description: 'Expand medical services and upgrade emergency care capabilities downtown.',
    timeline: 'Mar 2023 - May 2024',
    feedback: 22,
    verificationHistory: ['Quality audit passed', 'Community validation complete'],
    category: 'Healthcare'
  }
]

export const analyticsData = {
  budgetAllocation: [
    { name: 'Infrastructure', value: 12500000 },
    { name: 'Education', value: 8200000 },
    { name: 'Health', value: 6300000 },
    { name: 'Parks', value: 3100000 },
    { name: 'Transportation', value: 10300000 }
  ],
  departmentExpenditure: [
    { name: 'Infrastructure', spent: 9400000 },
    { name: 'Education', spent: 7100000 },
    { name: 'Health', spent: 5400000 },
    { name: 'Parks', spent: 2200000 },
    { name: 'Transportation', spent: 8900000 }
  ],
  monthlySpending: [
    { month: 'Jan', spent: 850000, budgeted: 950000 },
    { month: 'Feb', spent: 920000, budgeted: 980000 },
    { month: 'Mar', spent: 980000, budgeted: 1050000 },
    { month: 'Apr', spent: 1040000, budgeted: 1100000 },
    { month: 'May', spent: 1180000, budgeted: 1200000 },
    { month: 'Jun', spent: 1250000, budgeted: 1280000 }
  ],
  progressArea: [
    { month: 'Jan', progress: 55 },
    { month: 'Feb', progress: 58 },
    { month: 'Mar', progress: 62 },
    { month: 'Apr', progress: 68 },
    { month: 'May', progress: 73 },
    { month: 'Jun', progress: 78 }
  ],
  statusDistribution: [
    { name: 'Completed', value: 15 },
    { name: 'In Progress', value: 26 },
    { name: 'Planned', value: 10 },
    { name: 'Delayed', value: 5 }
  ]
}

export const mapProjects = [
  { id: 1, name: 'West End Stormwater Upgrade', status: 'In Progress', coord: [45, 22], color: '#f59e0b' },
  { id: 2, name: 'Riverfront Community Park', status: 'In Progress', coord: [60, 42], color: '#f59e0b' },
  { id: 3, name: 'Eastside School Renovation', status: 'Completed', coord: [38, 70], color: '#16a34a' },
  { id: 4, name: 'City Transit Expansion', status: 'Planned', coord: [75, 30], color: '#3b82f6' },
  { id: 5, name: 'Downtown Health Hub', status: 'Completed', coord: [55, 80], color: '#16a34a' },
  { id: 6, name: 'Lakeside Greenway', status: 'Delayed', coord: [22, 58], color: '#ef4444' }
]

export const reportCategories = [
  'Safety Concern',
  'Budget Issue',
  'Construction Delay',
  'Verification Question',
  'Other'
]

export const notifications = [
  { id: 1, title: 'Budget revision approved for Riverfront Park', type: 'Budget', time: '2h ago' },
  { id: 2, title: 'New citizen report submitted for Eastside School', type: 'Report', time: '5h ago' },
  { id: 3, title: 'Transit expansion schedule update', type: 'Project', time: '1d ago' },
  { id: 4, title: 'Verification completed for Downtown Health Hub', type: 'Verification', time: '2d ago' }
]

export const chatHistory = [
  { id: 1, user: true, message: 'What is the current status of the Downtown Health Hub project?', timestamp: '09:10 AM' },
  { id: 2, user: false, message: 'Downtown Health Hub is completed and verified with a 98% budget utilization rate.', timestamp: '09:11 AM' }
]

export const adminProjects = mockProjects

export const authUsers = [
  { id: 1, name: 'Admin User', email: 'admin@civictrack.gov' }
]
