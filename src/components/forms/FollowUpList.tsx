'use client'

import { addFollowUp } from '@/app/actions/enquiries'
import { formatDate } from '@/lib/utils'
import { useState, useTransition } from 'react'

type FollowUp = {
  id: string
  note: string
  contactedVia: string | null
  createdAt: Date
}

export function FollowUpList({
  followUps,
  enquiryId,
  status,
}: {
  followUps: FollowUp[]
  enquiryId: string
  status: string
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [isPending, startTransition] = useTransition()

  const isActive = status !== 'converted' && status !== 'closed'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">Follow-up History</h2>
        {isActive && (
          <button
            onClick={() => setShowAdd(!showAdd)}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Follow-up
          </button>
        )}
      </div>

      {showAdd && (
        <form
          action={(formData) => {
            startTransition(async () => {
              await addFollowUp(enquiryId, formData)
              setShowAdd(false)
            })
          }}
          className="mb-4 p-4 bg-gray-50 rounded-lg space-y-3"
        >
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Note</label>
            <textarea
              name="note"
              required
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="What was discussed?"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Contacted Via</label>
              <select name="contactedVia" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                <option value="">Select</option>
                <option value="phone">Phone</option>
                <option value="email">Email</option>
                <option value="whatsapp">WhatsApp</option>
                <option value="in-person">In Person</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Next Follow-up Date</label>
              <input
                name="nextFollowUp"
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              />
            </div>
          </div>
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              {isPending ? 'Saving...' : 'Save'}
            </button>
            <button
              type="button"
              onClick={() => setShowAdd(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {followUps.length === 0 ? (
        <p className="text-sm text-gray-500">No follow-ups recorded yet.</p>
      ) : (
        <div className="space-y-3">
          {followUps.map((fu) => (
            <div key={fu.id} className="p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-start">
                <p className="text-sm text-gray-900">{fu.note}</p>
                <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                  {formatDate(fu.createdAt)}
                </span>
              </div>
              {fu.contactedVia && (
                <p className="text-xs text-gray-500 mt-1 capitalize">via {fu.contactedVia}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
