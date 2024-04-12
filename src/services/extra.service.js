import { db } from "../config/firebase/firebase.config.js";
import Extra from "../models/extra.model.js";

const collectionRef = db.collection('extras');


async function getExtraById(extraId) {
  try {
    const snapshot = await collectionRef.where('id', '==', extraId).get();
    //console.log('extra id -', extraId);
    //console.log('snapshot -', snapshot);
    let extra = new Extra();

    for (let doc of snapshot.docs) {
      const extraData = doc.data();
      extra = new Extra(extraId, extraData.title, extraData.imageName, extraData.price);
      //console.log('extra - ', doc.data())
     }

     if (!extra) {
      return null;
    }
    return extra;
  } catch (error) {
    throw new Error(error.message);
  }
}

export { getExtraById }