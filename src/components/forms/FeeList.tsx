'use client'

import { createFee, recordPayment, waiveFee } from '@/app/actions/fees'
import { formatCurrency, formatDate } from '@/lib/utils'
import { useState, useTransition } from 'react'

type Fee = {
  id: string
  amount: number
  type: string
  description: string | null
  dueDate: Date | null
  paidDate: Date | null
  paidAmount: number | null
  status: string
  paymentMode: string | null
  receiptNo: string | null
  remarks: string | null
}

export function FeeList({
  fees,
  studentId,
}: {
  fees: Fee[]
  studentId: string
}) {
  const [showAdd, setShowAdd] = useState(false)
  const [payingFeeId, setPayingFeeId] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const statusColors: Record<string, string> = {
    pending: 'bg-orange-100 text-orange-700',
    partial: 'bg-yellow-100 text-yellow-700',
    paid: 'bg-green-100 text-green-700',
    overdue: 'bg-red-100 text-red-700',
    waived: 'bg-gray-100 text-gray-500',
  }

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-gray-900">Fee Details</h2>
        <button
          onClick={() => setShowAdd(!showAdd)}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Fee
        </button>
      </div>

      {showAdd && (
        <form
          action={(formData) => {
            startTransition(async () => {
              await createFee(studentId, formData)
              setShowAdd(false)
            })
          }}
          className="mb-4 p-4 bg-gray-50 rounded-lg grid grid-cols-1 md:grid-cols-4 gap-3"
        >
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Amount</label>
            <input
              name="amount"
              type="number"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="e.g. 5000"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Type</label>
            <select name="type" required className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
              <option value="tuition">Tuition</option>
              <option value="registration">Registration</option>
              <option value="exam">Exam</option>
              <option value="material">Material</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Due Date</label>
            <input
              name="dueDate"
              type="date"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Description</label>
            <input
              name="description"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
              placeholder="Optional"
            />
          </div>
          <div className="md:col-span-4">
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Add Fee
            </button>
          </div>
        </form>
      )}

      {fees.length === 0 ? (
        <p className="text-sm text-gray-500">No fees recorded.</p>
      ) : (
        <div className="space-y-3">
          {fees.map((fee) => (
            <div key={fee.id} className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span
                    className={`px-2 py-0.5 text-xs rounded-full capitalize ${statusColors[fee.status] || 'bg-gray-100 text-gray-700'}`}
                  >
                    {fee.status}
                  </span>
                  <div>
                    <p className="text-sm font-medium text-gray-900 capitalize">
                      {fee.type} Fee {fee.description ? `- ${fee.description}` : ''}
                    </p>
                    <p className="text-xs text-gray-500">
                      Amount: {formatCurrency(fee.amount)}
                      {fee.paidAmount ? ` | Paid: ${formatCurrency(fee.paidAmount)}` : ''}
                      {fee.dueDate ? ` | Due: ${formatDate(fee.dueDate)}` : ''}
                    </p>
                  </div>
                </div>

                {(fee.status === 'pending' || fee.status === 'partial' || fee.status === 'overdue') && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => setPayingFeeId(payingFeeId === fee.id ? null : fee.id)}
                      className="px-3 py-1 text-xs bg-green-100 text-green-700 rounded hover:bg-green-200"
                    >
                      Record Payment
                    </button>
                    <button
                      onClick={() => startTransition(() => waiveFee(fee.id))}
                      disabled={isPending}
                      className="px-3 py-1 text-xs bg-gray-200 text-gray-600 rounded hover:bg-gray-300 disabled:opacity-50"
                    >
                      Waive
                    </button>
                  </div>
                )}
              </div>

              {payingFeeId === fee.id && (
                <form
                  action={(formData) => {
                    startTransition(async () => {
                      await recordPayment(fee.id, formData)
                      setPayingFeeId(null)
                    })
                  }}
                  className="mt-3 pt-3 border-t border-gray-200 grid grid-cols-1 md:grid-cols-4 gap-3"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Amount Paid</label>
                    <input
                      name="paidAmount"
                      type="number"
                      required
                      defaultValue={fee.amount - (fee.paidAmount || 0)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Payment Mode</label>
                    <select name="paymentMode" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm">
                      <option value="cash">Cash</option>
                      <option value="upi">UPI</option>
                      <option value="bank_transfer">Bank Transfer</option>
                      <option value="cheque">Cheque</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-600 mb-1">Receipt No</label>
                    <input
                      name="receiptNo"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm"
                      placeholder="Optional"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="submit"
                      disabled={isPending}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm hover:bg-green-700 disabled:opacity-50"
                    >
                      Confirm
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
