import { createClient } from "@/utils/supabase/server";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    return NextResponse.json({ success: false, error: "Not logged in" }, { status: 401 });
  }

  const formData = await req.formData();
  const username = formData.get("username") as string;
  const avatarFile = formData.get("avatar") as File;

  let avatarUrl = undefined;

  if (avatarFile && avatarFile.size > 0) {
    const ext = avatarFile.name.split(".").pop();
    const fileName = `${session.user.id}-${Date.now()}.${ext}`;
    
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("avatars")
      .upload(fileName, avatarFile, { upsert: true });

    if (uploadError) {
      return NextResponse.json({ success: false, error: "Failed to upload avatar" }, { status: 400 });
    }

    const { data: publicUrlData } = supabase.storage
      .from("avatars")
      .getPublicUrl(fileName);
      
    avatarUrl = publicUrlData.publicUrl;
  }

  const updateData: any = {};
  if (username) updateData.username = username;
  if (avatarUrl) updateData.avatar_url = avatarUrl;

  const { error } = await supabase
    .from("profiles")
    .update(updateData)
    .eq("id", session.user.id);

  if (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({ success: true, avatar_url: avatarUrl });
}
