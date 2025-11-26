"use client";

import { useState } from "react";
import { Loader2, Sparkles, Download } from "lucide-react";
import ImagePreview from "@/components/ImagePreview";
import StyleChips from "@/components/StyleChips";
import HistoryBar from "@/components/HistoryBar";
import { STYLES, HistoryItem } from "@/lib/venice";
import { cn } from "@/lib/utils";

export default function Home() {
  const [image, setImage] = useState<string | null>(null); // Current display image (could be original or generated)
  const [originalImage, setOriginalImage] = useState<string | null>(null); // Always keeps the uploaded original
  const [selectedStyle, setSelectedStyle] = useState(STYLES[0].id);
  const [customStyle, setCustomStyle] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [resolution, setResolution] = useState("1024");
  const [count, setCount] = useState(1);

  // Helper to resize image to max dimension to avoid 10MB limit
  const resizeImage = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement("canvas");
          let width = img.width;
          let height = img.height;
          const maxDim = 1024; // Resize to max 1024px to correspond with model optimization and file size limits

          if (width > height) {
            if (width > maxDim) {
              height = Math.round((height * maxDim) / width);
              width = maxDim;
            }
          } else {
            if (height > maxDim) {
              width = Math.round((width * maxDim) / height);
              height = maxDim;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext("2d");
          ctx?.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL("image/jpeg", 0.9)); // Use JPEG 0.9 quality
        };
        img.onerror = reject;
        img.src = e.target?.result as string;
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleUpload = async (file: File) => {
    try {
      const resized = await resizeImage(file);
      setImage(resized);
      setOriginalImage(resized);
      setError(null);
    } catch (err) {
      setError("Failed to process image");
    }
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setIsLoading(true);
    setError(null);

    try {
      const stylePrompt = customStyle.trim() 
        ? customStyle 
        : STYLES.find((s) => s.id === selectedStyle)?.prompt || selectedStyle;

      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          imageBase64: originalImage,
          style: stylePrompt,
          resolution,
          count,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Generation failed");
      }

      if (data.data && data.data.length > 0) {
        // Venice returns base64 without prefix usually, or with. 
        // Standard is usually pure b64 for b64_json.
        // We need to check if prefix exists.
        let b64 = data.data[0].b64_json;
        if (!b64.startsWith("data:image")) {
          b64 = `data:image/png;base64,${b64}`;
        }
        
        setImage(b64);
        
        // Add to history
        const newItem: HistoryItem = {
          id: Date.now().toString(),
          image: b64,
          original: originalImage,
          style: stylePrompt,
          date: Date.now(),
        };
        setHistory((prev) => [newItem, ...prev]);
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = () => {
    if (!image) return;
    const link = document.createElement("a");
    link.href = image;
    link.download = `interior-ai-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <main className="flex h-screen w-full bg-white overflow-hidden font-sans text-gray-900">
      {/* Left Panel - Image Preview */}
      <div className="flex-1 bg-[#F9FAFB] p-6 flex items-center justify-center relative">
        <div className="w-full h-full max-w-[1200px] mx-auto">
          <ImagePreview 
            image={image} 
            isLoading={isLoading} 
            onUpload={handleUpload} 
          />
        </div>
        
        {/* Download Button overlay */}
        {image && !isLoading && (
          <button
            onClick={handleDownload}
            className="absolute top-8 right-8 p-3 bg-white rounded-full shadow-md hover:bg-gray-50 transition-all text-gray-700"
            title="Download Image"
          >
            <Download className="w-5 h-5" />
          </button>
        )}

        {error && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-red-50 text-red-600 px-4 py-2 rounded-full text-sm shadow-sm border border-red-100 animate-in fade-in slide-in-from-bottom-4">
            {error}
          </div>
        )}
      </div>

      {/* Right Panel - Controls */}
      <div className="w-[400px] bg-white border-l border-gray-100 flex flex-col h-full z-10 shadow-xl shadow-gray-200/50">
        <div className="p-6 border-b border-gray-100">
          <h1 className="text-xl font-semibold tracking-tight">Nano Interior 🍌</h1>
          <p className="text-sm text-gray-500">Redesign your space with AI</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Style Selection */}
          <div className="space-y-3">
            <label className="text-sm font-medium text-gray-700">Choose Style</label>
            <StyleChips selectedStyle={selectedStyle} onSelect={setSelectedStyle} />
          </div>

          {/* Custom Style */}
          <div className="space-y-3">
             <label className="text-sm font-medium text-gray-700">Or Custom Style</label>
             <input
               type="text"
               value={customStyle}
               onChange={(e) => setCustomStyle(e.target.value)}
               placeholder="e.g. Cyberpunk jungle office"
               className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-sm"
             />
          </div>

          {/* Settings */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Resolution</label>
              <select 
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white"
              >
                <option value="512">512 x 512</option>
                <option value="768">768 x 768</option>
                <option value="1024">1024 x 1024</option>
              </select>
            </div>
             <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Variations</label>
              <select 
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/5 text-sm bg-white"
              >
                <option value={1}>1 Image</option>
                <option value={2}>2 Images</option>
                <option value={3}>3 Images</option>
                <option value={4}>4 Images</option>
              </select>
            </div>
          </div>

          {/* Generate Button */}
          <button
            onClick={handleGenerate}
            disabled={!originalImage || isLoading}
            className={cn(
              "w-full py-3 rounded-xl font-medium text-white flex items-center justify-center gap-2 transition-all",
              !originalImage || isLoading
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 shadow-lg shadow-blue-600/20"
            )}
          >
            {isLoading ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <Sparkles className="w-5 h-5" />
            )}
            {isLoading ? "Generating..." : "Generate New Look"}
          </button>

          {/* History */}
          <HistoryBar 
            history={history} 
            onSelect={(item) => setImage(item.image)} 
          />
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-gray-100 text-center">
          <p className="text-xs text-gray-400">Powered by Venice.ai & Banana Nano</p>
        </div>
      </div>
    </main>
  );
}
