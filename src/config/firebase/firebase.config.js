import admin from 'firebase-admin';
import serviceAccount from '../env/dbConnection.json' assert { type: 'json' };

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: serviceAccount.bucket,
});

const bucket = admin.storage().bucket();

const db = admin.firestore();

export { db, bucket };
