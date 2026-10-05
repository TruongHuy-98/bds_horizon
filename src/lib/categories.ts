import { supabase } from "@/integrations/supabase/client";
import { slugify } from "@/lib/utils";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parent_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export const DEFAULT_CATEGORIES: CategoryItem[] = [
  {
    id: "cat-phap-ly",
    name: "Pháp lý",
    slug: "phap-ly",
    description: "Tư vấn hồ sơ, sổ đỏ, quy hoạch, tranh chấp và pháp lý bất động sản chuyên sâu.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-thi-truong",
    name: "Thị trường BĐS",
    slug: "thi-truong-bds",
    description: "Bản tin thị trường bất động sản Đà Nẵng và miền Trung.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-quy-hoach",
    name: "Quy hoạch & Pháp lý",
    slug: "quy-hoach-phap-ly",
    description: "Thông tin quy hoạch đô thị, phân khu và chỉ giới hạ tầng.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-du-an",
    name: "Dự án",
    slug: "du-an",
    description: "Cập nhật tiến độ các dự án căn hộ, biệt thự và đất nền.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-loi-khuyen",
    name: "Lời khuyên mua nhà",
    slug: "loi-khuyen-mua-nha",
    description: "Cẩm nang chọn mua, định giá và thương lượng bất động sản an toàn.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "cat-tien-do",
    name: "Tiến độ Hạ tầng",
    slug: "tien-do-ha-tang",
    description: "Tiến độ các công trình giao thông trọng điểm.",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const getMockCategories = (): CategoryItem[] => {
  if (typeof window === "undefined") return DEFAULT_CATEGORIES;
  const stored = localStorage.getItem("mock_categories");
  if (!stored) {
    localStorage.setItem("mock_categories", JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
  try {
    const parsed = JSON.parse(stored);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem("mock_categories", JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    // Ensure "Pháp lý" always exists
    if (!parsed.some((c: CategoryItem) => c.slug === "phap-ly" || c.name.toLowerCase() === "pháp lý")) {
      parsed.unshift(DEFAULT_CATEGORIES[0]);
      localStorage.setItem("mock_categories", JSON.stringify(parsed));
    }
    return parsed;
  } catch {
    localStorage.setItem("mock_categories", JSON.stringify(DEFAULT_CATEGORIES));
    return DEFAULT_CATEGORIES;
  }
};

export const saveMockCategory = (
  item: Omit<CategoryItem, "id" | "created_at" | "updated_at"> & { id?: string }
): CategoryItem => {
  const list = getMockCategories();
  const slug = item.slug ? slugify(item.slug) : slugify(item.name);
  const now = new Date().toISOString();

  if (item.id) {
    const idx = list.findIndex((c) => c.id === item.id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...item, slug, updated_at: now };
      localStorage.setItem("mock_categories", JSON.stringify(list));
      return list[idx];
    }
  }

  const newCat: CategoryItem = {
    id: item.id || `cat-${Date.now()}`,
    name: item.name,
    slug,
    description: item.description || null,
    parent_id: item.parent_id || null,
    created_at: now,
    updated_at: now,
  };

  list.push(newCat);
  localStorage.setItem("mock_categories", JSON.stringify(list));
  return newCat;
};

export const deleteMockCategory = (id: string): void => {
  const list = getMockCategories().filter((c) => c.id !== id);
  localStorage.setItem("mock_categories", JSON.stringify(list));
};

export async function fetchCategories(isMock: boolean = true): Promise<CategoryItem[]> {
  if (isMock) {
    return getMockCategories();
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name", { ascending: true });

    if (error) throw error;
    if (data && data.length > 0) {
      return data as CategoryItem[];
    }
    // If table exists but empty, return mock/default
    return getMockCategories();
  } catch (err) {
    console.warn("Categories fetch from Supabase failed, falling back to local:", err);
    return getMockCategories();
  }
}

export async function createCategory(
  item: { name: string; slug?: string; description?: string; parent_id?: string | null },
  isMock: boolean = true
): Promise<CategoryItem> {
  const slug = item.slug ? slugify(item.slug) : slugify(item.name);

  if (isMock) {
    return saveMockCategory({
      name: item.name.trim(),
      slug,
      description: item.description?.trim() || null,
      parent_id: item.parent_id || null,
    });
  }

  try {
    const { data, error } = await supabase
      .from("categories")
      .insert({
        name: item.name.trim(),
        slug,
        description: item.description?.trim() || null,
        parent_id: item.parent_id || null,
      })
      .select()
      .single();

    if (error) throw error;
    return data as CategoryItem;
  } catch (err) {
    console.warn("Supabase category insert failed, saving locally:", err);
    return saveMockCategory({
      name: item.name.trim(),
      slug,
      description: item.description?.trim() || null,
      parent_id: item.parent_id || null,
    });
  }
}
