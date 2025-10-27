/**
 * Fast Video Loader - Optimized video loading utility
 * Implements preloading, lazy loading, and adaptive quality strategies
 */

class FastVideoLoader {
  constructor(options = {}) {
    this.options = {
      preloadStrategy: options.preloadStrategy || 'metadata', // 'none', 'metadata', 'auto'
      lazyLoad: options.lazyLoad !== undefined ? options.lazyLoad : true,
      adaptiveQuality: options.adaptiveQuality || false,
      bufferAhead: options.bufferAhead || 30, // seconds
      rootMargin: options.rootMargin || '50px',
      ...options
    };
    
    this.videos = new Map();
    this.observer = null;
    this.networkInfo = this.getNetworkInfo();
    
    if (this.options.lazyLoad) {
      this.initIntersectionObserver();
    }
  }

  /**
   * Load a video element with optimizations
   * @param {HTMLVideoElement|string} videoElement - Video element or selector
   * @param {Object} sources - Video sources { src: string, type?: string, quality?: string }
   * @returns {Promise<HTMLVideoElement>}
   */
  async loadVideo(videoElement, sources = {}) {
    const video = typeof videoElement === 'string' 
      ? document.querySelector(videoElement) 
      : videoElement;

    if (!video) {
      throw new Error('Video element not found');
    }

    // Apply optimizations
    this.optimizeVideoElement(video);

    // Set sources
    if (sources.src) {
      const optimalSource = this.options.adaptiveQuality 
        ? this.selectOptimalQuality(sources) 
        : sources.src;
      
      video.src = optimalSource;
    }

    // Store video reference
    this.videos.set(video, { sources, loaded: false });

    // Handle lazy loading
    if (this.options.lazyLoad && this.observer) {
      this.observer.observe(video);
      return new Promise((resolve) => {
        video.addEventListener('loadeddata', () => resolve(video), { once: true });
      });
    }

    // Immediate load
    return this.forceLoad(video);
  }

  /**
   * Optimize video element attributes for fast loading
   */
  optimizeVideoElement(video) {
    video.preload = this.options.preloadStrategy;
    video.setAttribute('playsinline', '');
    
    // Enable hardware acceleration hints
    video.style.willChange = 'transform';
    
    // Disable picture-in-picture if not needed
    if (!this.options.allowPiP) {
      video.disablePictureInPicture = true;
    }

    // Add buffer optimization
    if (video.buffered && this.options.bufferAhead) {
      video.addEventListener('progress', () => {
        this.optimizeBuffer(video);
      });
    }
  }

  /**
   * Force load video immediately
   */
  async forceLoad(video) {
    return new Promise((resolve, reject) => {
      const onLoad = () => {
        this.videos.get(video).loaded = true;
        cleanup();
        resolve(video);
      };

      const onError = (e) => {
        cleanup();
        reject(new Error(`Video load failed: ${e.message}`));
      };

      const cleanup = () => {
        video.removeEventListener('loadeddata', onLoad);
        video.removeEventListener('error', onError);
      };

      video.addEventListener('loadeddata', onLoad, { once: true });
      video.addEventListener('error', onError, { once: true });

      // Trigger load
      video.load();
    });
  }

  /**
   * Initialize Intersection Observer for lazy loading
   */
  initIntersectionObserver() {
    if (!('IntersectionObserver' in window)) {
      console.warn('IntersectionObserver not supported, disabling lazy load');
      this.options.lazyLoad = false;
      return;
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const video = entry.target;
            const videoData = this.videos.get(video);
            
            if (videoData && !videoData.loaded) {
              this.forceLoad(video).catch(console.error);
              this.observer.unobserve(video);
            }
          }
        });
      },
      {
        rootMargin: this.options.rootMargin,
        threshold: 0.1
      }
    );
  }

  /**
   * Select optimal video quality based on network conditions
   */
  selectOptimalQuality(sources) {
    if (typeof sources === 'string') return sources;
    
    const connection = this.networkInfo;
    
    // If sources is an array of quality options
    if (Array.isArray(sources)) {
      if (connection.effectiveType === '4g' || connection.downlink > 5) {
        return sources.find(s => s.quality === 'high')?.src || sources[0].src;
      } else if (connection.effectiveType === '3g') {
        return sources.find(s => s.quality === 'medium')?.src || sources[0].src;
      } else {
        return sources.find(s => s.quality === 'low')?.src || sources[0].src;
      }
    }
    
    return sources.src || sources;
  }

  /**
   * Get network information
   */
  getNetworkInfo() {
    const connection = navigator.connection || 
                      navigator.mozConnection || 
                      navigator.webkitConnection;
    
    return {
      effectiveType: connection?.effectiveType || '4g',
      downlink: connection?.downlink || 10,
      saveData: connection?.saveData || false
    };
  }

  /**
   * Optimize buffer management
   */
  optimizeBuffer(video) {
    if (!video.buffered.length) return;

    const currentTime = video.currentTime;
    const bufferedEnd = video.buffered.end(video.buffered.length - 1);
    
    // Check if we have enough buffer ahead
    if (bufferedEnd - currentTime < this.options.bufferAhead) {
      // Browser will automatically buffer more
      return;
    }
  }

  /**
   * Preload multiple videos
   */
  async preloadVideos(videoSelectors) {
    const promises = videoSelectors.map(selector => {
      const video = document.querySelector(selector);
      if (video) {
        return this.loadVideo(video);
      }
      return Promise.resolve(null);
    });

    return Promise.allSettled(promises);
  }

  /**
   * Destroy and cleanup
   */
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
    }
    this.videos.clear();
  }
}

/**
 * Simple function to quickly load a video
 * @param {string|HTMLVideoElement} video - Video element or selector
 * @param {string|Object} src - Video source URL or sources object
 * @param {Object} options - Loading options
 */
async function quickLoadVideo(video, src, options = {}) {
  const loader = new FastVideoLoader(options);
  return loader.loadVideo(video, typeof src === 'string' ? { src } : src);
}

// Export for use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { FastVideoLoader, quickLoadVideo };
}
