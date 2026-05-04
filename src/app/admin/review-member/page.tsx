import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ImageUploadPreview from "@/components/admin/ImageUploadPreview";

export default async function ReviewMemberPage({
  searchParams,
}: {
  searchParams: Promise<{ token?: string }>;
}) {
  const params = await searchParams;
  const token = params.token;

  if (!token) return notFound();

  const request = await prisma.directoryRequest.findFirst({
    where: {
      approvalToken: token,
      approvalTokenExpires: {
        gt: new Date(),
      },
    },
  });

  if (!request) return notFound();

  return (
    <section className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-5xl mx-auto bg-white shadow-xl rounded-2xl overflow-hidden border">

        {/* Header */}
        <div className="bg-gradient-to-r from-[#6A0000] to-[#8B0000] px-8 py-6 text-white">
          <h1 className="text-3xl font-bold">Review / Edit Member</h1>
          <p className="text-sm opacity-90 mt-1">
            Verify details, update information, and approve member registration
          </p>
        </div>

        <form
          action="/api/admin/save-directory-request"
          method="POST"
          encType="multipart/form-data"
          className="p-8 space-y-8"
        >
          <input type="hidden" name="token" value={token} />

          {/* Profile Image */}
          <div className="grid lg:grid-cols-[380px_1fr] gap-10 items-start">
            <ImageUploadPreview currentImage={request.imageUrl} />

            <div className="grid md:grid-cols-2 gap-5 flex-1 w-full">

              <Input label="Full Name" name="name" defaultValue={request.name} />
              <Input label="Email" name="email" defaultValue={request.email} />
              <Input label="Phone" name="phone" defaultValue={request.phone || ""} />
              <Input label="Organization" name="organization" defaultValue={request.organization || ""} />
              <Input label="Position" name="position" defaultValue={request.position || ""} />
              <Input label="Zone" name="zone" defaultValue={request.zone || ""} />
              <Input label="State" name="state" defaultValue={request.state || ""} />
              <Input label="Branch" name="branch" defaultValue={request.branch || ""} />
              <Input label="Gender" name="gender" defaultValue={request.gender || ""} />

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  defaultValue={
                    request.dateOfBirth
                      ? request.dateOfBirth.toISOString().split("T")[0]
                      : ""
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Marriage
                </label>
                <input
                  type="date"
                  name="dateOfMarriage"
                  defaultValue={
                    request.dateOfMarriage
                      ? request.dateOfMarriage.toISOString().split("T")[0]
                      : ""
                  }
                  className="w-full border rounded-lg px-4 py-3"
                />
              </div>

            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <textarea
              name="address"
              defaultValue={request.address || ""}
              rows={4}
              className="w-full border rounded-lg px-4 py-3"
            />
          </div>

          {/* Buttons */}
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold shadow"
            >
              Save Changes
            </button>

            <a
              href={`/api/admin/approve?token=${token}`}
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold shadow"
            >
              Approve Member
            </a>
          </div>
        </form>
      </div>
    </section>
  );
}

function Input({
  label,
  name,
  defaultValue,
}: {
  label: string;
  name: string;
  defaultValue?: string;
}) {
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