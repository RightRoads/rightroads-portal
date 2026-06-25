import { StudentForm } from '@/components/forms/StudentForm'

export default async function NewStudentPage(props: {
  searchParams: Promise<Record<string, string | undefined>>
}) {
  const searchParams = await props.searchParams

  const prefill = {
    enquiryId: searchParams.enquiryId || '',
    firstName: searchParams.firstName || '',
    lastName: searchParams.lastName || '',
    email: searchParams.email || '',
    phone: searchParams.phone || '',
    dateOfBirth: searchParams.dateOfBirth || '',
    gender: searchParams.gender || '',
    address: searchParams.address || '',
    city: searchParams.city || '',
    state: searchParams.state || '',
    pincode: searchParams.pincode || '',
    guardianName: searchParams.guardianName || '',
    guardianPhone: searchParams.guardianPhone || '',
    guardianRelation: searchParams.guardianRelation || '',
  }

  const fromEnquiry = !!searchParams.enquiryId

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-2">New Admission</h1>
      {fromEnquiry && (
        <p className="text-sm text-green-600 mb-4">
          Pre-filled from enquiry. Review and complete the admission.
        </p>
      )}
      <StudentForm prefill={prefill} />
    </div>
  )
}
