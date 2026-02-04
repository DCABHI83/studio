"use client";

import { useState, useEffect, Dispatch, SetStateAction } from 'react';

// This function safely gets a value from localStorage, handling potential
// issues like server-side rendering or parsing errors.
function getStorageValue<T>(key: string, initialValue: T): T {
  // Prevent execution on the server.
  if (typeof window === 'undefined') {
    return initialValue;
  }
  try {
    const item = window.localStorage.getItem(key);
    // Parse stored json or return initialValue if it doesn't exist.
    return item ? JSON.parse(item) : initialValue;
  } catch (error) {
    console.log(error);
    return initialValue;
  }
}

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  // Use a lazy initializer with useState to read from localStorage only once.
  const [storedValue, setStoredValue] = useState<T>(() => {
    return getStorageValue(key, initialValue);
  });

  // This effect runs only when the storedValue changes, updating localStorage.
  useEffect(() => {
    // Prevent execution on the server.
    if (typeof window !== 'undefined') {
      try {
        window.localStorage.setItem(key, JSON.stringify(storedValue));
      } catch (error) {
        console.log(error);
      }
    }
  }, [key, storedValue]);


  return [storedValue, setStoredValue];
}
export default useLocalStorage;
