import React from 'react';
import { HEADSHOT_STYLES, StyleOption } from '../types';
import { Briefcase, Cpu, Sun, Camera, Edit3, CheckCircle2 } from 'lucide-react';

interface StyleSelectorProps {
  selectedStyle: string;
  onSelectStyle: (id: string) => void;
  customPrompt: string;
  onCustomPromptChange: (text: string) => void;
  disabled: boolean;
}

const StyleSelector: React.FC<StyleSelectorProps> = ({
  selectedStyle,
  onSelectStyle,
  customPrompt,
  onCustomPromptChange,
  disabled
}) => {

  const getIcon = (iconName: string) => {
    switch(iconName) {
      case 'briefcase': return <Briefcase className="w-5 h-5" />;
      case 'cpu': return <Cpu className="w-5 h-5" />;
      case 'sun': return <Sun className="w-5 h-5" />;
      case 'camera': return <Camera className="w-5 h-5" />;
      default: return <Edit3 className="w-5 h-5" />;
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">1. 选择风格</h3>
        <span className="text-sm text-gray-500">选择您喜欢的氛围</span>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {HEADSHOT_STYLES.map((style) => {
          const isSelected = selectedStyle === style.id;
          return (
            <button
              key={style.id}
              onClick={() => onSelectStyle(style.id)}
              disabled={disabled}
              className={`
                relative flex items-start gap-3 p-4 rounded-xl border-2 text-left transition-all duration-200
                ${isSelected 
                  ? 'border-brand-500 bg-brand-50 shadow-md ring-1 ring-brand-500' 
                  : 'border-gray-200 hover:border-brand-200 hover:bg-gray-50 bg-white'
                }
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
              `}
            >
              <div className={`
                p-2 rounded-lg shrink-0
                ${isSelected ? 'bg-brand-100 text-brand-700' : 'bg-gray-100 text-gray-500'}
              `}>
                {getIcon(style.icon)}
              </div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold ${isSelected ? 'text-brand-900' : 'text-gray-900'}`}>
                  {style.name}
                </p>
                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                  {style.description}
                </p>
              </div>
              {isSelected && (
                <div className="absolute top-3 right-3 text-brand-500">
                  <CheckCircle2 className="w-5 h-5 fill-brand-100" />
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Custom Prompt Input - Shows only if 'Custom' is selected or acts as modifier */}
      <div className={`space-y-2 transition-all duration-300 ${selectedStyle === 'custom' ? 'opacity-100' : 'opacity-70'}`}>
        <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-700 flex justify-between">
          <span>{selectedStyle === 'custom' ? '描述您的风格' : '额外指令（可选）'}</span>
          {selectedStyle !== 'custom' && <span className="text-xs text-gray-400">例如：“加一副眼镜”、“让我微笑”</span>}
        </label>
        <textarea
          id="custom-prompt"
          rows={selectedStyle === 'custom' ? 3 : 2}
          value={customPrompt}
          onChange={(e) => onCustomPromptChange(e.target.value)}
          disabled={disabled}
          placeholder={selectedStyle === 'custom' 
            ? "例如：赛博朋克未来感背景，霓虹灯光，穿着皮夹克。" 
            : "有什么额外调整吗？（例如：“移除背景中的人”、“把图片变成黑白”）"}
          className={`
            w-full rounded-lg border-gray-300 shadow-sm focus:border-brand-500 focus:ring-brand-500 sm:text-sm p-3 border
            ${disabled ? 'bg-gray-100' : 'bg-white'}
          `}
        />
      </div>
    </div>
  );
};

export default StyleSelector;