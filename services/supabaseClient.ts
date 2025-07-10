import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

let supabaseClient: ReturnType<typeof createClient> | null = null;
let supabaseInitError: string | null = null;

if (!supabaseUrl || !supabaseKey) {
    supabaseInitError = "Supabase URL or Key is not set in environment variables. Please check your .env file.";
} else {
    supabaseClient = createClient(supabaseUrl, supabaseKey);
}

export const supabase = supabaseClient;
export const supabaseError = supabaseInitError;
