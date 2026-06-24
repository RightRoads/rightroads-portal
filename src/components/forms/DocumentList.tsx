'use client'

import { updateDocumentStatus, addDocument } from '@/app/actions/documents'
import { useState, useTransition } from 'react'

type Document = {
  id: string
  name: string
  type: string
  status: string
  remarks: string | null
  uploadedAt: Date | null
  verifiedAt: Date | null
}

export function DocumentList({
  documents,
  studentId,
}: {
  documents: Document[]
  studentId: string
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [isPending, startTransition] = useTransition()

  const statusColors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    uploaded: 'bg-blue-100 text-blue-700',
    verified: 'bg-green-100 text-green-700',
    rejected: 'bg-red-100 text-red-700',
  }

  function handleStatusChange(docId: string, newStatus: string) {
    startTransition(async () => {
      await updateDocumentStatus(docId, newStatus)
    })
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">Documents</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Document
        </button>
      </div>

      {showAdd && (
        <form
          action={(formData) => {
            startTransition(async () => {
              await addDocument(studentId, formData)
              setShowAdd(false)
            })
          }}
          className="mb-4 p-4 bg-gray-50 rounded-lg flex gap-3 items-end"
        >
          <div className="flex-1">
            <label className="block text-xs font-medium text-gray-600 mb-1">Document Name</label>
            <input
              name="name"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="e.g. Transfer Certificate"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select name="type" className="px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="identity">Identity</option>
              <option value="education">Education</option>
              <option value="address">Address</option>
              <option value="photo">Photo</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button
            type="submit"
            disabled={isPending}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
          >
            Add
          </button>
        </form>
      )}

      <div className="space-y-2">
        {documents.map((doc) => (
          <div
            key={doc.id}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <span
                className={`px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[doc.status] || 'bg-gray-100 text-gray-700'}`}
              >
                {doc.status}
              </span>
              <div>
                <p className="text-sm font-medium text-gray-900">{doc.name}</p>
                <p className="text-xs text-gray-500 capitalize">{doc.type}</p>
              </div>
            </div>

            <div className="flex gap-2">
              {doc.status === 'pending' && (
                <button
                  onClick={() => handleStatusChange(doc.id, 'uploaded')}
                  disabled={isPending}
                  className="px-3 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 disabled:opacity-50"
                >
                  Mark Uploaded
                </button>
              )}
              {doc.status === 'uploaded' && (
                <>
                  <button
                    onClick={() => handleStatusChange(doc.id, 'verified')}
                    disabled={isPending}
                    className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200 disabled:opacity-50"
                  >
                    Verify
                  </button>
                  <button
                    onClick={() => handleStatusChange(doc.id, 'rejected')}
                    disabled={isPending}
                    className="px-3 py-1 text-xs bg-red-100 text-red-700 rounded hover:bg-red-200 disabled:opacity-50"
                  >
                    Reject
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
