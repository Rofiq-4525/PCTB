/* PCTB – সার্ভিস ওয়ার্কার */
const V='pctb-v3';
const CORE=['./','logo-short-web.png','pctb-icon-192.png'];
const OK_HOSTS=['fonts.googleapis.com','fonts.gstatic.com','www.gstatic.com','res.cloudinary.com'];

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
  /* ডেটাবেস/লগইন/ফাইল আপলোডের অনুরোধ কখনও ক্যাশ হবে না */
  if(u.origin!==location.origin&&!OK_HOSTS.includes(u.hostname))return;
  if(r.mode==='navigate'){
    e.respondWith(fetch(r).then(res=>{
      const cp=res.clone();caches.open(V).then(c=>c.put('./',cp));return res;
    }).catch(()=>caches.match('./')));
    return;
  }
  e.respondWith(caches.open(V).then(async c=>{
    const hit=await c.match(r);
    const net=fetch(r).then(res=>{if(res&&(res.ok||res.type==='opaque'))c.put(r,res.clone());return res}).catch(()=>hit);
    return hit||net;
  }));
});
