import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Simple in-memory rate limiting (resets on cold start, but provides basic protection)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute window
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP
const MAX_DEMO_REQUESTS_PER_WINDOW = 3; // Stricter limit for demo mode

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function isRateLimited(clientIP: string, isDemo: boolean): boolean {
  const now = Date.now();
  const key = isDemo ? `demo_${clientIP}` : clientIP;
  const maxRequests = isDemo ? MAX_DEMO_REQUESTS_PER_WINDOW : MAX_REQUESTS_PER_WINDOW;
  const entry = rateLimitMap.get(key);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (entry.count >= maxRequests) {
    return true;
  }
  
  entry.count++;
  return false;
}

interface ProductComposition {
  materials: {
    name: string;
    percentage: number;
    isEcoFriendly: boolean;
    recyclable: boolean;
  }[];
  packaging: {
    type: string;
    recyclable: boolean;
    biodegradable: boolean;
  };
  certifications: string[];
  environmentalImpact: {
    waterUsage: "low" | "medium" | "high";
    energyConsumption: "low" | "medium" | "high";
    wasteGeneration: "low" | "medium" | "high";
  };
}

interface ProductAnalysis {
  productName: string;
  category: string;
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  carbonFootprint: number;
  biodegradable: number;
  composition?: ProductComposition;
  suggestions: {
    name: string;
    grade: "S" | "A" | "B";
    amazonSearch: string;
    flipkartSearch: string;
    carbonFootprint: number;
    biodegradable: number;
    imageUrl?: string;
    composition?: ProductComposition;
  }[];
}

// Function to generate product image using AI
async function generateProductImage(productName: string, apiKey: string): Promise<string | null> {
  try {
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image',
        messages: [
          {
            role: 'user',
            content: `Generate a clean, professional product photo of: ${productName}. Show the product packaging clearly on a white background, like an e-commerce product image. Make it look realistic and appealing.`
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      console.error('Image generation failed:', response.status);
      return null;
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    return imageUrl || null;
  } catch (error) {
    console.error('Error generating image:', error);
    return null;
  }
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { imageBase64 } = body;
    // NOTE: isDemo is determined server-side based on authentication, not from client

    // Server-side demo detection - determine based on auth status, not client flag
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;
    let isDemo = false;
    let supabaseClient: ReturnType<typeof createClient> | null = null;

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Supabase configuration missing');
      throw new Error('Server configuration error');
    }

    if (!authHeader) {
      // No auth = demo mode with strict limits
      isDemo = true;
      console.log('No auth header - demo mode request');
    } else {
      // Verify the JWT token
      supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });

      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      if (authError || !user) {
        // Invalid auth = treat as demo mode
        isDemo = true;
        console.log('Invalid auth token - falling back to demo mode:', authError?.message);
      } else {
        userId = user.id;
        isDemo = false;
        console.log(`Authenticated request from user: ${userId}`);
      }
    }

    // Rate limiting check with stricter limits for demo mode
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP, isDemo)) {
      const message = isDemo 
        ? 'Demo limit reached. Please sign up for more scans.'
        : 'Too many requests. Please wait a moment and try again.';
      console.warn(`Rate limit exceeded for ${isDemo ? 'demo ' : ''}IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: message }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }

    // Input validation: check if imageBase64 exists and has reasonable size
    if (!imageBase64 || typeof imageBase64 !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Image data is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate base64 size (max ~10MB encoded, which is ~7.5MB actual)
    const MAX_BASE64_SIZE = 10 * 1024 * 1024;
    if (imageBase64.length > MAX_BASE64_SIZE) {
      return new Response(
        JSON.stringify({ error: 'Image too large. Please upload an image under 7MB.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // MIME type whitelist for security
    const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    
    // Validate data URI format with strict MIME type checking
    const dataUriMatch = imageBase64.match(/^data:(image\/[a-z]+);base64,/i);
    const isDataUri = !!dataUriMatch;
    
    if (isDataUri) {
      const mimeType = dataUriMatch[1].toLowerCase();
      if (!ALLOWED_MIME_TYPES.includes(mimeType)) {
        console.warn(`Rejected MIME type: ${mimeType}`);
        return new Response(
          JSON.stringify({ error: 'Invalid image format. Supported formats: JPEG, PNG, WebP, GIF.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Extract and validate the base64 portion
      const base64Data = imageBase64.slice(dataUriMatch[0].length);
      // Validate entire base64 string structure (not just first 100 chars)
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(base64Data)) {
        console.warn('Invalid base64 structure in data URI');
        return new Response(
          JSON.stringify({ error: 'Invalid image data encoding.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      // Plain base64 - validate entire string structure
      if (!/^[A-Za-z0-9+/]*={0,2}$/.test(imageBase64)) {
        console.warn('Invalid base64 structure');
        return new Response(
          JSON.stringify({ error: 'Invalid image format. Please upload a valid image.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Analyzing product image...');

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are an expert product recognition and eco-sustainability analyzer with exceptional visual analysis skills. Your PRIMARY task is to accurately identify the EXACT product shown in the image with HIGH PRECISION.

CRITICAL INSTRUCTIONS FOR PRODUCT IDENTIFICATION:
1. SCAN THE ENTIRE IMAGE carefully - look for:
   - Brand name/logo (usually prominently displayed)
   - Product name text on packaging
   - Taglines, flavor variants, or product descriptions
   - Package design, colors, and distinctive features
   
2. BRAND IDENTIFICATION PRIORITY:
   - READ ALL visible text on the packaging character by character
   - Look for brand logos (Nike swoosh, Apple logo, Lay's wave, Coca-Cola script, etc.)
   - Check corners, edges, and small print for brand names
   - If multiple brands appear (e.g., parent company + product brand), use the product brand
   
3. PRODUCT NAME FORMAT - Be specific and detailed:
   - CORRECT: "Lay's Classic Salted Potato Chips 52g"
   - CORRECT: "Coca-Cola Original Taste 330ml Can"
   - CORRECT: "Dove Deeply Nourishing Body Wash 500ml"
   - WRONG: "Potato Chips" (too generic)
   - WRONG: "Unbranded Cola" (should identify brand)
   - WRONG: "Body Wash" (missing brand and variant)

4. IF BRAND IS NOT CLEARLY VISIBLE:
   - Describe the product type precisely with visible characteristics
   - Example: "Orange-flavored Corn Puffs Snack (Brand Not Visible)"
   - Never use "Unbranded" or "Standard" - describe what you actually see

5. CONFIDENCE CHECK:
   - Only report brands you can CLEARLY read or recognize from logos
   - If image is blurry or text is unreadable, describe the product category and visible features

Your response MUST be valid JSON with this exact structure:
{
  "productName": "Brand Name - Full Product Name with Variant/Size (e.g., Lay's Classic Salted Chips 52g)",
  "category": "Snacks" | "Food & Beverages" | "Personal Care" | "Household" | "Electronics" | "Clothing",
  "grade": "S" | "A" | "B" | "C" | "D" | "F",
  "carbonFootprint": number between 5-50 (kg CO2),
  "biodegradable": number between 10-100 (percentage),
  "composition": {
    "materials": [
      {
        "name": "material name (e.g., Recycled Plastic, Organic Cotton, Palm Oil)",
        "percentage": number between 1-100,
        "isEcoFriendly": boolean,
        "recyclable": boolean
      }
    ],
    "packaging": {
      "type": "Plastic Wrapper" | "Cardboard Box" | "Glass Bottle" | "Aluminum Can" | "Paper Bag" | "Biodegradable Pouch",
      "recyclable": boolean,
      "biodegradable": boolean
    },
    "certifications": ["FSC Certified", "Organic", "Fair Trade", "Rainforest Alliance", "Carbon Neutral", "Vegan", "Cruelty-Free"],
    "environmentalImpact": {
      "waterUsage": "low" | "medium" | "high",
      "energyConsumption": "low" | "medium" | "high",
      "wasteGeneration": "low" | "medium" | "high"
    }
  },
  "suggestions": [
    {
      "name": "eco-friendly alternative IN THE SAME CATEGORY with full product name",
      "grade": "S" | "A" | "B",
      "amazonSearch": "exact search query for this specific product on amazon",
      "flipkartSearch": "exact search query for this specific product on flipkart",
      "carbonFootprint": number (lower than original),
      "biodegradable": number (higher than original),
      "composition": {
        "materials": [...same structure as above...],
        "packaging": {...same structure as above...},
        "certifications": [...],
        "environmentalImpact": {...same structure as above...}
      }
    }
  ]
}

COMPOSITION ANALYSIS RULES:
- Identify 3-5 main materials/ingredients the product is made from
- Be specific: "High Fructose Corn Syrup" not just "Sugar", "Recycled PET Plastic" not just "Plastic"
- Set isEcoFriendly=true for: organic materials, recycled content, natural fibers, plant-based ingredients
- Set recyclable=true for: glass, aluminum, paper, certain plastics (PET, HDPE)
- Include relevant certifications the product might have based on its type
- Assess environmental impact based on product category and manufacturing process

SUGGESTION RULES - CRITICAL:
- Match the EXACT product category (chips → chips, soda → soda, shampoo → shampoo)
- Suggest REAL eco-friendly brands that exist:
  * Chips: "Slurrp Farm Millet Puffs", "Too Yumm Veggie Stix", "Yoga Bar Protein Chips"
  * Beverages: "Paper Boat Aam Panna", "Raw Pressery Cold Pressed Juice"
  * Personal Care: "Mamaearth", "WOW Skin Science", "Khadi Natural"
  * Household: "Beco Eco-Friendly", "The Better Home", "Purecosheet"
- Include product size/variant in suggestion names
- NEVER suggest unrelated categories
- Include composition details for each suggestion with better eco metrics

Grading criteria:
- S (Excellent): Carbon footprint < 8 kg, Biodegradable > 90%
- A (Great): Carbon footprint < 12 kg, Biodegradable > 80%
- B (Good): Carbon footprint < 18 kg, Biodegradable > 60%
- C (Average): Carbon footprint < 25 kg, Biodegradable > 40%
- D (Below Average): Carbon footprint < 35 kg, Biodegradable > 20%
- F (Poor): Higher carbon footprint or lower biodegradable

Only respond with the JSON, no additional text or markdown.`
          },
          {
            role: 'user',
            content: [
              {
                type: 'text',
                text: 'Analyze this product image and provide eco-sustainability metrics with relevant alternative suggestions in the same product category.'
              },
              {
                type: 'image_url',
                image_url: {
                  url: imageBase64.startsWith('data:') ? imageBase64 : `data:image/jpeg;base64,${imageBase64}`
                }
              }
            ]
          }
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      // Log detailed error server-side only for debugging
      console.error('Analysis service error [internal]:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Service is busy. Please try again in a few moments.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Service temporarily unavailable. Please try again later.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      // Generic error for all other cases - no internal details
      throw new Error('Analysis service error');
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI Response received');

    if (!content) {
      throw new Error('No response from AI');
    }

    // Helper function to repair common JSON issues
    function repairJSON(jsonString: string): string {
      let repaired = jsonString;
      
      // Remove any text before the first { and after the last }
      const firstBrace = repaired.indexOf('{');
      const lastBrace = repaired.lastIndexOf('}');
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        repaired = repaired.slice(firstBrace, lastBrace + 1);
      }
      
      // Remove trailing commas before } or ]
      repaired = repaired.replace(/,\s*([}\]])/g, '$1');
      
      // Fix unescaped quotes within string values (common AI mistake)
      // This is a simplified fix - matches strings and escapes internal quotes
      repaired = repaired.replace(/"([^"]*?)"/g, (match, content) => {
        // Don't process if it's already properly formatted
        if (!content.includes('"')) return match;
        const escaped = content.replace(/(?<!\\)"/g, '\\"');
        return `"${escaped}"`;
      });
      
      // Remove control characters that break JSON
      repaired = repaired.replace(/[\x00-\x1F\x7F]/g, (char) => {
        if (char === '\n' || char === '\r' || char === '\t') return char;
        return '';
      });
      
      return repaired;
    }

    // Parse the JSON response
    let analysis: ProductAnalysis;
    try {
      // Clean the response - remove markdown code blocks if present
      let cleanContent = content.trim();
      if (cleanContent.startsWith('```json')) {
        cleanContent = cleanContent.slice(7);
      }
      if (cleanContent.startsWith('```')) {
        cleanContent = cleanContent.slice(3);
      }
      if (cleanContent.endsWith('```')) {
        cleanContent = cleanContent.slice(0, -3);
      }
      cleanContent = cleanContent.trim();
      
      // First attempt: parse as-is
      try {
        analysis = JSON.parse(cleanContent);
      } catch {
        // Second attempt: try to repair common JSON issues
        console.log('Initial JSON parse failed, attempting repair...');
        const repairedContent = repairJSON(cleanContent);
        try {
          analysis = JSON.parse(repairedContent);
          console.log('JSON repair successful');
        } catch (repairError) {
          // Third attempt: extract just the essential fields using regex
          console.log('JSON repair failed, extracting essential fields...');
          const productNameMatch = cleanContent.match(/"productName"\s*:\s*"([^"]+)"/);
          const categoryMatch = cleanContent.match(/"category"\s*:\s*"([^"]+)"/);
          const gradeMatch = cleanContent.match(/"grade"\s*:\s*"([SABCDF])"/);
          const carbonMatch = cleanContent.match(/"carbonFootprint"\s*:\s*(\d+(?:\.\d+)?)/);
          const biodegradableMatch = cleanContent.match(/"biodegradable"\s*:\s*(\d+(?:\.\d+)?)/);
          
          if (productNameMatch) {
            analysis = {
              productName: productNameMatch[1],
              category: categoryMatch?.[1] || 'Consumer Goods',
              grade: (gradeMatch?.[1] || 'C') as "S" | "A" | "B" | "C" | "D" | "F",
              carbonFootprint: parseFloat(carbonMatch?.[1] || '20'),
              biodegradable: parseFloat(biodegradableMatch?.[1] || '50'),
              suggestions: []
            };
            console.log('Extracted essential fields successfully');
          } else {
            throw new Error('Could not extract product information from response');
          }
        }
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse product analysis');
    }

    // Build suggestions with images and composition (only for non-demo mode)
    let suggestionsWithImages: ProductAnalysis['suggestions'] = [];
    
    if (!isDemo && analysis.suggestions && analysis.suggestions.length > 0) {
      console.log('Generating images for suggestions...');
      const suggestionPromises = (analysis.suggestions || []).slice(0, 3).map(async (s) => {
        const imageUrl = await generateProductImage(s.name, LOVABLE_API_KEY);
        return {
          name: s.name,
          grade: s.grade || 'A' as "S" | "A" | "B",
          amazonSearch: s.amazonSearch || s.name,
          flipkartSearch: s.flipkartSearch || s.name,
          carbonFootprint: Math.round(s.carbonFootprint) || 10,
          biodegradable: Math.round(s.biodegradable) || 85,
          imageUrl: imageUrl || undefined,
          composition: s.composition || undefined,
        };
      });
      
      suggestionsWithImages = await Promise.all(suggestionPromises);
      console.log('Generated images for', suggestionsWithImages.filter(s => s.imageUrl).length, 'suggestions');
    }

    // Validate and ensure proper structure
    const result: ProductAnalysis = {
      productName: analysis.productName || 'Unknown Product',
      category: analysis.category || 'Consumer Goods',
      grade: analysis.grade || 'C',
      carbonFootprint: Math.round(analysis.carbonFootprint) || 20,
      biodegradable: Math.round(analysis.biodegradable) || 50,
      composition: !isDemo ? analysis.composition : undefined, // Only include composition for authenticated users
      suggestions: suggestionsWithImages,
    };

    // Save scan result to database for authenticated users
    if (!isDemo && userId && supabaseServiceKey) {
      try {
        const adminClient = createClient(supabaseUrl, supabaseServiceKey);
        const { error: saveError } = await adminClient
          .from('scan_history')
          .insert({
            user_id: userId,
            product_name: result.productName,
            category: result.category,
            grade: result.grade,
            carbon_footprint: result.carbonFootprint,
            biodegradable: result.biodegradable,
            is_demo: false
          });
        
        if (saveError) {
          console.error('Failed to save scan to history:', saveError);
          // Don't fail the request - just log the error
        } else {
          console.log('Scan saved to history for user:', userId);
        }
      } catch (dbError) {
        console.error('Database error saving scan:', dbError);
        // Don't fail the request
      }
    }

    console.log('Analysis completed for:', result.productName);

    return new Response(
      JSON.stringify({ ...result, isDemo }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    // Log detailed error server-side only
    console.error('Request processing error [internal]:', error instanceof Error ? error.message : 'Unknown error');
    // Return generic message to client
    return new Response(
      JSON.stringify({ error: 'Unable to process request. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
