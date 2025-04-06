import { useState, useEffect } from 'react';
import './components.css';

const ChatHistory = ({ apiBaseUrl = 'http://localhost:8000' }) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch chat history from the backend
  const fetchChatHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/chat-history`);
      const data = await response.json();
      setChatHistory(data.history || []);
    } catch (error) {
      console.error('Error fetching chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear chat history
  const clearChatHistory = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${apiBaseUrl}/api/clear-chat`, {
        method: 'POST',
      });
      const data = await response.json();
      if (data.status === 'success') {
        setChatHistory([]);
      }
    } catch (error) {
      console.error('Error clearing chat history:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch chat history on component mount
  useEffect(() => {
    fetchChatHistory();
  }, [apiBaseUrl]);

  return (
    <div className="chat-history-container">
      <div className="chat-history-header">
        <h3><span className="icon">💬</span> Chat History</h3>
        <div className="chat-history-actions">
          <button 
            onClick={fetchChatHistory} 
            className="refresh-btn"
            disabled={isLoading}
          >
            <span className="icon">🔄</span> Refresh
          </button>
          <button 
            onClick={clearChatHistory} 
            className="clear-btn"
            disabled={isLoading}
          >
            <span className="icon">🗑️</span> Clear Chat
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="loading-container">
          <span className="loading"></span>
          <p>Loading chat history...</p>
        </div>
      ) : chatHistory.length === 0 ? (
        <div className="empty-history">
          <p>No chat history available.</p>
        </div>
      ) : (
        <div className="chat-messages">
          {chatHistory.map((message, index) => (
            <div key={index} className="chat-entry">
              <div className="chat-entry-content">
                {message.role === 'user' ? (
                  <div className="patient-query">
                    <span className="query-label">You:</span>
                    <p>{message.content}</p>
                  </div>
                ) : (
                  <div className="doctor-response">
                    <span className="response-label">Doctor:</span>
                    <p>{message.content}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ChatHistory;