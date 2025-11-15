import { useEffect, useState } from 'react';

interface FontConfig {
  heading: string;
  body: string;
  script: string;
  elegant: string;
}

export const useFontLoader = () => {
  const [fontsLoaded, setFontsLoaded] = useState(false);
  const [fontConfig] = useState<FontConfig>({
    heading: 'Libre Baskerville, serif',
    body: 'Montserrat, sans-serif',
    script: 'Great Vibes, cursive',
    elegant: 'Cormorant Garamond, serif'
  });

  useEffect(() => {
    const loadFonts = async () => {
      try {
        // Create link elements for Google Fonts
        const fontLinks = [
          'https://fonts.googleapis.com/css2?family=Libre+Baskerville:wght@400;700&display=swap',
          'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700;800&display=swap',
          'https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap',
          'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600;700&display=swap'
        ];

        fontLinks.forEach(fontUrl => {
          const link = document.createElement('link');
          link.rel = 'stylesheet';
          link.href = fontUrl;
          document.head.appendChild(link);
        });

        // Set CSS variables
        const root = document.documentElement;
        root.style.setProperty('--font-heading', fontConfig.heading);
        root.style.setProperty('--font-body', fontConfig.body);
        root.style.setProperty('--font-script', fontConfig.script);
        root.style.setProperty('--font-elegant', fontConfig.elegant);

        // Wait for fonts to load
        if ('fonts' in document) {
          const fonts = await Promise.all([
            document.fonts.load('400px Libre Baskerville'),
            document.fonts.load('700px Libre Baskerville'),
            document.fonts.load('400px Montserrat'),
            document.fonts.load('700px Montserrat'),
            document.fonts.load('400px Great Vibes'),
            document.fonts.load('400px Cormorant Garamond')
          ]);
          
          if (fonts.every(font => font.length > 0)) {
            setFontsLoaded(true);
          }
        } else {
          // Fallback for browsers that don't support the Font Loading API
          setTimeout(() => {
            setFontsLoaded(true);
          }, 1000);
        }
      } catch (error) {
        console.warn('Error loading fonts:', error);
        setFontsLoaded(true); // Continue even if fonts fail to load
      }
    };

    loadFonts();
  }, [fontConfig]);

  return { fontsLoaded, fontConfig };
};