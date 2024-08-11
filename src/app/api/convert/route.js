import { NextResponse } from 'next/server';
import sharp from 'sharp';
import multer from 'multer';
import { promisify } from 'util';

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = promisify(upload.single('file'));

export async function POST(req) {
  await uploadMiddleware(req, {}, () => {});

  const { format } = req.body;
  const buffer = req.file.buffer;

  let convertedBuffer;
  switch (format) {
    case 'png':
      convertedBuffer = await sharp(buffer).png().toBuffer();
      break;
    case 'jpg':
      convertedBuffer = await sharp(buffer).jpeg().toBuffer();
      break;
    case 'webp':
      convertedBuffer = await sharp(buffer).webp().toBuffer();
      break;
    default:
      return NextResponse.json({ error: 'Unsupported format' }, { status: 400 });
  }

  return new NextResponse(convertedBuffer, {
    headers: { 'Content-Type': `image/${format}` },
  });
}