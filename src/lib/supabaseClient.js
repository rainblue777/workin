import { createClient } from '@supabase/supabase-js'

// Vite에서는 VITE_로 시작하는 환경변수만 브라우저 코드에서 읽을 수 있습니다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabasePublishableKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY

// 값이 비어 있으면 Supabase 연결이 동작하지 않으므로 개발자가 바로 확인할 수 있게 알려줍니다.
if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase 환경변수가 없습니다. .env.local의 VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY를 확인하세요.',
  )
}

// 다른 파일에서 import { supabase } 형태로 가져다 쓸 Supabase 클라이언트입니다.
export const supabase = createClient(supabaseUrl, supabasePublishableKey)
