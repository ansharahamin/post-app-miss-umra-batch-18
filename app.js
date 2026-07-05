let supabaseUrl = 'https://phgbkzvxbefidcrtagbt.supabase.co'
let supabaseKey = 'sb_publishable_xbv5T3RlyRtRymBO3pY69A_lTr1vU0s'
var supabase = window.supabase.createClient(supabaseUrl, supabaseKey)
var cardBg;
var editId = null;
let email;
var user_id;
var currentUserId = null;
var currentUserEmail = null;

window.onload = async function () {

  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      currentUserId = user.id;
      console.log("Current User ID:", currentUserId);
    } else {
      console.log("No user is currently logged in.");
    }
  } catch (error) {
    console.log(error);
  }

  var posts = []
  try {
    const { data, error } = await supabase.from('Post App Table').select('*').order('id', { ascending: false })
    console.log(data, error);
    if (error) {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong with fetching data from database!",
      });
    } else {
      posts = data
    }
  } catch (error) {
    console.log(error.message);
  }

  const { data: likes } = await supabase.from('Likes').select('*')
  const { data: comments } = await supabase.from('Comments').select('*').order('created_at', { ascending: true })
  renderPosts(posts, likes || [], comments || [])
}

function renderPosts(posts, likes, comments) {
  var postsDiv = document.getElementById("posts")
  postsDiv.innerHTML = ''

  posts.forEach(post => {
    var isOwner = post.user_id === currentUserId

    var postLikes = likes.filter(l => l.post_id === post.id)
    var likeCount = postLikes.length
    var isLiked = postLikes.some(l => l.user_id === currentUserId)

    var postComments = comments.filter(c => c.post_id === post.id)
    var commentCount = postComments.length

    var commentsHtml = postComments.map(c => `
      <div class="comment-item d-flex justify-content-between">
        <small><b>${c.email}:</b> ${c.comment_text}</small>
        ${c.user_id === currentUserId ? `<span onclick="deleteComment(event, ${c.id})" style="cursor:pointer" class="text-danger">✖</span>` : ''}
      </div>
    `).join('')

    postsDiv.innerHTML += `
    <div class="card mb-2" id="post-${post.id}">
      <div class="card-header">${post.id} :${post.email} </div>
      <div style="background-image:url(${post.img_bg})" class="card-body">
        <figure>
          <blockquote class="blockquote">
            <p>${post.title}</p>
          </blockquote>
          <figcaption class="blockquote-footer">${post.description}</figcaption>
        </figure>
      </div>

      <div class="d-flex align-items-center gap-3 px-2">
        <span onclick="toggleLike(event, ${post.id})" style="cursor:pointer">
          ${isLiked ? '❤️' : '🤍'} <span id="like-count-${post.id}">${likeCount}</span>
        </span>
        <span onclick="toggleCommentsBox(${post.id})" style="cursor:pointer">
          💬 <span id="comment-count-${post.id}">${commentCount}</span>
        </span>
      </div>

      <div id="comments-box-${post.id}" style="display:none" class="p-2">
        <div id="comments-list-${post.id}">
          ${commentsHtml}
        </div>
        <div class="d-flex gap-1 mt-1">
          <input type="text" id="comment-input-${post.id}" class="form-control form-control-sm" placeholder="Add a comment...">
          <button onclick="addComment(event, ${post.id})" class="btn btn-sm btn-primary">Send</button>
        </div>
      </div>

      <div class="ms-auto m-2">
        ${isOwner ? `
          <button onclick="editPost(event,${post.id})" class="btn btn-success">Edit</button>
          <button onclick="deletePost(event,${post.id})" class="btn btn-danger">Delete</button>
        ` : ''}
      </div>
    </div>
    `
  })
}
async function search() {
  var searchInput = document.getElementById('searchInput').value
  try {
    const { data: { user } } = await supabase.auth.getUser()
    if (user) {
      currentUserId = user.id;
      currentUserEmail = user.email;
      console.log("Current User ID:", currentUserId);
      console.log("Current User Email:", currentUserEmail);
    } else {
      console.log("No user is currently logged in.");
    }
  } catch (error) {
    console.log(error);
  }
  try {
    const { data: posts, error } = await supabase
      .from('Post App Table')
      .select('*').order('id', { ascending: false })
      // .ilike('title', `%${searchInput}%`)
      .or(`title.ilike.%${searchInput}%,description.ilike.%${searchInput}%, email.ilike.%${searchInput}%`)
    console.log(posts);
    if(posts.length === 0) {
      console.log("No posts found.");
      Swal.fire({
        icon: "info",
        title: "No results",
        text: "No posts found matching your search.",
      });
    }
    if (error) {
      console.log(error.message);
    }
    const { data: likes } = await supabase.from('Likes').select('*')
    const { data: comments } = await supabase.from('Comments').select('*').order('created_at', { ascending: true })

    renderPosts(posts, likes || [], comments || [])

  } catch (error) {
    console.log(error.message);
  }
}
async function logout() {
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
  var deleteBtn = document.getElementById(`deleteBtn${id}`)
  try {
    const { data, error } = await supabase.from('Post App Table').delete().eq('id', id).select()
    if (error) {
      console.log(error);
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Delete failed: " + error.message,
      });
      return
    }
    console.log(data);
    if (!data || data.length === 0) {
      Swal.fire({
        icon: "error",
        title: "Not allowed",
        text: "You can only delete your own posts!",
      });
      // deleteBtn.disabled = true

    } else {
      console.log("Post deleted successfully", data);
      card.remove()
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
    const { data: { user }, error } = await supabase.auth.getUser()
    if (error) {
      console.log(error);
    }
    email = user.email
    user_id = user.id
    console.log(user.email);
  } catch (error) {
    console.log(error);
  }
  if (title.value.trim() && description.value.trim()) {
    try {

      if (editId !== null) {
        const { data, error } = await supabase
          .from('Post App Table')
          .update({ title: title.value, description: description.value, img_bg: cardBg, user_id: user_id })
          .eq('id', editId)
          .select()
        // window.location.reload()
        if (error) {
          console.log(error);
        }
        if (!data || data.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Not allowed",
            text: "You can only edit your own posts!",
          });
        }
      } else {

        const { data, error } = await supabase
          .from('Post App Table')
          .insert({ title: title.value, description: description.value, img_bg: cardBg, email: email, user_id: user_id })
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

async function toggleLike(event, postId) {
  if (!currentUserId) {
    Swal.fire({ icon: "info", title: "Login required", text: "Please login to like posts." });
    return
  }
  try {
    const { data: existingLike, error } = await supabase
      .from('Likes')
      .select()
      .eq('post_id', postId)
      .eq('user_id', currentUserId)
      .maybeSingle()
    if (existingLike) {
      // Unlike the post
      const { data, error } = await supabase
        .from('Likes')
        .delete()
        .eq('post_id', postId)
        .eq('user_id', currentUserId)
    } else {
      // Like the post
      const { data, error } = await supabase
        .from('Likes')
        .insert({ post_id: postId, user_id: currentUserId })
    }
    location.reload()
  } catch (error) {
    console.log(error.message);
  }
}

function toggleCommentsBox(postId) {
  var box = document.getElementById(`comments-box-${postId}`)
  box.style.display = box.style.display === 'none' ? 'block' : 'none'
}
async function addComment(event, postId) {
  if (!currentUserId) {
    Swal.fire({ icon: "info", title: "Login required", text: "Please login to comment on posts." });
    return
  }
  var input = document.getElementById(`comment-input-${postId}`)
  var commentText = input.value.trim()
  currentUserEmail = currentUserEmail || (await supabase.auth.getUser()).data.user.email;
  if (!commentText) {
    Swal.fire({ icon: "error", title: "Oops...", text: "Comment can't be empty!" });
    return
  }
  location.reload()
  try {
    const { error } = await supabase
      .from('Comments')
      .insert({ post_id: postId, user_id: currentUserId, comment_text: commentText, email: currentUserEmail })
    if (error) {
      console.log(error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to add comment!" });
      return
    }
    input.value = ""

  } catch (error) {
    console.log(error.message);
  }
}
async function deleteComment(event, commentId) {
  try{
    const { data, error } = await supabase
    .from('Comments')
    .delete()
    .eq('id', commentId)
    if (error) {
      console.log(error);
      Swal.fire({ icon: "error", title: "Oops...", text: "Failed to delete comment!" });
      return
    }
    if(!data || data.length === 0 ){
      Swal.fire({ icon: "error", title: "Not allowed", text: "You can only delete your own comments!" });
    }
    location.reload()
  }catch(error){
    console.log(error.message);
  }
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

