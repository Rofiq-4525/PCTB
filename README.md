# PCTB – নববী শিক্ষাক্রম ও পাঠ্যপুস্তক বোর্ড

একটি স্ট্যাটিক ওয়েব অ্যাপ (একটি `index.html`), ডেটাবেস: Firebase (Firestore, Auth, Storage)।

## GitHub Pages-এ হোস্ট
1. GitHub-এ নতুন repository খুলুন (যেমন `pctb`)।
2. এই zip-এর সব ফাইল repository-তে আপলোড করুন (`index.html` অবশ্যই রুটে থাকবে)।
3. Settings → Pages → Source: `Deploy from a branch` → Branch: `main` / `(root)` → Save।
4. কিছুক্ষণ পর সাইট পাবেন: `https://<username>.github.io/<repo>/`

## Firebase সেটআপ (একবারই)
1. Firestore Database চালু করুন, এবং `firestore.rules` ফাইলের লেখা Rules ট্যাবে বসিয়ে Publish করুন।
2. Authentication → Email/Password চালু করুন, Users-এ শিক্ষকের ইমেইল ও পাসওয়ার্ড দিয়ে ইউজার বানান।
3. Authentication → Settings → Authorized domains-এ যোগ করুন: `<username>.github.io`
4. বই আপলোডের জন্য Storage চালু করুন (Blaze প্ল্যান লাগতে পারে), না হলে বইয়ের লিংক দিন।

## শিক্ষক লগইন
Firebase Authentication-এ যে ইউজার বানাবেন সেই ইমেইল/পাসওয়ার্ড।
