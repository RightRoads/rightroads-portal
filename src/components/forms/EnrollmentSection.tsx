'use client'

import { enrollStudent } from '@/app/actions/courses'
import { useState, useTransition } from 'react'

type Course = {
  id: string
  name: string
  code: string
  batches: { id: string; name: string }[]
}

type Enrollment = {
  id: string
  course: { id: string; name: string; code: string } | null
  batch: { id: string; name: string } | null
} | null

export function EnrollmentSection({
  studentId,
  enrollment,
  courses,
}: {
  studentId: string
  enrollment: Enrollment
  courses: Course[]
}) {
  const [editing, setEditing] = useState(false)
  const [selectedCourse, setSelectedCourse] = useState(enrollment?.course?.id || '')
  const [isPending, startTransition] = useTransition()

  const selectedCourseData = courses.find((c) => c.id === selectedCourse)

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">Course & Batch</h2>
        <button
          onClick={() => setEditing(!editing)}
          className="text-sm text-blue-600 hover:underline"
        >
          {enrollment ? 'Change' : 'Assign Course'}
        </button>
      </div>

      {enrollment && !editing ? (
        <div className="flex gap-6 text-sm">
          <div>
            <p className="text-gray-500">Course</p>
            <p className="font-medium">{enrollment.course?.name} ({enrollment.course?.code})</p>
          </div>
          <div>
            <p className="text-gray-500">Batch</p>
            <p className="font-medium">{enrollment.batch?.name || 'Not assigned'}</p>
          </div>
        </div>
      ) : !editing ? (
        <p className="text-sm text-gray-500">No course assigned yet.</p>
      ) : null}

      {editing && (
        <form
          action={(formData) => {
            startTransition(async () => {
              await enrollStudent(formData)
              setEditing(false)
            })
          }}
          className="mt-3 space-y-3"
        >
          <input type="hidden" name="studentId" value={studentId} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Course</label>
              <select
                name="courseId"
                required
                value={selectedCourse}
                onChange={(e) => setSelectedCourse(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Select course</option>
                {courses.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Batch</label>
              <select
                name="batchId"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              >
                <option value="">Select batch (optional)</option>
                {selectedCourseData?.batches.map((b) => (
                  <option key={b.id} value={b.id}>
                    {b.name}
                  </option>
                ))}
              </select>
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
              onClick={() => setEditing(false)}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
