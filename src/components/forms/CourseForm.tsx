'use client'

import { createCourse } from '@/app/actions/courses'
import { useState, useTransition } from 'react'

export function CourseForm() {
  const [showForm, setShowForm] = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!showForm) {
    return (
      <div className="mb-6">
        <button
          onClick={() => setShowForm(true)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
        >
          + Add Course
        </button>
      </div>
    )
  }

  return (
    <form
      action={(formData) => {
        startTransition(async () => {
          await createCourse(formData)
          setShowForm(false)
        })
      }}
      className="bg-white rounded-xl border border-gray-200 p-6 mb-6"
    >
      <h3 className="font-semibold text-gray-900 mb-4">New Course</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Name</label>
          <input
            name="name"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="e.g. Full Stack Web Development"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Code</label>
          <input
            name="code"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="e.g. FSWD-01"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
          <input
            name="duration"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="e.g. 6 months"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Fee (INR)</label>
          <input
            name="fee"
            type="number"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="e.g. 25000"
          />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <input
            name="description"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            placeholder="Optional description"
          />
        </div>
      </div>
      <div className="mt-4 flex gap-3">
        <button
          type="submit"
          disabled={isPending}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
        >
          {isPending ? 'Creating...' : 'Create Course'}
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
