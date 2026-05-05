/* Tutor Widget - WebSocket connection to LeejnusAI backend */
(function() {
  let socket = null;
  let isConnecting = false;
  let userId = 'tutor_' + Math.random().toString(36).slice(2, 8);
  let audioContext = null;

  function initSocket() {
    if (socket) return;
    isConnecting = true;
    socket = io('http://localhost:5050', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000
    });

    socket.on('connect', function() {
      document.querySelector('.tutor-status').textContent = 'Connected';
      document.querySelector('.tutor-status').style.color = '#22c55e';
      isConnecting = false;
    });

    socket.on('disconnect', function() {
      document.querySelector('.tutor-status').textContent = 'Disconnected';
      document.querySelector('.tutor-status').style.color = '#ef4444';
    });

    socket.on('bot_chunk', function(data) {
      const current = getCurrentMessage();
      if (current) {
        current.body.textContent += data.text || '';
        scrollToBottom();
      }
    });

    socket.on('bot_final', function(data) {
      const current = getCurrentMessage();
      if (current) {
        current.dataset.done = 'true';
        addAudioButton(current);
      }
      currentInput = '';
    });

    socket.on('system_ready', function(data) {
      console.log('System ready:', data.status);
    });

    socket.on('connect_error', function(err) {
      isConnecting = false;
      addMessage('Assistant', `Backend not available at http://localhost:5050. Please start the LeejnusAI backend first.`, true);
    });
  }

  function addMessage(role, text, isError) {
    const container = containerEl;
    const msg = document.createElement('div');
    msg.className = 'tutor-msg ' + (role.toLowerCase() === 'user' ? 'user' : 'bot');
    if (isError) msg.classList.add('error');
    
    const head = document.createElement('div');
    head.className = 'tutor-msg-head';
    head.textContent = role;
    head.style.fontWeight = '600';
    head.style.fontSize = '0.75rem';
    head.style.color = '#94a3b8';
    head.style.marginBottom = '0.25rem';
    head.style.textTransform = 'uppercase';
    head.style.letterSpacing = '0.05em';
    
    const body = document.createElement('div');
    body.className = 'tutor-msg-body';
    body.textContent = text;
    body.style.whiteSpace = 'pre-wrap';
    body.style.lineHeight = '1.5';
    
    msg.appendChild(head);
    msg.appendChild(body);
    container.appendChild(msg);
    scrollToBottom();
    return msg;
  }

  let currentMsg = null;
  function getCurrentMessage() {
    return currentMsg;
  }
  
  function startNewBotMsg() {
    const container = containerEl;
    // Remove any existing error messages
    const errors = container.querySelectorAll('.tutor-msg');
    if (errors.length > 0) {
      errors.forEach(el => el.remove());
    }
    currentInput = '';
    clearChatBtn.style.display = 'inline-block';
    
    const msg = document.createElement('div');
    msg.className = 'tutor-msg bot';
    
    const head = document.createElement('div');
    head.className = 'tutor-msg-head';
    head.textContent = 'Leejnus AI';
    head.style.fontWeight = '600';
    head.style.fontSize = '0.75rem';
    head.style.color = '#94a3b8';
    head.style.marginBottom = '0.25rem';
    head.style.textTransform = 'uppercase';
    head.style.letterSpacing = '0.05em';
    
    const body = document.createElement('div');
    body.className = 'tutor-msg-body';
    body.style.whiteSpace = 'pre-wrap';
    body.style.lineHeight = '1.5';
    body.style.minHeight = '1rem';
    
    msg.appendChild(head);
    msg.appendChild(body);
    container.appendChild(msg);
    
    // Show "typing" indicator
    const typingSpan = document.createElement('span');
    typingSpan.textContent = '●';
    typingSpan.style.color = '#d4a017';
    typingSpan.style.animation = 'pulse 1s infinite';
    body.appendChild(typingSpan);
    
    currentMsg = msg;
    scrollToBottom();
    return msg;
  }
  
  function addAudioButton(msgEl) {
    const head = msgEl.querySelector('.tutor-msg-head');
    const audioBtn = document.createElement('button');
    audioBtn.className = 'audio-btn';
    audioBtn.innerHTML = '&#128266;';
    audioBtn.style.display = 'inline-block';
    audioBtn.style.marginTop = '0.5rem';
    audioBtn.style.padding = '0.25rem 0.5rem';
    audioBtn.style.border = '1px solid rgba(255,255,255,0.1)';
    audioBtn.style.borderRadius = '6px';
    audioBtn.style.background = 'rgba(212, 160, 23, 0.1)';
    audioBtn.style.color = '#d4a017';
    audioBtn.style.fontSize = '0.75rem';
    audioBtn.style.cursor = 'pointer';
    audioBtn.style.transition = 'all 0.2s';
    
    audioBtn.onmouseenter = () => {
      audioBtn.style.background = 'rgba(212, 160, 23, 0.2)';
      audioBtn.style.transform = 'scale(1.05)';
    };
    audioBtn.onmouseleave = () => audioBtn.style.transform = 'scale(1)';
    
    audioBtn.onclick = function() {
      const text = body.textContent.replace('Leejnus AI', '');
      if (!text.trim()) return;
      
      audioBtn.textContent = '♪';
      audioBtn.style.pointerEvents = 'none';
      
      fetch(`/synthesize?text=${encodeURIComponent(text.trim())}`)
        .then(r => r.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audio.play();
          audio.onended = () => {
            audioBtn.textContent = '&#128266;';
            audioBtn.style.pointerEvents = 'auto';
          };
        })
        .catch(() => {
          audioBtn.textContent = '⚠️';
          setTimeout(() => audioBtn.textContent = '&#128266;', 2000);
        });
    };
    
    head.appendChild(audioBtn);
    return audioBtn;
  }

  function scrollToBottom() {
    containerEl.scrollTop = containerEl.scrollHeight;
  }

  let containerEl = null;
  let inputEl = null;
  let sendBtn = null;
  let statusEl = null;
  let clearChatBtn = null;
  let currentInput = '';

  function initTutorWidget() {
    containerEl = document.querySelector('.tutor-messages') || document.querySelector('[class*="tutor-message"]');
    if (!containerEl) return;
    
    // Find input elements
    const inputArea = document.querySelector('.tutor-input-area') || 
                      document.querySelector('[class*="tutor-input-container"]');
    if (inputArea) {
      inputEl = inputArea.querySelector('input') || inputArea.querySelector('[type="text"]');
      sendBtn = inputArea.querySelector('button') || inputArea.querySelector('[class*="send"]');
      clearChatBtn = inputArea.querySelector('[class*="clear"]');
      
      if (inputEl) {
        inputEl.addEventListener('keypress', function(e) {
          if (e.key === 'Enter') {
            e.preventDefault();
            sendMessage();
          }
        });
      }
    }

    if (clearChatBtn) {
      clearChatBtn.addEventListener('click', function() {
        containerEl.innerHTML = '';
        clearChatBtn.style.display = 'none';
        addMessage('Assistant', 'Chat cleared. What would you like to know?', false);
      });
    }
    
    if (sendBtn) {
      sendBtn.addEventListener('click', function(e) {
        e.preventDefault();
        sendMessage();
      });
    }

    statusEl = document.querySelector('.tutor-status');
    if (!statusEl) {
      const status = document.createElement('div');
      status.className = 'tutor-status';
      status.style.cssText = 'font-size: 0.65rem; color: #64748b;';
      status.textContent = 'Connecting...';
      if (statusEl) {
        statusEl.parentElement.appendChild(status);
      }
    }

    addMessage('Assistant', `I'm Leejnus AI Tutor. I can explain Hmong words, phrases, and grammar. Try asking me:
• What does "nyob zoo" mean?
• How do I say "thank you" in Hmong?
• What is Hmong tone?`, false);
  }

  function sendMessage() {
    const text = (inputEl ? inputEl.value.trim() : currentInput).trim();
    if (!text || !socket) return;
    
    // Add user message
    const msg = addMessage('User', text, false);
    if (inputEl) inputEl.value = '';
    currentInput = '';
    if (clearChatBtn) clearChatBtn.style.display = 'inline-block';

    if (!statusEl || statusEl.textContent !== 'Connected') {
      addMessage('Assistant', `I can't connect to the backend. Please ensure LeejnusAI is running on localhost:5050.`, true);
      return;
    }

    initSocket();

    // Start a new bot message
    startNewBotMsg();

    socket.emit('text_input', {
      text: text,
      userId: userId
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initTutorWidget);
  } else {
    initTutorWidget();
  }
  
  // Also try to init immediately in case DOM is already ready
  setTimeout(initTutorWidget, 100);
})();
