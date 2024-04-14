import express from "express";
import session from 'express-session'; 
import cors from 'cors';
import dotenv from 'dotenv';
import authMiddleware from "./middlewares/authMiddleware.js";
import path from 'path';
import { __dirname } from "./utils.js";
import passport from 'passport'; 
import { Strategy as TwitterStrategy } from 'passport-twitter';
import categoryRouter from './routes/category.route.js';
import extraRouter from './routes/extra.route.js';
import orderRouter from './routes/order.route.js';
import productRouter from './routes/product.route.js';
import userService from  './services/user.service.js';

dotenv.config();

// Twitter keys
const TWITTER_CONSUMER_KEY = process.env.TWITTER_CONSUMER_KEY;
const TWITTER_CONSUMER_SECRET = process.env.TWITTER_CONSUMER_SECRET;
const EXPRESS_SESSION_SECRET = process.env.EXPRESS_SESSION_SECRET;

// Initialize Express app
const app = express();

// Middleware to Cors
app.use(cors({origin: 'https://futuristic-delivery-app.firebaseapp.com'}));

// Middleware to parse JSON
app.use(express.json());

// express-session configuration
app.use(session({
  secret: EXPRESS_SESSION_SECRET, 
  resave: false,  
  saveUninitialized: false, 
  cookie: { secure: false } 
}));

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// User serialization and deserialization
passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});

// Twitter strategy configuration
passport.use(new TwitterStrategy({
  consumerKey: TWITTER_CONSUMER_KEY,
  consumerSecret: TWITTER_CONSUMER_SECRET,
  callbackURL: "https://futuristic-delivery-app-9z0i.onrender.com/auth/twitter/callback"
},
async function(token, tokenSecret, profile, done) {
  try {
    const user = await userService.findOrCreateUser(profile.id, profile);
    done(null, user);
  } catch (error) {
    console.error('Error during authentication', error);
    done(error);
  }
}
));


// Twiter's route
app.get('/auth/twitter', passport.authenticate('twitter'));

// Twitter's callback
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  (req, res) => {
    res.redirect('/api/categories');
  }
);

// Routes
app.use('/api/categories', categoryRouter);
app.use('/api/orders', authMiddleware, orderRouter);
app.use('/api/products', productRouter);
app.use('/api/extras', extraRouter);

// File for the images
app.use('/images', express.static(path.join(__dirname, 'public', 'images')));

const PORT = process.env.PORT;

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
