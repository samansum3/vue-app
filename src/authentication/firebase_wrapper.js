import firebase from 'firebase/app';
import 'firebase/auth';

const initializeApp = () => {
    firebase.initializeApp({
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        authDomain: process.env.VUE_APP_FIREBASE_DOMAIN,
        projectId: process.env.VUE_APP_FIREBASE_PROJECT_ID,
        storageBucket: process.env.VUE_APP_FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.VUE_APP_FIREBASE_APP_ID
    });
    firebase.auth().createUserWithEmailAndPassword = () => new Promise(resolve => { resolve(); });
    firebase.auth().setPersistence(firebase.auth.Auth.Persistence.NONE);
}

class FirebaseWrapper {
    constructor() {
        this.initializeApp = initializeApp;
        this.firebase = firebase;
    }
}

export default new FirebaseWrapper();