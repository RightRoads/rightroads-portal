'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { generateAdmissionNo } from '@/lib/utils'

export async function createStudent(formData: FormData) {
  const enquiryId = (formData.get('enquiryId') as string) || null

  const data = {
    admissionNo: generateAdmissionNo(),
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: (formData.get('email') as string) || null,
    phone: formData.get('phone') as string,
    dateOfBirth: formData.get('dateOfBirth')
      ? new Date(formData.get('dateOfBirth') as string)
      : null,
    gender: (formData.get('gender') as string) || null,
    address: (formData.get('address') as string) || null,
    city: (formData.get('city') as string) || null,
    state: (formData.get('state') as string) || null,
    pincode: (formData.get('pincode') as string) || null,
    guardianName: (formData.get('guardianName') as string) || null,
    guardianPhone: (formData.get('guardianPhone') as string) || null,
    guardianRelation: (formData.get('guardianRelation') as string) || null,
  }

  const student = await prisma.student.create({ data })

  // Mark enquiry as converted if this came from an enquiry
  if (enquiryId) {
    await prisma.enquiry.update({
      where: { id: enquiryId },
      data: { status: 'converted', convertedToStudentId: student.id },
    })
    revalidatePath('/enquiries')
  }

  // Create default required documents
  const requiredDocs = [
    { name: 'Aadhaar Card', type: 'identity' },
    { name: 'Passport Photo', type: 'photo' },
    { name: '10th Certificate', type: 'education' },
    { name: '12th Certificate', type: 'education' },
    { name: 'Address Proof', type: 'address' },
  ]

  await prisma.document.createMany({
    data: requiredDocs.map((doc) => ({
      studentId: student.id,
      name: doc.name,
      type: doc.type,
      status: 'pending',
    })),
  })

  revalidatePath('/students')
  revalidatePath('/dashboard')
  redirect(`/students/${student.id}`)
}

export async function updateStudent(id: string, formData: FormData) {
  const data = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    email: (formData.get('email') as string) || null,
    phone: formData.get('phone') as string,
    dateOfBirth: formData.get('dateOfBirth')
      ? new Date(formData.get('dateOfBirth') as string)
      : null,
    gender: (formData.get('gender') as string) || null,
    address: (formData.get('address') as string) || null,
    city: (formData.get('city') as string) || null,
    state: (formData.get('state') as string) || null,
    pincode: (formData.get('pincode') as string) || null,
    guardianName: (formData.get('guardianName') as string) || null,
    guardianPhone: (formData.get('guardianPhone') as string) || null,
    guardianRelation: (formData.get('guardianRelation') as string) || null,
    scholarshipStatus: (formData.get('scholarshipStatus') as string) || null,
    scholarshipAmount: formData.get('scholarshipAmount')
      ? parseFloat(formData.get('scholarshipAmount') as string)
      : null,
  }

  await prisma.student.update({ where: { id }, data })
  revalidatePath(`/students/${id}`)
  revalidatePath('/students')
  revalidatePath('/dashboard')
}

export async function deleteStudent(id: string) {
  await prisma.student.delete({ where: { id } })
  revalidatePath('/students')
  revalidatePath('/dashboard')
  redirect('/students')
}
