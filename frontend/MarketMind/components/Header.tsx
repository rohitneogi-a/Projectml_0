import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import { MessageCircleCode } from "lucide-react";

export default function Header() {
  const [isChatbotOpen, setIsChatbotOpen] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { message: "Hello! How can I assist you today?", sender: "bot" },
    {
      message: "Please ask about predict, insights, or news related queries!",
      sender: "bot",
    },
  ]);
  const [newMessage, setNewMessage] = useState(false);
  const [isLoading, setIsLoading] = useState(false); // Loading state to track if the AI is thinking

  const toggleChatbot = () => {
    setIsChatbotOpen(!isChatbotOpen);
    if (isChatbotOpen) setNewMessage(false);
  };

  const sendMessage = async () => {
    if (!userMessage.trim()) return; // Don't send empty messages

    // Add user message to chat history
    setChatHistory((prev) => [
      ...prev,
      { message: userMessage, sender: "user" },
    ]);
    setUserMessage("");
    setIsLoading(true); // Set loading to true when waiting for a response

    try {
      const response = await fetch("http://127.0.0.1:8000/api/chatbot/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      });

      if (!response.ok) throw new Error("Server error");
      const data = await response.json();

      // Add bot's response to the chat history
      setChatHistory((prev) => [
        ...prev,
        { message: data.response, sender: "bot" },
      ]);
      setNewMessage(true); // Set new message received
    } catch {
      setChatHistory((prev) => [
        ...prev,
        { message: "Error: No response from server.", sender: "bot" },
      ]);
    } finally {
      setIsLoading(false); // Set loading to false once the response is received
    }
  };

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-white/90 dark:bg-gray-800/80 backdrop-blur-md shadow-md transition-colors duration-200"
      >
        <nav className="container mx-auto px-6 py-4 max-w-6xl">
          <div className="flex justify-between items-center">
            <Link href="/" className="text-3xl font-bold gradient-text">
              MarketMind
            </Link>
            <div className="flex items-center space-x-6">
              {["Home", "About"].map((item) => (
                <Link
                  key={item}
                  href={item === "Home" ? "/" : `/${item.toLowerCase()}`}
                  className="relative group"
                >
                  <motion.span
                    className="text-gray-700 dark:text-gray-300 hover:text-blue-700 dark:hover:text-blue-400 transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                  >
                    {item}
                  </motion.span>
                </Link>
              ))}

              {/* Chatbot Button */}
              <div className="relative">
                <button
                  onClick={toggleChatbot}
                  className="relative p-3  bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-full shadow-lg hover:scale-105 transition-transform"
                >
                  <MessageCircleCode />
                </button>
                {newMessage && !isChatbotOpen && (
                  <motion.span
                    className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#90EE90] rounded-full animate-pulse"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 0 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                  />
                )}
              </div>
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Stylish Chatbot Modal */}
      {isChatbotOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-0 right-0 z-50 w-[420px] h-[520px] bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-2xl shadow-2xl flex flex-col overflow-hidden "
        >
          {/* Chatbot Header */}
          <div className="flex justify-between items-center p-4 bg-gradient-to-b from-gray-900 to-gray-800 text-white rounded-t-2xl">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold">Chatbot</h2>
              {/* Blinking Green Light beside Chatbot Text */}
              {newMessage && (
                <motion.span className="w-2.5 h-2.5 bg-[#90EE90] rounded-full animate-pulse" />
              )}
            </div>
            <button
              onClick={toggleChatbot}
              className="text-xl hover:text-gray-300 transition-colors"
            >
              ✖
            </button>
          </div>

          {/* Chat History */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 dark:bg-gray-800">
            {chatHistory.map((chat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
                className={`p-2 max-w-xs rounded-lg shadow-md ${
                  chat.sender === "bot"
                    ? "bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start rounded-xl"
                    : "bg-blue-600 rounded-xl text-white self-end w-1/2"
                }`}
              >
                {chat.message}
              </motion.div>
            ))}

            {isLoading && (
              <div className="p-2 max-w-xs shadow-md bg-gray-300 dark:bg-gray-700 text-gray-900 dark:text-gray-100 self-start rounded-xl flex items-center space-x-2">
                <div className="w-3 h-3 border-4 border-t-4 border-gray-400 dark:border-white border-solid rounded-full animate-pulse"></div>{" "}
                {/* <span className="text-gray-500">   ...</span> */}
                {/* Small Loader */}
              </div>
            )}
          </div>

          {/* Input Box & Send Button */}
          <div className="p-4 bg-gray-200 dark:bg-gray-900 flex space-x-2">
            <input
              type="text"
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={sendMessage}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-xl shadow-md hover:scale-105 transition-transform "
            >
              ➤
            </button>
          </div>
        </motion.div>
      )}
    </>
  );
}
