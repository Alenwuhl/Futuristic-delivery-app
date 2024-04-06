import admin from 'firebase-admin';
import serviceAccount from '../env/dbConnection.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

export { db };
