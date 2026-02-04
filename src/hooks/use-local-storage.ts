"use client";

import { useState, useEffect, Dispatch, SetStateAction, useRef } from 'react';

function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const isMounted = useRef(false);

  // Effect to read from localStorage on initial client render
  useEffect(() => {
    try {
      const item = window.localStorage.getItem(key);
      if (item) {
        setStoredValue(JSON.parse(item));
      }
    } catch (error) {
      console.log(error);
    }
    // Set mounted to true after initial read attempt
    isMounted.current = true;
  // We only want to run this on the first client render
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  // Effect to update localStorage when state changes
  useEffect(() => {
    // Only run this effect after the component has mounted
    if (isMounted.current) {
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
