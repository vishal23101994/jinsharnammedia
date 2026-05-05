export default function TrusteeSavedPage() {
  return (
    <section className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md text-center border">
        <div className="w-20 h-20 rounded-full bg-green-100 mx-auto flex items-center justify-center mb-5">
          <span className="text-4xl text-green-600">✓</span>
        </div>

        <h1 className="text-2xl font-bold mb-3 text-green-700">
          Trustee Details Saved Successfully
        </h1>

        <p className="text-gray-600 mb-6">
          Trustee registration details were updated successfully.
        </p>

        <a
          href="/"
          className="inline-block bg-[#6A0000] text-white px-6 py-3 rounded-lg"
        >
          Go Home
        </a>
      </div>
    </section>
  );
}