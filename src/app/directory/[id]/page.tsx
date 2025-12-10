"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

export default function MemberDetailPage() {
  const { id } = useParams();
  const [member, setMember] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/directory/member/${id}`)
      .then((res) => res.json())
      .then(setMember);
  }, [id]);

  if (!member) return <p className="p-8">Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-8">
      <img
        src={member.imageUrl || "/images/default-user.jpg"}
        className="w-64 h-64 object-cover rounded-xl mx-auto mb-6"
      />
      <h1 className="text-3xl text-center font-bold">{member.name}</h1>

      <div className="mt-8 space-y-3 text-lg">
        <p><b>Email:</b> {member.email}</p>
        <p><b>Phone:</b> {member.phone}</p>
        <p><b>State:</b> {member.state}</p>
        <p><b>Branch:</b> {member.branch}</p>
        <p><b>Organization:</b> {member.organization}</p>
        <p><b>Address:</b> {member.address}</p>
      </div>
    </div>
  );
}
