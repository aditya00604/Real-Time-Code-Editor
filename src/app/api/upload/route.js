import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google Generative AI with your API key
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

export async function POST(request) {
  try {
    const { content, type } = await request.json(); // Expecting 'content' and 'type' (e.g., 'html', 'css', 'js') from the frontend
    
    console.log('Received content:', content);

    // Create a prompt based on content type
    const prompt = `Based on the following ${type} code snippets, please generate additional lines of code that improve or extend the current implementation. Don't include the current code snippet. Code: \n\n${content}`;
    console.log('Generated prompt:', prompt);

    // Generate suggestions using Google Generative AI
    const result = await model.generateContent(prompt);
    let responseText = result.response.text();
    console.log('Generated suggestion:', responseText);
    // Format the response (optional, depending on your needs)
    responseText = formatResponse(responseText, type, content);

    // Save the interaction to the database (optional)

    
    // Send back the generated response and the chat ID
    return NextResponse.json({ suggestion: responseText });
  } catch (error) {
    console.error('Error generating suggestion:', error.message);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

function formatResponse(text, type, originalContent) {
  switch (type) {
    case 'html':
    case 'css':
    case 'js':
      return extractFirstContent(text, type, originalContent);
    default:
      return text;
  }
}

function extractFirstContent(text, type, originalContent) {
  const pattern = new RegExp(`\`\`\`${type}\n([\\s\\S]*?)\n\`\`\``, 'i');
  const match = text.match(pattern);
  if (match) {
    let extractedContent = match[1].trim();
    // Remove original content from the extracted content
    return extractedContent.replace(originalContent, '').trim();
  }
  return '';
}
