import { SocialProvider } from '@/types/firebase';
import { initializeApp } from 'firebase/app';
import {
  createUserWithEmailAndPassword,
  getAuth,
  FacebookAuthProvider,
  GithubAuthProvider,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  User,
  UserCredential,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

initializeApp(firebaseConfig);
const auth = getAuth();

export const socialLogin =
  (type: SocialProvider) => async (): Promise<User | null> => {
    try {
      let provider = null;
      if (type === 'google') {
        provider = new GoogleAuthProvider();
      } else if (type === 'github') {
        provider = new GithubAuthProvider();
      } else if (type === 'facebook') {
        provider = new FacebookAuthProvider();
      }
      const result = await signInWithPopup(auth, provider);
      console.log({ result });
      const user = result.user;
      console.log(user);
      return user;
    } catch (error) {
      throw error;
    }
  };

export const login = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const user = await signInWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const signup = async (
  email: string,
  password: string
): Promise<UserCredential> => {
  try {
    const user = await createUserWithEmailAndPassword(auth, email, password);
    return user;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export async function logout(): Promise<UserCredential> {
  try {
    await signOut(auth);
    return null;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export function onUserStateChange(callback: (user: User | null) => void): void {
  onAuthStateChanged(auth, (user) => {
    callback(user);
  });
}
