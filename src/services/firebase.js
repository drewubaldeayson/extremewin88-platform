// Import the required Firebase libraries
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, doc, onSnapshot } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDssOo432oFRRuIDAZLsyREa3VEVaGuZwQ",
    authDomain: "extremewin88-9a5d2.firebaseapp.com",
    projectId: "extremewin88-9a5d2",
    storageBucket: "extremewin88-9a5d2.firebasestorage.app",
    messagingSenderId: "84383913086",
    appId: "1:84383913086:web:6d67aa520284357bb6742f",
    measurementId: "G-XCQRQJMKSZ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// Fetch all providers from "game_providers" collection
export const fetchProviders = async () => {
  const providerCollection = collection(db, "game_providers");
  const snapshot = await getDocs(providerCollection);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Fetch all games by provider from "games_list" collection
export const fetchGamesByProvider = async (providerUid) => {
  const gamesCollection = collection(db, "game_list");
  const q = query(gamesCollection, where("provider_uid", "==", providerUid));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Firebase Auth: Sign in with username and password
export const signInWithUsername = async (username, password) => {
  try {
    // Query the players collection to find the email associated with the username
    const playersCollection = collection(db, "players");
    const q = query(playersCollection, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("Username not found.");
    }

    const userData = snapshot.docs[0].data();
    const email = userData.email; // Get the email for Firebase Auth

    // Authenticate using email and password
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return { user: userCredential.user, data: userData }; // Return Firebase user and additional data
  } catch (error) {
    throw error;
  }
};