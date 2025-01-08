// Import the required Firebase libraries
import { initializeApp } from "firebase/app";
import { Timestamp, getFirestore, collection, getDocs, query, where, doc, getDoc, addDoc, serverTimestamp, updateDoc  } from "firebase/firestore";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword,  updatePassword as fbUpdatePassword  } from "firebase/auth";
import { v4 as uuidv4 } from "uuid"; 

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
      userId: userCredential.user.uid
    });

    return userCredential.user;
  } catch (error) {
    throw error;
  }
};


// Handle deposit requests
export const sendDepositTransaction = async ({ amount, transactionNumber, username }) => {
  try {
    const depositRequestId = uuidv4(); // Generate unique deposit_request_id
    const transactionId = uuidv4(); // Generate unique transaction_id

    await addDoc(collection(db, "deposit_requests"), {
      deposit_request_id: depositRequestId,
      deposit_amount: parseFloat(amount),
      deposit_method: "GCash",
      transaction_id: transactionId,
      created_at: serverTimestamp(),
      deposit_transaction_number: transactionNumber,
      currency: "PHP",
      username: username,
      status: "processing",
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending deposit transaction:", error);
    throw new Error("Failed to process your request. Please try again.");
  }
};

// Handle withdrawal requests
export const sendWithdrawalTransaction = async ({method, amount, accountNumber, accountName, username}) => {
  try {
    const withdrawCollection = collection(db, "withdrawal_requests");

    const existingRequestQuery = query(
      withdrawCollection,
      where("status", "==", "processing"),
      where("username", "==", username)
    );
    const existingSnapshot = await getDocs(existingRequestQuery);

    if (!existingSnapshot.empty) {
      throw new Error("You already have a pending withdrawal request. We'll make sure to process your previous request before doing another transaction.");
    }

    const withdrawRequestId = uuidv4(); // Generate unique withdraw_request_id
    const transactionId = uuidv4(); // Generate unique transaction_id

    await addDoc(collection(db, "withdrawal_requests"), {
      withdraw_request_id: withdrawRequestId,
      withdraw_amount: parseFloat(amount),
      withdraw_method: method,
      transaction_id: transactionId,
      created_at: serverTimestamp(),
      account_number: accountNumber,
      account_name: accountName,
      currency: "PHP",
      status: "processing",
      username: username
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending deposit transaction:", error);
    throw new Error(error.message);
  }
};


// Fetch deposit requests from Firestore
export const fetchDepositRequests = async () => {
  try {
    const depositCollection = collection(db, "deposit_requests");
    const snapshot = await getDocs(depositCollection);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching deposit requests:", error);
    throw error;
  }
};


// Fetch deposit requests with optional status filter
export const fetchFilteredDepositRequests = async (status, startDate, endDate) => {
  try {
    const depositCollection = collection(db, "deposit_requests");

    let depositQuery = depositCollection;

    // Apply status filter if provided
    if (status && status !== "All") {
      depositQuery = query(depositQuery, where("status", "==", status.toLowerCase()));
    }

    // Apply date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      depositQuery = query(
        depositQuery,
        where("created_at", ">=", Timestamp.fromDate(new Date(startDate))),
        where("created_at", "<=", Timestamp.fromDate(new Date(endDate)))
      );
    }

    // Fetch the data
    const snapshot = await getDocs(depositQuery);

    // Map and return the results
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching filtered deposit requests:", error);
    throw error;
  }
};


export const fetchFilteredWithdrawalRequests = async (status, startDate, endDate) => {
  try {
    const depositCollection = collection(db, "withdrawal_requests");

    let withdrawalQuery = depositCollection;

    // Apply status filter if provided
    if (status && status !== "All") {
      withdrawalQuery = query(withdrawalQuery, where("status", "==", status.toLowerCase()));
    }

    // Apply date range filter if both startDate and endDate are provided
    if (startDate && endDate) {
      withdrawalQuery = query(
        withdrawalQuery,
        where("created_at", ">=", Timestamp.fromDate(new Date(startDate))),
        where("created_at", "<=", Timestamp.fromDate(new Date(endDate)))
      );
    }

    // Fetch the data
    const snapshot = await getDocs(withdrawalQuery);

    // Map and return the results
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching filtered withdrawal requests:", error);
    throw error;
  }
};


export const fetchPendingWithdrawals = async (username) => {
  const withdrawCollection = collection(db, "withdrawal_requests");

  const existingRequestQuery = query(
    withdrawCollection,
    where("status", "==", "processing"),
    where("username", "==", username)
  );

  const existingSnapshot = await getDocs(existingRequestQuery);
  let pendingAmount = 0;

  if (!existingSnapshot.empty) {
    existingSnapshot.forEach((doc) => {
      const data = doc.data();
      pendingAmount += data.withdraw_amount || 0;
    });
  }

  return pendingAmount;
};


// Fetch betting history list with optional status filter
export const fetchFilteredBettingHistoryList = async (gameProviderFilter, startDate, endDate, username) => {
  try {
    const bettingHistoryCollection = collection(db, "betting_history");

    // Base query for betting history with username filter
    let bettingQuery = query(bettingHistoryCollection, where("username", "==", username));

    // Apply date range filters if provided
    if (startDate && endDate) {
      bettingQuery = query(
        bettingQuery,
        where("created_at", ">=", Timestamp.fromDate(new Date(startDate))),
        where("created_at", "<=", Timestamp.fromDate(new Date(endDate)))
      );
    }

    // Fetch betting history data
    const bettingSnapshot = await getDocs(bettingQuery);
    const bettingData = bettingSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    if (!bettingData.length) return [];

    // Fetch game list data
    const gameListCollection = collection(db, "game_list");
    const gameListSnapshot = await getDocs(gameListCollection);
    const gameList = gameListSnapshot.docs.reduce((map, doc) => {
      const data = doc.data();
      map[data.game_uid] = data.provider_uid;
      return map;
    }, {});

    // Filter betting history by game provider if provided
    // const filteredData = bettingData.filter((record) => {
    //   const provider = gameList[record.game_uid] || "Unknown";
    //   return !gameProviderFilter || provider === gameProviderFilter;
    // });

     // Group and aggregate data
     const aggregatedData = bettingData.reduce((acc, record) => {
      const provider = gameList[record.game_uid] || "Unknown";
      const betAmount = parseFloat(record.bet_amount);
      const winAmount = parseFloat(record.win_amount);
      const key = provider;

      if (!acc[key]) {
        acc[key] = {
          id: record.id,
          created_at: record.created_at,
          game_provider: provider,
          bet_count: 0,
          total_bet_amount: 0,
          total_win_lose_amount: 0,
        };
      }

      acc[key].bet_count += 1;
      acc[key].total_bet_amount += betAmount;
      acc[key].total_win_lose_amount += winAmount - betAmount;

      return acc;
    }, {});

    if (gameProviderFilter && gameProviderFilter !== "All") {
      return Object.values(aggregatedData).filter(
        (data) => data.game_provider === gameProviderFilter
      );
    }

    // Convert aggregated data to array format
    return Object.values(aggregatedData);

  } catch (error) {
    console.error("Error fetching filtered betting history requests:", error);
    throw error;
  }
};


export const updatePassword = async (username, email, oldPassword, newPassword) => {
  try {

    const playersCollection = collection(db, "players");
    const q = query(playersCollection, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error("User not found. Please check the username.");
    }

    const userDoc = snapshot.docs[0]; // First matching document
    const userData = userDoc.data();

    if (userData.password !== oldPassword) {
      throw new Error("The current password is incorrect. Please try again.");
    }

    // Reauthenticate the user
    const userCredential = await signInWithEmailAndPassword(auth, email, oldPassword);

    // Update the password in Firebase Auth
    await fbUpdatePassword(userCredential.user, newPassword);

    const userRef = doc(db, "players", userDoc.id);
    await updateDoc(userRef, { password: newPassword });

    return true;
  } catch (error) {
    // Check the error code and provide specific feedback
    if (error.code === "auth/wrong-password") {
      throw new Error("The current password is incorrect. Please try again.");
    } else if (error.code === "auth/invalid-credential") {
      throw new Error("The current password is incorrect. Please try again.");
    } else if (error.code === "auth/user-not-found") {
      throw new Error("User not found. Please check your email.");
    } else {
      throw error; // Rethrow the error for other cases
    }
  }
};

// Fetch player details by email or userId
export const fetchPlayerDetails = async (username) => {
  try {
    const playersCollection = collection(db, 'players');
    const q = query(playersCollection, where('username', '==', username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      throw new Error('Player details not found.');
    }

    const playerData = snapshot.docs[0].data(); // Get the first matching document

    return playerData;// Return player details
  } catch (error) {
    throw error;
  }
};