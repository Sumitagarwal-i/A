interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  priority?: boolean;
}

export function OptimizedImage({ 
  src, 
  alt, 
  className = "", 
  width, 
  height, 
  priority = false 
}: OptimizedImageProps) {
  // Convert PNG to WebP for better compression
  const webpSrc = src.replace(/\.png$/, '.webp');
  
  return (
    <picture>
      {/* WebP format for modern browsers */}
      <source srcSet={webpSrc} type="image/webp" />
      {/* Fallback to original format */}
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        style={{ 
          width: width ? `${width}px` : 'auto',
          height: height ? `${height}px` : 'auto'
        }}
      />
    </picture>
  );
} 