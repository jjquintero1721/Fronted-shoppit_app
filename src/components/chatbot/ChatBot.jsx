import React, { useState, useEffect, useRef, useContext } from 'react';
import { FaPaperPlane, FaTimes } from 'react-icons/fa';
import { FaRobot } from 'react-icons/fa';
import { AuthContext } from '../../context/AuthContext';
import api from '../../api';
import styles from './ChatBot.module.css';
import ChatBotService from './ChatBotService';

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { 
      text: "¡Hola! Soy el asistente virtual de A.I.A.G. ¿En qué puedo ayudarte hoy?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const { isAuthenticated, username } = useContext(AuthContext);
  const chatBotService = new ChatBotService(api);
  
  // Scroll to bottom whenever messages change
  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };
  
  const toggleChat = () => {
    setIsOpen(!isOpen);
    // If opening the chat and user is authenticated, send a personalized greeting
    if (!isOpen && isAuthenticated && username && messages.length === 1) {
      setTimeout(() => {
        addMessage(`¡Hola ${username}! ¿En qué puedo ayudarte hoy?`, 'bot');
      }, 300);
    }
  };
  
  const addMessage = (text, sender) => {
    const newMessage = {
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prevMessages => [...prevMessages, newMessage]);
  };
  
  const handleInputChange = (e) => {
    setInputMessage(e.target.value);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (inputMessage.trim() === '') return;
    
    // Add user message
    addMessage(inputMessage, 'user');
    const userQuestion = inputMessage;
    setInputMessage('');
    
    // Show typing indicator
    setIsTyping(true);
    
    try {
      // Process the message and get a response
      const response = await chatBotService.processMessage(userQuestion, isAuthenticated);
      
      // Add bot response after a small delay to simulate thinking
      setTimeout(() => {
        setIsTyping(false);
        addMessage(response, 'bot');
      }, 1000);
    } catch (error) {
      console.error('Error processing message:', error);
      setIsTyping(false);
      addMessage('Lo siento, tuve un problema al procesar tu mensaje. ¿Puedes intentarlo de nuevo?', 'bot');
    }
  };
  
  const formatTime = (date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <div className={styles.chatbotContainer}>
      {/* Chat button */}
      <button 
        className={`${styles.chatButton} ${isOpen ? styles.hidden : ''}`} 
        onClick={toggleChat}
      >
        <FaRobot className={styles.chatIcon} />
        <span>Chat con A.I.A.G</span>
      </button>
      
      {/* Chat window */}
      <div className={`${styles.chatWindow} ${isOpen ? styles.open : ''}`}>
        <div className={styles.chatHeader}>
          <div className={styles.chatTitle}>
            <FaRobot className={styles.chatHeaderIcon} />
            <span>Chat con A.I.A.G</span>
          </div>
          <button className={styles.closeButton} onClick={toggleChat}>
            <FaTimes />
          </button>
        </div>
        
        
<div className={styles.chatMessages}>
  {messages.map((msg, index) => (
    <div 
      key={index} 
      className={`${styles.message} ${
        msg.sender === 'user' ? styles.userMessage : styles.botMessage
      }`}
    >
      <div className={styles.messageContent}>
        {/* Usar dangerouslySetInnerHTML para cualquier mensaje que contenga HTML */}
        {typeof msg.text === 'string' && msg.text.includes('<') && msg.text.includes('>') ? (
          <p dangerouslySetInnerHTML={{ __html: msg.text }}></p>
        ) : (
          <p>{msg.text}</p>
        )}
        <span className={styles.messageTime}>{formatTime(msg.timestamp)}</span>
      </div>
    </div>
  ))}
  {isTyping && (
    <div className={`${styles.message} ${styles.botMessage}`}>
      <div className={styles.typingIndicator}>
        <span></span>
        <span></span>
        <span></span>
      </div>
    </div>
  )}
  <div ref={messagesEndRef} />
</div>
        
        <form className={styles.chatInputContainer} onSubmit={handleSubmit}>
          <input
            type="text"
            value={inputMessage}
            onChange={handleInputChange}
            placeholder="Escribe un mensaje..."
            className={styles.chatInput}
          />
          <button 
            type="submit" 
            className={styles.sendButton}
            disabled={inputMessage.trim() === ''}
          >
            <FaPaperPlane />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatBot;