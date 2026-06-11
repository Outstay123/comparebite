import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { Product, Review } from '@/lib/types';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const productsPath = path.join(process.cwd(), 'lib', 'data', 'products.json');

type ScoreSubmission = {
  user?: unknown;
  taste_score?: unknown;
  portion_score?: unknown;
  price_score?: unknown;
};

function asString(value: unknown): string {
  return typeof value === 'string' ? value.trim() : '';
}

function asScore(value: unknown): number | null {
  const numberValue = typeof value === 'number' ? value : Number(value);
  if (!Number.isFinite(numberValue)) return null;
  return Math.min(5, Math.max(1, Number(numberValue.toFixed(1))));
}

function average(values: number[]): number {
  if (values.length === 0) return 0;
  return Number((values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1));
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

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  let body: ScoreSubmission;

  try {
    body = (await request.json()) as ScoreSubmission;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON payload.' }, { status: 400 });
  }

  const tasteScore = asScore(body.taste_score);
  const portionScore = asScore(body.portion_score);
  const priceScore = asScore(body.price_score);
  const errors: string[] = [];

  if (tasteScore === null) errors.push('Taste score is required.');
  if (portionScore === null) errors.push('Portion score is required.');
  if (priceScore === null) errors.push('Price score is required.');

  if (errors.length > 0) {
    return NextResponse.json({ error: errors.join(' ') }, { status: 400 });
  }

  try {
    const { id } = await params;
    const products = await readProducts();
    const productIndex = products.findIndex((product) => product.id === id);

    if (productIndex === -1) {
      return NextResponse.json({ error: 'Product not found.' }, { status: 404 });
    }

    const product = products[productIndex];
    const now = new Date().toISOString().slice(0, 10);
    const rating = average([tasteScore as number, portionScore as number, priceScore as number]);
    const review: Review = {
      id: `rev_${id}_${Date.now()}`,
      user: asString(body.user) || 'Consumer',
      rating,
      portion_score: portionScore as number,
      taste_score: tasteScore as number,
      value_score: priceScore as number,
      comment: 'Consumer score submission.',
      created_at: now,
    };
    const reviews = [...product.reviews, review];

    const updatedProduct: Product = {
      ...product,
      reviews,
      average_rating: average(reviews.map((item) => item.rating)),
      review_count: reviews.length,
      portion_score: average(reviews.map((item) => item.portion_score)),
      taste_score: average(reviews.map((item) => item.taste_score)),
      value_score: average(reviews.map((item) => item.value_score)),
      updated_at: now,
    };

    products[productIndex] = updatedProduct;
    await writeProducts(products);

    return NextResponse.json({ product: updatedProduct }, { status: 201 });
  } catch (error) {
    console.error('Failed to save product score', error);
    return NextResponse.json({ error: 'Failed to save score.' }, { status: 500 });
  }
}
