/**
 * HmongHeritage Audio Manager
 * Handles playback of cultural and language audio files.
 */
const AudioManager = {
  basePath: 'audio/',
  
  /**
   * Plays an audio file based on the Hmong word.
   * @param {string} word - The Hmong word (e.g., 'nyuj')
   * @returns {Promise<boolean>} - True if playback started, false if file not found.
   */
  async playWord(word) {
    const filename = `${word.toLowerCase().trim()}.mp3`;
    const url = `${this.basePath}${filename}`;
    
    try {
      const audio = new Audio(url);
      await audio.play();
      return true;
    } catch (error) {
      console.warn(`Audio file not found: ${url}`);
      return false;
    }
  },

  /**
   * Plays a UI sound effect (e.g., 'correct', 'wrong')
   * @param {string} effect - The effect name
   */
  playEffect(effect) {
    const effects = {
      correct: 'audio/sfx/correct.mp3',
      wrong: 'audio/sfx/wrong.mp3',
      pop: 'audio/sfx/pop.mp3'
    };
    
    if (effects[effect]) {
      new Audio(effects[effect]).play().catch(() => {});
    }
  }
};

export default AudioManager;
