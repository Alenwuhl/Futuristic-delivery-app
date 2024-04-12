import express from "express";
import session from 'express-session'; // Importa express-session
import cors from 'cors';
//import admin from 'firebase-admin';
import dotenv from 'dotenv';
import authMiddleware from "./middlewares/authMiddleware.js";
import path from 'path';
import { __dirname } from "./utils.js";
import passport from 'passport'; // Importa passport
import { Strategy as TwitterStrategy } from 'passport-twitter'; // Importa la estrategia de Twitter
import categoryRouter from './routes/category.route.js';
import extraRouter from './routes/extra.route.js';
import orderRouter from './routes/order.route.js';
import productRouter from './routes/product.route.js';
import userService from  './services/user.service.js';

dotenv.config();

// Aquí deberías configurar las claves de Twitter
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET;

// Initialize Express app
const app = express();

// Middleware to Cors
app.use(cors());

// Middleware to parse JSON
app.use(express.json());

// Configura express-session, necesario para el manejo de sesiones con Passport
/*app.use(session({
  secret: 'secreto', // EXPRESS_SESSION_SECRET,  // Asegúrate de que esta variable está definida en tu .env
  resave: true,
  saveUninitialized: true
}));*/
app.use(session({
  secret: EXPRESS_SESSION_SECRET, // Asegúrate de que este valor es seguro y único
  resave: false,  // No reescribir sesiones que no han sido modificadas
  saveUninitialized: false,  // No guardar sesiones automáticas vacías
  cookie: { secure: false } //process.env.NODE_ENV === 'production' }  // Usar cookies seguras en producción
}));

// Inicializa Passport y sesiones de Passport
app.use(passport.initialize());
app.use(passport.session());

// Serialización y deserialización de usuarios
//passport.serializeUser((user, cb) => cb(null, user));
//passport.deserializeUser((obj, cb) => cb(null, obj));
passport.serializeUser((user, done) => {
  console.log('Serializing user: ', user);
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  console.log('deserializeUser ', id);
  User.findById(id, (err, user) => {
    console.log('passport.deserializeUser - ', user, ' err - ', err);
    done(err, user);
  });
});

// Configuración de la estrategia de Twitter con Passport
passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "https://futuristic-delivery-app-9z0i.onrender.com/auth/twitter/callback"
},
async function(token, tokenSecret, profile, done) {
  console.log("Token de Solicitud Recuperado:", token);
  try {
    const user = await userService.findOrCreateUser(profile.id, profile);
    done(null, user);
  } catch (error) {
    console.error('Error during authentication', error);
    done(error);
  }
}
));


// Ruta para iniciar la autenticación con Twitter
app.get('/auth/twitter', passport.authenticate('twitter'));

// Ruta de callback tras la autenticación con Twitter
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    // Autenticación exitosa
    // Redirigir a la página principal o a donde sea necesario
    console.log('/auth/twitter/callback - ', req)
    res.redirect('/api/categories');
  }
);

// Tus rutas existentes aquí...
app.use('/api/categories', categoryRouter);
app.use('/api/orders', authMiddleware, orderRouter);
app.use('/api/products', productRouter);
app.use('/api/extras', extraRouter);

// File for the images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const PORT = process.env.PORT;// || 3000;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
