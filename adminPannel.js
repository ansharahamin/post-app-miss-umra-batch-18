import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

var supabase = createClient('https://ahsssjritbabkgtpwdcr.supabase.co', 'sb_publishable_EAULxzXyJbY24Gx6WQNRKQ_SlVkqh91')
const supabaseAdmin = createClient(
  'https://ahsssjritbabkgtpwdcr.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoc3NzanJpdGJhYmtndHB3ZGNyIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MjI3NjcxNCwiZXhwIjoyMDk3ODUyNzE0fQ.Ebic9HhTdHNWjSpQ7lJ9aaXvVWp9VPP7tpW_cF-hO3k' // Found in Project Settings → API
)


// 🔐 Check if user is admin
async function checkAdmin() {

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
    window.location.href = "/";
    return;
  }

  if (user.user_metadata.role !== "admin") {
    alert("Access Denied");
    window.location.href = "/dashboard.html";
  }

}

checkAdmin();