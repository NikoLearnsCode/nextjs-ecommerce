import type {ProductCard} from '@/lib/types/db-types';
import {ProductFormData} from '../validators/admin.product-validation';

export type SortField = 'id' | 'price' | 'name';

/** 'fts' = full-text search; 'fuzzy' = pg_trgm fallback when FTS finds nothing. */
export type SearchMode = 'fts' | 'fuzzy';

export type SortOrder = 'asc' | 'desc';

export type SortParams = {
  sort: SortField;
  order: SortOrder;
};

export type PaymentInfo = {
  method: 'card' | 'swish' | 'klarna';
};

export type Params = {
  limit?: number;
  query?: string;
  order?: 'asc' | 'desc';
  sort?: SortField;
  lastId?: string | null;
  lastValue?: number | string | null;
  category?: string | null;
  gender?: string | null;
  color?: string[];
  sizes?: string[];
  metadata?: boolean;
  isNewOnly?: boolean;
  includeCount?: boolean;
  searchMode?: SearchMode;
};

export type Result = {
  products: ProductCard[];
  hasMore: boolean;
  totalCount?: number;
  /** Mode that produced the page; pages 2+ must request the same mode. */
  searchMode?: SearchMode;
  metadata?: {
    availableColors: string[];
    availableSizes: string[];
    availableCategories: string[];
  };
};

export type ActionResult = {
  success: boolean;
  data?: unknown;
  error?: string;
  errors?: {
    [key in keyof ProductFormData]?: string[];
  };
};
