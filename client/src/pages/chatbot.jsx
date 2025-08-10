import React, { useState, useEffect, useRef } from 'react';
import { FaRobot, FaUser, FaPaperPlane, FaSpinner } from 'react-icons/fa';

const ChatBot = () => {
  const [messages, setMessages] = useState([
    { 
      sender: 'bot', 
      text: 'Hi there! 👋 I\'m your shopping assistant. How can I help you today?',
      quickReplies: [
        'Order Status',
        'Payment Issues',
        'Change Payment Method',
        'Return Policy',
        'Delivery Time'
      ]
    }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  // Auto-scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Simulate bot typing delay
  const simulateTyping = (callback) => {
    setIsTyping(true);
    setTimeout(() => {
      callback();
      setIsTyping(false);
    }, 800 + Math.random() * 1000);
  };

  const getBotReply = (msg) => {
    const lowerMsg = msg.toLowerCase().trim();
    let reply = {};
    
    // Payment Method Change - THIS MUST COME FIRST
    if (/change|modify|switch|update|different.*payment|payment.*change|want.*payment/.test(lowerMsg)) {
      reply.text = "To change your payment method:";
      reply.html = (
        <div>
          <p><strong>For unshipped orders:</strong></p>
          <ol style={{ marginLeft: '20px' }}>
            <li>Go to 'My Orders' in your account</li>
            <li>Select the order you want to modify</li>
            <li>Click 'Change Payment Method'</li>
            <li>Select your new preferred payment option</li>
          </ol>
          <p><strong>Note:</strong> If your order has already shipped, the payment method cannot be changed. Please contact support@example.com for assistance.</p>
        </div>
      );
      reply.quickReplies = ['Contact Support', 'Track My Order', 'Payment Issues'];
    }
    // Login & Account
    else if (lowerMsg.includes("login") || lowerMsg.includes("sign in")) {
      reply.text = "You can log in using the 'Sign In' button at the top right. Need help with password recovery?";
      reply.quickReplies = ['Forgot Password', 'Create Account'];
    } 
    else if (lowerMsg.includes("forgot password") || lowerMsg.includes("reset password")) {
      reply.text = "No worries! Click 'Forgot Password' on the login page. We'll send a reset link to your email.";
    }
    else if (lowerMsg.includes("create account") || lowerMsg.includes("sign up")) {
      reply.text = "To create an account, click 'Register' and enter your details. You'll get a verification email to complete signup.";
    }
    // Payment Methods
    else if (lowerMsg.includes("payment") || lowerMsg.includes("pay options") || lowerMsg.includes("payment methods")) {
      reply.text = "We accept multiple payment options for your convenience:";
      reply.html = (
        <div>
          <p>We accept:</p>
          <ul style={{ marginLeft: '20px', listStyleType: 'disc' }}>
            <li>UPI (Google Pay, PhonePe, Paytm)</li>
            <li>Credit/Debit Cards</li>
            <li>Net Banking</li>
            <li>Cash on Delivery (COD)</li>
          </ul>
          <p>All payments are securely processed.</p>
        </div>
      );
      reply.quickReplies = ['Change Payment Method', 'Payment Failed', 'COD Questions'];
    }
    else if (lowerMsg.includes("gpay") || lowerMsg.includes("google pay")) {
      reply.text = "Yes! Google Pay is supported for quick and secure payments. Look for the GPay option at checkout.";
    }
    else if (lowerMsg.includes("phonepe")) {
      reply.text = "Absolutely! PhonePe is accepted. Select UPI payment and choose PhonePe at checkout.";
    }
    else if (lowerMsg.includes("cod") || lowerMsg.includes("cash on delivery")) {
      reply.text = "Cash on Delivery is available for most orders. The maximum COD amount is ₹10,000. A ₹30 COD fee may apply.";
    }
    else if (lowerMsg.includes("payment failed")) {
      reply.text = "If payment failed but money was deducted, it will be refunded in 3-5 business days. Please check:";
      reply.html = (
        <div>
          <ol style={{ marginLeft: '20px' }}>
            <li>Your bank balance</li>
            <li>Payment confirmation email</li>
            <li>Order status in 'My Account'</li>
          </ol>
          <p>If the issue persists, share your order number for assistance.</p>
        </div>
      );
    }
    // Orders & Shipping
    else if (lowerMsg.includes("track") || lowerMsg.includes("where is my order") || lowerMsg.includes("order status")) {
      reply.text = "You can track your order in real-time:";
      reply.html = (
        <div>
          <p>1. Go to <strong>'My Orders'</strong> in your account</p>
          <p>2. Click on your order number</p>
          <p>3. View live tracking with carrier updates</p>
          <p>Need the tracking link? Share your order number.</p>
        </div>
      );
    }
    else if (lowerMsg.includes("cancel order")) {
      reply.text = "To cancel an order:";
      reply.html = (
        <div>
          <p>1. Visit <strong>'My Orders'</strong></p>
          <p>2. Select the order</p>
          <p>3. Click <strong>'Cancel Order'</strong></p>
          <p>Note: Orders already shipped cannot be canceled but may be returned.</p>
        </div>
      );
    }
    else if (lowerMsg.includes("delivery time") || lowerMsg.includes("how long for delivery")) {
      reply.text = "Delivery times vary by location:";
      reply.html = (
        <div>
          <ul style={{ marginLeft: '20px', listStyleType: 'disc' }}>
            <li><strong>Metro cities:</strong> 2-3 business days</li>
            <li><strong>Other cities:</strong> 3-5 business days</li>
            <li><strong>Remote areas:</strong> 5-7 business days</li>
          </ul>
          <p>Express delivery (1-2 days) is available for ₹99 extra.</p>
        </div>
      );
    }
    // Discount
    else if (lowerMsg.includes("discount") || lowerMsg.includes("coupon") || lowerMsg.includes("promo code")) {
      reply.text = "Sorry for the trouble! Please check if the code is expired or has minimum purchase requirements. If it's still not working, share the code with us, and we'll help!";
    }
    // Returns & Refunds
    else if (lowerMsg.includes("return policy")) {
      reply.text = "Our hassle-free return policy:";
      reply.html = (
        <div>
          <ul style={{ marginLeft: '20px', listStyleType: 'disc' }}>
            <li><strong>Duration:</strong> 7 days from delivery</li>
            <li><strong>Condition:</strong> Unused with original tags/packaging</li>
            <li><strong>Process:</strong> Free pickup for most locations</li>
            <li><strong>Refund:</strong> 5-7 business days after return</li>
          </ul>
          <p>Some items (e.g., innerwear) are non-returnable for hygiene reasons.</p>
        </div>
      );
    }
    else if (lowerMsg.includes("how to return") || lowerMsg.includes("start return")) {
      reply.text = "Initiating a return is easy:";
      reply.html = (
        <div>
          <p>1. Go to <strong>'My Orders'</strong></p>
          <p>2. Select the item</p>
          <p>3. Click <strong>'Return Item'</strong></p>
          <p>4. Choose reason and pickup date</p>
          <p>We'll email you return instructions and tracking details.</p>
        </div>
      );
    }
    else if (lowerMsg.includes("refund")) {
      reply.text = "Refund details:";
      reply.html = (
        <div>
          <ul style={{ marginLeft: '20px', listStyleType: 'disc' }}>
            <li><strong>Processing Time:</strong> 5-7 business days after we receive return</li>
            <li><strong>Method:</strong> Refunded to original payment source</li>
            <li><strong>Bank Processing:</strong> May take additional 2-3 days</li>
          </ul>
          <p>For COD orders, refunds are processed via bank transfer (share account details).</p>
        </div>
      );
    }
    else if (lowerMsg.includes("damage") || lowerMsg.includes("broken") || lowerMsg.includes("defective")) {
      reply.text = "We apologize for the inconvenience! Please send a photo of the damage to support@example.com, and we'll arrange a replacement or refund immediately.";
    }
    // Default fallback
    else {
      reply.text = "I'm happy to help with:";
      reply.quickReplies = [
        'Track My Order',
        'Payment Issues',
        'Start a Return',
        'Contact Support',
        'Change Payment Method'
      ];
    }

    return reply;
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { sender: 'user', text: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    simulateTyping(() => {
      const botReply = getBotReply(input);
      setMessages(prev => [...prev, { 
        sender: 'bot', 
        text: botReply.text,
        html: botReply.html,
        quickReplies: botReply.quickReplies 
      }]);
    });
  };

  const handleQuickReply = (reply) => {
    setInput(reply);
    handleSend();
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.header}>
        <FaRobot style={{ marginRight: '10px', color: '#4CAF50' }} />
        <h3 style={{ margin: 0 }}>Shopping Assistant</h3>
      </div>
      
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div key={index}>
            <div
              style={{
                ...styles.message,
                alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                backgroundColor: msg.sender === 'user' ? '#e3f2fd' : '#f5f5f5'
              }}
            >
              <div style={styles.messageIcon}>
                {msg.sender === 'user' ? <FaUser /> : <FaRobot />}
              </div>
              <div>
                {msg.html || msg.text}
                {msg.quickReplies && (
                  <div style={styles.quickReplies}>
                    {msg.quickReplies.map((reply, i) => (
                      <button 
                        key={i}
                        style={styles.quickReplyButton}
                        onClick={() => handleQuickReply(reply)}
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isTyping && (
          <div style={{ ...styles.message, alignSelf: 'flex-start', backgroundColor: '#f5f5f5' }}>
            <div style={styles.messageIcon}>
              <FaRobot />
            </div>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaSpinner className="spin" style={{ marginRight: '8px' }} />
              <span>Typing...</span>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
      
      <div style={styles.inputArea}>
        <input
          type="text"
          value={input}
          placeholder="Type your question..."
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
          onKeyDown={(e) => e.key === 'Enter' && handleSend()}
        />
        <button 
          onClick={handleSend} 
          style={styles.button}
          disabled={!input.trim()}
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
};

// Styles
const styles = {
  chatContainer: {
    width: '100%',
    maxWidth: '400px',
    margin: '20px auto',
    border: '1px solid #e0e0e0',
    borderRadius: '16px',
    padding: '0',
    background: '#ffffff',
    boxShadow: '0 5px 15px rgba(0,0,0,0.08)',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif'
  },
  header: {
    background: '#4CAF50',
    color: 'white',
    padding: '15px 20px',
    display: 'flex',
    alignItems: 'center',
    fontSize: '18px'
  },
  chatBox: {
    height: '400px',
    overflowY: 'auto',
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
    padding: '15px',
    background: '#fafafa'
  },
  message: {
    padding: '12px 16px',
    borderRadius: '18px',
    maxWidth: '85%',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '10px',
    lineHeight: '1.4',
    boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
  },
  messageIcon: {
    fontSize: '16px',
    color: '#666',
    marginTop: '2px'
  },
  quickReplies: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    marginTop: '10px'
  },
  quickReplyButton: {
    padding: '6px 12px',
    border: '1px solid #4CAF50',
    background: 'transparent',
    borderRadius: '15px',
    fontSize: '12px',
    color: '#4CAF50',
    cursor: 'pointer',
    transition: 'all 0.2s',
    ':hover': {
      background: '#4CAF50',
      color: 'white'
    }
  },
  inputArea: {
    display: 'flex',
    gap: '10px',
    padding: '15px',
    borderTop: '1px solid #eee',
    background: '#fff'
  },
  input: {
    flex: 1,
    padding: '12px 15px',
    borderRadius: '24px',
    border: '1px solid #ddd',
    outline: 'none',
    fontSize: '14px',
    ':focus': {
      borderColor: '#4CAF50'
    }
  },
  button: {
    width: '48px',
    height: '48px',
    border: 'none',
    background: '#4CAF50',
    color: '#fff',
    borderRadius: '50%',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    transition: 'background 0.2s',
    ':disabled': {
      background: '#cccccc',
      cursor: 'not-allowed'
    }
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' }
  },
  spin: {
    animation: 'spin 1s linear infinite'
  }
};

export default ChatBot;