# Port 3000 vs 5000 Issue Explanation & Solution

## Kya Issue Tha? (What was the issue?)
Aapka "Food View" project ka frontend **port 5173** par chal raha tha, aur backend **port 5000** par. Lekin aapke frontend code mein (components aur pages mein) aur backend ke `passport.js` mein **har jagah API URLs `http://localhost:3000` hardcoded the**.

Kyunki aapka ek aur project (`job-pilot`) pehle se port 3000 par chal raha tha, toh jab aap "Food View" mein login karne ki koshish kar rahe the, tab ye ho raha tha:
1. **Wrong Backend Call:** Aapka "Food View" frontend galti se `job-pilot` ke backend (port 3000) ko request bhej raha tha. 
2. **Incorrect ID/Password:** Kyunki `job-pilot` ke database mein aapka Food View wala user nahi hai, isliye vo "Incorrect ID/Password" batata tha.
3. **Google/GitHub 404 Error:** Jab aap Google/GitHub login par click karte the, frontend `http://localhost:3000/api/auth/google` par bhejta tha. Kyunki `job-pilot` mein aisi koi route bani hi nahi hai, isliye aapko 404 "This page could not be found" ki error aa rahi thi.

## Permanent Solution Kya Hai?
Maine backend aur frontend dono jagah URLs ko theek kar diya hai:
1. Frontend mein saari jagah URL ko `3000` se badalkar `5000` kar diya hai. Ab frontend direct aapke Food View ke backend par hi request bhejega.
2. Backend (`passport.js`) mein humne callback URL ko dynamically `process.env.BACKEND_URL` par set kar diya hai. Agar ye set nahi hai to by default `http://localhost:5000` lega.

## IMPORTANT: Aapko Abhi Kya Karna Hoga?
Google aur GitHub par login completely work kare uske liye aapko apne developer accounts par ja kar **Redirect URI update karni hogi**:

### GitHub ke liye:
1. GitHub Developer Settings me jayen (Settings > Developer Settings > OAuth Apps)
2. Apni Food View App ko select karein.
3. **Authorization callback URL** ko badal kar ye karein:
   `http://localhost:5000/api/auth/github/callback`

### Google ke liye:
1. Google Cloud Console me jayen (APIs & Services > Credentials).
2. Apne OAuth 2.0 Client ID ko edit karein.
3. **Authorized redirect URIs** me purana 3000 wala URL delete karein aur ye naya add karein:
   `http://localhost:5000/api/auth/google/callback`

Ab aap bina kisi error ke dono projects (`job-pilot` aur `Food View`) ek sath chala sakte hain!
