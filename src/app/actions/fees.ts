'use server'

import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'

export async function createFee(studentId: string, formData: FormData) {
  await prisma.fee.create({
    data: {
      studentId,
      amount: parseFloat(formData.get('amount') as string),
      type: formData.get('type') as string,
      description: (formData.get('description') as string) || null,
      dueDate: formData.get('dueDate')
        ? new Date(formData.get('dueDate') as string)
        : null,
      status: 'pending',
    },
  })

  revalidatePath(`/students/${studentId}`)
  revalidatePath('/fees')
  revalidatePath('/dashboard')
}

export async function recordPayment(feeId: string, formData: FormData) {
  const paidAmount = parseFloat(formData.get('paidAmount') as string)
  const fee = await prisma.fee.findUnique({ where: { id: feeId } })

  if (!fee) return

  const totalPaid = (fee.paidAmount || 0) + paidAmount
  const status = totalPaid >= fee.amount ? 'paid' : 'partial'

  await prisma.fee.update({
    where: { id: feeId },
    data: {
      paidAmount: totalPaid,
      paidDate: new Date(),
      status,
      paymentMode: (formData.get('paymentMode') as string) || null,
      receiptNo: (formData.get('receiptNo') as string) || null,
      remarks: (formData.get('remarks') as string) || null,
    },
  })

  revalidatePath(`/students/${fee.studentId}`)
  revalidatePath('/fees')
  revalidatePath('/dashboard')
}

export async function waiveFee(feeId: string) {
  const fee = await prisma.fee.findUnique({ where: { id: feeId } })
  if (!fee) return

  await prisma.fee.update({
    where: { id: feeId },
    data: { status: 'waived' },
  })

  revalidatePath(`/students/${fee.studentId}`)
  revalidatePath('/fees')
  revalidatePath('/dashboard')
}
