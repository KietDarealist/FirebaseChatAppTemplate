import "../styles/globals.css";
import type { AppProps } from "next/app";
import Login from "./login";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../config/firebase";
import Loading from "../components/Loading";
import { useEffect } from "react";
import { serverTimestamp, setDoc, doc } from "firebase/firestore";

function MyApp({ Component, pageProps }: AppProps) {
  const [loggedInUser, loading, _error] = useAuthState(auth);

  const setUserInDb = async () => {
    try {
      await setDoc(
        doc(db, "users", loggedInUser?.email as string),
        {
          email: loggedInUser?.email,
          lastSeen: serverTimestamp(),
          photoUrl: loggedInUser?.photoURL,
        },
        { merge: true }
      );
    } catch (error) {
      console.log("Error settings user info in db", error);
    }
  };

  const initCallWhenUserExisted = async () => {
    try {
      if (loggedInUser) {
        await setUserInDb();
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    initCallWhenUserExisted();
  }, [loggedInUser]);

  if (loading) return <Loading />;
  if (!loggedInUser) return <Login />;
  return <Component {...pageProps} />;
}

export default MyApp;
