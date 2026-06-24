'use client'

import { deleteStudent } from '@/app/actions/students'
import { useTransition } from 'react'

export function StudentActions({ studentId }: { studentId: string }) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => {
        if (confirm('Are you sure you want to delete this student? This cannot be undone.')) {
          startTransition(() => deleteStudent(studentId))
        }
      }}
      disabled={isPending}
      className="px-3 py-1.5 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 disabled:opacity-50"
    >
      {isPending ? 'Deleting...' : 'Delete Student'}
    </button>
  )
}
