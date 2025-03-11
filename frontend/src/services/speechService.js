class SpeechService {
    constructor() {
      this.synth = window.speechSynthesis;
      this.utterance = null;
      this.voices = [];
      this.isVoicesLoaded = false;
      this.preferredVoice = null;
      
      // Load available voices
      this.loadVoices();
      
      // Re-load voices if they change
      if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = this.loadVoices.bind(this);
      }
    }
  
    // Load available voices and select a preferred voice
    loadVoices() {
      this.voices = this.synth.getVoices();
      
      if (this.voices.length > 0) {
        this.isVoicesLoaded = true;
        
        // Try to find a neutral, clear voice (preferably English)
        this.preferredVoice = this.voices.find(voice => 
          voice.name.includes('Google') && voice.name.includes('US English')
        ) || 
        this.voices.find(voice => 
          voice.lang === 'en-US' && voice.name.includes('Female')
        ) ||
        this.voices.find(voice => 
          voice.lang === 'en-US'
        ) ||
        this.voices[0]; // Fallback to the first voice
      }
      
      return this.voices;
    }
  
    // Speak the provided text
    speak(text, options = {}) {
      return new Promise((resolve, reject) => {
        if (!this.synth) {
          reject(new Error('Speech synthesis not supported'));
          return;
        }
  
        // Cancel any ongoing speech
        this.cancel();
        
        // Create a new utterance
        this.utterance = new SpeechSynthesisUtterance(text);
        
        // Set voice
        if (options.voice) {
          this.utterance.voice = options.voice;
        } else if (this.preferredVoice) {
          this.utterance.voice = this.preferredVoice;
        }
        
        // Set optional parameters
        if (options.rate) this.utterance.rate = options.rate;
        if (options.pitch) this.utterance.pitch = options.pitch;
        if (options.volume) this.utterance.volume = options.volume;
        
        // Set callbacks
        this.utterance.onend = () => {
          resolve();
        };
        
        this.utterance.onerror = (event) => {
          reject(new Error(`Speech synthesis error: ${event.error}`));
        };
        
        // Start speaking
        this.synth.speak(this.utterance);
      });
    }
  
    // Cancel any ongoing speech
    cancel() {
      if (this.synth) {
        this.synth.cancel();
      }
    }
  
    // Pause speech
    pause() {
      if (this.synth) {
        this.synth.pause();
      }
    }
  
    // Resume speech
    resume() {
      if (this.synth) {
        this.synth.resume();
      }
    }
  
    // Check if synthesis is speaking
    isSpeaking() {
      return this.synth ? this.synth.speaking : false;
    }
  
    // Check if speech synthesis is supported
    isSupported() {
      return 'speechSynthesis' in window;
    }
  
    // Get all available voices
    getVoices() {
      return this.voices;
    }
  }
  
  // Create a singleton instance
  const speechService = new SpeechService();
  
  export default speechService;