# useDebounce Hook

A generic TypeScript hook for performance optimization that debounces any value type with configurable delay.

## Location
`client/src/hooks/useDebounce.ts`

## Overview

The `useDebounce` hook delays updating a value until a specified time has passed without the value changing. This is particularly useful for search inputs, API calls, and any scenario where you want to reduce the frequency of expensive operations.

## Hook Definition

```typescript
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
```

## Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `value` | `T` | The value to debounce (generic type) |
| `delay` | `number` | Delay in milliseconds before updating |

## Returns

- `T` - The debounced value of the same type as input

## Features

- **Generic Type Support**: Works with any data type
- **Performance Optimized**: Reduces unnecessary operations
- **Memory Safe**: Proper cleanup of timeouts
- **TypeScript Strict**: Full type safety
- **Flexible Delay**: Configurable debounce timing

## Use Cases

### 1. Search Input Optimization

```tsx
import { useState } from 'react';
import { useDebounce } from '@/hooks/useDebounce';

const SearchComponent = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      // API call only happens 300ms after user stops typing
      searchAPI(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);

  return (
    <TextField
      value={searchTerm}
      onChange={(e) => setSearchTerm(e.target.value)}
      placeholder="Search..."
    />
  );
};
```

### 2. API Call Optimization

```tsx
const DataFetcher = () => {
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    dateRange: null
  });
  
  const debouncedFilters = useDebounce(filters, 500);

  useEffect(() => {
    // API call happens only after filters stabilize for 500ms
    fetchData(debouncedFilters);
  }, [debouncedFilters]);

  return (
    // Filter controls that update filters state
    <FilterControls onFiltersChange={setFilters} />
  );
};
```

### 3. Window Resize Optimization

```tsx
const ResponsiveComponent = () => {
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight
  });
  
  const debouncedWindowSize = useDebounce(windowSize, 250);

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    // Expensive layout calculations only after resize stops
    calculateLayout(debouncedWindowSize);
  }, [debouncedWindowSize]);

  return <div>Responsive content</div>;
};
```

### 4. Form Validation

```tsx
const FormComponent = () => {
  const [formData, setFormData] = useState({
    email: '',
    username: '',
    password: ''
  });
  
  const debouncedFormData = useDebounce(formData, 400);

  useEffect(() => {
    // Validation only happens after user stops typing
    validateForm(debouncedFormData);
  }, [debouncedFormData]);

  return (
    <form>
      {/* Form inputs */}
    </form>
  );
};
```

## Advanced Usage

### Multiple Debounced Values

```tsx
const AdvancedSearch = () => {
  const [query, setQuery] = useState('');
  const [filters, setFilters] = useState({});
  const [sortOptions, setSortOptions] = useState({});

  // Different debounce delays for different types of input
  const debouncedQuery = useDebounce(query, 300);      // Fast for search
  const debouncedFilters = useDebounce(filters, 500);   // Medium for filters
  const debouncedSort = useDebounce(sortOptions, 100);  // Fast for sorting

  useEffect(() => {
    searchWithParams({
      query: debouncedQuery,
      filters: debouncedFilters,
      sort: debouncedSort
    });
  }, [debouncedQuery, debouncedFilters, debouncedSort]);
};
```

### Type-Safe Object Debouncing

```tsx
interface SearchParams {
  term: string;
  category: string;
  priceRange: [number, number];
  inStock: boolean;
}

const TypedSearch = () => {
  const [searchParams, setSearchParams] = useState<SearchParams>({
    term: '',
    category: 'all',
    priceRange: [0, 1000],
    inStock: false
  });

  const debouncedParams = useDebounce<SearchParams>(searchParams, 400);

  useEffect(() => {
    // TypeScript ensures type safety
    performSearch(debouncedParams);
  }, [debouncedParams]);
};
```

## Performance Benefits

### Before Debouncing
```
User types "React"
- API call for "R"
- API call for "Re"  
- API call for "Rea"
- API call for "Reac"
- API call for "React"
Result: 5 API calls
```

### After Debouncing (300ms)
```
User types "React"
- Timer starts for "R"
- Timer resets for "Re"
- Timer resets for "Rea"
- Timer resets for "Reac"
- Timer resets for "React"
- After 300ms of no changes: API call for "React"
Result: 1 API call
```

## Best Practices

### 1. Choose Appropriate Delays
```typescript
// Search inputs: 200-400ms
const debouncedSearch = useDebounce(searchTerm, 300);

// Form validation: 400-600ms
const debouncedForm = useDebounce(formData, 500);

// Window resize: 200-300ms
const debouncedResize = useDebounce(windowSize, 250);

// API filters: 400-800ms
const debouncedFilters = useDebounce(filters, 600);
```

### 2. Combine with Loading States
```tsx
const SearchWithLoading = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    if (debouncedSearchTerm) {
      setIsLoading(true);
      searchAPI(debouncedSearchTerm)
        .finally(() => setIsLoading(false));
    }
  }, [debouncedSearchTerm]);

  return (
    <Box>
      <TextField 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      {isLoading && <CircularProgress />}
    </Box>
  );
};
```

### 3. Memory Optimization
The hook automatically cleans up timers, but for complex objects:

```tsx
// For large objects, consider memoization
const expensiveObject = useMemo(() => ({
  // ... complex calculation
}), [dependencies]);

const debouncedObject = useDebounce(expensiveObject, 500);
```

## Browser Compatibility

- **Modern Browsers**: Full support
- **IE11+**: Supported with React polyfills
- **Mobile**: Optimized for touch interactions
- **Node.js**: Compatible for SSR applications

## Testing

```typescript
// Test example
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

test('debounces value changes', async () => {
  const { result, rerender } = renderHook(
    ({ value, delay }) => useDebounce(value, delay),
    { initialProps: { value: 'initial', delay: 100 } }
  );

  expect(result.current).toBe('initial');

  // Update value
  rerender({ value: 'updated', delay: 100 });
  expect(result.current).toBe('initial'); // Still old value

  // Wait for debounce
  await act(async () => {
    await new Promise(resolve => setTimeout(resolve, 150));
  });
  
  expect(result.current).toBe('updated'); // Now updated
});
```