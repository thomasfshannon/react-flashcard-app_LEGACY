import firebase from 'firebase'
console.log(process.env)
let firebaseConfig = {
apiKey: process.env.REACT_APP_API_KEY,
authDomain: process.env.REACT_APP_DOMAIN,
databaseURL: process.env.REACT_APP_DB_URL,
projectId: process.env.REACT_APP_PROJECT_ID,
storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
messagingSenderId: process.env.REACT_APP_SENDER_ID,
appId: process.env.REACT_APP_APP_ID
};
firebase.initializeApp(firebaseConfig);
export default firebase.firestore()