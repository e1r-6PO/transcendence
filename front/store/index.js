export const state = () => ({
  isSoundEnabled: Boolean,
  isMusicEnabled: Boolean,
  soundVolume: (localStorage.getItem('soundVolume') == null ? 7 : localStorage.getItem('soundVolume')),
  musicVolume: (localStorage.getItem('musicVolume') == null ? 7 : localStorage.getItem('musicVolume')),
  sounds: {
    'inQueue': new Audio(require("@/assets/sounds/inQueue.mp3").default),
    'offQueue': new Audio(require("@/assets/sounds/offQueue.mp3").default),
    'audio3': new Audio(require('@/assets/sounds/3c.mp3').default),
    'audio2': new Audio(require('@/assets/sounds/2c.mp3').default),
    'audio1': new Audio(require('@/assets/sounds/1c.mp3').default),
    'audioGO': new Audio(require('@/assets/sounds/GOc.mp3').default),
    'loserSound': new Audio(require("@/assets/sounds/loserSound.mp3").default),
    'winnerSound': new Audio(require("@/assets/sounds/winnerSound.mp3").default),
    'spectatorSound': new Audio(require("@/assets/sounds/spectatorEndSound.mp3").default),
    'wallCollision': new Audio(require("@/assets/sounds/wallCollision.mp3").default),
    'paddleCollision': new Audio(require("@/assets/sounds/paddleCollision.mp3").default),
  },
  music: new Audio(require("@/assets/sounds/Derezzed.mp3").default),
})

export const mutations = {
  changeSoundVolume(state, n) {
    state.soundVolume = n
    localStorage.setItem('soundVolume', n)

    for (const [key, value] of Object.entries(state.sounds)) {
      value.volume = n / 10
    }
    if (state.isSoundEnabled == false) {
      state.isSoundEnabled = !state.isSoundEnabled;
      localStorage.setItem('isSoundEnabled', state.isSoundEnabled);
    }
  },

  changeMusicVolume(state, n) {
    state.musicVolume = n
    localStorage.setItem('musicVolume', n)
    state.music.volume = n / 10
    if (state.isMusicEnabled == false) {
      state.isMusicEnabled = !state.isMusicEnabled;
      localStorage.setItem('isMusicEnabled', state.isMusicEnabled);
      state.music.play()
      state.music.loop = true
    }
  },

  toggleSound(state) {
    state.isSoundEnabled = !state.isSoundEnabled;
    localStorage.setItem('isSoundEnabled', state.isSoundEnabled);
  },
  toggleMusic(state) {
    state.isMusicEnabled = !state.isMusicEnabled;
    localStorage.setItem('isMusicEnabled', state.isMusicEnabled);
  },
  initializeSound(state) {
    const isSoundEnabled = JSON.parse(localStorage.getItem('isSoundEnabled'));
    if(isSoundEnabled == null) {
      state.isSoundEnabled = true;
      localStorage.setItem("isSoundEnabled", true);
    } else if(isSoundEnabled) {
      state.isSoundEnabled = true;
      localStorage.setItem("isSoundEnabled", true);
    } else {
      state.isSoundEnabled = false;
      localStorage.setItem("isSoundEnabled", false);
    }
  },
  initializeMusic(state) {
    const isMusicEnabled = JSON.parse(localStorage.getItem('isMusicEnabled'));
    if(isMusicEnabled == null) {
      state.isMusicEnabled = false;
      localStorage.setItem("isMusicEnabled", false);
    } else if(isMusicEnabled) {
      state.isMusicEnabled = false;
      localStorage.setItem("isMusicEnabled", false);
    } else {
      state.isMusicEnabled = false;
      localStorage.setItem("isMusicEnabled", false);
    }
  },
}
