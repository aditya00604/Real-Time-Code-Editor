// utils/imageUtils.js
import { toPng, toJpeg, toWebp } from 'html-to-image';
import Compressor from 'compressorjs';

export const convertImage = async (file, format) => {
  const image = await loadImage(file);
  switch (format) {
    case 'png':
      return toPng(image);
    case 'jpg':
      return toJpeg(image);
    case 'webp':
      return toWebp(image);
    default:
      throw new Error('Unsupported format');
  }
};

export const compressImage = (file) => {
  return new Promise((resolve, reject) => {
    new Compressor(file, {
      quality: 0.6,
      success(result) {
        resolve(result);
      },
      error(err) {
        reject(err);
      },
    });
  });
};

export const editImage = async (file, options) => {
  const image = await loadImage(file);
  // Implement basic editing logic here
  // For example, cropping or resizing using a library like cropperjs or similar
  return image;
};

const loadImage = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target.result;
      img.onload = () => resolve(img);
      img.onerror = reject;
    };
    reader.readAsDataURL(file);
  });
};