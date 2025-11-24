// import { auth, db } from "@/firebaseConfig";
// import type { User } from "firebase/auth";
// import {
//   createContext,
//   useContext,
//   useEffect,
//   useState,
//   type ReactNode,
// } from "react";
// import {
//   getIdToken,
//   signInWithEmailAndPassword,
//   signOut,
//   onAuthStateChanged,
// } from "firebase/auth";
// import { doc, getDoc } from "firebase/firestore";

// type Role = "user" | "organisator";

// interface UserProfile {
//   uid: string;
//   name: string | null;
//   email: string | null;
//   role?: Role;
// }

// interface AuthContextType {
//   user: User | null;
//   profile: UserProfile | null;
//   loading: boolean;
//   login: (email: string, password: string) => void;
//   logout: () => void;
//   getToken: () => Promise<string | null>;
// }

// export const AuthContext = createContext<AuthContextType | undefined>(
//   undefined
// );

// export const AuthProvider = ({ children }: { children: ReactNode }) => {
//   const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
//   const [profile, setProfile] = useState<UserProfile | null>(null);
//   const [loading, setLoading] = useState(true);

//   const loadProfile = async (user: User) => {
//     try {
//       const ref = doc(db, "users", user.uid);
//       const snap = await getDoc(ref);

//       const data = snap.exists() ? (snap.data() as any) : {};

//       const userProfile: UserProfile = {
//         uid: user.uid,
//         email: user.email ?? data.email ?? null,
//         name: data.name ?? user.displayName ?? null,
//         role: data.role as Role | undefined,
//       };

//       setProfile(userProfile);
//     } catch (error) {
//       console.error("Error loading user profile:", error);
//       // Fallback to basic auth data
//       setProfile({
//         uid: user.uid,
//         email: user.email,
//         name: user.displayName ?? null,
//       });
//     }
//   };

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
//       if (fbUser) {
//         setFirebaseUser(fbUser);
//         await loadProfile(fbUser);
//       } else {
//         setFirebaseUser(null);
//         setProfile(null);
//       }
//       setLoading(false);
//     });

//     return () => unsubscribe();
//   }, []);

//   const login = async (email: string, password: string) => {
//     try {
//       setLoading(true);
//       const userCredential = await signInWithEmailAndPassword(
//         auth,
//         email,
//         password
//       );
//       const fbUser = userCredential.user;
//       setFirebaseUser(fbUser);
//       await loadProfile(fbUser);
//     } catch (error) {
//       console.error("Login error:", error);
//       throw error; // so callers can show error message
//     } finally {
//       setLoading(false);
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setFirebaseUser(null);
//       setProfile(null);
//     } catch (error) {
//       console.error("Logout error:", error);
//     }
//   };

//   const getToken = async () => {
//     if (!auth.currentUser) return null;
//     return await getIdToken(auth.currentUser, /* forceRefresh = */ false);
//   };

//   return (
//     <AuthContext.Provider
//       value={{ firebaseUser, profile, loading, login, logout, getToken }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export const useAuth = () => {
//   const context = useContext(AuthContext);
//   if (!context) {
//     throw new Error("useAuth must be used within an AuthProvider");
//   }
//   return context;
// };

// src/auth/AuthContext.tsx
import { auth, db } from "@/firebaseConfig";
import type { User } from "firebase/auth";
import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getIdToken,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";

type Role = "user" | "organisator";

interface UserProfile {
  uid: string;
  name: string | null;
  email: string | null;
  role?: Role;
}

interface AuthContextType {
  user: User | null; // raw Firebase user
  profile: UserProfile | null; // our enriched profile with role
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getToken: () => Promise<string | null>;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const loadProfile = async (fbUser: User) => {
    try {
      const ref = doc(db, "users", fbUser.uid);
      const snap = await getDoc(ref);
      const data = snap.exists() ? (snap.data() as any) : {};

      const userProfile: UserProfile = {
        uid: fbUser.uid,
        email: fbUser.email ?? data.email ?? null,
        name: data.name ?? fbUser.displayName ?? null,
        role: data.role as Role | undefined,
      };

      setProfile(userProfile);
    } catch (error) {
      console.error("Error loading user profile:", error);
      // Fallback to basic auth data
      setProfile({
        uid: fbUser.uid,
        email: fbUser.email,
        name: fbUser.displayName ?? null,
      });
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      try {
        if (fbUser) {
          setUser(fbUser);
          await loadProfile(fbUser);
        } else {
          setUser(null);
          setProfile(null);
        }
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const fbUser = userCredential.user;
      setUser(fbUser);
      await loadProfile(fbUser);
    } catch (error) {
      console.error("Login error:", error);
      throw error; // so Login.tsx can show message
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setProfile(null);
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const getToken = async () => {
    if (!auth.currentUser) return null;
    return await getIdToken(auth.currentUser, false);
  };

  return (
    <AuthContext.Provider
      value={{ user, profile, loading, login, logout, getToken }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
