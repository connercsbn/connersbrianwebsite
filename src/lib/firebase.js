import { getFirestore, collection, getDocs } from 'firebase/firestore/lite';
import { initializeApp } from 'firebase/app';
const firebaseConfig = {
};
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);