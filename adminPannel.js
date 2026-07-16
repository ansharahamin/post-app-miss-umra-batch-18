import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'

var supabase = createClient('https://phgbkzvxbefidcrtagbt.supabase.co', 'sb_publishable_xbv5T3RlyRtRymBO3pY69A_lTr1vU0s')
const supabaseAdmin = createClient(
  'https://phgbkzvxbefidcrtagbt.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBoZ2JrenZ4YmVmaWRjcnRhZ2J0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4MTY4NjgwNCwiZXhwIjoyMDk3MjYyODA0fQ.dWpsNLMQKkc4u_IYdfP-Z5FPSMruMnKcp7oSFBD5-UY' // Found in Project Settings → API
)


// 🔐 Check if user is admin
async function checkAdmin() {

  const { data: { user }, error } = await supabase.auth.getUser();

  if (!user) {
      window.location.href = "/index.html";
    return;   // 👈 zaroori
  }

  if (user.user_metadata.role !== "admin") {
    alert("Access Denied");
    window.location.href = "/dashboard.html";
    return
  }

}

checkAdmin();

async function loadStats() {
  try {
    const {data , error} = await supabase.from('Post App Table').select('*')
    document.getElementById('totalPosts').innerHTML = data.length
    if (error) {
      console.log(error);
      return
    }
  } catch (error) {
    console.log(error);
    
  }

  try {
    const { data: { users }, error } = await supabaseAdmin.auth.admin.listUsers()
    console.log(users.length);
    if (error) {
      console.error(error.message);
      return
    }
    document.getElementById('totalUsers').innerHTML = users.length
  } catch (error) {
    console.log(error);
    return
  }
}
loadStats()
window.loadStats = loadStats
window.checkAdmin = checkAdmin