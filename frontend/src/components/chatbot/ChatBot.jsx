import React, { useState, useRef, useEffect } from 'react';
import styles from './ChatBot.module.css';
import { chatbotAPI } from '../../services/api';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 1, text: "Hello! 👋 How can I help you with your job posting today?", isBot: true }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Ref for auto-scrolling
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);

  // Auto-scroll to bottom when messages change
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const toggleChat = () => {
    setIsOpen(!isOpen);
  };

  const handleSendMessage = async () => {
    if (inputMessage.trim() === '' || isLoading) return;

    // Add user message
    const newUserMessage = {
      id: messages.length + 1,
      text: inputMessage,
      isBot: false
    };

    const updatedMessages = [...messages, newUserMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Call the AI-powered chatbot API
      const response = await chatbotAPI.sendMessage(inputMessage, messages);

      const botResponse = {
        id: updatedMessages.length + 1,
        text: response.success ? response.data.message : "Sorry, I couldn't process your request. Please try again.",
        isBot: true
      };
      setMessages(prev => [...prev, botResponse]);
    } catch (error) {
      console.error('Chatbot error:', error);
      const errorResponse = {
        id: updatedMessages.length + 1,
        text: "I'm sorry, I'm having trouble connecting right now. Please try again later.",
        isBot: true
      };
      setMessages(prev => [...prev, errorResponse]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Bot Button */}
      <button
        className={`${styles.chatBotButton} ${isOpen ? styles.buttonHidden : ''}`}
        onClick={toggleChat}
        aria-label="Open chat bot"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="currentColor">
          <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
        </svg>
      </button>

      {/* Chat Bot Popup */}
      <div className={`${styles.chatBotPopup} ${isOpen ? styles.popupOpen : ''}`}>
        {/* Header */}
        <div className={styles.chatHeader}>
          <div className={styles.headerInfo}>
            <div className={styles.botAvatar}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2z" />
              </svg>
            </div>
            <div className={styles.headerText}>
              <h4>Job Posting Assistant</h4>
              <span className={styles.status}>Online</span>
            </div>
          </div>
          <button
            className={styles.closeButton}
            onClick={toggleChat}
            aria-label="Close chat"
          >
            ✕
          </button>
        </div>

        {/* Messages Container */}
        <div className={styles.messagesContainer} ref={messagesContainerRef}>
          {messages.map((message) => (
            <div
              key={message.id}
              className={`${styles.message} ${message.isBot ? styles.botMessage : styles.userMessage
                }`}
            >
              <div className={styles.messageBubble}>
                {message.text}
              </div>
            </div>
          ))}

          {/* Typing Indicator */}
          {isLoading && (
            <div className={styles.message + ' ' + styles.botMessage}>
              <div className={styles.typingIndicator}>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
                <div className={styles.typingDot}></div>
              </div>
            </div>
          )}

          {/* Invisible element to scroll to */}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className={styles.inputContainer}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              placeholder="Type your message..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className={styles.messageInput}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              disabled={!inputMessage.trim() || isLoading}
              className={styles.sendButton}
              aria-label="Send message"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && <div className={styles.overlay} onClick={toggleChat}></div>}
    </>
  );
};

export default ChatBot;