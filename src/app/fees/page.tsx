import { prisma } from '@/lib/prisma'
import { formatCurrency, formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function FeesPage() {
  const fees = await prisma.fee.findMany({
    orderBy: { createdAt: 'desc' },
    include: { student: true },
  })

  const summary = await Promise.all([
    prisma.fee.aggregate({ _sum: { amount: true } }),
    prisma.fee.aggregate({ where: { status: 'paid' }, _sum: { paidAmount: true } }),
    prisma.fee.aggregate({
      where: { status: { in: ['pending', 'partial', 'overdue'] } },
      _sum: { amount: true },
    }),
    prisma.fee.count({ where: { status: { in: ['pending', 'partial', 'overdue'] } } }),
  ])

  const statusColors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    partial: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    waived: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Fee Management</h1>

      {/* Summary */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Fees</p>
          <p className="text-xl font-bold">{formatCurrency(summary[0]._sum.amount)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Collected</p>
          <p className="text-xl font-bold text-green-600">{formatCurrency(summary[1]._sum.paidAmount)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending Amount</p>
          <p className="text-xl font-bold text-red-600">{formatCurrency(summary[2]._sum.amount)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Pending Entries</p>
          <p className="text-xl font-bold text-orange-600">{summary[3]}</p>
        </div>
      </div>

      {/* Fee Table */}
      {fees.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No fees recorded yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Student</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Type</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Amount</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Paid</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Due Date</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {fees.map((fee) => (
                  <tr key={fee.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/students/${fee.studentId}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {fee.student.firstName} {fee.student.lastName}
                      </Link>
                      <p className="text-xs text-gray-500">{fee.student.admissionNo}</p>
                    </td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{fee.type}</td>
                    <td className="px-4 py-3 font-medium">{formatCurrency(fee.amount)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatCurrency(fee.paidAmount)}</td>
                    <td className="px-4 py-3 text-gray-600">{formatDate(fee.dueDate)}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[fee.status] || 'bg-gray-100 text-gray-700'}`}>
                        {fee.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
