// Import the required Firebase libraries
import { initializeApp } from "firebase/app";
import { getFirestore, collection, getDocs, query, where, doc, onSnapshot, addDoc } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword  } from "firebase/auth";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDu2ap7zNmkOYpUBgm0T5eHlSRxjbRZldM",
  authDomain: "extremewin88-6ec15.firebaseapp.com",
  projectId: "extremewin88-6ec15",
  storageBucket: "extremewin88-6ec15.firebasestorage.app",
  messagingSenderId: "622031742553",
  appId: "1:622031742553:web:8c73ad700f4622eea07348",
  measurementId: "G-H10JP5B512"
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
    const formattedUsername = username.toLowerCase();
    const q = query(playersCollection, where("username", "==", formattedUsername));
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

export const registerUser = async ({ name, username, password, phone, inviteCode }) => {
  try {
    // Check if username already exists
    const playersCollection = collection(db, "players");
    const existingUsers = await getDocs(query(playersCollection, where("username", "==", username)));
    if (!existingUsers.empty) {
      throw new Error("Username is already taken");
    }

    if(phone.startsWith("+")){
      phone = phone.substring(1)
    }

    if(phone.startsWith("0")){
      phone = "63" + phone.substring(1);
    }

    const existingPhoneNumber = await getDocs(query(playersCollection, where("phone", "==", phone)));

    if (!existingPhoneNumber.empty) {
      throw new Error("Phone Number is already registered");
    }

    // Create user with email and password in Firebase Auth
    const email = `${username}@extremewin88.com`; // Generate an email from the username
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);

    // Add user data to Firestore
    await addDoc(playersCollection, {
      uid: userCredential.user.uid,
      name,
      username: username.toLowerCase(),
      email,
      phone,
      invite_code: inviteCode || null,
      wallet_amount: 0,
      createdAt: new Date().toISOString(),
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};