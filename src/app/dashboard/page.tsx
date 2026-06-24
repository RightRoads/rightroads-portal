import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import Link from 'next/link'

export default async function DashboardPage() {
  const [
    totalStudents,
    activeStudents,
    pendingDocs,
    pendingFees,
    scholarshipApplied,
    scholarshipApproved,
    recentStudents,
    totalFeesCollected,
    totalFeesPending,
  ] = await Promise.all([
    prisma.student.count(),
    prisma.student.count({ where: { status: 'active' } }),
    prisma.document.count({ where: { status: 'pending' } }),
    prisma.fee.count({ where: { status: { in: ['pending', 'partial', 'overdue'] } } }),
    prisma.student.count({ where: { scholarshipStatus: 'applied' } }),
    prisma.student.count({ where: { scholarshipStatus: 'approved' } }),
    prisma.student.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: { documents: true, fees: true },
    }),
    prisma.fee.aggregate({
      where: { status: 'paid' },
      _sum: { paidAmount: true },
    }),
    prisma.fee.aggregate({
      where: { status: { in: ['pending', 'partial', 'overdue'] } },
      _sum: { amount: true },
    }),
  ])

  const stats = [
    { label: 'Total Students', value: totalStudents, href: '/students', color: 'bg-blue-50 text-blue-700' },
    { label: 'Active Students', value: activeStudents, href: '/students', color: 'bg-green-50 text-green-700' },
    { label: 'Pending Documents', value: pendingDocs, href: '/students', color: 'bg-orange-50 text-orange-700' },
    { label: 'Pending Fees', value: pendingFees, href: '/fees', color: 'bg-red-50 text-red-700' },
    { label: 'Scholarship Applied', value: scholarshipApplied, href: '/students', color: 'bg-purple-50 text-purple-700' },
    { label: 'Scholarship Approved', value: scholarshipApproved, href: '/students', color: 'bg-indigo-50 text-indigo-700' },
  ]

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className={`${stat.color} rounded-xl p-5 transition-transform hover:scale-[1.02]`}
          >
            <p className="text-sm font-medium opacity-80">{stat.label}</p>
            <p className="text-3xl font-bold mt-1">{stat.value}</p>
          </Link>
        ))}
      </div>

      {/* Financial Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500">Total Fees Collected</p>
          <p className="text-2xl font-bold text-green-600 mt-1">
            {formatCurrency(totalFeesCollected._sum.paidAmount)}
          </p>
        </div>
        <div className="bg-white rounded-xl p-5 border border-gray-200">
          <p className="text-sm text-gray-500">Total Fees Pending</p>
          <p className="text-2xl font-bold text-red-600 mt-1">
            {formatCurrency(totalFeesPending._sum.amount)}
          </p>
        </div>
      </div>

      {/* Recent Admissions */}
      <div className="bg-white rounded-xl border border-gray-200">
        <div className="p-5 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-semibold text-gray-900">Recent Admissions</h2>
          <Link href="/students" className="text-sm text-blue-600 hover:underline">
            View all
          </Link>
        </div>
        {recentStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            No students yet.{' '}
            <Link href="/students/new" className="text-blue-600 hover:underline">
              Add first student
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {recentStudents.map((student) => {
              const pendingDocCount = student.documents.filter(
                (d) => d.status === 'pending'
              ).length
              const pendingFeeCount = student.fees.filter(
                (f) => f.status === 'pending' || f.status === 'partial' || f.status === 'overdue'
              ).length

              return (
                <Link
                  key={student.id}
                  href={`/students/${student.id}`}
                  className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <p className="font-medium text-gray-900">
                      {student.firstName} {student.lastName}
                    </p>
                    <p className="text-sm text-gray-500">{student.admissionNo}</p>
                  </div>
                  <div className="flex gap-2">
                    {pendingDocCount > 0 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-orange-100 text-orange-700">
                        {pendingDocCount} docs pending
                      </span>
                    )}
                    {pendingFeeCount > 0 && (
                      <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        {pendingFeeCount} fees pending
                      </span>
                    )}
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
