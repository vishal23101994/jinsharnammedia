import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default async function ReviewTrusteePage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) return notFound();

  const request = await prisma.trusteeRequest.findFirst({
    where: {
      approvalToken: token,
      approvalTokenExpires: { gt: new Date() },
    },
  });

  if (!request) return notFound();

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">

        <div className="bg-gradient-to-r from-[#6A0000] to-[#A00000] px-8 py-6 text-white">
          <h1 className="text-3xl font-bold">Review / Edit Trustee</h1>
          <p className="text-sm opacity-90 mt-1">
            Verify trustee information before approval
          </p>
        </div>

        <form
          action="/api/admin/save-trustee-request"
          method="POST"
          encType="multipart/form-data"
          className="p-8 space-y-8"
        >
          <input type="hidden" name="token" value={token} />

          <div className="grid lg:grid-cols-[380px_1fr] gap-10">
            <ImageUploadPreview currentImage={request.imageUrl} />

            <div className="grid md:grid-cols-2 gap-5">
              <Input label="Full Name" name="name" defaultValue={request.name} />
              <Input
                label="Email"
                name="email"
                defaultValue={request.email || ""}
              />
              <Input label="Phone" name="phone" defaultValue={request.phone || ""} />
              <Input label="Alternate Phone" name="alternatePhone" defaultValue={request.alternatePhone || ""} />
              <Input label="Gender" name="gender" defaultValue={request.gender || ""} />
              <Input label="Designation" name="designation" defaultValue={request.designation || ""} />
              <Input label="City" name="city" defaultValue={request.city || ""} />
              <Input label="State" name="state" defaultValue={request.state || ""} />
              <Input label="Pincode" name="pincode" defaultValue={request.pincode || ""} />

              <DateInput
                label="Date of Birth"
                name="dateOfBirth"
                value={request.dateOfBirth}
              />

              <DateInput
                label="Date of Marriage"
                name="dateOfMarriage"
                value={request.dateOfMarriage}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              defaultValue={request.address || ""}
              rows={4}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          <div className="flex gap-4 pt-4 border-t">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Save Changes
            </button>

            <a
              href={`/api/trustee/approve?token=${token}`}
              className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Approve Trustee
            </a>

            <a
              href={`/api/trustee/reject?token=${token}`}
              className="bg-red-600 text-white px-8 py-3 rounded-lg font-semibold"
            >
              Reject Trustee
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}

function Input({ label, name, defaultValue }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        name={name}
        defaultValue={defaultValue}
        className="w-full border rounded-lg px-4 py-3"
      />
    </div>
  );
}

function DateInput({ label, name, value }: any) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1">{label}</label>
      <input
        type="date"
        name={name}
        defaultValue={value ? value.toISOString().split("T")[0] : ""}
        className="w-full border rounded-lg px-4 py-3"
      />
    </div>
  );
}