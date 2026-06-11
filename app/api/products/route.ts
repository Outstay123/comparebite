import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Product } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const productsPath = path.join(process.cwd(), 'lib', 'data', 'products.json');

type ProductSubmission = {
  location_id?: unknown;
  seller_name?: unknown;
  chain?: unknown;
  name?: unknown;
  description?: unknown;
  categories?: unknown;
  product_type?: unknown;
  price?: unknown;
  currency?: unknown;
  ingredients?: unknown;
  image_url?: unknown;
  is_halal?: unknown;
  is_vegetarian?: unknown;
  allergens?: unknown;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asNumber(value: unknown): number | null {
  const numberValue = typeof value === 'number' ? value : Number(value);
  return Number.isFinite(numberValue) ? numberValue : null;
}

function asBoolean(value: unknown): boolean {
  return value === true || value === 'true';
}

function asStringArray(value: unknown): string[] {
  if (Array.isArray(value)) {
    return value.map(asString).filter(Boolean);
  }

  if (typeof value === 'string') {
    return value
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 60);
}

function buildProductId(products: Product[], name: string, sellerName: string): string {
  const base = `item_${slugify(name)}_${slugify(sellerName)}` || `item_${Date.now()}`;
  let candidate = base;
  let index = 2;

  while (products.some((product) => product.id === candidate)) {
    candidate = `${base}_${index}`;
    index += 1;
  }

  return candidate;
}

async function readProducts(): Promise<Product[]> {
  const contents = await fs.readFile(productsPath, 'utf8');
  return JSON.parse(contents) as Product[];
}

async function writeProducts(products: Product[]) {
  const json = `${JSON.stringify(products, null, 2)}\n`;
  const temporaryPath = `${productsPath}.tmp`;
  await fs.writeFile(temporaryPath, json, 'utf8');
  await fs.rename(temporaryPath, productsPath);
}

export async function POST(request: Request) {
  let body: ProductSubmission;

  try {
    body = (await request.json()) as ProductSubmission;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const locationId = asString(body.location_id);
  const sellerName = asString(body.seller_name);
  const chain = asString(body.chain);
  const name = asString(body.name);
  const categories = asStringArray(body.categories);
  const productType = asString(body.product_type);
  const price = asNumber(body.price);
  const currency = asString(body.currency) || 'MYR';
  const ingredients = asStringArray(body.ingredients);

  const validTypes = ['food', 'drink', 'dessert', 'side'];
  const errors: string[] = [];

  if (!locationId) errors.push('Location is required.');
  if (!sellerName) errors.push('Seller name is required.');
  if (!chain) errors.push('Chain is required.');
  if (!name) errors.push('Food item name is required.');
  if (categories.length === 0) errors.push('At least one category is required.');
  if (!validTypes.includes(productType)) errors.push('Product type is required.');
  if (price === null || price <= 0) errors.push('Price must be greater than 0.');
  if (!currency) errors.push('Currency is required.');
  if (ingredients.length === 0) errors.push('At least one ingredient is required.');

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
  }

  const productPrice = price as number;

  try {
    const products = await readProducts();
    const now = new Date().toISOString().slice(0, 10);
    const id = buildProductId(products, name, sellerName);

    const product: Product = {
      id,
      location_id: locationId,
      seller_name: sellerName,
      chain,
      name,
      description: asString(body.description),
      categories,
      product_type: productType as Product['product_type'],
      price: productPrice,
      currency,
      ingredients,
      options: {},
      reviews: [],
      average_rating: 0,
      review_count: 0,
      portion_score: 0,
      taste_score: 0,
      value_score: 0,
      offers: [],
      image_url: asString(body.image_url) || '/images/placeholder-food.jpg',
      is_halal: asBoolean(body.is_halal),
      is_vegetarian: asBoolean(body.is_vegetarian),
      allergens: asStringArray(body.allergens),
      created_at: now,
      updated_at: now,
    };

    products.push(product);
    await writeProducts(products);

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error('Failed to add product', error);
    return NextResponse.json({ error: 'Failed to save product.' }, { status: 500 });
  }
}
