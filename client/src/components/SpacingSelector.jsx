import React, { useState } from "react";
import { Check, AlignJustify } from "lucide-react";

const OPTIONS = [
  { id: "compact", name: "Compact", hint: "Tightest spacing - best for fitting one page" },
  { id: "normal", name: "Normal", hint: "Balanced spacing (default)" },
  { id: "relaxed", name: "Relaxed", hint: "More breathing room between sections" },
];

const SpacingSelector = ({ selectedSpacing, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const active = OPTIONS.find((o) => o.id === selectedSpacing) || OPTIONS[1];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 text-sm text-green-600 bg-gradient-to-br from-green-50 to-green-100 ring-green-600 hover:ring transition-all px-3 py-2 rounded-lg"
      >
        <AlignJustify size={14} /> <span className="max-sm:hidden">Spacing</span>
      </button>

      {isOpen && (
        <div className="absolute top-full mt-2 w-64 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          {OPTIONS.map((option) => (
            <div
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className={`relative p-4 cursor-pointer ${selectedSpacing === option.id ? "bg-green-50" : "hover:bg-gray-50"}`}
            >
              {selectedSpacing === option.id && (
                <div className="absolute top-2 right-2">
                  <div className="size-5 bg-green-400 rounded-full flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" />
                  </div>
                </div>
              )}
              <h4 className="font-medium text-gray-800">{option.name}</h4>
              <p className="mt-1 text-xs text-gray-500">{option.hint}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SpacingSelector;
