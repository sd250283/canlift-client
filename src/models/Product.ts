export interface Product {
    '@context'?: string;
    '@id'?: string;
    '@type'?: string;
    id?: number;
    libelle: string;
    gts_libelle?: string;
    gts_code?: string;
    gts_id?: string;
    type?: string;
    IsSession?: boolean;
    IsContigent?: boolean;
    IsBookable?: boolean;
    IsFree?: boolean;
    IsInvite?: boolean;
    IsBundle?: boolean;
    IsUpsell?: boolean;
    IsPrimeYield?: boolean;
    IsFrequented?: boolean;
    libelleShorted?: string;
    destination?: string;
    ascentWay?: string;
    productDetails?: ProductDetail[];
}

export interface ProductDetail {
    '@context'?: string;
    '@id'?: string;
    '@type'?: string;
    id?: number;
    libelle: string;
    gts_libelle?: string;
    gts_code?: string;
    gts_id?: string;
    type?: string;
    IsSession?: boolean;
    IsContigent?: boolean;
    IsBookable?: boolean;
    IsFree?: boolean;
    IsInvite?: boolean;
    IsBundle?: boolean;
    IsUpsell?: boolean;
    IsPrimeYield?: boolean;
    IsFrequented?: boolean;
    libelleShorted?: string;
    destination?: string;
    ascentWay?: string;
    product?: string; // IRI reference to Product
}

// Generic utility function to transform boolean properties for API POST/PUT requests
function transformBooleansForApi(data: Record<string, any>) {
    const transformedData: Record<string, any> = { ...data };
    
    for (const [key, value] of Object.entries(transformedData)) {
        if (typeof value === 'boolean') {
            // Handle PascalCase properties (Is...) from API - convert to setIs... format
            if (key.startsWith('Is')) {
                const setPropName = `set${key}`;
                transformedData[setPropName] = value;
                delete transformedData[key];
            }
        }
    }
    
    return transformedData;
}

export function createProduct(data: Partial<Product> = {}): Product {
  return {
    id: data.id,
    libelle: data.libelle || '',
    gts_libelle: data.gts_libelle || '',
    gts_code: data.gts_code || '',
    gts_id: data.gts_id || '',
    type: data.type || '',
    IsSession: data.IsSession ?? false,
    IsContigent: data.IsContigent ?? false,
    IsBookable: data.IsBookable ?? false,
    IsFree: data.IsFree ?? false,
    IsInvite: data.IsInvite ?? false,
    IsBundle: data.IsBundle ?? false,
    IsUpsell: data.IsUpsell ?? false,
    IsPrimeYield: data.IsPrimeYield ?? false,
    IsFrequented: data.IsFrequented ?? false,
    libelleShorted: data.libelleShorted || '',
    destination: data.destination || '',
    ascentWay: data.ascentWay || '',
    productDetails: data.productDetails || []
  }
}

export function createProductDetail(data: Partial<ProductDetail> = {}): ProductDetail {
  return {
    id: data.id,
    libelle: data.libelle || '',
    gts_libelle: data.gts_libelle || '',
    gts_code: data.gts_code || '',
    gts_id: data.gts_id || '',
    type: data.type || '',
    IsSession: data.IsSession ?? false,
    IsContigent: data.IsContigent ?? false,
    IsBookable: data.IsBookable ?? false,
    IsFree: data.IsFree ?? false,
    IsInvite: data.IsInvite ?? false,
    IsBundle: data.IsBundle ?? false,
    IsUpsell: data.IsUpsell ?? false,
    IsPrimeYield: data.IsPrimeYield ?? false,
    IsFrequented: data.IsFrequented ?? false,
    libelleShorted: data.libelleShorted || '',
    destination: data.destination || '',
    ascentWay: data.ascentWay || '',
    product: data.product || ''
  }
}

// Utility function to prepare Product data for POST requests (API serialization)
export function prepareProductForPost(product: Product): Partial<Product> {
  const postData: Partial<Product> = {
    id: product.id,
    libelle: product.libelle,
    gts_libelle: product.gts_libelle,
    gts_code: product.gts_code,
    gts_id: product.gts_id,
    type: product.type,
    libelleShorted: product.libelleShorted,
    destination: product.destination,
    ascentWay: product.ascentWay,
    // Include all boolean fields
    IsSession: product.IsSession,
    IsContigent: product.IsContigent,
    IsBookable: product.IsBookable,
    IsFree: product.IsFree,
    IsInvite: product.IsInvite,
    IsBundle: product.IsBundle,
    IsUpsell: product.IsUpsell,
    IsPrimeYield: product.IsPrimeYield,
    IsFrequented: product.IsFrequented,
  }
  
  const transformedData = transformBooleansForApi(postData);

  // Remove undefined values
  return Object.fromEntries(
    Object.entries(transformedData).filter(([_, value]) => value !== undefined)
  ) as Partial<Product>
}

// Utility function to prepare ProductDetail data for POST requests (API serialization)
export function prepareProductDetailForPost(productDetail: ProductDetail): Partial<ProductDetail> {
  const postData: Partial<ProductDetail> = {
    id: productDetail.id,
    libelle: productDetail.libelle,
    gts_libelle: productDetail.gts_libelle,
    gts_code: productDetail.gts_code,
    gts_id: productDetail.gts_id,
    type: productDetail.type,
    libelleShorted: productDetail.libelleShorted,
    destination: productDetail.destination,
    ascentWay: productDetail.ascentWay,
    product: productDetail.product,
    // Include all boolean fields
    IsSession: productDetail.IsSession,
    IsContigent: productDetail.IsContigent,
    IsBookable: productDetail.IsBookable,
    IsFree: productDetail.IsFree,
    IsInvite: productDetail.IsInvite,
    IsBundle: productDetail.IsBundle,
    IsUpsell: productDetail.IsUpsell,
    IsPrimeYield: productDetail.IsPrimeYield,
    IsFrequented: productDetail.IsFrequented,
  }

  const transformedData = transformBooleansForApi(postData);
  
  // Remove undefined values
  return Object.fromEntries(
    Object.entries(transformedData).filter(([_, value]) => value !== undefined)
  ) as Partial<ProductDetail>
}