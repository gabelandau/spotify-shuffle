import React from 'react';

const navigateToAuth = () => {
  const key = process.env.REACT_APP_SPOTIFY_APP_ID;
  const baseUrl = 'https://accounts.spotify.com/authorize';

  const url = `${baseUrl}?client_id=${key}&response_type=token&redirect_uri=${process.env.REACT_APP_REDIRECT_URL}&scope=user-library-read playlist-modify-private`;

  window.location.href = url;
};

const Authenticate = () => {
  return (
    <div>
      <section className="hero is-fullheight-with-navbar">
        <div className="hero-body">
          <div className="container">
            <div className="title">
              <h1 className="title is-1">Spotify Shuffle Playlists</h1>
              <button
                className="button is-primary is-large"
                onClick={() => navigateToAuth()}
              >
                Authenticate
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Authenticate;
