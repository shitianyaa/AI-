export interface StyleOption {
  id: string;
  name: string;
  description: string;
  promptModifier: string;
  icon: string;
}

export type ProcessingStatus = 'idle' | 'uploading' | 'generating' | 'success' | 'error';

export interface GenerationResult {
  originalImage: string; // Base64
  generatedImage: string | null; // Base64
  promptUsed: string;
}

export const HEADSHOT_STYLES: StyleOption[] = [
  {
    id: 'corporate',
    name: '商务灰背景',
    description: '经典灰色背景，专业西装/西装外套，中性光线。',
    promptModifier: 'Change the background to a professional grey studio backdrop. Change clothing to a dark navy or charcoal business suit. Ensure lighting is even and professional.',
    icon: 'briefcase'
  },
  {
    id: 'tech',
    name: '现代科技风',
    description: '明亮的现代办公室背景，智能休闲装。',
    promptModifier: 'Change the background to a blurred, bright modern tech office with glass walls. Change clothing to smart casual tech industry attire (e.g., high-quality t-shirt with blazer or crisp button-down). Lighting should be bright and airy.',
    icon: 'cpu'
  },
  {
    id: 'outdoor',
    name: '户外自然风',
    description: '柔和的模糊自然背景，自然光线。',
    promptModifier: 'Change the background to a soft-focus outdoor park setting with greenery. Change clothing to professional yet approachable business casual. Use warm, natural golden-hour lighting.',
    icon: 'sun'
  },
  {
    id: 'studio',
    name: '暗调摄影棚',
    description: '戏剧性的深色背景，高对比度光线。',
    promptModifier: 'Change the background to a dark, moody black or dark blue texture. Use dramatic studio lighting (rembrandt style) to highlight facial features. Change clothing to a sleek, dark monochrome outfit.',
    icon: 'camera'
  },
  {
    id: 'custom',
    name: '自定义',
    description: '描述您具体的想法。',
    promptModifier: '', // Handled dynamically
    icon: 'edit'
  }
];