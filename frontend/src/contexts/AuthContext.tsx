import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { 
  User as FirebaseUser, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, userData: Partial<User>) => Promise<void>;
  logout: () => Promise<void>;
  updateUserProfile: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [loading, setLoading] = useState(true);

  const login = async (email: string, password: string) => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    await loadUserData(result.user);
  };

  const register = async (email: string, password: string, userData: Partial<User>) => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    
    const newUser: User = {
      id: result.user.uid,
      email: result.user.email!,
      firstName: userData.firstName || '',
      lastName: userData.lastName || '',
      companyId: userData.companyId || '',
      role: 'employee',
      profileData: {
        onboardingCompleted: false,
        dependents: 0
      },
      financialHealthScore: 0,
      createdAt: new Date(),
      lastLogin: new Date()
    };

    await setDoc(doc(db, 'users', result.user.uid), newUser);
    setCurrentUser(newUser);
  };

  const logout = async () => {
    await signOut(auth);
    setCurrentUser(null);
    setFirebaseUser(null);
  };

  const loadUserData = async (firebaseUser: FirebaseUser) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
      if (userDoc.exists()) {
        const userData = userDoc.data() as User;
        setCurrentUser(userData);
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    }
  };

  const updateUserProfile = async (data: Partial<User>) => {
    if (!currentUser) return;
    
    const updatedUser = { ...currentUser, ...data };
    await setDoc(doc(db, 'users', currentUser.id), updatedUser);
    setCurrentUser(updatedUser);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setFirebaseUser(user);
        await loadUserData(user);
      } else {
        setCurrentUser(null);
        setFirebaseUser(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextType = {
    currentUser,
    firebaseUser,
    loading,
    login,
    register,
    logout,
    updateUserProfile
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};