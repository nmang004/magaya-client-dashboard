import React, { useState, useRef, useEffect } from 'react';
import { Box, Skeleton, useTheme, alpha } from '@mui/material';
import { motion } from 'framer-motion';

interface LazyImageProps {
  src: string;
  alt: string;
  width?: number | string;
  height?: number | string;
  placeholder?: string;
  blurhash?: string;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: () => void;
  onError?: () => void;
  priority?: boolean; // For above-the-fold images
  quality?: number; // For future optimization
  sizes?: string; // Responsive image sizes
  srcSet?: string; // Responsive image sources
}

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  width = '100%',
  height = 'auto',
  placeholder,
  blurhash,
  className,
  style,
  onLoad,
  onError,
  priority = false,
  quality = 85,
  sizes,
  srcSet,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority); // Load immediately if priority
  const [hasError, setHasError] = useState(false);
  const [imageSrc, setImageSrc] = useState<string>('');
  const imgRef = useRef<HTMLImageElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  // Intersection Observer for lazy loading
  useEffect(() => {
    if (priority) return; // Skip observer for priority images

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  // Load image when in view
  useEffect(() => {
    if (isInView && src && !imageSrc) {
      // For now, use the original src. In the future, this could be optimized
      // with a service like Cloudinary or custom image optimization
      setImageSrc(src);
    }
  }, [isInView, src, imageSrc]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  const containerStyles = {
    width,
    height,
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: alpha(theme.palette.grey[300], 0.3),
    borderRadius: theme.shape.borderRadius,
    ...style,
  } as const;

  return (
    <Box
      ref={containerRef}
      sx={containerStyles}
      className={className}
    >
      {/* Placeholder/Skeleton */}
      {!isLoaded && !hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {placeholder ? (
            <img
              src={placeholder}
              alt=""
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: 'blur(2px)',
                transform: 'scale(1.1)', // Slightly larger to hide blur edges
              }}
            />
          ) : (
            <Skeleton
              variant="rectangular"
              width="100%"
              height="100%"
              animation="wave"
              sx={{
                transform: 'none', // Remove default transform
              }}
            />
          )}
        </Box>
      )}

      {/* Error State */}
      {hasError && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: alpha(theme.palette.grey[200], 0.5),
            color: theme.palette.text.secondary,
            fontSize: '0.75rem',
          }}
        >
          Failed to load image
        </Box>
      )}

      {/* Actual Image */}
      {imageSrc && !hasError && (
        <motion.img
          ref={imgRef}
          src={imageSrc}
          srcSet={srcSet}
          sizes={sizes}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            zIndex: 1,
          }}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      )}
    </Box>
  );
};

export default LazyImage;