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

function getClientIP(req: Request): string {
  return req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 
         req.headers.get('x-real-ip') || 
         'unknown';
}

function isRateLimited(clientIP: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(clientIP);
  
  // Clean up old entries periodically
  if (rateLimitMap.size > 1000) {
    for (const [ip, data] of rateLimitMap.entries()) {
      if (now > data.resetTime) {
        rateLimitMap.delete(ip);
      }
    }
  }
  
  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }
  
  if (entry.count >= MAX_REQUESTS_PER_WINDOW) {
    return true;
  }
  
  entry.count++;
  return false;
}

interface ProductAnalysis {
  productName: string;
  category: string;
  grade: "S" | "A" | "B" | "C" | "D" | "F";
  carbonFootprint: number;
  biodegradable: number;
  suggestions: {
    name: string;
    grade: "S" | "A" | "B";
    amazonSearch: string;
    flipkartSearch: string;
    carbonFootprint: number;
    biodegradable: number;
  }[];
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check for demo mode in request body first (parsed later)
    const body = await req.json();
    const { imageBase64, isDemo = false } = body;

    // Authentication check - required for non-demo requests
    const authHeader = req.headers.get('Authorization');
    let userId: string | null = null;

    if (!isDemo) {
      if (!authHeader) {
        console.warn('No authorization header provided for authenticated request');
        return new Response(
          JSON.stringify({ error: 'Authentication required. Please log in to scan products.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Verify the JWT token
      const supabaseUrl = Deno.env.get('SUPABASE_URL');
      const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY');
      
      if (!supabaseUrl || !supabaseAnonKey) {
        console.error('Supabase configuration missing');
        throw new Error('Server configuration error');
      }

      const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
        global: { headers: { Authorization: authHeader } }
      });

      const { data: { user }, error: authError } = await supabaseClient.auth.getUser();
      
      if (authError || !user) {
        console.warn('Invalid authentication token:', authError?.message);
        return new Response(
          JSON.stringify({ error: 'Invalid authentication. Please log in again.' }),
          { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      userId = user.id;
      console.log(`Authenticated request from user: ${userId}`);
    } else {
      console.log('Demo mode request - limited features');
    }

    // Rate limiting check
    const clientIP = getClientIP(req);
    if (isRateLimited(clientIP)) {
      console.warn(`Rate limit exceeded for IP: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a moment and try again.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' } }
      );
    }

    // Input validation: check if imageBase64 exists and has reasonable size
    if (!imageBase64) {
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

    // Basic base64/data URI format validation
    const isDataUri = imageBase64.startsWith('data:image/');
    const isPlainBase64 = /^[A-Za-z0-9+/]+=*$/.test(imageBase64.slice(0, 100));
    if (!isDataUri && !isPlainBase64) {
      return new Response(
        JSON.stringify({ error: 'Invalid image format. Please upload a valid image.' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
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
  "suggestions": [
    {
      "name": "eco-friendly alternative IN THE SAME CATEGORY with full product name",
      "grade": "S" | "A" | "B",
      "amazonSearch": "exact search query for this specific product on amazon",
      "flipkartSearch": "exact search query for this specific product on flipkart",
      "carbonFootprint": number (lower than original),
      "biodegradable": number (higher than original)
    }
  ]
}

SUGGESTION RULES - CRITICAL:
- Match the EXACT product category (chips → chips, soda → soda, shampoo → shampoo)
- Suggest REAL eco-friendly brands that exist:
  * Chips: "Slurrp Farm Millet Puffs", "Too Yumm Veggie Stix", "Yoga Bar Protein Chips"
  * Beverages: "Paper Boat Aam Panna", "Raw Pressery Cold Pressed Juice"
  * Personal Care: "Mamaearth", "WOW Skin Science", "Khadi Natural"
  * Household: "Beco Eco-Friendly", "The Better Home", "Purecosheet"
- Include product size/variant in suggestion names
- NEVER suggest unrelated categories

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
      console.error('AI Gateway error:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'AI credits exhausted. Please add more credits.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    console.log('AI Response received');

    if (!content) {
      throw new Error('No response from AI');
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
      
      analysis = JSON.parse(cleanContent.trim());
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      throw new Error('Failed to parse product analysis');
    }

    // Validate and ensure proper structure
    const result: ProductAnalysis = {
      productName: analysis.productName || 'Unknown Product',
      category: analysis.category || 'Consumer Goods',
      grade: analysis.grade || 'C',
      carbonFootprint: Math.round(analysis.carbonFootprint) || 20,
      biodegradable: Math.round(analysis.biodegradable) || 50,
      // For demo mode, don't include suggestions
      suggestions: isDemo ? [] : (analysis.suggestions || []).slice(0, 3).map(s => ({
        name: s.name,
        grade: s.grade || 'A',
        amazonSearch: s.amazonSearch || s.name,
        flipkartSearch: s.flipkartSearch || s.name,
        carbonFootprint: Math.round(s.carbonFootprint) || 10,
        biodegradable: Math.round(s.biodegradable) || 85,
      })),
    };

    console.log('Analysis completed for:', result.productName);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error analyzing product:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to analyze product. Please try again.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
