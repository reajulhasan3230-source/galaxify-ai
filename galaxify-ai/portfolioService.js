import { db } from '../src/firebase';
import { collection, query, where, getDocs, doc, setDoc } from 'firebase/firestore';

export const getPortfolioByUsername = async (username) => {
  try {
    const q = query(collection(db, "portfolios"), where("username", "==", username));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      // Return the first matching document's data
      return querySnapshot.docs[0].data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching portfolio:", error);
    throw error;
  }
};

export const createUserProfile = async (uid, userData) => {
  try {
    await setDoc(doc(db, "portfolios", uid), {
      ...userData,
      plan: 'free',
      createdAt: new Date().toISOString()
    }, { merge: true });
  } catch (error) {
    console.error("Error creating user profile:", error);
    throw error;
  }
};