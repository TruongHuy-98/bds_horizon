import { useMemo } from "react";
import { ListingItem } from "@/data/listingsData";
import { FilterState } from "@/components/listings/ListingFilterBar";

/**
 * Remove Vietnamese diacritics / accents for flexible search
 */
export function removeAccents(str: string): string {
  if (!str) return "";
  return str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase();
}

/**
 * Custom hook to filter listings based on client-side state
 */
export function useFilteredListings(
  listings: ListingItem[],
  filters: FilterState,
  listingTypeOverride?: "sale" | "rent"
) {
  return useMemo(() => {
    let result = [...listings];

    // Filter by sale/rent type
    if (listingTypeOverride) {
      result = result.filter((item) => item.listingType === listingTypeOverride);
    }

    // 1. Keyword search (case insensitive & accent insensitive)
    if (filters.keyword && filters.keyword.trim()) {
      const normKw = removeAccents(filters.keyword.trim());
      result = result.filter((item) => {
        const normTitle = removeAccents(item.title);
        const normDesc = removeAccents(item.description);
        const normLoc = removeAccents(item.location);
        const normDistrict = removeAccents(item.district);
        return (
          normTitle.includes(normKw) ||
          normDesc.includes(normKw) ||
          normLoc.includes(normKw) ||
          normDistrict.includes(normKw)
        );
      });
    }

    // 2. District filter (supports both exact string and slug)
    if (filters.district && filters.district !== "all") {
      const normTarget = removeAccents(filters.district);
      result = result.filter((item) => {
        const normDist = removeAccents(item.district);
        return normDist.includes(normTarget) || normTarget.includes(normDist);
      });
    }

    // 3. Property Category / Type filter
    if (filters.category && filters.category !== "all") {
      const cat = filters.category.toLowerCase();
      result = result.filter((item) => {
        if (cat === "land" || cat === "dat-nen" || cat === "dat") return item.category === "land";
        if (cat === "house" || cat === "nha-rieng" || cat === "town") return item.category === "house";
        if (cat === "villa" || cat === "biet-thu") return item.category === "villa";
        if (cat === "apartment" || cat === "can-ho" || cat === "apt") return item.category === "apartment";
        return item.category === cat;
      });
    }

    // 4. Price range filter
    if (filters.priceRange && filters.priceRange !== "all") {
      const p = filters.priceRange;
      result = result.filter((item) => {
        const price = item.price; // numerical value
        if (p === "under-1" || p === "1") return price < 1;
        if (p === "1-2") return price >= 1 && price <= 2;
        if (p === "2-3") return price >= 2 && price <= 3;
        if (p === "3-5") return price >= 3 && price <= 5;
        if (p === "over-5") return price > 5;
        if (p === "under-2" || p === "2") return price < 2;
        if (p === "2-5" || p === "3") return price >= 2 && price <= 5;
        if (p === "5-10" || p === "4") return price >= 5 && price <= 10;
        if (p === "over-10") return price > 10;
        return true;
      });
    }

    // 5. Area range filter
    if (filters.areaRange && filters.areaRange !== "all") {
      const a = filters.areaRange;
      result = result.filter((item) => {
        const area = item.area;
        if (a === "under-30") return area < 30;
        if (a === "30-50") return area >= 30 && area <= 50;
        if (a === "50-80") return area >= 50 && area <= 80;
        if (a === "80-100") return area >= 80 && area <= 100;
        if (a === "over-100") return area > 100;
        if (a === "under-50") return area < 50;
        if (a === "50-100") return area >= 50 && area <= 100;
        if (a === "100-200") return area >= 100 && area <= 200;
        if (a === "over-200") return area > 200;
        return true;
      });
    }

    // 6. Direction filter
    if (filters.direction && filters.direction !== "all") {
      result = result.filter((item) => item.directions === filters.direction);
    }

    // 7. Bedrooms filter
    if (filters.bedrooms && filters.bedrooms !== "all") {
      const minBeds = parseInt(filters.bedrooms, 10);
      result = result.filter((item) => (item.bedrooms || 0) >= minBeds);
    }

    return result;
  }, [listings, filters, listingTypeOverride]);
}
