import { createContext, useEffect, useState } from 'react';
import {
  GoogleAuthProvider,
  GithubAuthProvider,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
  getAuth,
} from 'firebase/auth';
import axios from 'axios';
import app from '../firebase/firebase.config';

export const AuthContext = createContext();
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const registerUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const updateUserProfile = (name, photoURL) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photoURL,
    });
  };

  const loginUser = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const loginWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const loginWithGithub = () => {
    setLoading(true);
    return signInWithPopup(auth, githubProvider);
  };

  const logoutUser = async () => {
    setLoading(true);
    try {
      await signOut(auth);
      localStorage.removeItem('athletichub-token');
      setUser(null);
    } catch (error) {
      console.error('Error during logout:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (loggedUser) => {
      setUser(loggedUser);
      setLoading(false);

      if (loggedUser?.email) {
        try {
          // Get Firebase ID token
          const firebaseToken = await loggedUser.getIdToken();
          
          // Get your JWT token from backend
          const res = await axios.post(`${import.meta.env.VITE_API_BASE}/auth/login`, {
            email: loggedUser.email,
          }, {
            headers: {
              Authorization: `Bearer ${firebaseToken}`
            }
          });

          if (res.data?.token) {
            localStorage.setItem('athletichub-token', res.data.token);
          } else {
            console.error('No token received from auth endpoint');
          }
        } catch (error) {
          console.error('Failed to get JWT token:', error);
          localStorage.removeItem('athletichub-token');
        }
      } else {
        localStorage.removeItem('athletichub-token');
      }
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    registerUser,
    loginUser,
    loginWithGoogle,
    loginWithGithub,
    logoutUser,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;