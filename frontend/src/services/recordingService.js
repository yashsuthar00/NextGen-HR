class RecordingService {
    constructor() {
      this.mediaRecorder = null;
      this.stream = null;
      this.recordedChunks = [];
      this.isRecording = false;
      this.constraints = {
        audio: true,
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        }
      };
    }
  
    // Initialize the recording service with a video element
    async initialize(videoElement = null) {
      try {
        // Release any previous stream
        await this.releaseStream();
        
        // Request camera and microphone access
        this.stream = await navigator.mediaDevices.getUserMedia(this.constraints);
        
        // If a video element is provided, set it as the source
        if (videoElement) {
          this.setVideoSource(videoElement);
        }
        
        return { success: true };
      } catch (error) {
        console.error('Failed to initialize recording service:', error);
        return { 
          success: false, 
          error: error.message || 'Failed to access camera and microphone'
        };
      }
    }
  
    // Set the video source to show the camera preview
    setVideoSource(videoElement) {
      if (this.stream && videoElement) {
        videoElement.srcObject = this.stream;
      }
    }
  
    // Start recording
    startRecording(options = {}) {
      if (!this.stream) {
        throw new Error('Stream not initialized. Call initialize() first.');
      }
  
      // Reset recorded chunks
      this.recordedChunks = [];
      
      // Set up options for MediaRecorder
      const mediaRecorderOptions = {
        mimeType: options.mimeType || 'video/webm;codecs=vp9,opus',
        videoBitsPerSecond: options.videoBitsPerSecond || 2500000 // 2.5 Mbps
      };
      
      try {
        this.mediaRecorder = new MediaRecorder(this.stream, mediaRecorderOptions);
      } catch (e) {
        // Fallback to a more compatible format if the preferred format is not supported
        this.mediaRecorder = new MediaRecorder(this.stream);
      }
      
      // Set up event handlers
      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.recordedChunks.push(event.data);
        }
      };
      
      // Start recording
      this.mediaRecorder.start(options.timeslice || 1000); // Collect data every second by default
      this.isRecording = true;
      
      return true;
    }
  
    // Stop recording and get the recorded blob
    stopRecording() {
      return new Promise((resolve, reject) => {
        if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
          reject(new Error('No active recording'));
          return;
        }
        
        // Set up the onstop handler to resolve the promise with the recorded blob
        this.mediaRecorder.onstop = () => {
          const blob = new Blob(this.recordedChunks, { type: 'video/webm' });
          this.isRecording = false;
          resolve(blob);
        };
        
        // Stop the recording
        this.mediaRecorder.stop();
      });
    }
  
    // Pause recording
    pauseRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state === 'recording') {
        this.mediaRecorder.pause();
        return true;
      }
      return false;
    }
  
    // Resume recording
    resumeRecording() {
      if (this.mediaRecorder && this.mediaRecorder.state === 'paused') {
        this.mediaRecorder.resume();
        return true;
      }
      return false;
    }
  
    // Release the media stream and clean up resources
    async releaseStream() {
      if (this.isRecording) {
        try {
          await this.stopRecording();
        } catch (e) {
          // Ignore errors when stopping recording
        }
      }
      
      if (this.stream) {
        this.stream.getTracks().forEach(track => track.stop());
        this.stream = null;
      }
      
      this.mediaRecorder = null;
      this.isRecording = false;
    }
  
    // Check if recording is currently active
    isCurrentlyRecording() {
      return this.isRecording;
    }
  
    // Get the current recording state
    getRecordingState() {
      if (!this.mediaRecorder) return 'inactive';
      return this.mediaRecorder.state;
    }
  
    // Check if getUserMedia and MediaRecorder are supported
    static isSupported() {
      return !!(navigator.mediaDevices && 
                navigator.mediaDevices.getUserMedia && 
                window.MediaRecorder);
    }
  }
  
  // Create a singleton instance
  const recordingService = new RecordingService();
  
  export default recordingService;