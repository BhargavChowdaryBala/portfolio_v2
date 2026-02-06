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
            // Helper to ensure display:none is applied effectively by removing active class
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

    // Add click event listeners
    navLinksList.forEach(link => {
        link.addEventListener('click', (e) => {
            const targetId = link.getAttribute('href');

            // Only handle if it's an internal link (starts with #)
            if (targetId && targetId.startsWith('#')) {
                e.preventDefault();
                switchTab(targetId);
            }
            // Otherwise, let the browser handle it (e.g., Resume download)
        });
    });

    // Make Logo Clickable -> Go to Home
    const logo = document.querySelector('.logo');
    if (logo) {
        logo.addEventListener('click', () => {
            switchTab('#hero');
        });
    }

    // Show Home/Hero by default
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
});
