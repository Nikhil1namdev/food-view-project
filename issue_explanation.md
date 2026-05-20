# Port 3000 vs 5000 Issue Explanation & Solution

## Kya Issue Tha? (What was the issue?)
Aapka "Food View" project ka frontend **port 5173** par chal raha tha, aur backend **port 5000** par. Lekin aapke frontend code mein (components aur pages mein) aur backend ke `passport.js` mein **har jagah API URLs `http://localhost:3000` hardcoded the**.

Kyunki aapka ek aur project (`job-pilot`) pehle se port 3000 par chal raha tha, toh jab aap "Food View" mein login karne ki koshish kar rahe the, tab ye ho raha tha:
1. **Wrong Backend Call:** Aapka "Food View" frontend galti se `job-pilot` ke backend (port 3000) ko request bhej raha tha. 
2. **Incorrect ID/Password:** Kyunki `job-pilot` ke database mein aapka Food View wala user nahi hai, isliye vo "Incorrect ID/Password" batata tha.
3. **Google/GitHub 404 Error:** Jab aap Google/GitHub login par click karte the, frontend `http://localhost:3000/api/auth/google` par bhejta tha. Kyunki `job-pilot` mein aisi koi route bani hi nahi hai, isliye aapko 404 "This page could not be found" ki error aa rahi thi (jo aapne screenshot me dikhai).

## Kya Hum Dono Project Ek Sath Chala Sakte Hai?
**Haan, bilkul chala sakte ho!** 
Aap 10 project bhi ek sath chala sakte ho jab tak unke port numbers alag-alag ho. Issue dono project ek sath chalane me nahi tha, issue isme tha ki aapke Food View ke code me `3000` likha hua tha, jisse vo doosre project se takra raha tha.

## Solution (Kaise Solve Kiya?)
Mene aapke project me ye permanent fixes kiye hain:
1. **Frontend:** Jitne bhi pages aur components the (jaise `UserLogin`, `UserRegister`, `FoodPartnerLogin`, `AuthContext`, `api.js` etc.) un sabme jaha jaha `http://localhost:3000` hardcoded tha, usko change karke `http://localhost:5000` kar diya hai. Ab frontend sahi backend (Food View wale) se baat karega.
2. **Backend:** `backend/src/services/passport.js` me Google aur GitHub ke callback URLs bhi `3000` par the. Unko change karke `${process.env.BACKEND_URL || 'http://localhost:5000'}` kar diya hai.

---

### ⚠️ IMPORTANT ACTION REQUIRED FROM YOU ⚠️
Kyunki ab backend ka port 5000 ho gaya hai, **Google aur GitHub OAuth redirect URLs me mismatch aayega** agar aapne unhe update nahi kiya to. 

Aapko Google Cloud Console aur GitHub Developer Settings me jaakar apne OAuth app ke "Authorized redirect URIs" ko update karna hoga:
- **Google me purana URL:** `http://localhost:3000/api/auth/google/callback`
- **Google me NAYA URL dalna hai:** `http://localhost:5000/api/auth/google/callback`

- **GitHub me purana URL:** `http://localhost:3000/api/auth/github/callback`
- **GitHub me NAYA URL dalna hai:** `http://localhost:5000/api/auth/github/callback`

Ye karne ke baad aap dono projects ek sath bindaas chala sakte ho bina kisi error ke!
