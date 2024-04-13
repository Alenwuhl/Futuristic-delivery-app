import pkg from 'firebase-admin';

const { auth } = pkg;

export default async (req, res, next) => {
  const token = req.headers.authorization?.split('Bearer ')[1];
  if (!token) {
    return res.status(401).json({ message: 'No token provided.' });
  }

  try {
    const decodedToken = await auth().verifyIdToken(token);
    req.user = decodedToken; // Here is the User information.
    next();
  } catch (error) {
    console.error('Error verifying auth token', error);
    res.status(403).json({ message: 'Invalid token.' });
  }
};
