import { auth } from './firebase';

export const registerWithEmail = async (name, email, password) => {
  console.log("Registering", name, email);
  // Mock response
  return { uid: 'new-user-123', email, displayName: name };
};