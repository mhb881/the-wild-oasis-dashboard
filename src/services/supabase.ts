// Vite：框架通常已经内置了 .env 支持，无需额外配置
// 使用方法：import.meta.env.VITE_API_URL
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export const supabaseUrl = "https://ssaqafewdtcpnbgshmzb.supabase.co";
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;

const supabase: SupabaseClient = createClient(supabaseUrl, supabaseKey);

export default supabase;
