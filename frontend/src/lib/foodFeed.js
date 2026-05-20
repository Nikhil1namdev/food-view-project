export const FOOD_CATEGORIES = [
  "All",
  "Indian",
  "Chinese",
  "Italian",
  "Fast Food",
  "Desserts",
  "Beverages",
  "Street Food",
];

export const SORT_OPTIONS = {
  DEFAULT: "default",
  PRICE_LOW: "price-low",
  PRICE_HIGH: "price-high",
};

export const VEG_FILTERS = {
  ALL: "all",
  VEG: "veg",
  NON_VEG: "non-veg",
};

function hashFromId(id = "") {
  let h = 0;
  for (let i = 0; i < id.length; i += 1) {
    h = (h << 5) - h + id.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

/** Stable demo values for legacy items missing catalog fields */
export function normalizeFoodItem(item) {
  const id = item._id?.toString() || "";
  const seed = hashFromId(id);
  const categories = FOOD_CATEGORIES.filter((c) => c !== "All");
  const likeCount = item.likeCount ?? 0;
  const savesCount = item.savesCount ?? 0;
  const engagement = likeCount + savesCount;

  const partner = item.foodPartner;
  const restaurantName =
    typeof partner === "object" && partner?.name
      ? partner.name
      : "Local Kitchen";

  return {
    ...item,
    price: item.price ?? 99 + (seed % 401),
    category: item.category ?? categories[seed % categories.length],
    isVeg: item.isVeg ?? seed % 3 !== 0,
    rating: item.rating ?? Number((3.5 + (seed % 15) / 10).toFixed(1)),
    restaurantName,
    partnerId:
      typeof partner === "object" ? partner?._id : partner,
    isTrending: engagement >= 2 || seed % 4 === 0,
  };
}

export function normalizeFoodList(items = []) {
  return items.map(normalizeFoodItem);
}

export function filterFoods(items, filters) {
  const {
    query = "",
    vegFilter = VEG_FILTERS.ALL,
    category = "All",
    trendingOnly = false,
    savedOnly = false,
  } = filters;

  const q = query.trim().toLowerCase();

  return items.filter((item) => {
    if (savedOnly && !item.isSaved) return false;
    if (trendingOnly && !item.isTrending) return false;

    if (vegFilter === VEG_FILTERS.VEG && !item.isVeg) return false;
    if (vegFilter === VEG_FILTERS.NON_VEG && item.isVeg) return false;

    if (category !== "All" && item.category !== category) return false;

    if (!q) return true;

    const haystack = [
      item.name,
      item.description,
      item.restaurantName,
      item.category,
    ]
      .filter(Boolean)
      .join(" ")
      .toLowerCase();

    return haystack.includes(q);
  });
}

export function sortFoods(items, sortBy) {
  const list = [...items];

  switch (sortBy) {
    case SORT_OPTIONS.PRICE_LOW:
      return list.sort((a, b) => a.price - b.price);
    case SORT_OPTIONS.PRICE_HIGH:
      return list.sort((a, b) => b.price - a.price);
    default:
      return list.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
      );
  }
}

export function getUniqueCategories(items) {
  const fromData = new Set(items.map((i) => i.category).filter(Boolean));
  const ordered = FOOD_CATEGORIES.filter(
    (c) => c === "All" || fromData.has(c)
  );
  const extras = [...fromData].filter((c) => !ordered.includes(c));
  return [...ordered.filter((c) => c !== "All"), ...extras];
}

export function formatPrice(price) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price ?? 0);
}
