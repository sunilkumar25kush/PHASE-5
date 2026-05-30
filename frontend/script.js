// Backend server ka URL - production aur development dono mein kaam karega
const BACKEND_URL = window.location.hostname === "localhost" 
    ? "http://localhost:3000" 
    : "";

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
    const question = questionInput.value.trim();

    // Validation
    if (!question) {
        showError("Sawal khali nahi ho sakta!");
        return;
    }

    // Clear previous errors
    hideError();

    // Disable button aur show loading
    submitBtn.disabled = true;
    loadingDiv.classList.remove("hidden");

    try {
        // Question ko display karo
        displayQuestion(question);

        // Backend ko POST request bhejo
        const response = await fetch(`${BACKEND_URL}/ask`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: question })
        });
        console.log(response)

        // Response check karo
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        if (data.success) {
            // Answer ko display karo
            displayAnswer(data.answer);
            // Input clear karo
            questionInput.value = "";
        } else {
            showError(data.error || "Kuch gadbad ho gayi");
        }

    } catch (error) {
        console.error("Error:", error);
        showError("Backend se connect nahi ho saka. Kya server chal raha hai?");
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

function displayAnswer(answer) {
    const messageDiv = document.createElement("div");
    messageDiv.className = "message answer";
    messageDiv.textContent = answer;
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
