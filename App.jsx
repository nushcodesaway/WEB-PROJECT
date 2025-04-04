import { useState, useRef, useEffect } from "react";
import "./App.css";

function App() {
  const [currentSong, setCurrentSong] = useState({
    title: "Sample Song",
    artist: "Sample Artist",
    duration: "3:45",
    isPlaying: false,
    album: "Album Name",
    audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Sample audio URL
  });

  const [playlist, setPlaylist] = useState([
    {
      id: 1,
      title: "Song 1",
      artist: "Artist 1",
      duration: "3:30",
      album: "Album 1",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: 2,
      title: "Song 2",
      artist: "Artist 2",
      duration: "4:15",
      album: "Album 2",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: 3,
      title: "Song 3",
      artist: "Artist 3",
      duration: "3:00",
      album: "Album 3",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
    {
      id: 4,
      title: "Song 4",
      artist: "Artist 4",
      duration: "4:45",
      album: "Album 4",
      audioUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
    },
  ]);

  const [currentTime, setCurrentTime] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState("none"); // none, one, all
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredPlaylist, setFilteredPlaylist] = useState(playlist);
  const audioRef = useRef(null);

  useEffect(() => {
    // Update filtered playlist when search query changes
    const filtered = playlist.filter(
      (song) =>
        song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
        song.album.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredPlaylist(filtered);
  }, [searchQuery, playlist]);

  useEffect(() => {
    // Update audio source when current song changes
    if (audioRef.current) {
      audioRef.current.src = currentSong.audioUrl;
    }
  }, [currentSong]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (currentSong.isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setCurrentSong((prev) => ({
        ...prev,
        isPlaying: !prev.isPlaying,
      }));
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleProgressClick = (e) => {
    if (audioRef.current) {
      const progressBar = e.currentTarget;
      const clickPosition = e.nativeEvent.offsetX;
      const progressBarWidth = progressBar.offsetWidth;
      const newTime =
        (clickPosition / progressBarWidth) * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
    }
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  const playNext = () => {
    const currentIndex = playlist.findIndex(
      (song) => song.id === currentSong.id
    );
    let nextIndex;

    if (isShuffled) {
      nextIndex = Math.floor(Math.random() * playlist.length);
    } else {
      nextIndex = (currentIndex + 1) % playlist.length;
    }

    setCurrentSong({
      ...playlist[nextIndex],
      isPlaying: true,
    });
  };

  const playPrevious = () => {
    const currentIndex = playlist.findIndex(
      (song) => song.id === currentSong.id
    );
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;

    setCurrentSong({
      ...playlist[prevIndex],
      isPlaying: true,
    });
  };

  const toggleShuffle = () => {
    setIsShuffled(!isShuffled);
  };

  const toggleRepeat = () => {
    setRepeatMode((prev) => {
      switch (prev) {
        case "none":
          return "one";
        case "one":
          return "all";
        case "all":
          return "none";
        default:
          return "none";
      }
    });
  };

  const handleSongSelect = (song) => {
    setCurrentSong({
      ...song,
      isPlaying: true,
    });
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  return (
    <div className="music-player">
      <audio
        ref={audioRef}
        onTimeUpdate={handleTimeUpdate}
        onEnded={playNext}
      />

      <div className="sidebar">
        <div className="logo">
          <div className="logo-icon">🎵</div>
          <h1>MusicApp</h1>
        </div>
        <nav className="nav-menu">
          <ul>
            <li className="active">
              <span className="nav-icon">🏠</span>
              <span>Home</span>
            </li>
            <li>
              <span className="nav-icon">🔍</span>
              <span>Search</span>
            </li>
            <li>
              <span className="nav-icon">📚</span>
              <span>Library</span>
            </li>
            <li>
              <span className="nav-icon">📑</span>
              <span>Playlists</span>
            </li>
            <li>
              <span className="nav-icon">❤️</span>
              <span>Favorites</span>
            </li>
          </ul>
        </nav>
        <div className="playlist">
          <div className="playlist-header">
            <h2>Your Playlist</h2>
            <button className="add-playlist-btn">+</button>
          </div>
          <ul>
            {filteredPlaylist.map((song) => (
              <li
                key={song.id}
                className={`playlist-item ${
                  currentSong.id === song.id ? "active" : ""
                }`}
                onClick={() => handleSongSelect(song)}>
                <div className="playlist-item-info">
                  <span className="song-title">{song.title}</span>
                  <span className="song-artist">{song.artist}</span>
                  <span className="song-album">{song.album}</span>
                </div>
                <span className="song-duration">{song.duration}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="main-content">
        <div className="top-bar">
          <div className="search-bar">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              placeholder="Search for songs, artists, or albums"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <div className="user-profile">
            <div className="user-avatar">👤</div>
            <span>User Name</span>
          </div>
        </div>

        <div className="content-area">
          <div className="welcome-section">
            <h1>Welcome back ANUSHA 23BCE0989!</h1>
            <p>Continue listening to your favorite music</p>
          </div>

          <div className="current-song">
            <div className="album-art">
              <div className="album-art-placeholder">
                <div className="album-art-icon">🎵</div>
              </div>
              <div className="album-art-overlay">
                <button className="play-overlay-btn" onClick={togglePlay}>
                  {currentSong.isPlaying ? "⏸" : "▶"}
                </button>
              </div>
            </div>
            <div className="song-info">
              <h3>{currentSong.title}</h3>
              <p className="artist">{currentSong.artist}</p>
              <p className="album">{currentSong.album}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="player-controls">
        <div className="now-playing">
          <div className="now-playing-art">
            <div className="mini-album-art"></div>
          </div>
          <div className="now-playing-info">
            <span className="now-playing-title">{currentSong.title}</span>
            <span className="now-playing-artist">{currentSong.artist}</span>
          </div>
          <button className="like-btn">❤️</button>
        </div>

        <div className="player-center">
          <div className="controls">
            <button
              className={`control-btn shuffle ${isShuffled ? "active" : ""}`}
              onClick={toggleShuffle}>
              🔀
            </button>
            <button className="control-btn" onClick={playPrevious}>
              ⏮
            </button>
            <button className="control-btn play-btn" onClick={togglePlay}>
              {currentSong.isPlaying ? "⏸" : "▶"}
            </button>
            <button className="control-btn" onClick={playNext}>
              ⏭
            </button>
            <button
              className={`control-btn repeat ${
                repeatMode !== "none" ? "active" : ""
              }`}
              onClick={toggleRepeat}>
              🔁
            </button>
          </div>
          <div className="song-progress">
            <div className="progress-bar" onClick={handleProgressClick}>
              <div
                className="progress"
                style={{
                  width: `${
                    (currentTime / audioRef.current?.duration) * 100 || 0
                  }%`,
                }}></div>
            </div>
            <div className="time">
              <span>{formatTime(currentTime)}</span>
              <span>{currentSong.duration}</span>
            </div>
          </div>
        </div>

        <div className="player-right">
          <div className="volume-control">
            <span className="volume-icon">🔊</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              className="volume-slider"
            />
          </div>
          <button className="queue-btn">📑</button>
        </div>
      </div>
    </div>
  );
}

export default App;
