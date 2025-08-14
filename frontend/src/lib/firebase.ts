import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
  // These will be replaced with actual Firebase config
  apiKey: "demo-key",
  authDomain: "wealthwise-pro.firebaseapp.com",
  projectId: "wealthwise-pro",
  storageBucket: "wealthwise-pro.appspot.com",
  messagingSenderId: "123456789",
  appId: "demo-app-id",
  databaseURL: "https://wealthwise-pro-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const realtimeDb = getDatabase(app);
export default app;