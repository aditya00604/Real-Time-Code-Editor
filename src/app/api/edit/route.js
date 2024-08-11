import { NextResponse } from 'next/server';
import sharp from 'sharp';
import multer from 'multer';
import { promisify } from 'util';

const upload = multer({ storage: multer.memoryStorage() });
const uploadMiddleware = promisify(upload.single('file'));

export async function POST(req) {
  await uploadMiddleware(req, {}, () => {});

  const buffer = req.file.buffer;
  const { action } = req.body;

  let editedBuffer;
  switch (action) {
    case 'crop':
      editedBuffer = await sharp(buffer).extract({ width: 100, height: 100, left: 10, top: 10 }).toBuffer();
      break;
    case 'resize':
      editedBuffer = await sharp(buffer).resize(100, 100).toBuffer();
      break;
    default:
      return NextResponse.json({ error: 'Unsupported action' }, { status: 400 });
  }

  return new NextResponse(editedBuffer, {
    headers: { 'Content-Type': req.file.mimetype },
  });
}