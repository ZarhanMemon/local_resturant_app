import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../../firebase/firebase.js";

/**
 * googleLogin - Firebase Google Sign-In Helper
 * 
 * This function opens a popup for the user to authenticate with their Google account.
 * Firebase handles all OAuth flows and returns user data automatically.
 * 
 * Flow:
 * 1. Opens Google sign-in popup
 * 2. Extracts user info (name, email, phone) from Firebase result
 * 3. Returns user object to be sent to backend
 * 
 * Note: Firebase's phoneNumber is always null for Google auth - handled by backend
 * 
 * @returns {Object} User object with name, email, phone (empty if not available)
 */
export const googleLogin = async () => {
  const result = await signInWithPopup(auth, googleProvider);

  const user = result.user;

  return {
    name: user.displayName || "",
    email: user.email || "",
    phone: user.phoneNumber || "", // Firebase doesn't provide phone
    // no password: OAuth users don't send passwords
  };
};
