'use client'

import { createEnquiry } from '@/app/actions/enquiries'
import { useActionState } from 'react'

type Course = { id: string; name: string; code: string }

export function EnquiryForm({ courses }: { courses: Course[] }) {
  const [, action, pending] = useActionState(
    async (_prev: unknown, formData: FormData) => {
      await createEnquiry(formData)
    },
    null
  )

  return (
    <form action={action} className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="md:col-span-2">
          <h3 className="font-semibold text-gray-900 mb-3">Contact Information</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name <span className="text-red-500">*</span>
          </label>
          <input
            name="firstName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter first name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name <span className="text-red-500">*</span>
          </label>
          <input
            name="lastName"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter last name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            name="phone"
            type="tel"
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter phone number"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            name="email"
            type="email"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter email"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
          <input
            name="dateOfBirth"
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
          <select
            name="gender"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Address */}
        <div className="md:col-span-2 mt-2">
          <h3 className="font-semibold text-gray-900 mb-3">Address</h3>
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Street Address</label>
          <input
            name="address"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter address"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
          <input
            name="city"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter city"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">State</label>
          <input
            name="state"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter state"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Pincode</label>
          <input
            name="pincode"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter pincode"
          />
        </div>

        {/* Guardian */}
        <div className="md:col-span-2 mt-2">
          <h3 className="font-semibold text-gray-900 mb-3">Guardian Details</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Name</label>
          <input
            name="guardianName"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter guardian name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Guardian Phone</label>
          <input
            name="guardianPhone"
            type="tel"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Enter guardian phone"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Relation</label>
          <select
            name="guardianRelation"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          >
            <option value="">Select relation</option>
            <option value="Father">Father</option>
            <option value="Mother">Mother</option>
            <option value="Guardian">Guardian</option>
            <option value="Spouse">Spouse</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Enquiry Details */}
        <div className="md:col-span-2 mt-2">
          <h3 className="font-semibold text-gray-900 mb-3">Enquiry Details</h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Course Interested In</label>
          <select
            name="courseInterested"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          >
            <option value="">Select course</option>
            {courses.map((c) => (
              <option key={c.id} value={c.name}>
                {c.name} ({c.code})
              </option>
            ))}
            <option value="Other">Other / Not Sure</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Source</label>
          <select
            name="source"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          >
            <option value="">How did they hear about us?</option>
            <option value="walk-in">Walk-in</option>
            <option value="phone">Phone Call</option>
            <option value="website">Website</option>
            <option value="referral">Referral</option>
            <option value="social-media">Social Media</option>
            <option value="newspaper">Newspaper</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Next Follow-up Date</label>
          <input
            name="nextFollowUp"
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
          />
        </div>

        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">Remarks</label>
          <textarea
            name="remarks"
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none text-sm"
            placeholder="Any additional notes about the enquiry..."
          />
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={pending}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm font-medium"
        >
          {pending ? 'Saving...' : 'Save Enquiry'}
        </button>
      </div>
    </form>
  )
}
