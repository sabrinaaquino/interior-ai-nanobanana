import { NextResponse } from "next/server";

export const runtime = "edge"; 

export async function POST(req: Request) {
  try {
    const { imageBase64, style, resolution, count } = await req.json();

    if (!process.env.VENICE_API_KEY) {
      return NextResponse.json(
        { error: "VENICE_API_KEY is not set" },
        { status: 500 }
      );
    }

    const base64Data = imageBase64.replace(/^data:image\/\w+;base64,/, "");

    // Based on the user's finding that the OpenAI-compatible `generations` endpoint 
    // does NOT accept input images, and `edits` endpoint on OpenAI path is likely not documented/supported fully 
    // in the way we want (or user can't find it), we are stuck with the `api/v1/image/edit` endpoint.
    
    // However, we know this endpoint is very strict (rejects most params).
    // And the model behind it seems to have a low default denoising strength (conservative editing).
    
    // The ONLY tool we have left is prompt hacking.
    // We need to trick the model into "ignoring" the source content more.
    // One technique is to describe the image as "Empty room" + "New furniture".
    // Or use "Construction site" -> "Finished room" logic? No.
    
    // Let's try a "Negative-Positive" reinforcement in the prompt itself, 
    // since `negative_prompt` parameter is rejected.
    // "NOT old furniture. NOT clutter. NEW modern furniture."
    
    // Also, the user said "it has images generations but i dont think it accepts images as input".
    // This confirms we MUST use the `edit` endpoint we are currently on.
    
    const directive = `(IGNORE ORIGINAL FURNITURE), (REPLACE ALL FURNITURE), ${style} interior design makeover. High quality, 8k. The room is completely renovated with new ${style} items. No old furniture remains.`;

    const payload = {
      prompt: directive,
      image: base64Data,
    };

    console.log("Calling Venice API (Edit) - Final Prompt Strategy");

    const response = await fetch("https://api.venice.ai/api/v1/image/edit", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.VENICE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Venice API Error:", errorText);
      return NextResponse.json(
        { error: `Venice API failed: ${response.status} ${response.statusText}`, details: errorText },
        { status: response.status }
      );
    }

    const contentType = response.headers.get("content-type");
    if (contentType && contentType.includes("image")) {
      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);
      const b64 = buffer.toString("base64");
      
      return NextResponse.json({
        data: [{ b64_json: b64 }]
      });
    }

    const data = await response.json();
    
    if (data.images && Array.isArray(data.images)) {
      return NextResponse.json({
        data: data.images.map((img: string) => ({ b64_json: img }))
      });
    }
    
    return NextResponse.json(data);

  } catch (error) {
    console.error("Server Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
