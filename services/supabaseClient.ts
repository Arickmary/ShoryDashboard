import { createClient } from '@supabase/supabase-js';

const supabaseUrl = window.APP_CONFIG?.SUPABASE_URL;
const supabaseKey = window.APP_CONFIG?.SUPABASE_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;
let supabaseInitError: string | null = null;

if (!supabaseUrl || !supabaseKey || supabaseUrl.startsWith("YOUR_")) {
    supabaseInitError = "Supabase URL or Key is not set. Please add your credentials to the script in your index.html file.";
} else {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseClient;
export const supabaseError = supabaseInitError;