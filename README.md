# Canteen-App

Campus canteen ordering app built with **Expo React Native** and **Firebase**.

## Tech Stack
- Expo React Native
- React Navigation
- Firebase Authentication + Firestore
- AsyncStorage

## Environment Setup

1. Copy `.env.example` to `.env`
2. Fill all values from your Firebase and Razorpay dashboards

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key_here
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_RAZORPAY_KEY=your_razorpay_key_here
EXPO_PUBLIC_ADMIN_EMAIL=admin@yourdomain.com
```

## Firebase Setup (Required)

1. Create a Firebase project
2. Add a Web App in Firebase project settings
3. Enable **Authentication → Email/Password**
4. Create admin credentials in Firebase Authentication users
5. Use the same admin email in `EXPO_PUBLIC_ADMIN_EMAIL`

## Run Locally

```bash
npm install
npm start
```

Optional:

```bash
npm run android
npm run ios
npm run web
```

## Current App Architecture (Phase 0 Baseline)

- `src/config/firebase.js` → Env-driven Firebase initialization
- `src/config/constants.js` → Shared constants/enums
- `src/utils/validators.js` → Common validation helpers
- `src/utils/formatters.js` → Display formatting helpers
- `src/context/` → Auth and cart state
- `src/screens/` → User/admin UI flows
- `src/services/` → Auth/business service layer

## Notes

- Firebase config is loaded from environment variables only.
- App includes role-based login paths (customer/admin).
- This repository now has a roadmap checklist in `to-do.md` for phased implementation.