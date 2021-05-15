import firebase from 'firebase/app';
import 'firebase/auth';

const initializeApp = () => {
    firebase.initializeApp({
        apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
        authDomain: process.env.VUE_APP_FIREBASE_DOMAIN
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