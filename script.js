document.addEventListener('DOMContentLoaded', function() {
  console.log("Welcome to Spotify");

  const audioPlayer = document.getElementById('audioPlayer');
  const items = document.querySelectorAll('.item');
  const nowPlayingInfo = document.querySelector('.now-playing-info');
  const nowPlayingText = document.querySelector('.now-playing-text');
  const playPauseBtn = document.querySelector('.play-pause');
  const progressBar = document.querySelector('.progress-bar');
  const progress = document.querySelector('.progress');
  const volumeSlider = document.querySelector('.volume-slider');
  const volumeProgress = document.querySelector('.volume-progress');
  
  // Create now playing bar if it doesn't exist
  if (!document.querySelector('.now-playing')) {
    const nowPlayingBar = document.createElement('div');
    nowPlayingBar.className = 'now-playing';
    nowPlayingBar.innerHTML = `
      <div class="now-playing-info">
        <img src="" alt="Album Cover" id="nowPlayingImage">
        <div class="now-playing-text">
          <h4 id="nowPlayingTitle">Not Playing</h4>
          <p id="nowPlayingArtist">-</p>
        </div>
      </div>
      <div class="player-controls">
        <div class="control-buttons">
          <button class="shuffle"><i class="fas fa-random"></i></button>
          <button class="previous"><i class="fas fa-step-backward"></i></button>
          <button class="play-pause"><i class="fas fa-play"></i></button>
          <button class="next"><i class="fas fa-step-forward"></i></button>
          <button class="repeat"><i class="fas fa-redo"></i></button>
        </div>
        <div class="progress-container">
          <div class="progress-bar">
            <div class="progress"></div>
          </div>
        </div>
      </div>
      <div class="volume-controls">
        <button class="volume-btn"><i class="fas fa-volume-up"></i></button>
        <div class="volume-slider">
          <div class="volume-progress"></div>
        </div>
      </div>
    `;
    document.body.appendChild(nowPlayingBar);
  }

  // Reset all icons to play
  function resetIcons() {
    items.forEach(item => {
      const icon = item.querySelector('.play-btn i');
      if (icon) {
        icon.classList.remove('fa-pause');
        icon.classList.add('fa-play');
      }
    });
  }

  // Update now playing info
  function updateNowPlaying(item) {
    const nowPlayingImage = document.getElementById('nowPlayingImage');
    const nowPlayingTitle = document.getElementById('nowPlayingTitle');
    const nowPlayingArtist = document.getElementById('nowPlayingArtist');
    
    nowPlayingImage.src = item.querySelector('img').src;
    nowPlayingTitle.textContent = item.querySelector('h4').textContent;
    nowPlayingArtist.textContent = item.querySelector('p').textContent;
  }

  // Play a song
  function playSong(item) {
    const song = item.getAttribute('data-song');
    
    if (!song) {
      console.log("No audio file assigned!");
      return;
    }

    audioPlayer.src = song;
    audioPlayer.play()
      .then(() => {
        console.log("Playing: " + song);
        resetIcons();
        const icon = item.querySelector('.play-btn i');
        if (icon) {
          icon.classList.remove('fa-play');
          icon.classList.add('fa-pause');
        }
        updateNowPlaying(item);
        
        // Update play/pause button in now playing bar
        const playPauseIcon = document.querySelector('.play-pause i');
        if (playPauseIcon) {
          playPauseIcon.classList.remove('fa-play');
          playPauseIcon.classList.add('fa-pause');
        }
      })
      .catch(error => {
        console.error("Error playing audio:", error);
      });
  }

  // Pause the current song
  function pauseSong() {
    audioPlayer.pause();
    const playPauseIcon = document.querySelector('.play-pause i');
    if (playPauseIcon) {
      playPauseIcon.classList.remove('fa-pause');
      playPauseIcon.classList.add('fa-play');
    }
  }

  // Toggle play/pause
  function togglePlayPause() {
    if (audioPlayer.paused) {
      audioPlayer.play();
      const playPauseIcon = document.querySelector('.play-pause i');
      if (playPauseIcon) {
        playPauseIcon.classList.remove('fa-play');
        playPauseIcon.classList.add('fa-pause');
      }
    } else {
      pauseSong();
    }
  }

  // Handle item clicks
  items.forEach(item => {
    item.addEventListener('click', () => {
      const song = item.getAttribute('data-song');
      
      if (!song) {
        console.log("No audio file assigned!");
        return;
      }

      // If clicking the currently playing song
      if (audioPlayer.src.includes(song)) {
        if (!audioPlayer.paused) {
          pauseSong();
          return;
        } else {
          audioPlayer.play();
          resetIcons();
          const icon = item.querySelector('.play-btn i');
          if (icon) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
          }
          return;
        }
      }

      // Play new song
      playSong(item);
    });
  });

  // Handle play button clicks
  document.querySelectorAll('.play-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent triggering the parent item's click event
      const item = btn.closest('.item');
      const song = item.getAttribute('data-song');
      
      if (!song) {
        console.log("No audio file assigned!");
        return;
      }

      if (audioPlayer.src.includes(song)) {
        if (!audioPlayer.paused) {
          pauseSong();
          const icon = btn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
          }
        } else {
          audioPlayer.play();
          const icon = btn.querySelector('i');
          if (icon) {
            icon.classList.remove('fa-play');
            icon.classList.add('fa-pause');
          }
        }
      } else {
        playSong(item);
      }
    });
  });

  // When audio ends, reset icons
  audioPlayer.addEventListener('ended', () => {
    resetIcons();
    console.log("Audio ended");
    
    const playPauseIcon = document.querySelector('.play-pause i');
    if (playPauseIcon) {
      playPauseIcon.classList.remove('fa-pause');
      playPauseIcon.classList.add('fa-play');
    }
  });

  // Update progress bar
  audioPlayer.addEventListener('timeupdate', () => {
    const progressPercent = (audioPlayer.currentTime / audioPlayer.duration) * 100;
    progress.style.width = `${progressPercent}%`;
  });

  // Click on progress bar to seek
  progressBar.addEventListener('click', (e) => {
    const clickX = e.offsetX;
    const progressBarWidth = progressBar.clientWidth;
    const seekTime = (clickX / progressBarWidth) * audioPlayer.duration;
    audioPlayer.currentTime = seekTime;
  });

  // Volume control
  volumeSlider.addEventListener('click', (e) => {
    const clickX = e.offsetX;
    const sliderWidth = volumeSlider.clientWidth;
    const volume = clickX / sliderWidth;
    audioPlayer.volume = volume;
    volumeProgress.style.width = `${volume * 100}%`;
  });

  // Set initial volume
  audioPlayer.volume = 0.7;
  volumeProgress.style.width = '70%';

  // Play/pause button in now playing bar
  document.querySelector('.play-pause')?.addEventListener('click', togglePlayPause);
});