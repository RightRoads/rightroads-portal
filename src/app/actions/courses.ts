'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createCourse(formData: FormData) {
  await prisma.course.create({
    data: {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      duration: formData.get('duration') as string,
      fee: parseFloat(formData.get('fee') as string),
      description: (formData.get('description') as string) || null,
    },
  })

  revalidatePath('/courses')
  redirect('/courses')
}

export async function updateCourse(id: string, formData: FormData) {
  await prisma.course.update({
    where: { id },
    data: {
      name: formData.get('name') as string,
      code: formData.get('code') as string,
      duration: formData.get('duration') as string,
      fee: parseFloat(formData.get('fee') as string),
      description: (formData.get('description') as string) || null,
    },
  })

  revalidatePath('/courses')
}

export async function createBatch(formData: FormData) {
  await prisma.batch.create({
    data: {
      name: formData.get('name') as string,
      courseId: formData.get('courseId') as string,
      startDate: new Date(formData.get('startDate') as string),
      endDate: formData.get('endDate')
        ? new Date(formData.get('endDate') as string)
        : null,
      capacity: parseInt(formData.get('capacity') as string) || 30,
    },
  })

  revalidatePath('/courses')
  revalidatePath('/batches')
}

export async function enrollStudent(formData: FormData) {
  const studentId = formData.get('studentId') as string
  const courseId = formData.get('courseId') as string
  const batchId = (formData.get('batchId') as string) || null

  // Check if student already enrolled
  const existing = await prisma.enrollment.findUnique({
    where: { studentId },
  })

  if (existing) {
    await prisma.enrollment.update({
      where: { id: existing.id },
      data: { courseId, batchId },
    })
  } else {
    await prisma.enrollment.create({
      data: { studentId, courseId, batchId },
    })
  }

  revalidatePath(`/students/${studentId}`)
  revalidatePath('/courses')
  revalidatePath('/batches')
}
