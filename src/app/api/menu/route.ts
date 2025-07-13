import {NextRequest} from 'next/server'

import {supabase} from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const {searchParams} = new URL(req.url)
  const date = searchParams.get('date')
  const mealType = searchParams.get('mealType')
  const category = searchParams.get('category')

  if (!date || !mealType || !category) {
    return new Response(JSON.stringify({message: 'Invalid params'}), {
      status: 400,
      headers: {'Content-Type': 'application/json'},
    })
  }

  const {data, error} = await supabase
    .from('daily_menu')
    .select('*')
    .eq('date', date)
    .eq('meal_type_id', mealType)
    .eq('category_id', category)
    .single()

  if (error || !data) {
    return new Response(JSON.stringify({message: error?.message || 'Not found'}), {
      status: 404,
      headers: {'Content-Type': 'application/json'},
    })
  }

  return new Response(JSON.stringify(data), {
    status: 200,
    headers: {'Content-Type': 'application/json'},
  })
} 