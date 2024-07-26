import { useState, useRef, useEffect } from "react";
import { GrAttachment } from "react-icons/gr";
import { RiEmojiStickerLine } from "react-icons/ri";
import { IoSend } from "react-icons/io5";
import EmojiPicker from "emoji-picker-react";
import { useAppStore } from "../../../../../../store/store";
import { useSocket } from "../../../../../../context/SocketContext";
import { apiClient } from "../../../../../../lib/api-client";
import { UPLOAD_FILE_ROUTE } from "../../../../../../utils/constants";
import { IoMdCall } from "react-icons/io";
import CallVideo from "../call-video/CallVideo";

const MessageBar = () => {
  const emojiRef = useRef();
  const fileInputRef = useRef();
  const [message, setMessage] = useState("");
  const [emojiPickerOpen, setEmojiPickerOpen] = useState(false);
  const {
    selectedChatType,
    selectedChatData,
    userInfo,
    setIsUploading,
    setFileUploadProgress,
    setIsMakeCall,
    isMakeCall,
  } = useAppStore();

  const socket = useSocket();
  useEffect(() => {
    function handleClickOutside(e) {
      if (emojiRef.current && !emojiRef.current.contains(e.target)) {
        setEmojiPickerOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [emojiRef]);
  const handleAddEmoji = (emoji) => {
    setMessage((msg) => msg + emoji.emoji);
  };
  const handleSendMessage = () => {
    if (selectedChatType === "contact") {
      socket.emit("sendMessage", {
        content: message,
        sender: userInfo._id,
        recipient: selectedChatData._id,
        messageType: "text",
        fileURL: undefined,
      });
    } else if (selectedChatType === "channel") {
      socket.emit("send-channel-message", {
        content: message,
        sender: userInfo._id,
        channelId: selectedChatData._id,
        messageType: "text",
        fileURL: undefined,
      });
    }
    setMessage("");
  };
  const handleAttachmentClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleAttachmentChange = async (e) => {
    try {
      const file = e.target.files[0];
      if (file) {
        const formData = new FormData();
        formData.append("file", file);
        setIsUploading(true);
        const res = await apiClient.post(UPLOAD_FILE_ROUTE, formData, {
          withCredentials: true,
          onUploadProgress: (progressEvent) => {
            setFileUploadProgress(
              Math.round((100 * progressEvent.loaded) / progressEvent.total)
            );
          },
        });

        if (res.status === 200 && res.data) {
          setIsUploading(false);
          if (selectedChatType === "contact") {
            socket.emit("sendMessage", {
              content: undefined,
              sender: userInfo._id,
              recipient: selectedChatData._id,
              messageType: "file",
              fileURL: res.data.filePath,
            });
          } else if (selectedChatType === "channel") {
            socket.emit("send-channel-message", {
              content: undefined,
              sender: userInfo._id,
              channelId: selectedChatData._id,
              messageType: "file",
              fileURL: res.data.filePath,
            });
          }
        }
      }
    } catch (error) {
      setIsUploading(false);
      console.error(
        "Error during save changes:",
        error.response ? error.response.data : error.message
      );
    }
  };
  const callFreature = () => {
    return (
      <div className="fixed z-[1000] top-0 left-0 h-[100vh] w-[100vw] flex items-center justify-center backdrop-blur-lg flex-col">
        <CallVideo />
      </div>
    );
  };
  return (
    <div className="h-[10vh] bg-[#1c1d25] flex justify-center items-center px-8 mb-6 gap-6">
      <div className="flex-1 flex bg-[#2a2b33] rounded-md items-center gap-5 pr-5">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="flex-1 p-5 bg-transparent rounded-md focus:border-none focus:outline-none"
          placeholder="Enter Message"
        />
        <button
          className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
          onClick={handleAttachmentClick}
        >
          <GrAttachment className="text-2xl" />
        </button>

        {selectedChatType === "contact" && (
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setIsMakeCall(true)}
          >
            <IoMdCall className="text-2xl" />
          </button>
        )}
        {isMakeCall && callFreature()}
        <input
          type="file"
          className="hidden"
          ref={fileInputRef}
          onChange={handleAttachmentChange}
        />
        <div className="relative">
          <button
            className="text-neutral-500 focus:border-none focus:outline-none focus:text-white duration-300 transition-all"
            onClick={() => setEmojiPickerOpen(true)}
          >
            <RiEmojiStickerLine className="text-2xl" />
          </button>
          <div className="absolute bottom-16 right-0" ref={emojiRef}>
            <EmojiPicker
              theme="dark"
              open={emojiPickerOpen}
              onEmojiClick={handleAddEmoji}
              autoFocusSearch={false}
            />
          </div>
        </div>
      </div>
      <button
        className="bg-[#8417ff] hover:bg-[#741bda] focus:bg-[#741bda] p-5 justify-center items-center flex rounded-md focus:outline-none focus:border-none focus:text-white duration-300 transition-all"
        onClick={handleSendMessage}
      >
        <IoSend className="text-2xl" />
      </button>
    </div>
  );
};

export default MessageBar;
