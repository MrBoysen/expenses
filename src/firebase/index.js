
import { initializeApp } from 'firebase/app'
import { getAnalytics } from 'firebase/analytics'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyBV0VMV3Xgpz7SFvx0fwj0oNvaG6g6vSlo',
  authDomain: 'expenses-98275.firebaseapp.com',
  projectId: 'expenses-98275',
  storageBucket: 'expenses-98275.appspot.com',
  messagingSenderId: '96195042441',
  appId: '1:96195042441:web:9b9ed8a6129bfef85cfa58',
  measurementId: 'G-H1VE4CBBHK'
}

const app = initializeApp(firebaseConfig)
const analytics = getAnalytics(app)
const db = getFirestore(app)

export {
    db
}