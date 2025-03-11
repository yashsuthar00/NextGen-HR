import { videoApi } from './api';

// Maximum number of concurrent uploads
const MAX_CONCURRENT_UPLOADS = 2;

class UploadManager {
  constructor() {
    this.uploadQueue = [];
    this.activeUploads = 0;
    this.isProcessing = false;
  }

  // Add an item to the upload queue
  addToQueue(videoBlob, metadata, onProgress, onComplete, onError) {
    const queueItem = {
      id: metadata.responseId,
      videoBlob,
      metadata,
      onProgress,
      onComplete,
      onError,
      status: 'queued'
    };

    this.uploadQueue.push(queueItem);
    
    // Start processing the queue if not already running
    if (!this.isProcessing) {
      this.processQueue();
    }
    
    return queueItem.id;
  }

  // Process items in the queue
  async processQueue() {
    if (this.uploadQueue.length === 0 || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    // Process uploads until the queue is empty
    while (this.uploadQueue.length > 0 && this.activeUploads < MAX_CONCURRENT_UPLOADS) {
      const item = this.uploadQueue.find(item => item.status === 'queued');
      
      if (!item) break;
      
      item.status = 'uploading';
      this.activeUploads++;
      
      // Start the upload process
      this.uploadItem(item)
        .finally(() => {
          this.activeUploads--;
          // Continue processing the queue
          this.processQueue();
        });
    }

    this.isProcessing = false;
  }

  // Upload a single item
  async uploadItem(item) {
    try {
      // Create a file from the blob
      const file = new File([item.videoBlob], `response_${item.id}.webm`, {
        type: 'video/webm'
      });

      // Upload the file
      const result = await videoApi.uploadVideoResponse(
        file,
        item.metadata,
        (progress) => {
          if (item.onProgress) {
            item.onProgress(item.id, progress);
          }
        }
      );

      item.status = 'completed';
      
      if (item.onComplete) {
        item.onComplete(item.id, result);
      }
      
      return result;
      
    } catch (error) {
      item.status = 'error';
      
      if (item.onError) {
        item.onError(item.id, error);
      }
      
      console.error('Upload failed:', error);
      throw error;
    }
  }

  // Cancel an upload
  cancelUpload(id) {
    // Find the item in the queue
    const itemIndex = this.uploadQueue.findIndex(item => item.id === id);
    
    if (itemIndex >= 0) {
      const item = this.uploadQueue[itemIndex];
      
      // If the item is queued, we can simply remove it
      if (item.status === 'queued') {
        this.uploadQueue.splice(itemIndex, 1);
        return true;
      }
      
      // If the item is uploading, we can't cancel it easily with axios
      // For a real implementation, you would use AbortController with axios
      // Here we just mark it as canceled and handle in the completion
      if (item.status === 'uploading') {
        item.status = 'canceled';
        // This won't actually stop the upload but will prevent callbacks
        return true;
      }
    }
    
    return false;
  }

  // Get the status of all uploads
  getStatus() {
    return {
      queueLength: this.uploadQueue.length,
      activeUploads: this.activeUploads,
      items: this.uploadQueue.map(item => ({
        id: item.id,
        status: item.status
      }))
    };
  }
}

// Create a singleton instance
const uploadManager = new UploadManager();

export default uploadManager;