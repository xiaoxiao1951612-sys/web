import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // 在开发阶段尽早暴露配置缺失问题；生产环境同样需要配置，否则数据层会 fallback
  console.warn(
    '[Supabase] 缺少 VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY，云端数据将不可用。'
  );
}

export const supabase = createClient(supabaseUrl ?? '', supabaseAnonKey ?? '');

