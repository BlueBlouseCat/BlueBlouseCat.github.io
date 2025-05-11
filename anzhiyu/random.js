var posts=["2025/05/11/first/","2025/05/11/hello-world/","2025/05/11/tttt/","2025/05/11/xxx/"];function toRandomPost(){
    pjax.loadUrl('/'+posts[Math.floor(Math.random() * posts.length)]);
  };