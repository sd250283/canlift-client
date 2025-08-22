// Shared helpers for 30->15 buffered pagination with simple cache
// Keeps logic DRY across modules (product details, products, etc.)

export interface DataCache<T> {
  items: T[];
  apiPage: number;
  totalFetched: number;
  lastFetchTime: number;
}

export function computeRequiredApiPage(page: number, apiItemsPerPage: number, tableItemsPerPage: number): number {
  return Math.ceil((page * tableItemsPerPage) / apiItemsPerPage);
}

export function computeSliceRange(page: number, apiItemsPerPage: number, tableItemsPerPage: number) {
  const startIndex = ((page - 1) * tableItemsPerPage) % apiItemsPerPage;
  const endIndex = startIndex + tableItemsPerPage;
  return { startIndex, endIndex };
}

export function isCacheValidForPage<T>(
  cache: DataCache<T>,
  requiredApiPage: number,
  now: number,
  maxAgeMs: number
): boolean {
  if (!cache) return false;
  const isFresh = now - (cache.lastFetchTime || 0) < maxAgeMs;
  const pageMatch = cache.apiPage === requiredApiPage;
  const hasItems = Array.isArray(cache.items) && cache.items.length > 0;
  return isFresh && pageMatch && hasItems;
}

export function slicePage<T>(items: T[], page: number, apiItemsPerPage: number, tableItemsPerPage: number): T[] {
  const { startIndex, endIndex } = computeSliceRange(page, apiItemsPerPage, tableItemsPerPage);
  return items.slice(startIndex, Math.min(endIndex, items.length));
}

export function extractTotalItemsFromApi(data: any): number {
  if (!data) return 0;
  return data.totalItems || data['hydra:totalItems'] || 0;
}

export function extractHydraFlags(data: any, fetchedCount: number, apiItemsPerPage: number) {
  const view = data && data['hydra:view'];
  const hasNextPage = Boolean(view && view['hydra:next']);
  const isLastPage = !hasNextPage || fetchedCount < apiItemsPerPage;
  return { hasNextPage, isLastPage };
}

export function buildPagination(
  totalItems: number,
  currentPage: number,
  tableItemsPerPage: number,
  hasNextPage: boolean,
  isLastPage: boolean,
  apiItemsPerPage: number
) {
  return {
    currentPage,
    totalItems,
    itemsPerPage: tableItemsPerPage,
    totalPages: Math.ceil(totalItems / tableItemsPerPage),
    hasNextPage,
    isLastPage,
    apiItemsPerPage,
    tableItemsPerPage
  };
}
