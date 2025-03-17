import { createClient } from '@supabase/supabase-js';

const supabaseAdmin = createClient(
  'https://unffaxaoxebjzbgsopom.supabase.co',
  process.env.SUPABASE_ADMIN_SECRET
);
export default supabaseAdmin;
