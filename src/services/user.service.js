import { db } from '../config/firebase/firebase.config.js';

async function findOrCreateUser(twitterId, profile) {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('twitterId', '==', twitterId).get();

  if (snapshot.empty) {
    const newUser = {
      twitterId: twitterId,
      name: profile.displayName,
      profilePicture: profile.photos[0].value,
    };
    const userRef = await usersRef.add(newUser);
    return { id: userRef.id, ...newUser };
  } else {
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
}

export default findOrCreateUser;