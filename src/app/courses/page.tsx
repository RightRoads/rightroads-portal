import { prisma } from '@/lib/prisma'
import { formatCurrency } from '@/lib/utils'
import { CourseForm } from '@/components/forms/CourseForm'

export default async function CoursesPage() {
  const courses = await prisma.course.findMany({
    orderBy: { createdAt: 'desc' },
    include: {
      _count: { select: { enrollments: true, batches: true } },
    },
  })

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Courses</h1>
      </div>

      {/* Add Course Form */}
      <CourseForm />

      {/* Course List */}
      {courses.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <p className="text-gray-500">No courses created yet. Add one above.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((course) => (
            <div
              key={course.id}
              className="bg-white rounded-xl border border-gray-200 p-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-900">{course.name}</h3>
                  <p className="text-sm text-gray-500">{course.code}</p>
                </div>
                <span className={`px-2 py-0.5 text-xs rounded-full ${course.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {course.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="mt-3 space-y-1 text-sm">
                <p className="text-gray-600">Duration: {course.duration}</p>
                <p className="text-gray-600">Fee: {formatCurrency(course.fee)}</p>
                {course.description && (
                  <p className="text-gray-500">{course.description}</p>
                )}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-100 flex gap-4 text-xs text-gray-500">
                <span>{course._count.enrollments} students enrolled</span>
                <span>{course._count.batches} batches</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
