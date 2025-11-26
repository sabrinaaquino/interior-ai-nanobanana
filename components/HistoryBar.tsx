"use client";

import { HistoryItem } from "@/lib/venice";

interface HistoryBarProps {
  history: HistoryItem[];
  onSelect: (item: HistoryItem) => void;
}

export default function HistoryBar({ history, onSelect }: HistoryBarProps) {
  if (history.length === 0) return null;

  return (
    <div className="mt-8 border-t border-gray-100 pt-6">
      <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent Designs</h3>
      <div className="grid grid-cols-4 gap-2">
        {history.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="relative aspect-square rounded-md overflow-hidden border border-gray-200 hover:ring-2 ring-black transition-all group"
          >
            <img
              src={item.image}
              alt={item.style}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>
    </div>
  );
}
