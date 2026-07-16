import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm'
const supabase_url = "https://phgbkzvxbefidcrtagbt.supabase.co"
const supabase_key = "sb_publishable_xbv5T3RlyRtRymBO3pY69A_lTr1vU0s"
const supabase = createClient(supabase_url, supabase_key)



async function register() {
  event.preventDefault()
  var name = document.getElementById("name").value
  var email = document.getElementById("email").value
  var phone = document.getElementById("phone").value
  var password = document.getElementById("password").value
  var cpassword = document.getElementById("cpassword").value

  // var data = {
  //     name: name,
  //     email,
  //     phone,
  //     password,
  //     cpassword
  // }
  if (!name) {
    alert("Name is required")
  } else if (password !== cpassword) {
    alert("Passwords should be identical")
  } else {
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user);
    // localStorage.setItem("data",JSON.stringify(data))
    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            first_name: name,
            phone: phone,
            password:password,
            role: 'user'
          }
        }
      })
      console.log(data);
      window.location.href="/dashboard.html"
      if (error) {
        alert(error);
      }
    } catch (error) {
      console.log(error.email);
    }

    window.location.href="/dashboard.html"
  }



}


async function login() {
  event.preventDefault()
  var loginEmail = document.getElementById("loginEmail").value
  var loginPass = document.getElementById("loginPass").value
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginEmail,
      password: loginPass,
    })
    console.log(data);
    window.location.href = "/dashboard.html"
    if (error) {
      alert(error)
    }
  } catch (error) {
    console.log(error);
  }


}
// const { data } = supabase.auth.onAuthStateChange((event, session) => {
//   console.log(event, session)
//   if (event === 'INITIAL_SESSION') {
//     if (!session) {
//       alert('user not found!')
//     }
//   } else if (event === 'SIGNED_IN') {
//     alert('user signed in successfully')
//     // window.location.href = './dashboard.html'
//   } else if (event === 'SIGNED_OUT') {
//     alert('user signed out!!')
//     session = null
//     window.location.href = './index.html'
//   }
// })


async function continueWithGoogle(){
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: 'http://127.0.0.1:5500/dashboard.html'
      }
    })
    if(error){
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
}
window.register = register;
window.login = login;
window.continueWithGoogle = continueWithGoogle
