import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'
import { parseGamepassId } from '@/lib/roblox'

export async function GET() {
    const supabase = await createClient();
    try {
        const { data, error } = await supabase.from('products').select('*').order('created_at', { ascending: false });
        if (error) return NextResponse.json({ uspeh: false, greska: error.message }, { status: 400 });
        return NextResponse.json({ uspeh: true, podaci: data });
    } catch (err: any) {
        return NextResponse.json({ uspeh: false, greska: err.message }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const supabase = await createClient();

    try {
        const formData = await req.formData();
        const title = formData.get('title') as string;
        const description = formData.get('description') as string;
        const isFree = formData.get('isFree') === 'true';
        const robloxLink = isFree ? null : (formData.get('robloxLink') as string);
        const category = formData.get('category') as string || 'Model';
        const stylesJson = formData.get('styles') as string;
        let styles = {};
        if (stylesJson) {
            try { styles = JSON.parse(stylesJson); } catch(e) {}
        }
        const imageFile = formData.get('image') as File | null;
        const itemFile = formData.get('file') as File | null;

        if (!title || (!isFree && !robloxLink) || !imageFile || !itemFile) {
            return NextResponse.json({ success: false, error: 'Missing required fields or files.' }, { status: 400 });
        }

        let pravaCena = 0;
        let gamepassId = "";

        if (!isFree && robloxLink) {
            const parsedId = parseGamepassId(robloxLink);
            if (!parsedId) {
                return NextResponse.json({ success: false, error: 'Invalid Roblox Gamepass link.' }, { status: 400 });
            }
            gamepassId = parsedId;
            // Price is set on admin approve (Roblox API called once there)
            pravaCena = 0;
        }

        // 2. Upload slike na Supabase
        const extImg = imageFile.name.split('.').pop();
        const imageName = `${crypto.randomUUID()}.${extImg}`;
        const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
        
        const { error: imgErr } = await supabase.storage
            .from('shop-assets')
            .upload(`images/${imageName}`, imageBuffer, { 
                contentType: imageFile.type 
            });

        if (imgErr) {
            return NextResponse.json({ success: false, error: 'Image upload error: ' + imgErr.message }, { status: 400 });
        }

        // 3. Upload .rbxm fajla na Supabase
        const extFile = itemFile.name.split('.').pop();
        const fileName = `${crypto.randomUUID()}.${extFile}`;
        const itemBuffer = Buffer.from(await itemFile.arrayBuffer());
        const jeRobloxFajl = itemFile.name.endsWith('.rbxm') || itemFile.name.endsWith('.rbxl');

        const { error: fileErr } = await supabase.storage
            .from('shop-assets')
            .upload(`files/${fileName}`, itemBuffer, { 
                contentType: jeRobloxFajl ? 'application/octet-stream' : itemFile.type,
                upsert: true
            });

        if (fileErr) {
            return NextResponse.json({ success: false, error: 'Roblox file upload error: ' + fileErr.message }, { status: 400 });
        }

        // Generisanje URL-ova
        const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shop-assets/images/${imageName}`;
        const fileUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/shop-assets/files/${fileName}`;

        // 4. Upis u bazu
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        
        if (authError || !user) {
            return NextResponse.json({ success: false, error: 'Unauthorized. Please log in.' }, { status: 401 });
        }
        const sellerId = user.id;

        const { data, error: dbErr } = await supabase
            .from('products')
            .insert([
                {
                    title,
                    description,
                    price: pravaCena,
                    gamepass_link: isFree ? null : robloxLink,
                    category,
                    styles,
                    image_url: imageUrl,
                    file_url: fileUrl,
                    seller_id: sellerId,
                    approved: 'pending'
                }
            ]).select();

        if (dbErr) {
            return NextResponse.json({ success: false, error: 'Database insert error: ' + dbErr.message }, { status: 400 });
        }

        const inserted = data?.[0];
        if (inserted?.id && styles && typeof styles === 'object') {
            const s = styles as Record<string, string | number | boolean | undefined>;
            await supabase
                .from('product_customization')
                .upsert({
                    product_id: inserted.id,
                    bg_color_or_image: (s.bgColor as string) || '#13192b',
                    title_color: (s.titleColor as string) || '#ffffff',
                    description_color: (s.descriptionColor as string) || '#94A3B8',
                    title_font: (s.titleFont as string) || 'default',
                    description_font: (s.descriptionFont as string) || 'default',
                    border_style: (s.frameStyle as string) || 'none',
                    border_color: (s.borderColor as string) || '#3b82f6',
                    border_width: typeof s.borderWidth === 'number' ? s.borderWidth : 1.5,
                    niche_type: category,
                    bg_image_storage_url: (s.bgImage as string) || null,
                }, { onConflict: 'product_id' });
        }

        return NextResponse.json({ 
            success: true, 
            data, 
            message: `Asset successfully published and is awaiting admin approval! ${isFree ? 'It is set as Free.' : 'Price will be verified when an admin approves your listing.'}` 
        });

    } catch (err: any) {
        console.error("Upload error:", err);
        return NextResponse.json({ success: false, error: 'System error: ' + err.message }, { status: 500 });
    }
}
