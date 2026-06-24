import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import { BatchForm } from '@/components/forms/BatchForm'

export default async function BatchesPage() {
  const batches = await prisma.batch.findMany({
    orderBy: { startDate: 'desc' },
    include: {
      course: true,
      _count: { select: { enrollments: true } },
    },
  })

  const courses = await prisma.course.findMany({
    where: { isActive: true },
  })

  const statusColors: Record<string, string> = {
    upcoming: 'bg-blue-100 text-blue-700',
    ongoing: 'bg-green-100 text-green-700',
    completed: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Batches</h1>
      </div>

      <BatchForm courses={courses} />

      {batches.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No batches created yet. Add one above.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Batch Name</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Course</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Start Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">End Date</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Students</th>
                <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {batches.map((batch) => (
                <tr key={batch.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 font-medium text-gray-900">{batch.name}</td>
                  <td className="px-4 py-3 text-gray-600">{batch.course.name}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(batch.startDate)}</td>
                  <td className="px-4 py-3 text-gray-600">{formatDate(batch.endDate)}</td>
                  <td className="px-4 py-3 text-gray-600">
                    {batch._count.enrollments} / {batch.capacity}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[batch.status] || 'bg-gray-100 text-gray-700'}`}>
                      {batch.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
