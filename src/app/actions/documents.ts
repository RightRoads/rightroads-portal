'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function updateDocumentStatus(
  docId: string,
  status: string,
  remarks?: string
) {
  const updateData: Record<string, unknown> = { status }

  if (status === 'uploaded') {
    updateData.uploadedAt = new Date()
  } else if (status === 'verified') {
    updateData.verifiedAt = new Date()
  }

  if (remarks !== undefined) {
    updateData.remarks = remarks
  }

  const doc = await prisma.document.update({
    where: { id: docId },
    data: updateData,
  })

  revalidatePath(`/students/${doc.studentId}`)
  revalidatePath('/dashboard')
}

export async function addDocument(studentId: string, formData: FormData) {
  await prisma.document.create({
    data: {
      studentId,
      name: formData.get('name') as string,
      type: formData.get('type') as string,
      status: 'pending',
    },
  })

  revalidatePath(`/students/${studentId}`)
  revalidatePath('/dashboard')
}

export async function deleteDocument(docId: string, studentId: string) {
  await prisma.document.delete({ where: { id: docId } })
  revalidatePath(`/students/${studentId}`)
  revalidatePath('/dashboard')
}
