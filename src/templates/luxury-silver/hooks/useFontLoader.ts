import { useEffect } from 'react';
import { WeddingConfig } from './useWeddingConfig';

export const useFontLoader = (config: WeddingConfig) => {
  useEffect(() => {
    if (!config.fonts) return;

    // Apply fonts to CSS variables
    document.documentElement.style.setProperty(
      '--font-heading',
      config.fonts.heading
    );
    
    document.documentElement.style.setProperty(
      '--font-body',
      config.fonts.body
    );
    
    if (config.fonts.script) {
      document.documentElement.style.setProperty(
        '--font-script',
        config.fonts.script
      );
    }
  }, [config.fonts]);
};