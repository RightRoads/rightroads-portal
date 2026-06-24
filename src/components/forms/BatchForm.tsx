'use client'

import { createBatch } from '@/app/actions/courses'
import { useState, useTransition } from 'react'

type Course = {
  id: string
  name: string
  code: string
}

export function BatchForm({ courses }: { courses: Course[] }) {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!showForm) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Create Batch
        </button>
      </div>
    )
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await createBatch(formData)
          setShowForm(false)
        })
      }}
      className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
    >
      <h3 className="font-semibold text-gray-900 mb-4">New Batch</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Batch Name</label>
          <input
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="e.g. Batch A - Jul 2026"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course</label>
          <select name="courseId" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name} ({c.code})
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
          <input
            name="startDate"
            type="date"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
          <input
            name="endDate"
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Capacity</label>
          <input
            name="capacity"
            type="number"
            defaultValue={30}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
          />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Batch'}
        </button>
        <button
          type="button"
          onClick={() => setShowForm(false)}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </form>
  )
}
