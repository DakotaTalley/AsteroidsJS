class Sound {
  constructor(src, vol) {
    this.sound = document.createElement("audio");
    this.sound.src = src;
    this.sound.volume = vol;
    this.sound.setAttribute("preload", "auto");
    this.sound.setAttribute("controls", "none");
    this.sound.style.display = "none";
    document.body.appendChild(this.sound);
  }

  play() {
    this.sound.currentTime = 0;
    // Resetting currentTime while a prior play() is still pending can abort
    // that request, rejecting its promise with AbortError under rapid fire.
    this.sound.play().catch(() => {});
  }
  stop() {
    this.sound.pause();
  }
}

export default Sound;
