import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyAsSyKzTfpZAtNoIBHU27Q3pYlIT7DWxik",
    authDomain: "online-maid-finder.firebaseapp.com",
    projectId: "online-maid-finder",
    storageBucket: "online-maid-finder.appspot.com",
    messagingSenderId: "437524370135",
    appId: "1:437524370135:web:ae95489938deb453479692",
    measurementId: "G-CB7Z6VEZ5D"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app);