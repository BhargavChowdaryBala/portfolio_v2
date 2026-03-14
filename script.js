document.addEventListener('DOMContentLoaded', () => {
    // Custom Cursor Logic (Fluid Canvas)
    function initCursor() {
        try {
            const cursorCanvas = document.getElementById('cursor-canvas');
            if (!cursorCanvas) {
                throw new Error('Cursor canvas not found');
            }

            const ctx = cursorCanvas.getContext('2d');
            if (!ctx) {
                throw new Error('2D context not available');
            }

            // Successfully initialized, hide default cursor
            document.body.classList.add('custom-cursor-active');

            let width = window.innerWidth;
            let height = window.innerHeight;
            let cursor = { x: width / 2, y: height / 2 };
            const lines = [];
            const config = {
                friction: 0.5,
                trails: 20,
                size: 50,
                dampening: 0.25,
                tension: 0.98
            };

            // Resize Logic
            function resize() {
                width = window.innerWidth;
                height = window.innerHeight;
                cursorCanvas.width = width;
                cursorCanvas.height = height;
            }
            window.addEventListener('resize', resize);
            resize();

            // Mouse Tracker
            function onMouseMove(e) {
                cursor.x = e.clientX;
                cursor.y = e.clientY;
            }
            window.addEventListener('mousemove', onMouseMove);

            // Oscillator for Color (Phase)
            function Oscillator(options) {
                this.phase = options.phase || 0;
                this.offset = options.offset || 0;
                this.frequency = options.frequency || 0.001;
                this.amplitude = options.amplitude || 1;
                this.update = function () {
                    this.phase += this.frequency;
                    return this.offset + Math.sin(this.phase) * this.amplitude;
                };
            }

            // Node Class
            function Node() {
                this.x = cursor.x;
                this.y = cursor.y;
                this.vx = 0;
                this.vy = 0;
            }

            // Line Class
            function Line(options) {
                this.spring = options.spring + 0.1 * Math.random() - 0.02;
                this.friction = config.friction + 0.01 * Math.random() - 0.002;
                this.nodes = [];
                for (let i = 0; i < config.size; i++) {
                    this.nodes.push(new Node());
                }
                this.update = function () {
                    let spring = this.spring;
                    let node = this.nodes[0];
                    node.vx += (cursor.x - node.x) * spring;
                    node.vy += (cursor.y - node.y) * spring;

                    for (let i = 0; i < this.nodes.length; i++) {
                        node = this.nodes[i];
                        if (i > 0) {
                            let prev = this.nodes[i - 1];
                            node.vx += (prev.x - node.x) * spring;
                            node.vy += (prev.y - node.y) * spring;
                            node.vx += prev.vx * config.dampening;
                            node.vy += prev.vy * config.dampening;
                        }
                        node.vx *= this.friction;
                        node.vy *= this.friction;
                        node.x += node.vx;
                        node.y += node.vy;
                        spring *= config.tension;
                    }
                };
                this.draw = function () {
                    let n = this.nodes[0];
                    ctx.beginPath();
                    ctx.moveTo(n.x, n.y);
                    for (let i = 1; i < this.nodes.length - 2; i++) {
                        let e = this.nodes[i];
                        let t = this.nodes[i + 1];
                        let midX = 0.5 * (e.x + t.x);
                        let midY = 0.5 * (e.y + t.y);
                        ctx.quadraticCurveTo(e.x, e.y, midX, midY);
                    }
                    let last = this.nodes[this.nodes.length - 2];
                    let veryLast = this.nodes[this.nodes.length - 1];
                    ctx.quadraticCurveTo(last.x, last.y, veryLast.x, veryLast.y);
                    ctx.stroke();
                    ctx.closePath();
                };
            }

            // Oscillator Instance (Green Color Range: Hue ~120 to ~160)
            const f = new Oscillator({
                phase: Math.random() * 2 * Math.PI,
                amplitude: 20, // Small range
                frequency: 0.0015,
                offset: 140 // Cyan/Green center
            });

            // Initialize Lines
            for (let i = 0; i < config.trails; i++) {
                lines.push(new Line({ spring: 0.4 + (i / config.trails) * 0.025 }));
            }

            // Render Loop
            function render() {
                if (!document.body.classList.contains('custom-cursor-active')) return;

                ctx.globalCompositeOperation = 'source-over';
                ctx.clearRect(0, 0, width, height);

                ctx.globalCompositeOperation = 'lighter';
                ctx.strokeStyle = 'hsla(' + Math.round(f.update()) + ', 90%, 50%, 0.25)';
                ctx.lineWidth = 1;

                for (let i = 0; i < config.trails; i++) {
                    lines[i].update();
                    lines[i].draw();
                }
                requestAnimationFrame(render);
            }
            render();

        } catch (e) {
            console.warn('Custom cursor initialization failed, reverting to default cursor:', e);
            document.body.classList.remove('custom-cursor-active');
            const cursorCanvas = document.getElementById('cursor-canvas');
            if (cursorCanvas) cursorCanvas.style.display = 'none';
        }
    }
    initCursor();

    // Mobile Navigation Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');

        // Toggle Icon
        const icon = hamburger.querySelector('i');
        if (navLinks.classList.contains('active')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
            document.body.classList.add('no-scroll'); // Prevent body scroll
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
            document.body.classList.remove('no-scroll'); // Re-enable body scroll
        }
    });

    // SPA Navigation Logic
    const navLinksList = document.querySelectorAll('.nav-links a, .cta-buttons a');
    const sections = document.querySelectorAll('section');

    // Function to switch tabs
    function switchTab(targetId) {
        // Hide all sections
        sections.forEach(sec => {
            sec.classList.remove('active-section');
        });

        // Show target section
        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            targetSection.classList.add('active-section');
            window.scrollTo(0, 0); // Reset scroll to top
        }

        // Close mobile menu if open
        navLinks.classList.remove('active');

        // Reset Hamburger Icon
        const hamburger = document.querySelector('.hamburger');
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
        document.body.classList.remove('no-scroll'); // Re-enable body scroll

        // Update Background: Home gets default, others get Tech Background
        const bg = document.querySelector('.background-gradient');
        if (bg) {
            if (targetId === '#hero') {
                bg.classList.remove('tech-background-active');
            } else {
                bg.classList.add('tech-background-active');
            }
        }
    }

    // Chatbot Head Clock
    function initChatbotClock() {
        const timeDisplay = document.getElementById('chatbot-time-display');
        const chatbotContainer = document.getElementById('chatbot-container');
        if (!timeDisplay) return;

        function updateTime() {
            const now = new Date();
            timeDisplay.textContent = now.toLocaleTimeString('en-US', { hour12: false });
        }

        updateTime(); // Initial call
        setInterval(updateTime, 1000);

        // Show time by default (simulating "thinking of time")
        if (chatbotContainer) chatbotContainer.classList.add('show-time');
    }
    initChatbotClock();

    // Matrix Animation Logic
    const canvas = document.getElementById('matrix-canvas');
    const ctx = canvas ? canvas.getContext('2d') : null;
    let matrixInterval;

    function startMatrixAnimation() {
        console.log('Starting Matrix Animation...');
        if (!canvas) console.error('Canvas not found!');
        if (!ctx) console.error('Canvas context not found!');
        if (!canvas || !ctx) return;

        // Set canvas config
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const alphabet = 'BHARGAV';

        const fontSize = 20; // Increased font size for more gap
        const columns = canvas.width / fontSize;

        const rainDrops = [];

        for (let x = 0; x < columns; x++) {
            rainDrops[x] = Math.floor(Math.random() * -100); // Randomize start
        }

        const draw = () => {
            // Reset effects to ensure background clear is clean
            ctx.shadowBlur = 0;
            ctx.shadowColor = 'transparent';

            // Use pure black with higher opacity for sharper contrast (less "shade")
            ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#0aff0a'; // Green text
            ctx.font = fontSize + 'px monospace';

            // Add Glow
            // Add Glow
            ctx.shadowBlur = 15;
            ctx.shadowColor = '#0aff0a';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                // Reset glow to avoid performance hit on rect clear 
                ctx.shadowBlur = 0;

                // Restore glow for next text
                ctx.shadowBlur = 15;

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = Math.floor(Math.random() * -10); // Randomize reset to keep it organic
                }
                rainDrops[i]++;
            }
        };

        clearInterval(matrixInterval);
        matrixInterval = setInterval(draw, 30);
    }

    function stopMatrixAnimation() {
        clearInterval(matrixInterval);
        if (ctx) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
        }
    }

    // Transition Animation Logic
    function navigateWithTransition(targetId) {
        const overlay = document.getElementById('code-transition-overlay');
        const loaderText = overlay.querySelector('.loader-text');

        if (!overlay) {
            switchTab(targetId);
            return;
        }

        // Show Overlay
        overlay.classList.add('active');
        startMatrixAnimation(); // Start Matrix Rain

        // Clean ID for display
        const targetName = targetId.replace('#', '');
        const displayTarget = targetName.charAt(0).toUpperCase() + targetName.slice(1);

        // Simulation Steps
        const messages = [
            `> Initializing ${displayTarget} module...`,
            `> Loading assets...`,
            `> Compiling code...`,
            `> Executing...`
        ];

        let msgIndex = 0;
        loaderText.textContent = messages[0];

        const interval = setInterval(() => {
            msgIndex++;
            if (msgIndex < messages.length) {
                loaderText.textContent = messages[msgIndex];
            }
        }, 250); // Speed of text change

        // Duration of transition
        setTimeout(() => {
            clearInterval(interval);
            switchTab(targetId);

            // Hide Overlay
            setTimeout(() => {
                overlay.classList.remove('active');
                stopMatrixAnimation(); // Stop Matrix Rain
            }, 300); // Slight delay to ensure switch is visible
        }, 1200); // Total transition time
    }

    // Add click event listeners
    navLinksList.forEach(link => {
        link.addEventListener('click', (e) => {
            // Ignore download links
            if (link.hasAttribute('download')) return;

            const targetId = link.getAttribute('href');

            // Only handle if it's an internal link (starts with #)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                navigateWithTransition(targetId);
            }
        });
    });

    // Make Logo Clickable -> Go to Home
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            navigateWithTransition('#hero');
        });
    }

    // Show Home/Hero by default (No transition for initial load)
    switchTab('#hero');


    // Terminal Typing Effect (Kept as is)
    const typeWriterElement = document.getElementById('typewriter-text');
    const codeLines = [
        { text: 'const profile = {', indent: 0 },
        { text: '    name: "Bhargav Chowdary",', indent: 4 },
        { text: '    role: "Aspiring Developer",', indent: 4 },
        { text: '    traits: [', indent: 4 },
        { text: '        "Problem Solver",', indent: 8 },
        { text: '        "Tech Enthusiast",', indent: 8 },
        { text: '        "Creative Thinker"', indent: 8 },
        { text: '    ],', indent: 4 },
        { text: '    mission: "Turning ideas into reality"', indent: 4 },
        { text: '};', indent: 0 },
        { text: '', indent: 0 },
        { text: 'console.log(profile.mission);', indent: 0 }
    ];

    let lineIndex = 0;
    let charIndex = 0;

    // Create the cursor element once
    const cursor = document.createElement('span');
    cursor.className = 'cursor';

    function typeCode() {
        if (lineIndex < codeLines.length) {
            const line = codeLines[lineIndex];

            // Add indentation and line div if starting a new line
            if (charIndex === 0) {
                const lineDiv = document.createElement('div');
                lineDiv.style.paddingLeft = `${line.indent * 10}px`; // aesthetic spacing
                lineDiv.className = 'typed-line';
                typeWriterElement.appendChild(lineDiv);

                // Move cursor to the new line
                lineDiv.appendChild(cursor);
            }

            // Get the current line element (last child)
            const currentLineElement = typeWriterElement.lastElementChild;

            // Type character
            if (charIndex < line.text.length) {
                const char = line.text.charAt(charIndex);
                const textNode = document.createTextNode(char);

                // Insert text before the cursor so cursor stays at the end
                currentLineElement.insertBefore(textNode, cursor);

                charIndex++;
                setTimeout(typeCode, Math.random() * 30 + 20); // Random typing speed
            } else {
                // Line finished
                lineIndex++;
                charIndex = 0;
                setTimeout(typeCode, 100); // Pause between lines
            }
        } else {
            // Finished typing all lines
            // Ensure cursor stays at the very end
            // It is already there from the last character insertion
        }
    }

    // Start typing after a small delay
    setTimeout(typeCode, 1000);

    // Mobile Profile Photo Modal Logic
    const profileTrigger = document.querySelector('.nav-profile-img');
    const modal = document.getElementById('profile-modal');
    const closeBtn = document.querySelector('.close-modal');

    if (profileTrigger && modal && closeBtn) {
        // Open Modal
        profileTrigger.addEventListener('click', () => {
            modal.style.display = 'flex';
        });

        // Close Modal (X button)
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
        });

        // Close Modal (Click outside image)
        window.addEventListener('click', (e) => {
            if (e.target === modal) {
                modal.style.display = 'none';
            }
        });
    }

    /* --- AI Chatbot Logic --- */

    const chatBubble = document.getElementById('chat-bubble');
    const chatWindow = document.getElementById('chat-window');
    const minimizeChat = document.querySelector('.minimize-chat');
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const notificationDot = document.querySelector('.notification-dot');

    // Context / System Prompt for Bhargav
    const portfolioContext = `
    You are an AI assistant for Bhargav Chowdary's portfolio website. 
    Your goal is to answer questions about Bhargav's skills, projects, and experience based on the following information.
    
    About Bhargav:
    - Aspiring Developer & Problem Solver.
    - Passionate about coding, building web applications, and solving complex problems.
    - Based in India.
    
    Skills:
    - Languages: C, Java, Python.
    - Web Technologies: HTML, CSS, JavaScript, React.js.
    - Tools: Git, VS Code.
    - Soft Skills: Leadership, Team Management, Event Management, Communication.
    
    Projects:
    1. Club Attendance Management System:
       - A web app to track student attendance.
       - Built with HTML, CSS, JS, and basic backend.
       - Features: Student login, admin dashboard, attendance tracking.
    2. N-Gram Explorer:
        - NLP tool to analyze text using N-Grams.
        - Features: Perplexity calculation, text generation.
    3. Portfolio Website:
        - The current site you are on.
        - Built with vanilla HTML, CSS, JS.
        - Features: Cyber aesthetic, responsive design, AI chatbot.

    Education:
    - B.Tech in CSE (AIML) from VR Siddhartha Engineering College (2023-2027).
    - CGPA: 9.3.
    - Intermediate from Sri Chaitanya Junior College (2021-2023) with 98.2%.
    - Schooling from Ravindra Bharathi School (2021) with 100%.

    Contact:
    - Email: bhargav@example.com (Placeholder)
    - LinkedIn & GitHub: Links available in the footer.
    
    Tone:
    - Simple and Humble.
    - DEFAULT RESPONSE: Keep answers short (max 4-5 lines).
    - ONLY provide detailed explanations if the user explicitly asks for "details", "explanation", or "how it works".
    - Avoid long paragraphs unless necessary.
    - Be friendly but direct.
    `;

    // API Configuration
    // Key is loaded from .env file (Vite)
    const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
    const API_URL = "https://api.groq.com/openai/v1/chat/completions";

    let messageHistory = [
        { role: "system", content: portfolioContext }
    ];

    // Toggle Chat Window
    function toggleChat() {
        if (!chatWindow) return;
        chatWindow.classList.toggle('active');
        if (chatWindow.classList.contains('active')) {
            if (notificationDot) notificationDot.style.display = 'none'; // Hide dot when opened
            if (userInput) userInput.focus();
        }
    }

    if (chatBubble) chatBubble.addEventListener('click', toggleChat);
    if (minimizeChat) minimizeChat.addEventListener('click', toggleChat);

    // Add Message to UI
    function addMessage(content, sender) {
        if (!chatMessages) return;
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(sender === 'user' ? 'user-message' : 'bot-message');

        messageDiv.textContent = content;
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight; // Auto-scroll
    }

    let typingInterval;

    // Show Typing Indicator with Timer
    function showTyping() {
        if (!chatMessages) return;
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typing-indicator';

        const getNow = () => new Date().toLocaleTimeString('en-US', { hour12: false });

        typingDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-timer" style="margin-left: 10px; font-size: 0.8rem; opacity: 0.8;">[${getNow()}]</span>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        clearInterval(typingInterval);
        typingInterval = setInterval(() => {
            const timerSpan = typingDiv.querySelector('.typing-timer');
            if (timerSpan) {
                timerSpan.textContent = `[${getNow()}]`;
            }
        }, 1000);
    }

    // Remove Typing Indicator
    function removeTyping() {
        clearInterval(typingInterval);
        const typingDiv = document.getElementById('typing-indicator');
        if (typingDiv) typingDiv.remove();
    }

    // Fetch Response from Groq
    async function getBotResponse(userMessage) {
        // Add user message to history
        messageHistory.push({ role: "user", content: userMessage });

        try {
            const response = await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama-3.3-70b-versatile",
                    messages: messageHistory,
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(`API Error ${response.status}: ${errorData || response.statusText}`);
            }

            const data = await response.json();
            const botContent = data.choices[0].message.content;

            // Add bot response to history
            messageHistory.push({ role: "assistant", content: botContent });

            return botContent;

        } catch (error) {
            console.error("Chatbot Error:", error);
            return `System Error: ${error.message}`;
        }
    }

    // Handle Send
    async function handleSend() {
        if (!userInput) return;
        const message = userInput.value.trim();
        if (!message) return;

        // Clear input
        userInput.value = '';

        // Add User Message
        addMessage(message, 'user');

        // Show Typing
        showTyping();

        // Get Response
        const response = await getBotResponse(message);

        // Remove Typing & Add Bot Message
        removeTyping();
        addMessage(response, 'bot');
    }

    // Event Listeners
    if (sendBtn) sendBtn.addEventListener('click', handleSend);
    if (userInput) {
        userInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') handleSend();
        });
    }

    // Draggable Chat Window Logic
    function initDraggableChat() {
        const chatWindow = document.getElementById('chat-window');
        const dragHandle = document.getElementById('chat-drag-handle');

        if (!chatWindow || !dragHandle) return;

        let isDragging = false;
        let startX, startY, initialLeft, initialTop;

        dragHandle.addEventListener('mousedown', (e) => {
            e.preventDefault();
            isDragging = true;

            // Get initial mouse position
            startX = e.clientX;
            startY = e.clientY;

            // Get initial element position
            const rect = chatWindow.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            // Remove right/bottom positioning to allow top/left to take over
            chatWindow.style.right = 'auto';
            chatWindow.style.bottom = 'auto';
            chatWindow.style.left = `${initialLeft}px`;
            chatWindow.style.top = `${initialTop}px`;

            dragHandle.style.cursor = 'grabbing';
            chatWindow.style.transition = 'none'; // Disable transition for smooth dragging
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();

            const dx = e.clientX - startX;
            const dy = e.clientY - startY;

            chatWindow.style.left = `${initialLeft + dx}px`;
            chatWindow.style.top = `${initialTop + dy}px`;
        });

        document.addEventListener('mouseup', () => {
            if (isDragging) {
                isDragging = false;
                dragHandle.style.cursor = 'grab';
                chatWindow.style.transition = ''; // Re-enable transition if any
            }
        });

        // Touch Support
        dragHandle.addEventListener('touchstart', (e) => {
            e.preventDefault();
            isDragging = true;
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;

            const rect = chatWindow.getBoundingClientRect();
            initialLeft = rect.left;
            initialTop = rect.top;

            chatWindow.style.right = 'auto';
            chatWindow.style.bottom = 'auto';
            chatWindow.style.left = `${initialLeft}px`;
            chatWindow.style.top = `${initialTop}px`;
            chatWindow.style.transition = 'none';
        });

        document.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault(); // Prevent scrolling

            const dx = e.touches[0].clientX - startX;
            const dy = e.touches[0].clientY - startY;

            chatWindow.style.left = `${initialLeft + dx}px`;
            chatWindow.style.top = `${initialTop + dy}px`;
        }, { passive: false });

        document.addEventListener('touchend', () => {
            if (isDragging) {
                isDragging = false;
                chatWindow.style.transition = '';
            }
        });
    }
    initDraggableChat();

    // --- ClickSpark Vanilla JS Implementation ---
    class ClickSpark {
        constructor(options = {}) {
            this.sparkColor = options.sparkColor || '#0aff0a'; // Default to theme green
            this.sparkSize = options.sparkSize || 10;
            this.sparkRadius = options.sparkRadius || 15;
            this.sparkCount = options.sparkCount || 8;
            this.duration = options.duration || 400;
            this.easing = options.easing || 'ease-out';
            this.extraScale = options.extraScale || 1.0;

            this.sparks = [];
            this.animationId = null;

            this.initCanvas();
            this.bindEvents();
        }

        initCanvas() {
            this.canvas = document.createElement('canvas');
            this.ctx = this.canvas.getContext('2d');
            
            // Style canvas to cover the whole viewport and ignore clicks
            Object.assign(this.canvas.style, {
                position: 'fixed',
                top: '0',
                left: '0',
                width: '100vw',
                height: '100vh',
                pointerEvents: 'none',
                zIndex: '9999'
            });

            document.body.appendChild(this.canvas);
            this.resizeCanvas();
        }

        resizeCanvas = () => {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
        };

        easeFunc(t) {
            switch (this.easing) {
                case 'linear':
                    return t;
                case 'ease-in':
                    return t * t;
                case 'ease-in-out':
                    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
                default: // ease-out
                    return t * (2 - t);
            }
        }

        handleClick = (e) => {
            // Fix coordinates for fixed canvas
            const x = e.clientX;
            const y = e.clientY;
            const now = performance.now();

            const newSparks = Array.from({ length: this.sparkCount }, (_, i) => ({
                x,
                y,
                angle: (2 * Math.PI * i) / this.sparkCount,
                startTime: now
            }));

            this.sparks.push(...newSparks);

            if (!this.animationId) {
                this.animationId = requestAnimationFrame(this.draw);
            }
        };

        draw = (timestamp) => {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            this.sparks = this.sparks.filter(spark => {
                const elapsed = timestamp - spark.startTime;
                if (elapsed >= this.duration) {
                    return false; // Remove finished sparks
                }

                const progress = elapsed / this.duration;
                const eased = this.easeFunc(progress);

                const distance = eased * this.sparkRadius * this.extraScale;
                const lineLength = this.sparkSize * (1 - eased);

                const x1 = spark.x + distance * Math.cos(spark.angle);
                const y1 = spark.y + distance * Math.sin(spark.angle);
                const x2 = spark.x + (distance + lineLength) * Math.cos(spark.angle);
                const y2 = spark.y + (distance + lineLength) * Math.sin(spark.angle);

                this.ctx.strokeStyle = this.sparkColor;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                this.ctx.moveTo(x1, y1);
                this.ctx.lineTo(x2, y2);
                this.ctx.stroke();

                return true;
            });

            if (this.sparks.length > 0) {
                this.animationId = requestAnimationFrame(this.draw);
            } else {
                this.animationId = null; // Stop animating if no sparks
            }
        };

        bindEvents() {
            window.addEventListener('resize', this.resizeCanvas);
            document.addEventListener('click', this.handleClick);
        }
    }

    // Initialize the effect
    new ClickSpark();

});
