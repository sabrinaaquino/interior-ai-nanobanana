"use client";

import { STYLES } from "../lib/venice";
import { cn } from "../lib/utils";

interface StyleChipsProps {
  selectedStyle: string;
  onSelect: (styleId: string) => void;
}

export default function StyleChips({ selectedStyle, onSelect }: StyleChipsProps) {
  return (
    <div className="w-full">
      <div className="flex flex-wrap gap-2">
        {STYLES.map((style) => (
          <button
            key={style.id}
            onClick={() => onSelect(style.id)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all",
              selectedStyle === style.id
                ? "bg-black text-white shadow-md"
                : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
            )}
          >
            {style.label}
          </button>
        ))}
      </div>
    </div>
  );
}
