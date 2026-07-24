const BACKEND_URL = (window.location.protocol.startsWith("http")) 
    ? window.location.origin 
    : "http://localhost:3000"; 

const questionInput = document.getElementById("questionInput");
const terminalInput = questionInput;
const submitBtn = document.getElementById("submitBtn");
const answersContainer = document.getElementById("answers");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");
const scrotNotification = document.getElementById("scrotNotification");
const statusBarClock = document.getElementById("statusBarClock");
const wsButtons = document.querySelectorAll(".ws-btn");
const wallpaperBg = document.querySelector(".wallpaper-bg");
const neofetchImg = document.querySelector(".neofetch-img");
const neofetchInfo = document.querySelector(".neofetch-info");
const terminalTitle = document.querySelector(".title-text");

// Workspace Configuration Database
const WORKSPACE_THEMES = {
    "1": {
        name: "Evangelion Purple Gothic",
        wallpaper: "wallpaper_ws1.png",
        neofetchImg: "neofetch_custom.png",
        title: "bash - gemini-ai@archlinux:~ (ws:1)",
        specs: `
            <p><span class="spec-label">OS:</span> <span class="spec-val">Arch Linux x86_64</span></p>
            <p><span class="spec-label">Kernel:</span> <span class="spec-val">Linux 4.15.13-1-ARCH</span></p>
            <p><span class="spec-label">WM:</span> <span class="spec-val">i3-gaps (antigravity)</span></p>
            <p><span class="spec-label">CPU:</span> <span class="spec-val">Gemini 2.5 Flash [38.0°C]</span></p>
            <p><span class="spec-label">Song:</span> <span class="spec-val">Bathory - Foreverdark Woods</span></p>
        `,
        toastMsg: "Workspace 1: Evangelion Purple Gothic"
    },
    "2": {
        name: "Violet Dark Aesthetic",
        wallpaper: "wallpaper_ws2.png",
        neofetchImg: "neofetch_ws2.png",
        title: "zsh - gemini-ai@archlinux:~ (ws:2)",
        specs: `
            <p><span class="spec-label">OS:</span> <span class="spec-val">Arch Linux (Violet-Rice)</span></p>
            <p><span class="spec-label">Kernel:</span> <span class="spec-val">Linux 6.1.0-VIOLET</span></p>
            <p><span class="spec-label">WM:</span> <span class="spec-val">bspwm (polybar)</span></p>
            <p><span class="spec-label">CPU:</span> <span class="spec-val">Gemini 2.5 Flash [35.2°C]</span></p>
            <p><span class="spec-label">Song:</span> <span class="spec-val">Lofi Girl - Midnight Chill</span></p>
        `,
        toastMsg: "Workspace 2: Violet Dark Aesthetic"
    },
    "3": {
        name: "Retro Anime Girl Rice",
        wallpaper: "wallpaper_ws3.png",
        neofetchImg: "neofetch_ws3.png",
        title: "fish - gemini-ai@archlinux:~ (ws:3)",
        specs: `
            <p><span class="spec-label">OS:</span> <span class="spec-val">Arch Linux (Retro-Girl)</span></p>
            <p><span class="spec-label">Kernel:</span> <span class="spec-val">Linux 6.6.0-HYPR</span></p>
            <p><span class="spec-label">WM:</span> <span class="spec-val">hyprland (waybar)</span></p>
            <p><span class="spec-label">CPU:</span> <span class="spec-val">Gemini 2.5 Flash [32.0°C]</span></p>
            <p><span class="spec-label">Song:</span> <span class="spec-val">Tatsuro Yamashita - Ride On Time</span></p>
        `,
        toastMsg: "Workspace 3: Retro Anime Girl Rice"
    },
    "4": {
        name: "Cyberpunk Synthwave Neon",
        wallpaper: "wallpaper_ws4.png",
        neofetchImg: "neofetch_ws4_ascii.png",
        title: "tmux - gemini-ai@archlinux:~ (ws:4)",
        specs: `
            <p><span class="spec-label">OS:</span> <span class="spec-val">Arch Linux (Cyberpunk)</span></p>
            <p><span class="spec-label">Kernel:</span> <span class="spec-val">Linux 6.8.0-NEON</span></p>
            <p><span class="spec-label">WM:</span> <span class="spec-val">sway (waybar)</span></p>
            <p><span class="spec-label">CPU:</span> <span class="spec-val">Gemini 2.5 Flash [40.1°C]</span></p>
            <p><span class="spec-label">Song:</span> <span class="spec-val">Kavinsky - Nightcall</span></p>
        `,
        toastMsg: "Workspace 4: Cyberpunk Synthwave Neon"
    }
};

// Current active workspace ID
let currentWorkspace = "1";

// Initialize Live Status Bar Clock
function updateClock() {
    const now = new Date();
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dayName = days[now.getDay()];
    const monthName = months[now.getMonth()];
    const dayNum = String(now.getDate()).padStart(2, '0');
    const yearShort = String(now.getFullYear()).slice(-2);
    
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedTime = `${dayName} ${monthName}/${dayNum}/${yearShort} ${hours}:${minutes}${ampm}`;
    if (statusBarClock) {
        statusBarClock.textContent = formattedTime;
    }
}
setInterval(updateClock, 1000);
updateClock();

// Switch Workspace function
function switchWorkspace(wsId) {
    const theme = WORKSPACE_THEMES[wsId];
    if (!theme) return;

    currentWorkspace = wsId;

    // Update body attribute for CSS theme rules
    document.body.setAttribute("data-workspace", wsId);

    // Update background wallpaper with crossfade
    if (wallpaperBg) {
        wallpaperBg.style.backgroundImage = `url('${theme.wallpaper}')`;
    }

    // Update Neofetch preview image
    if (neofetchImg) {
        neofetchImg.src = theme.neofetchImg || theme.wallpaper;
    }

    // Update Neofetch info text
    if (neofetchInfo) {
        neofetchInfo.innerHTML = theme.specs;
    }

    // Update Terminal titlebar text
    if (terminalTitle) {
        terminalTitle.textContent = theme.title;
    }

    // Update active workspace button styling
    wsButtons.forEach(b => {
        if (b.dataset.ws === wsId) {
            b.classList.add("active");
        } else {
            b.classList.remove("active");
        }
    });

    // Show toast notification
    showToast(theme.toastMsg);
}

// Workspace button click listeners
wsButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        switchWorkspace(btn.dataset.ws);
    });
});

// Toast notification helper
function showToast(message) {
    if (!scrotNotification) return;
    const toastText = scrotNotification.querySelector(".toast-text");
    if (toastText) toastText.textContent = message;
    scrotNotification.classList.remove("hidden");

    setTimeout(() => {
        scrotNotification.classList.add("hidden");
    }, 2200);
}

// Submit button click event
submitBtn.addEventListener("click", handleCommand);

// Enter key submit
questionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && questionInput.value.trim()) {
        handleCommand();
    }
});

async function handleCommand() {
    const inputVal = questionInput.value.trim();
    if (!inputVal) return;

    questionInput.value = "";

    // Handle Built-in Terminal Commands
    if (inputVal.toLowerCase() === "clear") {
        answersContainer.innerHTML = "";
        return;
    }

    if (inputVal.toLowerCase() === "help") {
        displayQuestion("help");
        displayAnswer(`**Available Commands:**\n- \`ask <question>\` or type any prompt directly.\n- \`ws <1-4>\`: Switch to workspace 1, 2, 3, or 4.\n- \`clear\`: Clear terminal output log.\n- \`neofetch\`: Display system & model specs.\n- \`help\`: Show this help menu.`);
        return;
    }

    if (inputVal.toLowerCase().startsWith("ws ")) {
        const targetWs = inputVal.split(" ")[1];
        if (WORKSPACE_THEMES[targetWs]) {
            switchWorkspace(targetWs);
            displayQuestion(`ws ${targetWs}`);
            displayAnswer(`Switched to **Workspace ${targetWs}** (${WORKSPACE_THEMES[targetWs].name})`);
            return;
        }
    }

    if (inputVal.toLowerCase() === "neofetch") {
        const theme = WORKSPACE_THEMES[currentWorkspace];
        displayQuestion("neofetch");
        displayAnswer(`\`\`\`\nTheme: ${theme.name}\n${theme.title}\nStatus: Active\n\`\`\``);
        return;
    }

    // Otherwise, treat as query to Gemini
    askQuestion(inputVal);
}

async function askQuestion(question) {
    hideError();
    submitBtn.disabled = true;
    loadingDiv.classList.remove("hidden");

    showToast("Taking scrot..");
    displayQuestion(question);

    let response = null;
    let responseText = null;
    let data = null;
    let networkError = null;

    const targetUrl = (window.location.protocol.startsWith("http") && window.location.origin)
        ? `${window.location.origin}/ask`
        : "http://localhost:3000/ask";

    const endpoints = Array.from(new Set([
        targetUrl,
        "/ask",
        "http://localhost:3000/ask"
    ]));

    for (const endpoint of endpoints) {
        try {
            response = await fetch(endpoint, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: question })
            });

            responseText = await response.text();
            try {
                data = JSON.parse(responseText);
            } catch (e) {
                data = null;
            }
            if (response.ok || data) break;
        } catch (err) {
            networkError = err;
        }
    }

    try {
        if (data && data.answer) {
            displayAnswer(data.answer);
        } else if (data && (data.error || data.message)) {
            showError(data.error || data.message);
        } else if (responseText && responseText.trim()) {
            displayAnswer(responseText.trim());
        } else if (response && !response.ok) {
            showError(`Server HTTP Error (${response.status}): Failed to fetch Gemini response.`);
        } else {
            showError("Could not connect to backend server. Please verify Node server is running on http://localhost:3000.");
        }
    } catch (error) {
        console.error("Display Error:", error);
        showError("An unexpected error occurred while displaying response.");
    } finally {
        submitBtn.disabled = false;
        loadingDiv.classList.add("hidden");
    }
}

function displayQuestion(question) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message question";
    messageDiv.innerHTML = `<span class="prompt-symbol">λ ~/_</span> ${escapeHtml(question)}`;
    answersContainer.appendChild(messageDiv);
    
    answersContainer.scrollTop = answersContainer.scrollHeight;
}

function escapeHtml(text) {
    return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function renderMarkdown(text) {
    if (typeof marked !== "undefined" && typeof marked.parse === "function") {
        return marked.parse(text, { breaks: true });
    }
    return text
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/### (.*)/g, "<h3>$1</h3>")
        .replace(/## (.*)/g, "<h2>$1</h2>")
        .replace(/# (.*)/g, "<h1>$1</h1>")
        .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
        .replace(/\*(.*?)\*/g, "<em>$1</em>")
        .replace(/\n/g, "<br>");
}

function displayAnswer(answer) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message answer terminal-typing";
    answersContainer.appendChild(messageDiv);
    
    // Disable inputs while output streams like a real Linux terminal
    terminalInput.disabled = true;
    submitBtn.disabled = true;
    
    let currentIndex = 0;
    const fullHtml = renderMarkdown(answer);
    
    // Dynamic chunking for smooth real terminal streaming output
    const chunkSize = answer.length > 800 ? 8 : (answer.length > 300 ? 4 : 2);
    const intervalTime = 12;

    const timer = setInterval(() => {
        currentIndex += chunkSize;
        if (currentIndex >= answer.length) {
            currentIndex = answer.length;
            clearInterval(timer);
            messageDiv.innerHTML = fullHtml;
            messageDiv.classList.remove("terminal-typing");
            terminalInput.disabled = false;
            submitBtn.disabled = false;
            terminalInput.focus();
        } else {
            const currentText = answer.substring(0, currentIndex);
            messageDiv.innerHTML = renderMarkdown(currentText) + `<span class="terminal-cursor">▋</span>`;
        }
        answersContainer.scrollTop = answersContainer.scrollHeight;
    }, intervalTime);
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

function hideError() {
    errorDiv.classList.add("hidden");
}

// Initial workspace setup
switchWorkspace("1");
