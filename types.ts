
export enum AspectRatio {
  SQ = '1:1',
  LANDSCAPE = '4:3',
  WIDE = '16:9',
  PORTRAIT = '3:4',
  TALL = '9:16'
}

export enum ImageSize {
  K1 = '1K',
  K2 = '2K',
  K4 = '4K'
}

export enum ModelType {
  FLASH = 'gemini-2.5-flash-image',
  PRO = 'gemini-3-pro-image-preview'
}

export interface GeneratedImage {
  id: string;
  url: string;
  prompt: string;
  timestamp: number;
  config: {
    model: ModelType;
    aspectRatio: AspectRatio;
    imageSize?: ImageSize;
  };
}

export interface GenerationConfig {
  prompt: string;
  model: ModelType;
  aspectRatio: AspectRatio;
  imageSize: ImageSize;
}
