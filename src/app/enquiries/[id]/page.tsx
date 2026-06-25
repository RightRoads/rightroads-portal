import { prisma } from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { formatDate } from '@/lib/utils'
import { EnquiryActions } from '@/components/forms/EnquiryActions'
import { FollowUpList } from '@/components/forms/FollowUpList'
import Link from 'next/link'

export default async function EnquiryDetailPage(props: PageProps<'/enquiries/[id]'>) {
  const { id } = await props.params

  const enquiry = await prisma.enquiry.findUnique({
    where: { id },
    include: { followUps: { orderBy: { createdAt: 'desc' } } },
  })

  if (!enquiry) notFound()

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    'follow-up': 'bg-orange-100 text-orange-700',
    converted: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <Link href="/enquiries" className="text-sm text-blue-600 hover:underline mb-1 inline-block">
            &larr; Back to Enquiries
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">
            {enquiry.firstName} {enquiry.lastName}
          </h1>
          <span className={`inline-block mt-1 px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[enquiry.status] || 'bg-gray-100 text-gray-700'}`}>
            {enquiry.status}
          </span>
        </div>
        <EnquiryActions enquiryId={enquiry.id} status={enquiry.status} />
      </div>

      {/* Enquiry Details */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="font-semibold text-gray-900 mb-4">Enquiry Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-500">Phone</p>
            <p className="font-medium">{enquiry.phone}</p>
          </div>
          <div>
            <p className="text-gray-500">Email</p>
            <p className="font-medium">{enquiry.email || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Date of Birth</p>
            <p className="font-medium">{formatDate(enquiry.dateOfBirth)}</p>
          </div>
          <div>
            <p className="text-gray-500">Gender</p>
            <p className="font-medium">{enquiry.gender || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Address</p>
            <p className="font-medium">
              {[enquiry.address, enquiry.city, enquiry.state, enquiry.pincode]
                .filter(Boolean)
                .join(', ') || '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Guardian</p>
            <p className="font-medium">
              {enquiry.guardianName
                ? `${enquiry.guardianName} (${enquiry.guardianRelation || 'N/A'}) - ${enquiry.guardianPhone || ''}`
                : '-'}
            </p>
          </div>
          <div>
            <p className="text-gray-500">Course Interested</p>
            <p className="font-medium">{enquiry.courseInterested || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Source</p>
            <p className="font-medium capitalize">{enquiry.source || '-'}</p>
          </div>
          <div>
            <p className="text-gray-500">Enquiry Date</p>
            <p className="font-medium">{formatDate(enquiry.createdAt)}</p>
          </div>
        </div>

        {enquiry.remarks && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-sm">Remarks</p>
            <p className="text-sm mt-1">{enquiry.remarks}</p>
          </div>
        )}

        {enquiry.nextFollowUp && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-gray-500 text-sm">Next Follow-up</p>
            <p className={`text-sm font-medium mt-1 ${new Date(enquiry.nextFollowUp) < new Date() ? 'text-red-600' : 'text-blue-600'}`}>
              {formatDate(enquiry.nextFollowUp)}
              {new Date(enquiry.nextFollowUp) < new Date() && ' (Overdue)'}
            </p>
          </div>
        )}

        {enquiry.convertedToStudentId && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <Link
              href={`/students/${enquiry.convertedToStudentId}`}
              className="text-sm text-green-600 hover:underline font-medium"
            >
              View Admitted Student &rarr;
            </Link>
          </div>
        )}
      </div>

      {/* Follow-ups */}
      <FollowUpList followUps={enquiry.followUps} enquiryId={enquiry.id} status={enquiry.status} />
    </div>
  )
}
