'use client';

import { useEffect, useState } from 'react';
import * as XLSX from 'xlsx';
import { motion } from 'framer-motion';

type SimpleMember = {
  "S.No"?: number | string;
  Name?: string;
  Designation?: string;
  Address?: string;
  Mob?: string;
};

export default function RashtriyaKaryakariniPage() {
  const [simpleData, setSimpleData] = useState<Record<string, SimpleMember[]>>({});
  const [activeSheet, setActiveSheet] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/data/Rashtriye_Karyakarni_List.xlsx')
      .then((res) => res.arrayBuffer())
      .then((ab) => {
        const wb = XLSX.read(ab, { type: 'array' });

        const allSheets: Record<string, SimpleMember[]> = {};

        wb.SheetNames.forEach((sheetName) => {
          const ws = wb.Sheets[sheetName];
          allSheets[sheetName] = XLSX.utils.sheet_to_json<SimpleMember>(ws);
        });

        setSimpleData(allSheets);
        setActiveSheet(wb.SheetNames[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  const exportExcel = () => {
    const wb = XLSX.utils.book_new();

    Object.entries(simpleData).forEach(([sheetName, rows]) => {
      const ws = XLSX.utils.json_to_sheet(rows);
      XLSX.utils.book_append_sheet(wb, ws, sheetName);
    });

    XLSX.writeFile(wb, 'Rashtriya_Karyakarini_List.xlsx');
  };

  return (
    <section className="relative min-h-screen overflow-hidden bg-gradient-to-b from-[#FFF9EF] via-[#FFF3D8] to-[#FBEBD2] px-6 py-14">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/swastik-pattern.png')] opacity-5 bg-cover bg-center pointer-events-none" />

      <div className="relative max-w-7xl mx-auto z-10">
        {/* HERO HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-10"
        >
          <h1 className="text-4xl md:text-5xl font-serif text-[#6A0000]">
            Rashtriya Karyakarini List
          </h1>

          <div className="w-28 h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent mx-auto mt-4 rounded-full" />

          <p className="mt-4 text-[#6B3F00] text-lg max-w-2xl mx-auto">
            Explore the official Rashtriya Karyakarini listing categorized by organizational divisions.
          </p>
        </motion.div>

        {/* MAIN CARD */}
        <motion.div
          initial={{ opacity: 0, y: 35 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9 }}
          className="rounded-3xl border border-[#E7D6BF] bg-white/90 backdrop-blur-md shadow-[0_25px_60px_rgba(106,0,0,0.08)] overflow-hidden"
        >
          {/* TOP BAR */}
          <div className="relative p-6 border-b border-[#E7D6BF] bg-gradient-to-r from-[#FFF8E8] to-[#FFF2D4]">
            <div className="flex flex-wrap justify-center gap-3">
              {Object.keys(simpleData).map((sheet) => (
                <button
                  key={sheet}
                  onClick={() => setActiveSheet(sheet)}
                  className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${
                    activeSheet === sheet
                      ? 'bg-gradient-to-r from-[#6A0000] to-[#8B0000] text-white shadow-lg scale-105'
                      : 'border border-[#D4AF37] text-[#6A0000] hover:bg-[#FFF1D6]'
                  }`}
                >
                  {sheet}
                </button>
              ))}
            </div>

            <button
              onClick={exportExcel}
              className="absolute right-6 top-6 px-5 py-2 rounded-full bg-gradient-to-r from-[#6A0000] to-[#8B0000] text-white font-semibold shadow-md hover:scale-105 transition"
            >
              Export Excel
            </button>
          </div>

          {/* TABLE */}
          <div className="max-h-[70vh] overflow-y-auto">
            <table className="w-full text-sm border-collapse">
              <thead className="sticky top-0 bg-[#FAF3E8] z-20 shadow-sm">
                <tr>
                  {['S.No', 'Name', 'Designation', 'Address', 'Mob'].map((h) => (
                    <th
                      key={h}
                      className="px-5 py-4 border border-[#E7D6BF] text-left text-xs uppercase tracking-wider font-bold text-[#6A0000]"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="p-10 text-center text-[#6A0000]">
                      Loading Rashtriya Karyakarini List...
                    </td>
                  </tr>
                ) : (
                  (simpleData[activeSheet] || []).map((row, i) => (
                    <tr
                      key={i}
                      className="odd:bg-white even:bg-[#FBF7F2] hover:bg-[#FFF1D6] transition duration-200"
                    >
                      <td className="border border-[#E7D6BF] px-5 py-4 font-medium">
                        {row['S.No']}
                      </td>
                      <td className="border border-[#E7D6BF] px-5 py-4">
                        {row.Name}
                      </td>
                      <td className="border border-[#E7D6BF] px-5 py-4">
                        {row.Designation}
                      </td>
                      <td className="border border-[#E7D6BF] px-5 py-4">
                        {row.Address}
                      </td>
                      <td className="border border-[#E7D6BF] px-5 py-4">
                        {row.Mob}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </section>
  );
}