import { getAuth, signOut } from "firebase/auth";

export const logoutUser = async () => {
    const auth = getAuth();
    try {
        await signOut(auth);
        window.location.href = "/";
        console.log("Logout successful");
    } catch (error) {
        console.error("Logout failed:", error);
    }
}