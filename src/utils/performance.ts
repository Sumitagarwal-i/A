// Performance monitoring utilities
export const performanceUtils = {
  // Track Core Web Vitals
  trackWebVitals() {
    if ('PerformanceObserver' in window) {
      // Track LCP (Largest Contentful Paint)
      const lcpObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        
        // Send to analytics if needed
        if (lastEntry.startTime > 2500) {
          console.warn('LCP is too slow:', lastEntry.startTime);
        }
      });
      lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });

      // Track FID (First Input Delay)
      const fidObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if ('processingStart' in entry) {
            // @ts-ignore
          }
        });
      });
      fidObserver.observe({ entryTypes: ['first-input'] });

      // Track CLS (Cumulative Layout Shift)
      const clsObserver = new PerformanceObserver((list) => {
        let clsValue = 0;
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (!entry.hadRecentInput) {
            clsValue += entry.value;
          }
        });
      });
      clsObserver.observe({ entryTypes: ['layout-shift'] });
    }
  },

  // Track resource loading performance
  trackResourceTiming() {
    if ('PerformanceObserver' in window) {
      const resourceObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.initiatorType === 'img' && entry.duration > 1000) {
            console.warn('Slow image load:', entry.name, entry.duration);
          }
        });
      });
      resourceObserver.observe({ entryTypes: ['resource'] });
    }
  },

  // Preload critical resources
  preloadCriticalResources() {
    const criticalImages = [
      '/ChatGPT Image Jul 3, 2025, 06_37_50 PM.png',
      '/ChatGPT Image Jul 3, 2025, 06_33_42 PM.png',
      '/ChatGPT Image Jul 3, 2025, 06_37_50 PM.webp',
      '/ChatGPT Image Jul 3, 2025, 06_33_42 PM.webp'
    ];

    criticalImages.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'image';
      link.href = src;
      document.head.appendChild(link);
    });
  },

  // Initialize all performance tracking
  init() {
    this.trackWebVitals();
    this.trackResourceTiming();
    this.preloadCriticalResources();
  }
}; 