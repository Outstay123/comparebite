import { randomUUID } from 'crypto';
import { promises as fs } from 'fs';
import path from 'path';
import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

const uploadDirectory = path.join(process.cwd(), 'public', 'images', 'uploads');
const maxImageSize = 5 * 1024 * 1024;

function getExtension(file: File): string {
  const byType: Record<string, string> = {
    'image/jpeg': 'jpg',
    'image/png': 'png',
    'image/gif': 'gif',
    'image/webp': 'webp',
  };

  if (byType[file.type]) return byType[file.type];

  const originalExtension = file.name.split('.').pop()?.toLowerCase();
  return originalExtension && /^[a-z0-9]+$/.test(originalExtension) ? originalExtension : 'jpg';
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const image = formData.get('image');

  if (!(image instanceof File)) {
    return NextResponse.json({ error: 'Image file is required.' }, { status: 400 });
  }

  if (!image.type.startsWith('image/')) {
    return NextResponse.json({ error: 'Uploaded file must be an image.' }, { status: 400 });
  }

  if (image.size > maxImageSize) {
    return NextResponse.json({ error: 'Image must be 5MB or smaller.' }, { status: 400 });
  }

  await fs.mkdir(uploadDirectory, { recursive: true });

  const extension = getExtension(image);
  const fileName = `food-${Date.now()}-${randomUUID()}.${extension}`;
  const filePath = path.join(uploadDirectory, fileName);
  const buffer = Buffer.from(await image.arrayBuffer());

  await fs.writeFile(filePath, buffer);

  return NextResponse.json({ image_url: `/images/uploads/${fileName}` }, { status: 201 });
}
