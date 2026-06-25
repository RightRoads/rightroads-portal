'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export async function createEnquiry(formData: FormData) {
  await prisma.enquiry.create({
    data: {
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
      courseInterested: (formData.get('courseInterested') as string) || null,
      source: (formData.get('source') as string) || null,
      remarks: (formData.get('remarks') as string) || null,
      nextFollowUp: formData.get('nextFollowUp')
        ? new Date(formData.get('nextFollowUp') as string)
        : null,
    },
  })

  revalidatePath('/enquiries')
  revalidatePath('/dashboard')
  redirect('/enquiries')
}

export async function updateEnquiryStatus(id: string, status: string) {
  await prisma.enquiry.update({
    where: { id },
    data: { status },
  })

  revalidatePath('/enquiries')
  revalidatePath(`/enquiries/${id}`)
  revalidatePath('/dashboard')
}

export async function addFollowUp(enquiryId: string, formData: FormData) {
  const nextFollowUp = formData.get('nextFollowUp')
    ? new Date(formData.get('nextFollowUp') as string)
    : null

  await prisma.followUp.create({
    data: {
      enquiryId,
      note: formData.get('note') as string,
      contactedVia: (formData.get('contactedVia') as string) || null,
    },
  })

  await prisma.enquiry.update({
    where: { id: enquiryId },
    data: {
      status: 'follow-up',
      nextFollowUp,
    },
  })

  revalidatePath(`/enquiries/${enquiryId}`)
  revalidatePath('/enquiries')
  revalidatePath('/dashboard')
}

export async function convertToAdmission(enquiryId: string) {
  const enquiry = await prisma.enquiry.findUnique({ where: { id: enquiryId } })
  if (!enquiry) return

  // Build query string with enquiry details to pre-fill admission form
  const params = new URLSearchParams()
  params.set('enquiryId', enquiryId)
  params.set('firstName', enquiry.firstName)
  params.set('lastName', enquiry.lastName)
  if (enquiry.email) params.set('email', enquiry.email)
  params.set('phone', enquiry.phone)
  if (enquiry.dateOfBirth) params.set('dateOfBirth', enquiry.dateOfBirth.toISOString().split('T')[0])
  if (enquiry.gender) params.set('gender', enquiry.gender)
  if (enquiry.address) params.set('address', enquiry.address)
  if (enquiry.city) params.set('city', enquiry.city)
  if (enquiry.state) params.set('state', enquiry.state)
  if (enquiry.pincode) params.set('pincode', enquiry.pincode)
  if (enquiry.guardianName) params.set('guardianName', enquiry.guardianName)
  if (enquiry.guardianPhone) params.set('guardianPhone', enquiry.guardianPhone)
  if (enquiry.guardianRelation) params.set('guardianRelation', enquiry.guardianRelation)

  redirect(`/students/new?${params.toString()}`)
}

export async function markEnquiryConverted(enquiryId: string, studentId: string) {
  await prisma.enquiry.update({
    where: { id: enquiryId },
    data: {
      status: 'converted',
      convertedToStudentId: studentId,
    },
  })

  revalidatePath('/enquiries')
  revalidatePath('/dashboard')
}

export async function deleteEnquiry(id: string) {
  await prisma.enquiry.delete({ where: { id } })
  revalidatePath('/enquiries')
  revalidatePath('/dashboard')
  redirect('/enquiries')
}
