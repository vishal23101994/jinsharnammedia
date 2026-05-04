"use client";

import { useState, useCallback, useRef } from "react";
import Cropper from "react-easy-crop";

export default function ImageUploadPreview({
  currentImage,
}: {
  currentImage?: string | null;
}) {
  const [image, setImage] = useState(currentImage || "");
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const fileRef = useRef<HTMLInputElement>(null);

  const onCropComplete = useCallback(() => {
    // future crop save logic
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    const objectUrl = URL.createObjectURL(file);
    setImage(objectUrl);
  }

  return (
    <div className="w-full max-w-md bg-white border rounded-2xl shadow-sm p-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">
        Profile Photo
      </h3>

      {/* Crop Area */}
      <div className="relative h-[380px] rounded-2xl overflow-hidden bg-gray-100 border shadow-inner">
        {image ? (
          <Cropper
            image={image}
            crop={crop}
            zoom={zoom}
            aspect={4 / 5}
            cropShape="rect"
            showGrid={false}
            onCropChange={setCrop}
            onZoomChange={setZoom}
            onCropComplete={onCropComplete}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
            <span className="text-sm">No Image Selected</span>
          </div>
        )}
      </div>

      {/* Controls */}
      <div className="mt-5 space-y-4">

        <input
          ref={fileRef}
          type="file"
          name="photo"
          accept="image/*"
          onChange={handleChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="w-full bg-[#6A0000] hover:bg-[#520000] text-white py-3 rounded-xl font-semibold transition"
        >
          Choose Different Photo
        </button>

        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="font-medium text-gray-700">Zoom / Crop</span>
            <span className="text-gray-500">{zoom.toFixed(1)}x</span>
          </div>

          <input
            type="range"
            min={1}
            max={3}
            step={0.1}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            className="w-full accent-[#6A0000]"
          />
        </div>

        <p className="text-xs text-gray-500 leading-relaxed">
          Drag image to reposition. Use zoom slider to crop properly.
          Supports all browser-supported image formats.
        </p>
      </div>
    </div>
  );
}