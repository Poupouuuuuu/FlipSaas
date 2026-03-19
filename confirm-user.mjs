import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';

const envText = readFileSync('c:/Users/Adam/Desktop/VINTED SAAS/vinted-saas/.env.local', 'utf-8');
const env = {};
envText.split('\n').forEach(line => {
  const match = line.match(/^([^#=]+)=(.*)$/);
  if (match) env[match[1].trim()] = match[2].trim().replace(/^['"]|['"]$/g, '');
});

const url = env['NEXT_PUBLIC_SUPABASE_URL'];
const key = env['SUPABASE_SERVICE_ROLE_KEY'];

const supabase = createClient(url, key);

async function run() {
  const { data: users, error: listError } = await supabase.auth.admin.listUsers();
  if (listError) return console.error("List Error:", listError);
  
  const user = users.users.find(u => u.email === 'lecharlesadam@gmail.com');
  if (user) {
    const { data, error } = await supabase.auth.admin.updateUserById(user.id, { email_confirm: true });
    if (error) {
      console.log("Update Error:", error);
    } else {
      console.log("User confirmed successfully! ID:", data.user.id);
    }
  } else {
    console.log("User not found.");
  }
}

run();
