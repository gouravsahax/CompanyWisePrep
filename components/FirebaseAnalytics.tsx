"use client";

import { useEffect } from "react";
import { initializeApp, getApps } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

export default function FirebaseAnalytics() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      !getApps().length &&
      process.env.NEXT_PUBLIC_FIREBASE_API_KEY
    ) {
      const app = initializeApp(firebaseConfig);
      
      // Initialize Analytics only if supported in this environment
      isSupported().then((supported) => {
        if (supported) {
          getAnalytics(app);
        }
      });
    }
  }, []);

  return null;
}
