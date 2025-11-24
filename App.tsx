import React, { useState } from 'react';
import Header from './components/Header';
import ImageUploader from './components/ImageUploader';
import StyleSelector from './components/StyleSelector';
import { HEADSHOT_STYLES, ProcessingStatus } from './types';
import { generateProfessionalHeadshot } from './services/geminiService';
import { Wand2, Download, RefreshCcw, AlertCircle, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [selectedStyleId, setSelectedStyleId] = useState<string>('corporate');
  const [customPrompt, setCustomPrompt] = useState<string>('');
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleImageUpload = (base64: string) => {
    setOriginalImage(base64);
    setGeneratedImage(null);
    setStatus('idle');
    setErrorMessage(null);
  };

  const handleClear = () => {
    setOriginalImage(null);
    setGeneratedImage(null);
    setStatus('idle');
    setErrorMessage(null);
    setCustomPrompt('');
  };

  const handleGenerate = async () => {
    if (!originalImage) return;

    setStatus('generating');
    setErrorMessage(null);

    try {
      // Construct prompt
      const style = HEADSHOT_STYLES.find(s => s.id === selectedStyleId);
      let finalPrompt = '';

      if (selectedStyleId === 'custom') {
        finalPrompt = customPrompt;
        if (!finalPrompt.trim()) {
           finalPrompt = "优化这张图片，使其看起来更专业。";
        }
      } else {
        finalPrompt = `${style?.promptModifier || ''} ${customPrompt}`;
      }

      const resultBase64 = await generateProfessionalHeadshot(originalImage, finalPrompt);
      
      // Append the data prefix for display if the API returned raw base64 (it typically does)
      const dataUri = `data:image/png;base64,${resultBase64}`;
      setGeneratedImage(dataUri);
      setStatus('success');
    } catch (err: any) {
      console.error(err);
      setStatus('error');
      setErrorMessage(err.message || "生成过程中出错。请重试。");
    }
  };

  const downloadImage = () => {
    if (generatedImage) {
      const link = document.createElement('a');
      link.href = generatedImage;
      link.download = `职业照-${selectedStyleId}-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <Header />

      <main className="flex-grow max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        
        {/* Intro Hero - Only show if no image uploaded yet */}
        {!originalImage && (
          <div className="text-center mb-12 animate-fade-in-up">
            <h2 className="text-4xl font-extrabold text-gray-900 tracking-tight sm:text-5xl mb-4">
              您的专业 <span className="text-brand-600">AI 职业照</span>
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-gray-500">
              无需花费昂贵的摄影费。上传一张日常自拍，让 Gemini AI 在几秒钟内将其转变为完美的 LinkedIn 个人资料照片。
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          
          {/* Left Column: Input Configuration */}
          <div className="lg:col-span-5 space-y-8">
            
            {/* Step 1: Upload */}
            <section>
               <div className="flex items-center justify-between mb-4">
                 <h3 className="text-lg font-semibold text-gray-900">上传照片</h3>
                 {originalImage && (
                    <span className="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        就绪
                    </span>
                 )}
               </div>
               <ImageUploader 
                 currentImage={originalImage} 
                 onImageUpload={handleImageUpload} 
                 onClear={handleClear}
                 disabled={status === 'generating'} 
               />
            </section>

            {/* Step 2: Style Selection (Only visible if image uploaded) */}
            {originalImage && (
              <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 animate-fade-in">
                <StyleSelector 
                  selectedStyle={selectedStyleId}
                  onSelectStyle={setSelectedStyleId}
                  customPrompt={customPrompt}
                  onCustomPromptChange={setCustomPrompt}
                  disabled={status === 'generating'}
                />

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <button
                    onClick={handleGenerate}
                    disabled={status === 'generating'}
                    className={`
                      w-full py-4 px-6 rounded-xl flex items-center justify-center gap-3 text-white font-bold text-lg shadow-lg transition-all duration-200
                      ${status === 'generating' 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-gradient-to-r from-brand-600 to-brand-500 hover:from-brand-500 hover:to-brand-400 hover:shadow-brand-200/50 transform hover:-translate-y-0.5'
                      }
                    `}
                  >
                    {status === 'generating' ? (
                      <>
                        <Loader2 className="w-6 h-6 animate-spin" />
                        正在润色您的形象...
                      </>
                    ) : (
                      <>
                        <Wand2 className="w-6 h-6" />
                        生成头像
                      </>
                    )}
                  </button>
                  {status === 'generating' && (
                    <p className="text-center text-sm text-gray-500 mt-3 animate-pulse">
                      通常需要 5-10 秒。
                    </p>
                  )}
                  {errorMessage && (
                    <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start gap-3 text-red-700">
                      <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                      <p className="text-sm">{errorMessage}</p>
                    </div>
                  )}
                </div>
              </section>
            )}
          </div>

          {/* Right Column: Results */}
          <div className="lg:col-span-7">
            {generatedImage ? (
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                  <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-brand-500" />
                    您的新头像
                  </h3>
                  <div className="flex gap-2">
                    <button 
                      onClick={handleGenerate}
                      className="text-sm text-gray-600 hover:text-brand-600 px-3 py-1.5 rounded-lg hover:bg-white border border-transparent hover:border-gray-200 transition-all flex items-center gap-2"
                    >
                      <RefreshCcw className="w-4 h-4" />
                      重试
                    </button>
                    <button 
                      onClick={downloadImage}
                      className="text-sm bg-brand-600 text-white px-4 py-1.5 rounded-lg hover:bg-brand-700 transition-colors flex items-center gap-2 font-medium shadow-sm"
                    >
                      <Download className="w-4 h-4" />
                      下载
                    </button>
                  </div>
                </div>
                
                <div className="relative aspect-square sm:aspect-[4/3] w-full bg-gray-100 flex items-center justify-center">
                   <img 
                     src={generatedImage} 
                     alt="AI Generated Headshot" 
                     className="w-full h-full object-contain"
                   />
                </div>
                
                <div className="p-6 bg-gray-50">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">使用的提示词：</h4>
                  <p className="text-sm text-gray-600 italic bg-white p-3 rounded border border-gray-200">
                     "Edit this image... {selectedStyleId === 'custom' ? customPrompt : HEADSHOT_STYLES.find(s => s.id === selectedStyleId)?.promptModifier}..."
                  </p>
                </div>
              </div>
            ) : (
              <div className={`
                h-full min-h-[400px] rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 flex flex-col items-center justify-center text-center p-8
                ${!originalImage ? 'opacity-50' : 'opacity-100'}
              `}>
                <div className="bg-white p-6 rounded-full shadow-sm mb-6">
                  <Sparkles className="w-12 h-12 text-brand-200" />
                </div>
                <h3 className="text-xl font-semibold text-gray-400">
                  {originalImage ? "准备生成" : "等待上传..."}
                </h3>
                <p className="text-gray-400 mt-2 max-w-sm">
                  {originalImage 
                    ? "在左侧选择一种风格，然后点击“生成头像”见证奇迹。"
                    : "上传自拍开始。结果将显示在这里。"}
                </p>
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  );
};

export default App;