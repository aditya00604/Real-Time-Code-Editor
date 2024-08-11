import { NextResponse } from 'next/server';
import sharp from 'sharp';
import multer from 'multer';
import { promisify } from 'util';

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = promisify(upload.single('file'));

export async function POST(req) {
  await uploadMiddleware(req, {}, () => {});

  const buffer = req.file.buffer;

  const compressedBuffer = await sharp(buffer)
    .jpeg({ quality: 60 })
    .toBuffer();

  return new NextResponse(compressedBuffer, {
    headers: { 'Content-Type': req.file.mimetype },
  });
}