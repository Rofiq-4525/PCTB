/* PCTB – সার্ভিস ওয়ার্কার */
const V='pctb-v5';
const CORE=['./'];
/* এই হোস্টগুলোর ফাইল ক্যাশ হবে (ফন্ট, Firebase SDK, ছবি) */
const OK_HOSTS=['fonts.googleapis.com','fonts.gstatic.com','www.gstatic.com','res.cloudinary.com'];
/* নেটওয়ার্ক ধীর হলে এত মিলিসেকেন্ড পর ক্যাশ থেকে পেজ দেখানো হবে */
const NAV_WAIT=3500;

self.addEventListener('install',e=>{
  e.waitUntil(caches.open(V).then(c=>Promise.all(CORE.map(u=>c.add(u).catch(()=>{})))).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',e=>{
  e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==V).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',e=>{
  const r=e.request;
  if(r.method!=='GET')return;
  const u=new URL(r.url);
  /* APK ফাইল কখনও ক্যাশ হবে না */
  if(u.pathname.toLowerCase().endsWith('.apk'))return;
  /* ডেটাবেস/লগইন/ফাইল আপলোডের অনুরোধ কখনও ক্যাশ হবে না */
  if(u.origin!==location.origin&&!OK_HOSTS.includes(u.hostname))return;

  /* পেজ: আগে নেটওয়ার্ক (সবসময় নতুন সংস্করণ); ধীর বা অফলাইন হলে ক্যাশ */
  if(r.mode==='navigate'){
    e.respondWith((async()=>{
      const c=await caches.open(V);
      const cached=await c.match('./');
      const net=fetch(r).then(res=>{
        if(res&&res.ok){c.put('./',res.clone());return res}
        throw new Error('bad response');
      });
      if(!cached)return net.catch(()=>Response.error());
      return Promise.race([net,new Promise(ok=>setTimeout(()=>ok(cached),NAV_WAIT))]).catch(()=>cached);
    })());
    return;
  }

  /* বাকি ফাইল: ক্যাশে থাকলে সঙ্গে সঙ্গে দেখাবে, পেছনে নতুন করে আপডেট করবে */
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);
    return hit||net;
  }));
});
