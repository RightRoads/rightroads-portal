import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'

export default async function StudentsPage() {
  const students = await prisma.student.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      documents: true,
      fees: true,
      enrollment: { include: { course: true, batch: true } },
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Students</h1>
        <Link
          href="/students/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Add Student
        </Link>
      </div>

      {students.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No students registered yet.</p>
          <Link
            href="/students/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Add First Student
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Admission No</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Course</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Docs</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Fees</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Joined</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((student) => {
                  const pendingDocs = student.documents.filter(
                    (d) => d.status === 'pending'
                  ).length
                  const pendingFees = student.fees.filter(
                    (f) =>
                      f.status === 'pending' ||
                      f.status === 'partial' ||
                      f.status === 'overdue'
                  ).length

                  return (
                    <tr key={student.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/students/${student.id}`}
                          className="text-blue-600 hover:underline font-medium"
                        >
                          {student.admissionNo}
                        </Link>
                      </td>
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {student.firstName} {student.lastName}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{student.phone}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {student.enrollment?.course?.name || '-'}
                      </td>
                      <td className="px-4 py-3">
                        {pendingDocs > 0 ? (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-orange-100 text-orange-700">
                            {pendingDocs} pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                            Complete
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {pendingFees > 0 ? (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-red-100 text-red-700">
                            {pendingFees} pending
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 text-xs rounded-full bg-green-100 text-green-700">
                            Paid
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {formatDate(student.createdAt)}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
