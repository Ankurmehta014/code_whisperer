const menuItems = document.querySelectorAll(".menu-item");

menuItems.forEach((item) => {
  item.addEventListener("click", () => {
    menuItems.forEach((i) => i.classList.remove("active"));
    item.classList.add("active");
  });
});

const homeItem = document.getElementById("home");
const newReleasesItem = document.getElementById("new-releases");
const topChartsItem = document.getElementById("top-charts");

const div4 = document.getElementById("div4");
const div5 = document.getElementById("div5");
const div6 = document.getElementById("div6");

// Add click event listeners
homeItem.addEventListener("click", () => {
  div4.style.display = "block";
  div5.style.display = "none";
  div6.style.display = "none";
});

newReleasesItem.addEventListener("click", () => {
  div4.style.display = "none";
  div5.style.display = "block";
  div6.style.display = "none";
});

topChartsItem.addEventListener("click", () => {
  div4.style.display = "none";
  div5.style.display = "none";
  div6.style.display = "block";
});

document.addEventListener("DOMContentLoaded", () => {
  const musicCards = document.querySelectorAll(".music-card");
  const playingImage = document.querySelector(".playing-image img");
  const audioPlayer = new Audio();
  const playPauseBtn = document.getElementById("play-pause-btn");
  const stopBtn = document.getElementById("stop-btn");

  let isPlaying = false;

  musicCards.forEach((card) => {
    card.addEventListener("click", () => {
      const newImageSrc = card.querySelector("img").src;
      const newAudioSrc = card.getAttribute("data-audio");

      // Update the playing image
      playingImage.src = newImageSrc;

      // Load the new audio source
      audioPlayer.src = newAudioSrc;

      // Play the new audio
      audioPlayer.play();
      isPlaying = true;
      playPauseBtn.textContent = "Pause"; // Update the button text
    });
  });

  // Play/Pause button functionality
  playPauseBtn.addEventListener("click", () => {
    if (isPlaying) {
      audioPlayer.pause();
      isPlaying = false;
      playPauseBtn.textContent = "Play"; // Change the button text
    } else {
      audioPlayer.play();
      isPlaying = true;
      playPauseBtn.textContent = "Pause"; // Change the button text
    }
  });

  // Stop button functionality
  stopBtn.addEventListener("click", () => {
    audioPlayer.pause();
    audioPlayer.currentTime = 0; // Reset the audio to the beginning
    isPlaying = false;
    playPauseBtn.textContent = "Play"; // Change the button text
  });
});
