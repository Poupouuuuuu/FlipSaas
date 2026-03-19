import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envText = readFileSync('c:/Users/Adam/Desktop/VINTED SAAS/vinted-saas/.env.local', 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const key = env['NEXT_PUBLIC_SUPABASE_ANON_KEY'];

if (!url || !key) {
  console.error("Missing URL or KEY", { url, key });
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  const { data, error } = await supabase.auth.signUp({
    email: 'lecharlesadam@gmail.com',
    password: '#Hash09072001'
  });
  console.log("Error:", error?.message);
  console.log("Status:", error?.status);
  if (!error) {
    console.log("Success! User:", data.user?.id);
  }
}

run();
