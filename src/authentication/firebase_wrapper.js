import firebase from 'firebase/app';

const initializeApp = () => {
    firebase.initializeApp({
        apiKey: '',
        authDomain: '',
        projectId: '',
        storageBucket: '',
        messagingSenderId: '',
        appId: ''
    });
}

class FirebaseWrapper {
    constructor() {
        this.initializeApp = initializeApp;
        this.firebase = firebase;
    }
}

export default new FirebaseWrapper();