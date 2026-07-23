const BACKEND_URL = window.location.origin; 

const questionInput = document.getElementById("questionInput");
const submitBtn = document.getElementById("submitBtn");
const answersContainer = document.getElementById("answers");
const loadingDiv = document.getElementById("loading");
const errorDiv = document.getElementById("error");

// Submit button click event
submitBtn.addEventListener("click", askQuestion);

// Enter key se bhi submit ho sake
questionInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && questionInput.value.trim()) {
        askQuestion();
    }
});

async function askQuestion() {


    const question =  questionInput.value.trim();

    // Validation
    if (!question) {
        showError("Question cannot be empty!");
        return;
    }

    // Clear previous errors
    hideError();

    // Disable button and show loading
    submitBtn.disabled = true;
    loadingDiv.classList.remove("hidden");

    try {
        // Display question
        displayQuestion(question);

        // Send POST request to backend
        const response = await fetch(`${BACKEND_URL}/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: question })
        });
        console.log(response)

        const data = await response.json().catch(() => null);

        if (response.ok && data && data.success) {
            // Display answer
            displayAnswer(data.answer);
            // Clear input
            questionInput.value = "";
        } else {
            const errorMsg = (data && data.error) ? data.error : `Server Error (${response.status})`;
            showError(errorMsg);
        }

    } catch (error) {
        console.error("Error:", error);
        showError("Could not connect to the server. Please check if backend is running.");
    } finally {
        // Button ko enable karo aur loading hide karo
        submitBtn.disabled = false;
        loadingDiv.classList.add("hidden");
    }
}

function displayQuestion(question) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message question";
    messageDiv.textContent = question;
    answersContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    answersContainer.scrollTop = answersContainer.scrollHeight;
}

function renderMarkdown(text) {
    if (typeof marked !== "undefined" && typeof marked.parse === "function") {
        return marked.parse(text, { breaks: true });
    }
    // Fallback if marked JS is unavailable
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
    messageDiv.className = "message answer";
    messageDiv.innerHTML = renderMarkdown(answer);
    answersContainer.appendChild(messageDiv);
    
    // Scroll to bottom
    answersContainer.scrollTop = answersContainer.scrollHeight;
}

function showError(message) {
    errorDiv.textContent = message;
    errorDiv.classList.remove("hidden");
}

function hideError() {
    errorDiv.classList.add("hidden");
}
