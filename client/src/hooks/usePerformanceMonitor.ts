import React, { useEffect, useRef, useCallback } from 'react';

interface PerformanceMetrics {
  renderTime: number;
  memoryUsage?: number;
  componentName: string;
  timestamp: number;
}

interface UsePerformanceMonitorOptions {
  componentName: string;
  enabled?: boolean;
  threshold?: number; // Log only if render time exceeds threshold (ms)
  onMetrics?: (metrics: PerformanceMetrics) => void;
}

export const usePerformanceMonitor = ({
  componentName,
  enabled = process.env.NODE_ENV === 'development',
  threshold = 16, // 16ms = 60fps threshold
  onMetrics,
}: UsePerformanceMonitorOptions) => {
  const renderStartTime = useRef<number>(0);
  const renderCount = useRef<number>(0);
  const totalRenderTime = useRef<number>(0);

  const startMeasurement = useCallback(() => {
    if (!enabled) return;
    renderStartTime.current = performance.now();
  }, [enabled]);

  const endMeasurement = useCallback(() => {
    if (!enabled || renderStartTime.current === 0) return;

    const renderTime = performance.now() - renderStartTime.current;
    renderCount.current += 1;
    totalRenderTime.current += renderTime;

    const metrics: PerformanceMetrics = {
      renderTime,
      componentName,
      timestamp: Date.now(),
    };

    // Add memory usage if available
    if ('memory' in performance) {
      const memory = (performance as any).memory;
      metrics.memoryUsage = memory.usedJSHeapSize;
    }

    // Log performance issues
    if (renderTime > threshold) {
      console.warn(
        `🐌 Slow render detected in ${componentName}:`,
        `${renderTime.toFixed(2)}ms (threshold: ${threshold}ms)`
      );
    }

    // Call custom metrics handler
    onMetrics?.(metrics);

    renderStartTime.current = 0;
  }, [enabled, threshold, componentName, onMetrics]);

  const getAverageRenderTime = useCallback(() => {
    return renderCount.current > 0 ? totalRenderTime.current / renderCount.current : 0;
  }, []);

  const resetMetrics = useCallback(() => {
    renderCount.current = 0;
    totalRenderTime.current = 0;
  }, []);

  useEffect(() => {
    startMeasurement();
    return endMeasurement;
  });

  return {
    startMeasurement,
    endMeasurement,
    getAverageRenderTime,
    resetMetrics,
    renderCount: renderCount.current,
  };
};

// Hook for measuring async operations
export const useAsyncPerformance = () => {
  const measureAsync = useCallback(async <T>(
    operation: () => Promise<T>,
    operationName: string
  ): Promise<T> => {
    const startTime = performance.now();
    
    try {
      const result = await operation();
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.log(`⚡ ${operationName} completed in ${duration.toFixed(2)}ms`);
      }
      
      return result;
    } catch (error) {
      const endTime = performance.now();
      const duration = endTime - startTime;
      
      if (process.env.NODE_ENV === 'development') {
        console.error(`❌ ${operationName} failed after ${duration.toFixed(2)}ms:`, error);
      }
      
      throw error;
    }
  }, []);

  return { measureAsync };
};

// Hook for performance-aware component updates
export const useOptimizedUpdates = <T>(
  value: T,
  updateThreshold: number = 16 // Only update if enough time has passed
) => {
  const lastUpdateTime = useRef<number>(0);
  const pendingValue = useRef<T>(value);
  const [optimizedValue, setOptimizedValue] = React.useState<T>(value);

  useEffect(() => {
    const now = performance.now();
    pendingValue.current = value;

    if (now - lastUpdateTime.current >= updateThreshold) {
      setOptimizedValue(value);
      lastUpdateTime.current = now;
    } else {
      // Debounce rapid updates
      const timeout = setTimeout(() => {
        setOptimizedValue(pendingValue.current);
        lastUpdateTime.current = performance.now();
      }, updateThreshold);

      return () => clearTimeout(timeout);
    }
  }, [value, updateThreshold]);

  return optimizedValue;
};

// Hook for Web Vitals monitoring
export const useWebVitals = (onMetric?: (metric: any) => void) => {
  useEffect(() => {
    if (typeof window === 'undefined' || !onMetric) return;

    // Dynamically import web-vitals to avoid SSR issues
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onMetric);
      getFID(onMetric);
      getFCP(onMetric);
      getLCP(onMetric);
      getTTFB(onMetric);
    }).catch(console.error);
  }, [onMetric]);
};

// Hook for bundle size analysis in development
export const useBundleAnalysis = () => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    // Analyze loaded modules
    const analyzeBundle = () => {
      const scripts = Array.from(document.scripts);
      const totalSize = scripts.reduce((acc, script) => {
        if (script.src) {
          // This is an approximation - in a real implementation,
          // you'd want to use actual bundle analysis tools
          return acc + (script.src.length * 100); // Rough estimate
        }
        return acc;
      }, 0);

      console.log(`📦 Estimated bundle size: ~${(totalSize / 1024).toFixed(2)}KB`);
    };

    // Run analysis after a delay to ensure all scripts are loaded
    const timeout = setTimeout(analyzeBundle, 2000);
    return () => clearTimeout(timeout);
  }, []);
};