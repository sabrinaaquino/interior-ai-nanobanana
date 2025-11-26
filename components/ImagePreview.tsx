"use client";

import { Upload, Loader2, ImageIcon } from "lucide-react";
import { useState, useRef } from "react";
import { cn } from "@/lib/utils";

interface ImagePreviewProps {
  image: string | null;
  isLoading: boolean;
  onUpload: (file: File) => void;
}

export default function ImagePreview({ image, isLoading, onUpload }: ImagePreviewProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onUpload(e.dataTransfer.files[0]);
    }
  };

  const handleClick = () => {
    if (!image && !isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div 
      className={cn(
        "relative w-full h-full min-h-[500px] bg-gray-50 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center overflow-hidden",
        isDragging ? "border-black bg-gray-100" : "border-gray-200",
        image ? "border-none" : "cursor-pointer hover:bg-gray-100"
      )}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          if (e.target.files?.[0]) onUpload(e.target.files[0]);
        }}
      />

      {!image && !isLoading && (
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-white rounded-full shadow-sm flex items-center justify-center mx-auto mb-4">
            <Upload className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900">Upload a photo</h3>
          <p className="text-sm text-gray-500 mt-1">Drag & drop or click to browse</p>
        </div>
      )}

      {image && (
        <div className="relative w-full h-full group">
           {/* Using img tag for base64 often easier than Next/Image for dynamic data URIs with unknown dimensions initially, 
               but styling full cover is needed. */}
          <img 
            src={image} 
            alt="Preview" 
            className={cn(
              "w-full h-full object-contain transition-opacity duration-500",
              isLoading ? "opacity-50 blur-sm" : "opacity-100"
            )}
          />
          
          {/* Overlay for re-uploading if image exists */}
          {!isLoading && (
            <button 
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="absolute bottom-4 right-4 bg-white/80 hover:bg-white backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium transition-all opacity-0 group-hover:opacity-100"
            >
              Change Image
            </button>
          )}
        </div>
      )}

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center z-10">
          <div className="bg-white/90 backdrop-blur px-6 py-4 rounded-xl shadow-lg flex items-center gap-3">
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
            <span className="text-sm font-medium text-gray-700">Designing...</span>
          </div>
        </div>
      )}
    </div>
  );
}

