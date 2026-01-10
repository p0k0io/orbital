import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

export async function POST(req) {
    const body = await req.json();
    console.log("Received data:", body);

    const { textInput, word, pdf, image } = body;

    console.log("Text Input:", textInput);
    console.log("Options - Word:", word, "PDF:", pdf, "Image:", image);

    
    return new Response(JSON.stringify({ message: "Data received", body }), { status: 200 });
}
