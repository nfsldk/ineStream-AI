import React, { useState, useEffect } from 'react';
// import { getDoubanPoster } from '../services/vodService.ts';

const FALLBACK_IMG = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 300 450' style='background:%23111827'%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%23374151' font-family='sans-serif' font-size='24' font-weight='bold'%3ECineStream%3C/text%3E%3C/svg%3E";

const CACHE_PREFIX = 'poster_cache_v2_';

interface ImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  searchKeyword?: string;
}

const ImageWithFallback: React.FC<ImageProps> = ({ src, alt, className, searchKeyword, ...props }) => {
  const [imgSrc, setImgSrc] = useState<string>(FALLBACK_IMG);
  const [retryStage, setRetryStage] = useState(0); 

  useEffect(() => {
    let url = src?.trim();
    
    if (!url) {
      if (searchKeyword) {
          setImgSrc(FALLBACK_IMG);
          setRetryStage(2);
          (window as any).getDoubanPoster(searchKeyword).then((newUrl: string) => {
              if (newUrl) {
                  const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(newUrl)}&output=webp`;
                  setImgSrc(proxyUrl);
              } else {
                  setRetryStage(3);
              }
          });
          return;
      }
      setImgSrc(FALLBACK_IMG);
      setRetryStage(3);
      return;
    }
    
    if (url.startsWith('//')) {
      url = 'https:' + url;
    }

    const cached = localStorage.getItem(CACHE_PREFIX + url);
    if (cached) {
        setImgSrc(cached);
        if (cached.includes('wsrv.nl')) {
            setRetryStage(1);
        } else {
            setRetryStage(0);
        }
        return;
    }

    if (url.includes('doubanio.com')) {
        const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
        setImgSrc(proxyUrl);
        setRetryStage(1); 
        return;
    }

    if (url.startsWith('http:')) {
        const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=webp`;
        setImgSrc(proxyUrl);
        setRetryStage(1);
        return;
    }

    setImgSrc(url);
    setRetryStage(0);

  }, [src, searchKeyword]);

  const handleError = () => {
    let originalUrl = src?.trim() || '';
    if (originalUrl.startsWith('//')) originalUrl = 'https:' + originalUrl;

    if (originalUrl) {
        localStorage.removeItem(CACHE_PREFIX + originalUrl);
    }

    if (retryStage === 0 && originalUrl) {
      const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(originalUrl)}&output=webp`;
      setImgSrc(proxyUrl);
      setRetryStage(1);
    } else if (retryStage === 1) {
      if (searchKeyword) {
          setRetryStage(2);
          (window as any).getDoubanPoster(searchKeyword).then((newUrl: string) => {
              if (newUrl) {
                  const proxyUrl = `https://wsrv.nl/?url=${encodeURIComponent(newUrl)}&output=webp`;
                  setImgSrc(proxyUrl);
              } else {
                  setImgSrc(FALLBACK_IMG);
                  setRetryStage(3);
              }
          });
      } else {
          setImgSrc(FALLBACK_IMG);
          setRetryStage(3);
      }
    } else {
      if (retryStage !== 3) {
          setImgSrc(FALLBACK_IMG);
          setRetryStage(3);
      }
    }
  };

  const handleLoad = () => {
      if (imgSrc !== FALLBACK_IMG && src) {
          let originalUrl = src.trim();
          if (originalUrl.startsWith('//')) originalUrl = 'https:' + originalUrl;
          try {
              localStorage.setItem(CACHE_PREFIX + originalUrl, imgSrc);
          } catch (e) {
              console.warn('Poster cache full');
          }
      }
  };

  return (
    <img 
      src={imgSrc} 
      alt={alt || "Poster"} 
      className={`${className} ${imgSrc === FALLBACK_IMG ? 'opacity-50 grayscale p-4 bg-gray-900' : 'bg-gray-800'}`}
      onError={handleError}
      onLoad={handleLoad}
      referrerPolicy="no-referrer" 
      loading="lazy"
      {...props} 
    />
  );
};

(window as any).ImageWithFallback = ImageWithFallback;