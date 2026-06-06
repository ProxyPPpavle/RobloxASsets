import { NextRequest, NextResponse } from "next/server";
import { fetchRobloxPrice } from "@/lib/roblox";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ gamepassId: string }> }
) {
  try {
    const gamepassId = (await params).gamepassId;
    const price = await fetchRobloxPrice(gamepassId);

    if (price === null) {
      return NextResponse.json(
        { uspeh: false, greska: "Could not read Roblox price for this gamepass." },
        { status: 404 }
      );
    }

    return NextResponse.json({ uspeh: true, price });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    return NextResponse.json({ uspeh: false, greska: message }, { status: 500 });
  }
}
