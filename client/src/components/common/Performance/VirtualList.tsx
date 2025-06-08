import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Box, useTheme } from '@mui/material';

interface VirtualListProps<T> {
  items: T[];
  height: number; // Container height
  itemHeight: number | ((index: number) => number); // Fixed or dynamic item height
  renderItem: (item: T, index: number) => React.ReactNode;
  overscan?: number; // Number of items to render outside viewport
  onScroll?: (scrollTop: number) => void;
  className?: string;
  style?: React.CSSProperties;
}

function VirtualList<T>({
  items,
  height,
  itemHeight,
  renderItem,
  overscan = 5,
  onScroll,
  className,
  style,
}: VirtualListProps<T>) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollElementRef = useRef<HTMLDivElement>(null);
  const theme = useTheme();

  const getItemHeight = useCallback(
    (index: number): number => {
      return typeof itemHeight === 'function' ? itemHeight(index) : itemHeight;
    },
    [itemHeight]
  );

  // Calculate cumulative heights for dynamic item heights
  const itemOffsets = useMemo(() => {
    const offsets = [0];
    for (let i = 0; i < items.length; i++) {
      offsets.push(offsets[i] + getItemHeight(i));
    }
    return offsets;
  }, [items.length, getItemHeight]);

  const totalHeight = itemOffsets[items.length] || 0;

  // Find start and end indices for visible items
  const { startIndex, endIndex } = useMemo(() => {
    if (typeof itemHeight === 'number') {
      // Fixed height calculation (more efficient)
      const start = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
      const visibleCount = Math.ceil(height / itemHeight);
      const end = Math.min(items.length - 1, start + visibleCount + overscan * 2);
      return { startIndex: start, endIndex: end };
    } else {
      // Dynamic height calculation
      let start = 0;
      let end = items.length - 1;

      // Binary search for start index
      let low = 0;
      let high = items.length - 1;
      while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (itemOffsets[mid] <= scrollTop) {
          start = mid;
          low = mid + 1;
        } else {
          high = mid - 1;
        }
      }

      // Find end index
      const visibleBottom = scrollTop + height;
      for (let i = start; i < items.length; i++) {
        if (itemOffsets[i] >= visibleBottom) {
          end = i;
          break;
        }
      }

      return {
        startIndex: Math.max(0, start - overscan),
        endIndex: Math.min(items.length - 1, end + overscan),
      };
    }
  }, [scrollTop, height, itemHeight, items.length, overscan, itemOffsets]);

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const newScrollTop = e.currentTarget.scrollTop;
      setScrollTop(newScrollTop);
      onScroll?.(newScrollTop);
    },
    [onScroll]
  );

  // Get offset for the first visible item
  const offsetY = useMemo(() => {
    if (typeof itemHeight === 'number') {
      return startIndex * itemHeight;
    } else {
      return itemOffsets[startIndex] || 0;
    }
  }, [startIndex, itemHeight, itemOffsets]);

  // Render visible items
  const visibleItems = useMemo(() => {
    const items_to_render = [];
    for (let i = startIndex; i <= endIndex; i++) {
      if (i >= 0 && i < items.length) {
        const item = items[i];
        const top = typeof itemHeight === 'number' 
          ? i * itemHeight - offsetY
          : (itemOffsets[i] || 0) - offsetY;

        items_to_render.push(
          <div
            key={i}
            style={{
              position: 'absolute',
              top,
              left: 0,
              right: 0,
              height: getItemHeight(i),
            }}
          >
            {renderItem(item, i)}
          </div>
        );
      }
    }
    return items_to_render;
  }, [startIndex, endIndex, items, itemHeight, offsetY, renderItem, getItemHeight, itemOffsets]);

  return (
    <div
      ref={scrollElementRef}
      className={className}
      style={{
        height,
        overflow: 'auto',
        position: 'relative',
        ...style,
      }}
      onScroll={handleScroll}
    >
      {/* Total height spacer */}
      <div style={{ height: totalHeight, position: 'relative' }}>
        {/* Visible items container */}
        <div
          style={{
            transform: `translateY(${offsetY}px)`,
            position: 'relative',
            height: '100%',
          }}
        >
          {visibleItems}
        </div>
      </div>
    </div>
  );
}

export default VirtualList;