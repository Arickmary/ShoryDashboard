import { createClient } from '@supabase/supabase-js';

const supabaseUrl = window.APP_CONFIG?.SUPABASE_URL;
const supabaseKey = window.APP_CONFIG?.SUPABASE_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;
let supabaseInitError: string | null = null;

if (!supabaseUrl || !supabaseKey) {
    supabaseInitError = "Supabase URL or Key is not set in config.js. Please create the file and add your credentials.";
} else {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseClient;
export const supabaseError = supabaseInitError;