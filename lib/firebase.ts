import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore } from 'firebase/firestore'

const firebaseConfig = {
  apiKey: 'AIzaSyABTBWmqij59oWmz9DrU9r1nCLuSm-oSzs',
  authDomain: 'kohistan-enclave-dc2bb.firebaseapp.com',
  projectId: 'kohistan-enclave-dc2bb',
  storageBucket: 'kohistan-enclave-dc2bb.firebasestorage.app',
  messagingSenderId: '635234690268',
  appId: '1:635234690268:web:606dd0507bf59c5292c019',
}

// Avoid re-initializing on every hot-reload in development.
const app = getApps().length ? getApp() : initializeApp(firebaseConfig)

export const db = getFirestore(app)
