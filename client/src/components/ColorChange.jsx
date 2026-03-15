import React, { useState } from "react";
import { Check, Palette } from "lucide-react";

const ColorChange = ({ selectedColor, onChange }) => {
    const colors  = [
    { name: "Blue", value: "#3b82f6" },
    { name: "Green", value: "#10b981" },
    { name: "Red", value: "#ef4444" },
    { name: "Black", value: "#000000" },
    { name: "Orange", value: "#f97316" },
    { name: "Pink", value: "#ec4899" },
    { name: "Teal", value: "#14b8a6" },
    ]

    const [isOpen, setIsOpen] = useState(false)
    const activeColor = colors.find((color) => color.value === selectedColor)

    return(
        <div className="relative">
        <button type="button" onClick={() => setIsOpen(!isOpen)} className="flex items-center gap-1 text-sm text-purple-600 bg-gradient-to-br from-purple-50 to-purple-100 ring-purple-600 hover:ring transition-all px-3 py-2 rounded-lg">
        <Palette size={16} /> <span className="max-sm:hidden">Accent</span>
        </button>
        {isOpen && (
            <div className="w-60 absolute top-full right-0 p-3 mt-2 z-20 bg-white rounded-md border border-gray-200 shadow-sm">
                <div className="grid grid-cols-4 gap-2">
                {colors.map ((color) => (
                    <div key={color.value} className="relative">
                        <div onClick={() => {onChange(color.value); setIsOpen(false)}} className={`size-6 rounded-full cursor-pointer ${selectedColor === color.value ? "ring-2 ring-offset-2 ring-purple-500" : ""}`} style={{backgroundColor: color.value}}></div>
                        {selectedColor === color.value && (
                        <div className="absolute inset-0 flex items-center justify-center">
                             <Check className="size-5 text-white"/>
                        </div>
                        )}
                    </div>
                ))}
                </div>
                <p className="text-xs text-center mt-3 text-gray-600">{activeColor?.name || "Custom"}</p>
            </div>
        )}
        </div>
    )
}


export default ColorChange