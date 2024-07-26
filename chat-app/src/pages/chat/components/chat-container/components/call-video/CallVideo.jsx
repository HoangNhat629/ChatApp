import { useRef, useState, useEffect } from "react";
import { IoVideocam, IoVideocamOff, IoMic, IoMicOff } from "react-icons/io5";
import { FaPhoneAlt } from "react-icons/fa";
import { useAppStore } from "../../../../../../store/store";
import { useSocket } from "../../../../../../context/SocketContext";
const CallVideo = () => {
  const videoRef = useRef(null);
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [audioEnabled, setAudioEnabled] = useState(true);
  const { selectedChatData, userInfo, isMakeCall, setIsMakeCall } = useAppStore();
  const socket = useSocket();
  useEffect(() => {
    if (isMakeCall) {
      // Access the webcam
      const getMedia = async () => {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({
            video: videoEnabled,
            audio: audioEnabled,
          });
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          console.error("Error accessing webcam or microphone:", err);
        }
      };

      getMedia();
    }

    // Cleanup function to stop the media stream when the component unmounts or makeCall changes
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject;
        const tracks = stream.getTracks();
        tracks.forEach((track) => track.stop());
      }
    };
  }, [isMakeCall, videoEnabled, audioEnabled]);

  const toggleVideo = () => {
    setVideoEnabled((prev) => !prev);
  };

  const toggleAudio = () => {
    setAudioEnabled((prev) => !prev);
  };

  const endCall = () => {
    setIsMakeCall(false);
    setVideoEnabled(false);
    setAudioEnabled(false);
  };

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        style={{ width: "50%", height: "auto" }}
      />
      <div className="absolute bottom-5 flex gap-4">
        <button
          className="bg-black/30 p-2 rounded-full hover:bg-black/50 transition-all duration-300"
          onClick={toggleVideo}
        >
          {videoEnabled ? <IoVideocam /> : <IoVideocamOff />}
        </button>
        <button
          className="bg-black/30 p-2 rounded-full hover:bg-black/50 transition-all duration-300"
          onClick={toggleAudio}
        >
          {audioEnabled ? <IoMic /> : <IoMicOff />}
        </button>
        <button
          className="bg-red-500 p-2 rounded-full hover:bg-red-700 transition-all duration-300"
          onClick={endCall}
        >
          <FaPhoneAlt />
        </button>
      </div>
    </div>
  );
};

export default CallVideo;
