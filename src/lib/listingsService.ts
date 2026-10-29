import { ListingItem, sampleListings } from "@/data/listingsData";
import { supabase } from "@/integrations/supabase/client";

/**
 * Converts a database or mock_properties row into a unified ListingItem format
 */
export function propertyRowToListingItem(p: any): ListingItem {
  const isRent =
    (p.listing_type || "").toLowerCase().includes("thuê") ||
    p.listing_type === "rent";

  const imgs: string[] =
    Array.isArray(p.images) && p.images.length > 0
      ? p.images
      : p.image_url
      ? [p.image_url]
      : ["https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&auto=format&fit=crop&q=60"];

  let category: "land" | "house" | "apartment" | "villa" = "apartment";
  const pType = (p.property_type || "").toLowerCase();
  if (pType.includes("đất")) category = "land";
  else if (pType.includes("biệt thự") || pType.includes("villa")) category = "villa";
  else if (pType.includes("nhà")) category = "house";
  else category = "apartment";

  // Parse numeric price if not directly available
  let numPrice = p.price;
  if (!numPrice && p.price_label) {
    const matched = String(p.price_label).match(/([\d\.,]+)/);
    if (matched) {
      numPrice = parseFloat(matched[1].replace(",", "."));
    }
  }

  return {
    id: p.id,
    title: p.title,
    slug: p.slug,
    listingType: isRent ? "rent" : "sale",
    category,
    price: numPrice || 0,
    priceLabel: p.price_label || (isRent ? "Thỏa thuận" : "Thỏa thuận"),
    pricePerM2:
      p.area && numPrice && !isRent
        ? `${Math.round((numPrice * 1000) / p.area)} tr/m²`
        : undefined,
    area: Number(p.area) || 0,
    location: p.address || (p.district ? `Quận ${p.district}, Đà Nẵng` : "Đà Nẵng"),
    district: p.district || "Hải Châu",
    city: "Đà Nẵng",
    images: imgs,
    description: p.description || p.excerpt || "Chưa có mô tả chi tiết cho bất động sản này.",
    directions: p.direction || "Đông Nam",
    bedrooms: Number(p.bedrooms) || 0,
    bathrooms: Number(p.bathrooms) || 0,
    legal: p.legal_status || "Sổ hồng / Sổ đỏ",
    brokerName: "Ban Quản Trị Da Nang Realty",
    brokerAvatar: "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&auto=format&fit=crop&q=80",
    brokerPhone: "0905 123 456",
    createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString("vi-VN") : "Mới đăng",
    isVip: true,
    isOwner: true,
  };
}

/**
 * Synchronously retrieves all properties from LocalStorage (mock_properties) merged with sampleListings
 */
export function getLocalAndSampleListings(listingTypeOverride?: "sale" | "rent"): ListingItem[] {
  let dbListings: ListingItem[] = [];

  if (typeof window !== "undefined") {
    try {
      const stored = localStorage.getItem("mock_properties");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          dbListings = parsed
            .filter((p) => p.published !== false)
            .map(propertyRowToListingItem);
        }
      }
    } catch (e) {
      console.warn("Could not parse mock_properties from localStorage", e);
    }
  }

  // Combine DB listings (newest first) + sample listings (deduplicate by slug or id)
  const allMap = new Map<string, ListingItem>();
  
  // First insert DB listings so they take priority
  for (const item of dbListings) {
    allMap.set(item.slug || item.id, item);
  }

  // Then add sampleListings if not already in map
  for (const item of sampleListings) {
    if (!allMap.has(item.slug) && !allMap.has(item.id)) {
      allMap.set(item.slug, item);
    }
  }

  let result = Array.from(allMap.values());

  if (listingTypeOverride) {
    result = result.filter((item) => item.listingType === listingTypeOverride);
  }

  return result;
}

/**
 * Finds a single listing by its slug (checks LocalStorage DB first, then sampleListings)
 */
export function findListingBySlug(slug: string, listingTypeOverride?: "sale" | "rent"): ListingItem | null {
  const all = getLocalAndSampleListings(listingTypeOverride);
  const found = all.find((item) => item.slug === slug);
  return found || null;
}
