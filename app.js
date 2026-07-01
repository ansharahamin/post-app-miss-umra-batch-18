let supabaseUrl = 'https://phgbkzvxbefidcrtagbt.supabase.co'
let supabaseKey = 'sb_publishable_xbv5T3RlyRtRymBO3pY69A_lTr1vU0s'
var supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
var cardBg;
var editId = null;
let email ;
window.onload = async function () {
  try {
    const { data, error } = await supabase.from('Post App Table').select('*').order('id', { ascending: false })
    console.log(data, error);
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with fetching data from database!",
      });
    }
    data.forEach(post => {
      var posts = document.getElementById("posts")

      posts.innerHTML += `
    <div class="card mb-2">
             <div class="card-header">${post.id} :${post.email} </div>
             <div style="background-image:url(${post.img_bg})" class="card-body">
               <figure>
                 <blockquote class="blockquote">
             
                   <p>
                     ${post.title}
                   </p>
                 </blockquote>
                 <figcaption class="blockquote-footer">
                   ${post.description}
                 </figcaption>
               </figure>
             </div>
             <div class="ms-auto m-2">
             <button onclick="editPost(event,${post.id})" class="btn btn-success">Edit</button>
             <button onclick="deletePost(event,${post.id})" class="btn btn-danger">Delete</button>
             </div>
           </div>
   `
    });
  } catch (error) {
    console.log(error.message);
  }


}

async function search() {
  var searchInput = document.getElementById('searchInput').value
  
  try {
    const { data, error } = await supabase
    .from('Post App Table')
    .select('*').order('id', { ascending: false })
    // .ilike('title', `%${searchInput}%`)
    .or(`title.ilike.%${searchInput}%,description.ilike.%${searchInput}%`)
    console.log(data);
    
    if (error) {
      console.log(error);
    }
    var posts = document.getElementById("posts")
    posts.innerHTML = ''
    data.forEach(post => {
     

      posts.innerHTML += `
    <div class="card mb-2">
             <div class="card-header">${post.id} , : ${post.email}</div>
             <div style="background-image:url(${post.img_bg})" class="card-body">
               <figure>
                 <blockquote class="blockquote">
                   <p>
                     ${post.title}
                   </p>
                 </blockquote>
                 <figcaption class="blockquote-footer">
                   ${post.description}
                 </figcaption>
               </figure>
             </div>
             <div class="ms-auto m-2">
             <button onclick="editPost(event,${post.id})" class="btn btn-success">Edit</button>
             <button onclick="deletePost(event,${post.id})" class="btn btn-danger">Delete</button>
             </div>
           </div>
   `
    });
  } catch (error) {
    console.log(error);
  }
 
}

async function logout(){
  try {
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.log(error);
    }
  } catch (error) {
    console.log(error);
  }
  window.location.href = "./index.html"
}

async function deletePost(event, id) {
  var card = event.target.parentNode.parentNode
  card.remove()
  try {
    const { data, error } = await supabase.from('Post App Table').delete().eq('id', id)
    if (error) {
      console.log(error);
    } else {

    }
  } catch (error) {
    console.log(error);
  }


}
async function editPost(event, id) {
  var card = event.target.parentNode.parentNode
  var title = card.children[1].children[0].children[0].children[0].innerText
  var description = card.children[1].children[0].children[1].innerText
  document.getElementById("title").value = title
  document.getElementById("description").value = description
  editId = id
 
  document.getElementById("post_btn").innerText = 'update post'

  console.log(title, description);
  card.remove()
}
async function post() {
  var title = document.getElementById("title")
  var description = document.getElementById("description")
  console.log(title.value, description.value);
  var posts = document.getElementById("posts")
  try {
    const { data: { user } ,error} = await supabase.auth.getUser()
    if (error) {
      console.log(error);
    }
    email = user.email
    console.log(user.email);
  } catch (error) {
    console.log(error);
  }
  if (title.value.trim() && description.value.trim()) {
    try {

      if (editId !== null) {
        const { data, error } = await supabase
          .from('Post App Table')
          .update({ title : title.value, description : description.value, img_bg: cardBg  })
          .eq('id', editId)
          .select()
          window.location.reload()
          if (error) {
            console.log(error);
          }
      } else {
       
        const { data, error } = await supabase
          .from('Post App Table')
          .insert({ title: title.value, description: description.value, img_bg: cardBg  , email:email})
          .select('*')
        window.location.reload()
        if (error) {
          console.log(error);
        }
      }
    

    } catch (error) {
      console.log(error);
    }

    location.reload()



  } else {
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Title & description can't be empty!",
    });
  }
  title.value = ""
  description.value = ""
}
function selectImg(src) {
  cardBg = src
  console.log(src, event.target.classList);
  // event.target.className += " selectedImg"
  var bgImg = document.getElementsByClassName("bgImg")
  for (var i = 0; i < bgImg.length; i++) {
    console.log(bgImg[i].className);
    bgImg[i].className = "bgImg"
  }
  event.target.classList.add("selectedImg")
}

