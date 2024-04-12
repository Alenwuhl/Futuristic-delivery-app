import { db } from '../config/firebase/firebase.config.js';

async function findOrCreateUser(twitterId, profile) {
  const usersRef = db.collection('users');
  const snapshot = await usersRef.where('twitterId', '==', twitterId).get();

  if (snapshot.empty) {
    // El usuario no existe, crea uno nuevo
    const newUser = {
      twitterId: twitterId,
      name: profile.displayName,
      profilePicture: profile.photos[0].value,
      // Añade más campos necesarios
    };
    const userRef = await usersRef.add(newUser);
    return { id: userRef.id, ...newUser };
  } else {
    // Usuario encontrado, devuelve la información
    return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
  }
}

export default findOrCreateUser;