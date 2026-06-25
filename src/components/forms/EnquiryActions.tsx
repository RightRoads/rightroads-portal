'use client'

import { updateEnquiryStatus, convertToAdmission, deleteEnquiry } from '@/app/actions/enquiries'
import { useTransition } from 'react'

export function EnquiryActions({ enquiryId, status }: { enquiryId: string; status: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <div className="flex gap-2 flex-wrap">
      {status !== 'converted' && status !== 'closed' && (
        <button
          onClick={() => startTransition(() => convertToAdmission(enquiryId))}
          disabled={isPending}
          className="px-3 py-1.5 text-sm bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
        >
          Convert to Admission
        </button>
      )}

      {status === 'new' && (
        <button
          onClick={() => startTransition(() => updateEnquiryStatus(enquiryId, 'contacted'))}
          disabled={isPending}
          className="px-3 py-1.5 text-sm bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 disabled:opacity-50"
        >
          Mark Contacted
        </button>
      )}

      {status !== 'closed' && status !== 'converted' && (
        <button
          onClick={() => {
            if (confirm('Close this enquiry?')) {
              startTransition(() => updateEnquiryStatus(enquiryId, 'closed'))
            }
          }}
          disabled={isPending}
          className="px-3 py-1.5 text-sm text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
        >
          Close
        </button>
      )}

      <button
        onClick={() => {
          if (confirm('Delete this enquiry? This cannot be undone.')) {
            startTransition(() => deleteEnquiry(enquiryId))
          }
        }}
        disabled={isPending}
        className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
      >
        Delete
      </button>
    </div>
  )
}
