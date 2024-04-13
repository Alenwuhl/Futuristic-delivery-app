app.get('/auth/twitter', passport.authenticate('twitter', {
  scope: [
    'tweet.read',
    'users.read',
    'offline.access'
  ]
}));

app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
  });

  