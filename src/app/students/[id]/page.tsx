import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate, formatCurrency } from '@/lib/utils'
import { DocumentList } from '@/components/forms/DocumentList'
import { FeeList } from '@/components/forms/FeeList'
import { EnrollmentSection } from '@/components/forms/EnrollmentSection'
import { StudentActions } from '@/components/forms/StudentActions'
import Link from 'next/link'

export default async function StudentDetailPage(props: PageProps<'/students/[id]'>) {
  const { id } = await props.params

  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      documents: { orderBy: { createdAt: 'asc' } },
      fees: { orderBy: { createdAt: 'desc' } },
      enrollment: { include: { course: true, batch: true } },
    },
  })

  if (!student) notFound()

  const courses = await prisma.course.findMany({
    where: { isActive: true },
    include: { batches: { where: { status: { not: 'completed' } } } },
  })

  const totalFees = student.fees.reduce((sum, f) => sum + f.amount, 0)
  const totalPaid = student.fees.reduce((sum, f) => sum + (f.paidAmount || 0), 0)
  const pendingDocs = student.documents.filter((d) => d.status === 'pending').length

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/students" className="text-sm text-blue-600 hover:underline mb-1 inline-block">
            &larr; Back to Students
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {student.firstName} {student.lastName}
          </h1>
          <p className="text-sm text-gray-500">Admission No: {student.admissionNo}</p>
        </div>
        <StudentActions studentId={student.id} />
      </div>

      {/* Profile Card */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Profile Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{student.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{student.email || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">{formatDate(student.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium">{student.gender || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">
              {[student.address, student.city, student.state, student.pincode]
                .filter(Boolean)
                .join(', ') || '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Guardian</p>
            <p className="font-medium">
              {student.guardianName
                ? `${student.guardianName} (${student.guardianRelation || 'N/A'}) - ${student.guardianPhone || ''}`
                : '-'}
            </p>
          </div>
        </div>

        {/* Scholarship */}
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex gap-4">
            <div>
              <p className="text-gray-500 text-sm">Scholarship Status</p>
              <p className="font-medium capitalize">{student.scholarshipStatus || 'None'}</p>
            </div>
            {student.scholarshipAmount && (
              <div>
                <p className="text-gray-500 text-sm">Scholarship Amount</p>
                <p className="font-medium">{formatCurrency(student.scholarshipAmount)}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Documents</p>
          <p className="text-lg font-bold">
            {pendingDocs > 0 ? (
              <span className="text-orange-600">{pendingDocs} pending</span>
            ) : (
              <span className="text-green-600">All complete</span>
            )}
          </p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Total Fees</p>
          <p className="text-lg font-bold">{formatCurrency(totalFees)}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <p className="text-sm text-gray-500">Balance Due</p>
          <p className={`text-lg font-bold ${totalFees - totalPaid > 0 ? 'text-red-600' : 'text-green-600'}`}>
            {formatCurrency(totalFees - totalPaid)}
          </p>
        </div>
      </div>

      {/* Enrollment */}
      <EnrollmentSection
        studentId={student.id}
        enrollment={student.enrollment}
        courses={courses}
      />

      {/* Documents */}
      <DocumentList documents={student.documents} studentId={student.id} />

      {/* Fees */}
      <FeeList fees={student.fees} studentId={student.id} />
    </div>
  )
}
