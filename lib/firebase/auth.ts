import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// Google provider for OAuth
const googleProvider = new GoogleAuthProvider();

/**
 * Register a new user with email and password
 */
export const registerWithEmail = async (
  email: string,
  password: string,
  displayName: string
) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const user = userCredential.user;

    // Update profile with display name
    await updateProfile(user, { displayName });

    // Create user document in Firestore
    await setDoc(doc(db, 'users', user.uid), {
      email: user.email,
      displayName,
      createdAt: serverTimestamp(),
      subscription: 'free',
    });

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Sign in with email and password
 */
export const loginWithEmail = async (email: string, password: string) => {
  try {
    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Sign in with Google
 */
export const loginWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;

    // Check if user document exists, if not create it
    const userDoc = await getDoc(doc(db, 'users', user.uid));
    
    if (!userDoc.exists()) {
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        displayName: user.displayName,
        createdAt: serverTimestamp(),
        subscription: 'free',
      });
    }

    return { user, error: null };
  } catch (error: any) {
    return { user: null, error: error.message };
  }
};

/**
 * Sign out current user
 */
export const logout = async () => {
  try {
    await signOut(auth);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

/**
 * Send password reset email
 */
export const resetPassword = async (email: string) => {
  try {
    await sendPasswordResetEmail(auth, email);
    return { error: null };
  } catch (error: any) {
    return { error: error.message };
  }
};

/**
 * Get current user
 */
export const getCurrentUser = (): User | null => {
  return auth.currentUser;
};

/**
 * Sign in as demo user
 * Uses environment variable for demo credentials
 */
export const loginAsDemo = async () => {
  try {
    const demoEmail = 'demo@datapal.cl';
    const demoPassword = process.env.NEXT_PUBLIC_DEMO_USER_PASSWORD;

    if (!demoPassword) {
      return { user: null, error: 'Demo no configurado. Contacta al administrador.' };
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      demoEmail,
      demoPassword
    );
    return { user: userCredential.user, error: null };
  } catch (error: any) {
    console.error('Error en login demo:', error);
    return { user: null, error: 'No se pudo acceder al demo. Intenta más tarde.' };
  }
};

/**
 * Check if current user is demo user
 */
export const isDemoUser = (user: User | null): boolean => {
  return user?.email === 'demo@datapal.cl';
};