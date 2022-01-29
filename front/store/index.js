export const state = () => ({
  isSoundEnabled: Boolean, // these are not 
  isMusicEnabled: Boolean,
})

export const mutations = {
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
