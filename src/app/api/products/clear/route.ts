import { createClient } from '@/utils/supabase/server'
import { revalidateTag } from 'next/cache'
import { NextResponse } from 'next/server'

export async function DELETE() {
  try {
    const supabase = await createClient()
    const { error } = await supabase.from('products').delete().gt('id', 0)
    
    if (error) {
      return NextResponse.json({ uspeh: false, greska: error.message }, { status: 400 })
    }

    revalidateTag('feed-products', { expire: 0 })
    
    return NextResponse.json({ uspeh: true, poruka: 'Svi proizvodi su obrisani.' })
  } catch (err: any) {
    return NextResponse.json({ uspeh: false, greska: err.message }, { status: 500 })
  }
}
