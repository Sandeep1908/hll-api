import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://uyrigmozmslzthznwdlo.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV5cmlnbW96bXNsenRoem53ZGxvIiwicm9sZSI6ImFub24iLCJpYXQiOjE2ODQ2ODcyMTMsImV4cCI6MjAwMDI2MzIxM30.xriPVXwXgFCP1bFPo3-d8egspfJgQQsUq5-M_rPgaK8'
);
export default supabase;
