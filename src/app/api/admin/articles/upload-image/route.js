import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function POST(req) {
  try {
    const formData = await req.formData();
    
    // Try common field names that Jodit may use
    let file = formData.get('file') 
            || formData.get('files[0]') 
            || formData.get('upload')
            || formData.get('image');

    // Fallback: iterate all entries and find the first file-like object
    if (!file || typeof file === 'string') {
      for (const [key, value] of formData.entries()) {
        if (value && typeof value !== 'string' && typeof value.arrayBuffer === 'function') {
          file = value;
          break;
        }
      }
    }

    if (!file || typeof file === 'string') {
      // Log what we received for debugging
      const keys = [];
      for (const [key, value] of formData.entries()) {
        keys.push(`${key}: ${typeof value}`);
      }
      console.error('No file found in formData. Keys received:', keys.join(', '));
      return NextResponse.json({ success: false, message: 'No file uploaded. Keys: ' + keys.join(', ') }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    
    // Generate unique filename
    const uniqueId = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const originalName = file.name || 'image.jpeg';
    const extension = path.extname(originalName) || '.jpg';
    const fileName = `img-${uniqueId}${extension}`;

    // Define upload directory
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'articles', 'images');
    
    // Ensure directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Save the file
    const filePath = path.join(uploadDir, fileName);
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/articles/images/${fileName}`;

    return NextResponse.json({ 
      success: true, 
      message: 'File successfully uploaded', 
      url: publicUrl 
    });

  } catch (error) {
    console.error('Image Upload Error:', error);
    return NextResponse.json({ success: false, message: 'Failed to upload image: ' + error.message }, { status: 500 });
  }
}
