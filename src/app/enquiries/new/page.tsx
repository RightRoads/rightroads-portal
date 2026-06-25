import { prisma } from '@/lib/prisma'
import { EnquiryForm } from '@/components/forms/EnquiryForm'

export default async function NewEnquiryPage() {
  const courses = await prisma.course.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  })

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Enquiry</h1>
      <EnquiryForm courses={courses} />
    </div>
  )
}
