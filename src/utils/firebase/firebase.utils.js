// initializeApp creates an app instance for you based of some config
import { initializeApp } from 'firebase/app'
import {
	getAuth,
	signInWithPopup,
	GoogleAuthProvider,
	createUserWithEmailAndPassword
} from 'firebase/auth'
import {
	getFirestore,
	doc,
	getDoc,
	setDoc
} from 'firebase/firestore'

// config is an object that allows us to attach this firebass app instance nd allows us to use CRUD functions

const firebaseConfig = {
	apiKey: "AIzaSyCBcY4tYJiE3JT7U8MpBZgWrere7g1vBG0",
	authDomain: "crown-clothing-db-6919a.firebaseapp.com",
	projectId: "crown-clothing-db-6919a",
	storageBucket: "crown-clothing-db-6919a.appspot.com",
	messagingSenderId: "586713414607",
	appId: "1:586713414607:web:7694247052a2671959b0ba"
};

// Initialize Firebase 
const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
	prompt: "select_account"
})

export const auth = getAuth();
export const signInWithGooglePopup = () => signInWithPopup(auth, googleProvider)

// create instance of database
export const db = getFirestore();

export const createUserDocumentFromAuth = async (userAuth, additionalInformation = {}) => {
	if (!userAuth) return;

	const userDocRef = doc(db, 'users', userAuth.uid);

	console.log(userDocRef);

	const userSnapshot = await getDoc(userDocRef);
	console.log(userSnapshot)

	if (!userSnapshot.exists()) {
		const { displayName, email } = userAuth;
		const createdAt = new Date();

		try {
			await setDoc(userDocRef, {
				displayName,
				email,
				createdAt,
				...additionalInformation
			});
		} catch (error) {
			if (error.code === 'auth/email-already-in-use'){
				alert('Cannot create user, email already in use');
			}
			else{
				console.log('error creating the user', error.message)
			}
		}
	}

	return userDocRef;
};

export const createAuthUserWithEmailAndPassword = async (email, password) => {
	if (!email || !password) return;

	return await createUserWithEmailAndPassword(auth, email, password);
}