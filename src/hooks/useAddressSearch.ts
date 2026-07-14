import { useState, useEffect, useRef } from "react";
import { searchAddressProxy } from "@/lib/planningProxy";

export interface AddressSearchResult {
  place_id: number;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: string[];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
}

export function useAddressSearch(initialQuery = "") {
  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<AddressSearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const cache = useRef<Record<string, AddressSearchResult[]>>({});

  useEffect(() => {
    if (!query || query.trim().length < 2) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    // Debounce search
    const delayDebounceFn = setTimeout(async () => {
      const trimmedQuery = query.trim();
      
      // Check cache first
      if (cache.current[trimmedQuery]) {
        setResults(cache.current[trimmedQuery]);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        const data = await searchAddressProxy({ data: trimmedQuery });
        
        cache.current[trimmedQuery] = data;
        setResults(data);
      } catch (err: any) {
        console.error("Address search error:", err);
        setError(err.message || "Đã xảy ra lỗi khi tìm địa chỉ.");
      } finally {
        setIsLoading(false);
      }
    }, 400); // 400ms debounce to comply with Nominatim usage policy

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return {
    query,
    setQuery,
    results,
    isLoading,
    error,
  };
}
