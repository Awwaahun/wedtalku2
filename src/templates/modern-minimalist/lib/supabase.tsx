import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://pdjgcmcpdyosofpbjqfp.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBkamdjbWNwZHlvc29mcGJqcWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAyODUyMjYsImV4cCI6MjA3NTg2MTIyNn0.AgXF7oObUf3O9BAN3fwM7PSUk_AW6_rXwYfHw5KyXhY";

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
        