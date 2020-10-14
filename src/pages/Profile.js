import React, { useState, useEffect } from 'react';
import './Profile.scss';

const generatePlaylist = (tracks) => {
  let n = 100,
    arr = tracks,
    len = arr.length,
    playlist = new Array(n),
    taken = new Array(len);

  while (n--) {
    let x = Math.floor(Math.random() * len);
    playlist[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  
  return playlist;
};

const getAllTracks = async (url, token) => {
  let tracks = [];

  async function makeRequest(url) {
    let data = await makeNetworkRequest(url, token);
    tracks.push(
      ...data.items.map((item) => {
        return { name: item.track.name, id: item.track.id, artist: item.track.artists[0].name };
      })
    );

    if (data.next) {
      await makeRequest(data.next);
    }
  }

  await makeRequest(url);
  return tracks;
};

const makeNetworkRequest = async (url, token) => {
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return await response.json();
};

const ProfileInformation = (props) => {
  const { name, image, trackCount, tracks, disabled } = props;
  const [playlist, setPlaylist] = useState(null);

  return (
    <div>
      <img className="profile-image" src={image} alt="Profile" />
      <h1 className="title is-1">Hello {name}!</h1>
      <h4 className="title is-4">
        You have {trackCount} songs saved in your library.
      </h4>
      <h4 className="title is-4">
        Click the button below to generate a playlist of 100 truly random songs.
      </h4>

      {playlist ? (
        <>
          <button
            className="button is-large is-primary"
            onClick={() => setPlaylist(generatePlaylist(tracks))}
          >
            Regenerate Playlist
          </button>
          <button className="button is-large is-primary">Save Playlist</button>
          <div className="box track-table">
            <h4 className="title is-4">Your Playlist</h4>
            {playlist.map((track) => (
              <p key={track.id}>{track.name} - {track.artist}</p>
            ))}
          </div>
        </>
      ) : (
        <>
          <button
            className="button is-large is-primary"
            disabled={disabled}
            onClick={() => setPlaylist(generatePlaylist(tracks))}
          >
            {disabled ? 'Loading Your Songs...' : 'Create Playlist'}
          </button>
        </>
      )}
    </div>
  );
};

const Profile = (props) => {
  const [profile, setProfile] = useState(null);
  const [trackCount, setTrackCount] = useState(null);
  const [tracks, setTracks] = useState([]);
  const [disabled, setDisabled] = useState(true);
  const { token } = props;

  useEffect(() => {
    async function fetchProfile() {
      const data = await makeNetworkRequest(
        'https://api.spotify.com/v1/me',
        token
      );
      console.log(data);
      setProfile(data);

      const trackCount = await makeNetworkRequest(
        'https://api.spotify.com/v1/me/tracks',
        token
      );
      setTrackCount(trackCount.total);

      const tracks = await getAllTracks(
        'https://api.spotify.com/v1/me/tracks',
        token
      );
      setTracks(tracks);
      setDisabled(false);
    }

    fetchProfile();
  }, [token]);

  return (
    <div>
      <section className="hero is-fullheight-with-navbar">
        <div className="hero-body">
          <div className="container">
            {profile && trackCount ? (
              <ProfileInformation
                name={profile.display_name}
                image={profile.images[0].url}
                trackCount={trackCount}
                tracks={tracks}
                disabled={disabled}
              />
            ) : (
              <div className="title">Loading...</div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Profile;
