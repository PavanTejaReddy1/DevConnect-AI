import { useState } from 'react';
import { motion } from 'framer-motion';
import { FiUpload, FiX } from 'react-icons/fi';

export default function ImageUploader({ label, currentImage, onImageChange, aspectRatio = 'square' }) {
  const [preview, setPreview] = useState(currentImage || null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
        onImageChange(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setPreview(null);
    onImageChange(null);
  };

  const aspectClasses = {
    square: 'aspect-square',
    landscape: 'aspect-video',
    portrait: 'aspect-[3/4]',
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-text">{label}</label>
      <div className={`relative ${aspectClasses[aspectRatio]} w-full max-w-xs border-2 border-dashed border-border rounded-xl overflow-hidden bg-gray-50 hover:border-primary/50 transition-colors`}>
        {preview ? (
          <div className="relative w-full h-full">
            <img src={preview} alt="Preview" className="w-full h-full object-cover" />
            <button
              onClick={handleRemove}
              className="absolute top-2 right-2 p-1.5 bg-danger text-white rounded-full shadow-card hover:bg-red-600 transition-colors"
            >
              <FiX size={16} />
            </button>
          </div>
        ) : (
          <label className="flex flex-col items-center justify-center w-full h-full cursor-pointer">
            <FiUpload size={32} className="text-text/40 mb-2" />
            <span className="text-sm text-text/40">Click to upload</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
