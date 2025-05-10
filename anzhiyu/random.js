var posts=["2025/05/10/first/","2025/05/10/hello-world/","2025/05/10/xxx/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };