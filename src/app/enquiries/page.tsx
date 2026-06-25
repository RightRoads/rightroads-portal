import { prisma } from '@/lib/prisma'
import { formatDate } from '@/lib/utils'
import Link from 'next/link'

export default async function EnquiriesPage() {
  const enquiries = await prisma.enquiry.findMany({
    orderBy: { createdAt: 'desc' },
    include: { followUps: { orderBy: { createdAt: 'desc' }, take: 1 } },
  })

  const statusColors: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    contacted: 'bg-yellow-100 text-yellow-700',
    'follow-up': 'bg-orange-100 text-orange-700',
    converted: 'bg-green-100 text-green-700',
    closed: 'bg-gray-100 text-gray-500',
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Enquiries</h1>
        <Link
          href="/enquiries/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + New Enquiry
        </Link>
      </div>

      {enquiries.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500 mb-4">No enquiries yet.</p>
          <Link
            href="/enquiries/new"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
          >
            Add First Enquiry
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Name</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Phone</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Course Interest</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Source</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Status</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Next Follow-up</th>
                  <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {enquiries.map((enquiry) => (
                  <tr key={enquiry.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3">
                      <Link
                        href={`/enquiries/${enquiry.id}`}
                        className="text-blue-600 hover:underline font-medium"
                      >
                        {enquiry.firstName} {enquiry.lastName}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-600">{enquiry.phone}</td>
                    <td className="px-4 py-3 text-gray-600">{enquiry.courseInterested || '-'}</td>
                    <td className="px-4 py-3 text-gray-600 capitalize">{enquiry.source || '-'}</td>
                    <td className="px-4 py-3">
                      <span className={`px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[enquiry.status] || 'bg-gray-100 text-gray-700'}`}>
                        {enquiry.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-600">
                      {enquiry.nextFollowUp ? (
                        <span className={new Date(enquiry.nextFollowUp) < new Date() ? 'text-red-600 font-medium' : ''}>
                          {formatDate(enquiry.nextFollowUp)}
                        </span>
                      ) : '-'}
                    </td>
                    <td className="px-4 py-3 text-gray-500">{formatDate(enquiry.createdAt)}</td>
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
