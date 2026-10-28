// অফলাইন ক্যাশ: পেজ/স্ক্রিপ্ট আগে নেট থেকে (সবসময় নতুন), না পেলে ক্যাশ থেকে; ফন্ট/আইকন ক্যাশ থেকে
const C="vocab-v2";
self.addEventListener("install",()=>self.skipWaiting());
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==C).map(x=>caches.delete(x)))).then(()=>clients.claim())));
self.addEventListener("fetch",e=>{
  const r=e.request,u=new URL(r.url);
  if(r.method!=="GET"||u.origin!==location.origin)return;
  const fresh=r.mode==="navigate"||/\.(html|js|json|webmanifest)$/.test(u.pathname)||u.pathname.endsWith("/");
  e.respondWith(caches.open(C).then(async c=>{
    if(fresh){
      try{const n=await fetch(r,{cache:"no-cache"});if(n.ok)c.put(r,n.clone());return n}
      catch(_){return(await c.match(r,{ignoreSearch:true}))||Response.error()}
    }
    const hit=await c.match(r,{ignoreSearch:true});if(hit)return hit;
    const n=await fetch(r);if(n.ok)c.put(r,n.clone());return n;
  }));
});
