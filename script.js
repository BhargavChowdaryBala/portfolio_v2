document.addEventListener('DOMContentLoaded', () => {
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
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
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
            }, 300); // Slight delay to ensure switch is visible
        }, 1200); // Total transition time
    }

    // Add click event listeners
    navLinksList.forEach(link => {
        link.addEventListener('click', (e) => {
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
    - Professional, helpful, slightly "techy" or "cyber" but very clear.
    - Keep answers concise (2-3 sentences max usually).
    - If asked about something not in this context, use your general knowledge (Llama-3 model) to answer helpfuly, but mention you are primarily here to talk about Bhargav.
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

    // Show Typing Indicator
    function showTyping() {
        if (!chatMessages) return;
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('typing-indicator');
        typingDiv.id = 'typing-indicator';
        typingDiv.innerHTML = `
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
            <span class="typing-dot"></span>
        `;
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Remove Typing Indicator
    function removeTyping() {
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
                    "Authorization": `Bearer ${CONFIG.GROQ_API_KEY}`
                },
                body: JSON.stringify({
                    model: "llama3-70b-8192", // or "mixtral-8x7b-32768"
                    messages: messageHistory,
                    temperature: 0.7,
                    max_tokens: 150
                })
            });

            if (!response.ok) {
                if (response.status === 401) return "Error: Invalid API Key. Please check the code or provide a key.";
                throw new Error(`API Error: ${response.statusText}`);
            }

            const data = await response.json();
            const botContent = data.choices[0].message.content;

            // Add bot response to history
            messageHistory.push({ role: "assistant", content: botContent });

            return botContent;

        } catch (error) {
            console.error("Chatbot Error:", error);
            return "System Error: Unable to connect to neural network. Please try again later.";
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

});
