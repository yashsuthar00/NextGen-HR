import { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Play, Pause, Volume2, VolumeX, Maximize, ArrowLeft, 
  ChevronRight, Clock, Award, MessageSquare, BarChart, 
  Bot // Replace Robot with Bot
} from 'lucide-react';
import axios from 'axios';

// Interview Viewer Component
export default function InterviewViewer() {
  const { interviewId } = useParams(); // Extract interviewId from the URL
  const [interview, setInterview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedQuestion, setSelectedQuestion] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoRef, setVideoRef] = useState(null);
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);
  const [buffering, setBuffering] = useState(false);
  const [videoMetadata, setVideoMetadata] = useState({});

  // Extract Cloudinary video ID from URL
  const extractCloudinaryId = (url) => {
    if (!url) return null;

    const regex = /\/(?:v\d+\/|video\/upload\/)?([^/]+)(?:\/[^/]+)?$/;
    const match = url.match(regex);

    return match ? match[1].split('.')[0] : null;
  };

  // Fetch video metadata from Cloudinary
  const fetchVideoMetadata = useCallback(async (videoUrl) => {
    if (!videoUrl) return;

    const videoId = extractCloudinaryId(videoUrl);
    if (!videoId) return;

    if (videoMetadata[videoId]) {
      setDuration(videoMetadata[videoId].duration);
      return;
    }

    try {
      const cloudName = 'your-cloud-name'; // Replace with your Cloudinary cloud name

      const response = await axios.get(
        `https://res.cloudinary.com/${cloudName}/video/upload/${videoId}.json`
      );

      if (response.data && response.data.duration) {
        const newMetadata = {
          ...videoMetadata,
          [videoId]: {
            duration: response.data.duration,
            width: response.data.width,
            height: response.data.height,
          },
        };

        setVideoMetadata(newMetadata);
        setDuration(response.data.duration);
        setIsVideoLoaded(true);
      }
    } catch (error) {
      console.error('Error fetching video metadata:', error);
    }
  }, [videoMetadata]);

  useEffect(() => {
    const fetchInterview = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:8000/api/interview/${interviewId}`);
        setInterview(response.data);
      } catch (err) {
        setError(err.response?.data?.message || err.message || 'Failed to fetch interview data');
      } finally {
        setLoading(false);
      }
    };

    fetchInterview();
  }, [interviewId]);

  useEffect(() => {
    if (selectedQuestion?.videoUrl) {
      fetchVideoMetadata(selectedQuestion.videoUrl);
    }
  }, [selectedQuestion, fetchVideoMetadata]);

  const handleQuestionClick = (question) => {
    setSelectedQuestion(question);
    setIsPlaying(false);
    setCurrentTime(0);
    if (videoRef) {
      videoRef.currentTime = 0;
    }

    if (question.videoUrl) {
      fetchVideoMetadata(question.videoUrl);
    }
  };

  const handleVideoRef = (ref) => {
    setVideoRef(ref);
    if (ref) {
      const videoElement = ref;

      videoElement.addEventListener('timeupdate', () => {
        setCurrentTime(videoElement.currentTime);
      });

      videoElement.addEventListener('loadedmetadata', () => {
        if (videoElement.duration && !isNaN(videoElement.duration) && isFinite(videoElement.duration)) {
          if (!duration || duration === 0) {
            setDuration(videoElement.duration);
          }
          setIsVideoLoaded(true);
        }
      });

      videoElement.addEventListener('durationchange', () => {
        if (videoElement.duration && !isNaN(videoElement.duration) && isFinite(videoElement.duration)) {
          setDuration(videoElement.duration);
        }
      });

      videoElement.addEventListener('waiting', () => {
        setBuffering(true);
      });

      videoElement.addEventListener('canplay', () => {
        setBuffering(false);
      });

      videoElement.addEventListener('ended', () => {
        setIsPlaying(false);
      });

      if (selectedQuestion?.videoUrl) {
        const videoId = extractCloudinaryId(selectedQuestion.videoUrl);
        if (videoId && videoMetadata[videoId]?.duration) {
          setDuration(videoMetadata[videoId].duration);
        }
      }
    }
  };

  const togglePlay = () => {
    if (videoRef) {
      if (isPlaying) {
        videoRef.pause();
      } else {
        videoRef.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const toggleMute = () => {
    if (videoRef) {
      videoRef.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleSeek = (e) => {
    if (videoRef && !isNaN(duration) && duration > 0) {
      const newTime = (parseFloat(e.target.value) / 100) * duration;
      videoRef.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time) => {
    if (time === undefined || isNaN(time) || !isFinite(time)) {
      return '0:00';
    }
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const calculateProgress = () => {
    if (!isNaN(currentTime) && !isNaN(duration) && duration > 0) {
      return (currentTime / duration) * 100;
    }
    return 0;
  };

  const handleFullscreen = () => {
    if (videoRef) {
      if (videoRef.requestFullscreen) {
        videoRef.requestFullscreen();
      } else if (videoRef.webkitRequestFullscreen) {
        videoRef.webkitRequestFullscreen();
      } else if (videoRef.msRequestFullscreen) {
        videoRef.msRequestFullscreen();
      }
    }
  };

  const handleBackToQuestions = () => {
    setSelectedQuestion(null);
  };

  const jumpToTime = (timeInSeconds) => {
    if (videoRef && isVideoLoaded && !isNaN(timeInSeconds) && timeInSeconds <= duration) {
      videoRef.currentTime = timeInSeconds;
      setCurrentTime(timeInSeconds);
    }
  };

  const QuickTimeButton = ({ time, label }) => (
    <button
      onClick={() => jumpToTime(time)}
      className="px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-blue-600 transition-colors"
      disabled={!isVideoLoaded || duration <= 0}
    >
      {label}
    </button>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-700">Loading interview data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-xl font-bold text-red-500 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!interview) {
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
        <div className="p-6 bg-white rounded-lg shadow-lg">
          <div className="w-16 h-16 mx-auto mb-4 bg-blue-50 rounded-full flex items-center justify-center">
            <Bot size={32} className="text-blue-400" /> {/* Replace Robot with Bot */}
          </div>
          <h2 className="text-xl font-bold text-gray-700 mb-4">No Data Available</h2>
          <p className="text-gray-600">The interview data could not be found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {selectedQuestion ? (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-500 transform translate-y-0 opacity-100">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handleBackToQuestions}
                  className="flex items-center text-gray-600 hover:text-blue-600 transition-colors group"
                >
                  <ArrowLeft className="mr-2 group-hover:-translate-x-1 transition-transform" size={20} />
                  Back to questions
                </button>
                <div className="flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                  <Bot size={18} className="text-blue-600" /> {/* Replace Robot with Bot */}
                  <span className="text-sm font-medium text-blue-700">AI Interview Session</span>
                </div>
              </div>

              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Question</h2>
                <p className="text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-200">
                  {selectedQuestion.question}
                </p>
              </div>

              <div className="video-container relative mb-6 bg-black rounded-xl overflow-hidden">
                <video
                  ref={handleVideoRef}
                  src={selectedQuestion.videoUrl}
                  className="w-full aspect-video rounded-lg object-cover"
                  onPlay={() => setIsPlaying(true)}
                  onPause={() => setIsPlaying(false)}
                  preload="metadata"
                  playsInline
                />

                <div
                  className="absolute inset-0 flex items-center justify-center cursor-pointer"
                  onClick={togglePlay}
                >
                  {buffering && (
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                      <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}

                  {!isPlaying && !buffering && (
                    <div className="bg-blue-600 bg-opacity-80 rounded-full p-4 hover:bg-opacity-100 transition-all transform hover:scale-110">
                      <Play size={32} className="text-white" />
                    </div>
                  )}
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 via-black/60 to-transparent px-4 pt-16 pb-4">
                  <div className="relative w-full h-2 mb-3 group">
                    <div className="absolute inset-0 bg-gray-600 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500"
                        style={{ width: `${calculateProgress()}%` }}
                      ></div>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={calculateProgress()}
                      onChange={handleSeek}
                      className="appearance-none absolute inset-0 w-full opacity-0 cursor-pointer"
                      disabled={!isVideoLoaded || duration <= 0}
                    />
                    <div
                      className="absolute h-4 w-4 bg-blue-500 rounded-full top-1/2 transform -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"
                      style={{ left: `${calculateProgress()}%` }}
                    ></div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={togglePlay}
                        className="text-white hover:text-blue-400 transition-colors focus:outline-none"
                        aria-label={isPlaying ? 'Pause' : 'Play'}
                      >
                        {isPlaying ? <Pause size={22} /> : <Play size={22} />}
                      </button>

                      <button
                        onClick={toggleMute}
                        className="text-white hover:text-blue-400 transition-colors focus:outline-none"
                        aria-label={isMuted ? 'Unmute' : 'Mute'}
                      >
                        {isMuted ? <VolumeX size={22} /> : <Volume2 size={22} />}
                      </button>

                      <div className="text-white text-sm">
                        {formatTime(currentTime)} / {isVideoLoaded ? formatTime(duration) : '0:00'}
                      </div>
                    </div>

                    {duration > 0 && duration > 30 && (
                      <div className="hidden sm:flex space-x-2 mr-4">
                        <QuickTimeButton time={0} label="Start" />
                        <QuickTimeButton time={Math.max(0, duration * 0.25)} label="25%" />
                        <QuickTimeButton time={Math.max(0, duration * 0.5)} label="50%" />
                        <QuickTimeButton time={Math.max(0, duration * 0.75)} label="75%" />
                      </div>
                    )}

                    <button
                      onClick={handleFullscreen}
                      className="text-white hover:text-blue-400 transition-colors focus:outline-none"
                      aria-label="Fullscreen"
                    >
                      <Maximize size={22} />
                    </button>
                  </div>
                </div>
              </div>

              {selectedQuestion.answer && (
                <div className="mb-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4">Answer</h2>
                  <p className="text-gray-700 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    {selectedQuestion.answer}
                  </p>
                </div>
              )}

              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-4">Evaluation</h2>
                <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 flex items-center">
                  <div className="flex-1">
                    <div className="text-4xl font-bold text-blue-600">
                      {selectedQuestion.evaluation || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">Score</div>
                  </div>
                  <div className="w-32 h-32 relative">
                    <svg className="w-full h-full" viewBox="0 0 100 100">
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#e6e6e6"
                        strokeWidth="10"
                      />
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="none"
                        stroke="#3b82f6"
                        strokeWidth="10"
                        strokeDasharray={`${2 * Math.PI * 45}`}
                        strokeDashoffset={`${
                          2 * Math.PI * 45 * (1 - (selectedQuestion.evaluation || 0) / 100)
                        }`}
                        strokeLinecap="round"
                        transform="rotate(-90 50 50)"
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-lg font-bold text-gray-700">
                      {selectedQuestion.evaluation ? `${selectedQuestion.evaluation}/100` : 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-xl overflow-hidden transition-all duration-500 transform translate-y-0 opacity-100">
            <div className="p-6">
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center">
                  <Bot size={28} className="mr-3 text-blue-600" /> {/* Replace Robot with Bot */}
                  AI Interview Review
                </h1>
                <p className="text-gray-600 mt-2">
                  Click on a question to view the candidate's response and evaluation.
                </p>
              </div>

              <ul className="divide-y divide-gray-200">
                {interview.questions.map((question, index) => (
                  <li
                    key={question._id.$oid || index}
                    className="py-4 hover:bg-gray-50 rounded-lg transition-colors cursor-pointer group"
                    onClick={() => handleQuestionClick(question)}
                  >
                    <div className="flex items-start">
                      <div className="flex-shrink-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-lg font-medium text-gray-800 group-hover:text-blue-600 transition-colors">
                          {question.question}
                        </p>
                        <div className="mt-2 flex items-center text-sm text-gray-500">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            Score: {question.evaluation || 'N/A'}
                          </span>
                        </div>
                      </div>
                      <div className="flex-shrink-0 ml-4 text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Play size={20} />
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}