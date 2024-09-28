import { NextRequest, NextResponse } from 'next/server';  
import { GoogleGenerativeAI } from '@google/generative-ai';  

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);  

export async function POST(request: NextRequest) {  
  try {  
    const formData = await request.formData();  
    const imageFile = formData.get('image') as File;  

    if (!imageFile) {  
      console.error('No image file provided');  
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });  
    }  

    console.log('Image file received:', imageFile.name, 'Size:', imageFile.size, 'Type:', imageFile.type);  

    const imageBytes = await imageFile.arrayBuffer();  

    // Convert ArrayBuffer to Base64  
    const base64Image = Buffer.from(imageBytes).toString('base64');  

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });  

    // Updated prompt for improved clarity  
    const prompt = `Given the uploaded image, please generate the complete HTML and CSS code separately required to replicate its visual design. Follow these guidelines:  
1. Start with the HTML code.
2. The HTML should not have any inline styling  
3. Immediately below, on a new line provide the CSS code prefixed with 'CSS:'.  

Please provide the code and also comment on where adjustments are needed. Prioritize achieving a visually accurate representation of the design elements from the image.`;  

    console.log('Sending request to Gemini API...');  
    const result = await model.generateContent([  
      prompt,  
      {  
        inlineData: {  
          mimeType: imageFile.type,  
          data: base64Image  
        }  
      }  
    ]);  
    console.log('Received response from Gemini API');  

    const response = await result.response;  
    const text = await response.text(); // Await the Promise  

    console.log('Generated text:', text);  

    // Split the generated text into HTML and CSS  
    const [html, cssPart] = text.split('CSS:').map(code => code.trim());  

    if (!html || !cssPart) {  
      throw new Error('Failed to generate both HTML and CSS');  
    }  

    // Clean up the CSS part  
    const css = cssPart.trim();  

    console.log('Successfully generated HTML and CSS');  
    return NextResponse.json({ html, css });  
  } catch (error) {  
    console.error('Error generating code:', error);  
    let errorMessage = 'An unexpected error occurred';  
    if (error instanceof Error) {  
      errorMessage = error.message;  
    }  
    return NextResponse.json({ error: `Failed to generate code: ${errorMessage}` }, { status: 500 });  
  }  
}