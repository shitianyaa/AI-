import React, { useCallback, useState } from 'react';
import { UploadCloud, Image as ImageIcon, X } from 'lucide-react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
  disabled: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ currentImage, onImageUpload, onClear, disabled }) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    if (!disabled) setIsDragging(true);
  }, [disabled]);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (disabled) return;

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [disabled]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件。');
      return;
    }

    // Limit size to ~4MB to avoid browser freeze on large base64 strings
    if (file.size > 4 * 1024 * 1024) {
      alert('文件过大。请使用 4MB 以下的图片。');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result && typeof e.target.result === 'string') {
        onImageUpload(e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  if (currentImage) {
    return (
      <div className="relative group rounded-xl overflow-hidden border border-gray-200 shadow-sm bg-white">
        <img 
          src={currentImage} 
          alt="Uploaded preview" 
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
          <button
            onClick={onClear}
            disabled={disabled}
            className="bg-white text-red-600 px-4 py-2 rounded-full font-medium flex items-center gap-2 hover:bg-red-50 transition-colors"
          >
            <X className="w-4 h-4" />
            移除照片
          </button>
        </div>
        <div className="absolute bottom-2 left-2 bg-black/60 text-white text-xs px-2 py-1 rounded">
          原图
        </div>
      </div>
    );
  }

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`
        relative border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all duration-200 h-64 sm:h-80
        ${isDragging 
          ? 'border-brand-500 bg-brand-50 scale-[1.01]' 
          : 'border-gray-300 hover:border-brand-300 hover:bg-gray-50 bg-gray-50'
        }
        ${disabled ? 'opacity-50 pointer-events-none' : ''}
      `}
    >
      <div className="bg-white p-4 rounded-full shadow-sm mb-4">
        <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-brand-600' : 'text-gray-400'}`} />
      </div>
      <h3 className="text-lg font-semibold text-gray-900">上传您的自拍</h3>
      <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
        拖放图片到此处，或点击浏览。
      </p>
      <p className="text-xs text-gray-400 mt-4">
        支持 JPG, PNG (最大 4MB)
      </p>
      
      <label className="absolute inset-0 cursor-pointer">
        <input 
          type="file" 
          accept="image/*" 
          className="hidden" 
          onChange={handleFileInput}
          disabled={disabled}
        />
      </label>
    </div>
  );
};

export default ImageUploader;