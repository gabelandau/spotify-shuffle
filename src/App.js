import React from 'react';
import Authenticate from './pages/Authenticate';
import Profile from './pages/Profile';
import './App.sass';

const App = () => {
  if (window.location.hash) {
    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('access_token');

    return <Profile token={token} />
  } else {
    return <Authenticate />
  }
};

export default App;
