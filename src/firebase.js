// Mock Firebase configuration for development
// Replace with your actual Firebase config

const auth = {
  currentUser: { uid: 'dev-user', displayName: 'Developer', email: 'dev@galaxify.ai' },
  onAuthStateChanged: (cb) => cb({ uid: 'dev-user', displayName: 'Developer', email: 'dev@galaxify.ai' })
};

const storage = {};
const db = {};

export { auth, storage, db };

// Mock functions
export const signOut = async () => console.log('Signed out');