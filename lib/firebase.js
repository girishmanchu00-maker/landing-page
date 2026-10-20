import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyB9EWMrrDvTjhlC42fOnh8MvYF2p4w-1O4",
  authDomain: "fintezy.firebaseapp.com",
  projectId: "fintezy",
  storageBucket: "fintezy.firebasestorage.app",
  messagingSenderId: "477564203001",
  appId: "1:477564203001:web:e802e71743a5a1855f9728",
  measurementId: "G-22P3CTZ58X"
};

// Initialize Firebase securely for Next.js
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];
const auth = getAuth(app);

// Initialize Analytics safely (Browser only)
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, analytics };
