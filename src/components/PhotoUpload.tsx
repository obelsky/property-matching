"use client";

import { useState, useRef, ChangeEvent } from "react";
import Image from "next/image";
import { CameraIcon, LightbulbIcon, CheckIcon } from "@/components/Icons";

interface PhotoUploadProps {
  photos: string[]; // Changed to base64 strings
  onPhotosChange: (photos: string[]) => void;
  maxPhotos?: number;
  minPhotos?: number;
}

export default function PhotoUpload({
  photos,
  onPhotosChange,
  maxPhotos = 10,
  minPhotos = 1,
}: PhotoUploadProps) {
  const [previews, setPreviews] = useState<string[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle file selection
  const handleFiles = async (files: FileList | null) => {
    if (!files) return;

    const newFiles = Array.from(files);
    const totalFiles = photos.length + newFiles.length;

    if (totalFiles > maxPhotos) {
      alert(`Můžete nahrát maximálně ${maxPhotos} fotografií`);
      return;
    }

    // Filter only images
    const imageFiles = newFiles.filter((file) =>
      file.type.startsWith("image/")
    );

    if (imageFiles.length !== newFiles.length) {
      alert("Můžete nahrát pouze obrázky (JPG, PNG, WEBP)");
    }

    // Validate file sizes (max 5MB per file)
    const maxSize = 5 * 1024 * 1024; // 5MB
    const oversizedFiles = imageFiles.filter(file => file.size > maxSize);
    if (oversizedFiles.length > 0) {
      alert(`Některé soubory jsou příliš velké. Maximum je 5MB na soubor.`);
      return;
    }

    // Convert to base64
    const base64Promises = imageFiles.map((file) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    });

    try {
      const base64Photos = await Promise.all(base64Promises);
      
      // Update previews (base64 strings can be used directly)
      setPreviews([...previews, ...base64Photos]);
      
      // Update photos state with base64 strings
      onPhotosChange([...photos, ...base64Photos]);
    } catch (error) {
      console.error("Error converting photos:", error);
      alert("Chyba při načítání fotografií");
    }
  };

  // Handle file input change
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  };

  // Handle drag & drop
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  };

  // Remove photo
  const removePhoto = (index: number) => {
    const newPhotos = photos.filter((_, i) => i !== index);
    const newPreviews = previews.filter((_, i) => i !== index);
    onPhotosChange(newPhotos);
    setPreviews(newPreviews);
  };

  // Trigger file input
  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      {/* Upload area */}
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
          dragActive
            ? "border-brand-orange bg-orange-50"
            : "border-zfp-border hover:border-brand-orange"
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
        />

        <div className="space-y-2">
          <CameraIcon className="w-16 h-16 mx-auto text-zfp-text-subtle" />
          <p className="text-lg font-semibold text-zfp-text">
            Nahrajte fotografie
          </p>
          <p className="text-sm text-zfp-text-muted">
            Přetáhněte fotky sem nebo klikněte pro výběr
          </p>
          <p className="text-xs text-zfp-text-subtle">
            Min {minPhotos}, max {maxPhotos} fotografií • JPG, PNG, WEBP
          </p>
        </div>
      </div>

      {/* Photo counter */}
      {photos.length > 0 && (
        <div className="text-sm text-zfp-text-muted">
          Nahráno: <strong>{photos.length}</strong> / {maxPhotos} fotografií
          {photos.length < minPhotos && (
            <span className="text-red-600 ml-2">
              (minimum {minPhotos})
            </span>
          )}
        </div>
      )}

      {/* Previews grid */}
      {previews.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {previews.map((preview, index) => (
            <div
              key={index}
              className="relative aspect-square rounded-lg overflow-hidden border-2 border-zfp-border group"
            >
              <Image
                src={preview}
                alt={`Náhled ${index + 1}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
              />

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removePhoto(index);
                }}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                aria-label="Odstranit fotku"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>

              {/* Main photo indicator */}
              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-brand-orange text-white px-2 py-1 rounded text-xs font-semibold">
                  Hlavní foto
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Helpful tips */}
      <div className="bg-info/10 border border-info/30 rounded-lg p-4">
        <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
          <LightbulbIcon className="w-5 h-5" />
          Tipy pro fotky:
        </h4>
        <ul className="text-sm text-blue-800 space-y-1">
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>První fotka bude hlavní (použije se v náhledu)</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Foťte v dobrém světle, nejlépe přes den</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Ukažte všechny místnosti a zajímavé detaily</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Exteriér, výhled, okolí zvyšují zájem</span>
          </li>
          <li className="flex items-start gap-2">
            <CheckIcon className="w-4 h-4 flex-shrink-0 mt-0.5" />
            <span>Ideálně 5-10 kvalitních fotografií</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
