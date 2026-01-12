
import React from 'react';
import { Upload, X } from 'lucide-react';

interface ImageUploadProps {
  onImageSelected: (file: File) => void;
  selectedImage: File | null;
  onClear: () => void;
  label?: string;
  compact?: boolean;
  accept?: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelected, selectedImage, onClear, label, compact, accept }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) onImageSelected(e.target.files[0]);
  };

  if (selectedImage) {
    return (
      <div className={`relative w-full ${compact ? 'h-32' : 'h-48'} rounded-2xl overflow-hidden group border border-brand-gold/30`}>
        <img src={URL.createObjectURL(selectedImage)} className="w-full h-full object-cover" alt="preview" />
        <button onClick={onClear} className="absolute top-2 right-2 bg-red-500 p-1.5 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      </div>
    );
  }

  return (
    <div className={`relative w-full ${compact ? 'h-32' : 'h-48'} rounded-2xl border-2 border-dashed border-white/10 hover:border-brand-gold/50 flex flex-col items-center justify-center cursor-pointer transition-all bg-white/5`}>
      <input type="file" accept={accept || "image/*"} onChange={handleChange} className="absolute inset-0 opacity-0 cursor-pointer" />
      <Upload size={24} className="text-brand-gold mb-2" />
      <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">{label || "Choisir Image"}</span>
    </div>
  );
};
export default ImageUpload;
