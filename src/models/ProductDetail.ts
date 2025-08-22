import type { Product } from './Product';

export interface ProductDetail {
  id?: number;
  name: string;
  description?: string;
  quantity?: number;
  unitPrice?: number;
  active?: boolean;
  product?: Product;
  productId?: number;
  createdAt?: string;
  updatedAt?: string;
}

export function createProductDetail(data: Partial<ProductDetail> = {}): ProductDetail {
  return {
    id: data.id,
    name: data.name || '',
    description: data.description || '',
    quantity: data.quantity || 0,
    unitPrice: data.unitPrice || 0,
    active: data.active ?? true,
    product: data.product,
    productId: data.productId,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt
  }
}
