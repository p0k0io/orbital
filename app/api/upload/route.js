import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_KEY
)

export async function POST(req) {
  try {
    const body = await req.json()
    const { file, fileName } = body

    if (!file || !fileName) {
      return new Response(JSON.stringify({ message: "File and fileName required" }), { status: 400 })
    }

    const buffer = Buffer.from(file, "base64")

    const { data, error } = await supabase.storage
      .from("upload")
      .upload(fileName, buffer, { cacheControl: "3600", upsert: false })

    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    return new Response(JSON.stringify({ message: "File uploaded", data }), { status: 200 })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 })
  }
}
