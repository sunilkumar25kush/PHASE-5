# 🌌 Arch Linux i3-WM Styled Gemini AI Web Application

A stunning, retro-futuristic Arch Linux (i3-wm & Polybar) themed web application powered by **Google Gemini AI**. Features dynamic workspace switching, customizable rice wallpapers, system Neofetch previews, live status bar clock, and interactive terminal commands (`ask`, `help`, `clear`, `neofetch`, `ws <1-4>`).

![Arch Linux Desktop Rice Banner](frontend/wallpaper_ws1.png)

---

## ✨ Features

- 🖥️ **Arch Linux i3-WM Aesthetic**: Ultra-sleek retro desktop interface featuring Polybar, status indicators, and glassmorphic terminal log window.
- 🎨 **4 Dynamic Workspaces**:
  - **Workspace 1**: *Evangelion Purple Gothic* (`ws:1`)
  - **Workspace 2**: *Violet Dark Aesthetic* (`ws:2`)
  - **Workspace 3**: *Retro Anime Girl Rice* (`ws:3`)
  - **Workspace 4**: *Cyberpunk Synthwave Neon* (`ws:4`)
- 🤖 **Google Gemini AI Direct Integration**: Instant AI answers powered by the latest `@google/generative-ai` SDK (`gemini-2.5-flash`).
- ⚡ **Interactive Terminal Commands**:
  - `ask <question>` or type prompt directly to query Gemini AI.
  - `ws <1-4>`: Instantly switch active desktop workspace.
  - `neofetch`: View system & workspace theme specs.
  - `clear`: Clear terminal output log.
  - `help`: Display available terminal commands.
- 🕒 **Live Polybar Clock**: Real-time status bar clock and CPU/storage system monitors.

---

## 🛠️ Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (Custom Design System & Glassmorphism), JavaScript (ES6+).
- **Backend**: Node.js, Express.js.
- **AI Engine**: `@google/generative-ai` SDK (Google Gemini 2.5 Flash).
- **Environment**: Dotenv for secure API key management.

---

## 🚀 Getting Started

### Prerequisites

Ensure you have [Node.js](https://nodejs.org/) (v18+ recommended) installed on your machine.

### Installation

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/your-username/your-repo-name.git
   cd your-repo-name
   ```

2. **Install Dependencies**:
   ```bash
   npm install
   ```

3. **Configure Environment Variables**:
   Create a `.env` file in the root directory (or copy from `.env.example`):
   ```env
   GEMINI_API_KEY="your_google_gemini_api_key_here"
   PORT=3000
   ```
   > 💡 Get a free API key at [Google AI Studio](https://aistudio.google.com/app/apikey).

4. **Start the Application**:
   ```bash
   npm start
   ```
   Or for development mode:
   ```bash
   npm run dev
   ```

5. **Open in Browser**:
   Navigate to `http://localhost:3000` to interact with the application!

---

## 📂 Project Structure

```
├── frontend/
│   ├── index.html            # Main desktop rice layout
│   ├── style.css             # Design system & workspace themes
│   ├── script.js             # Terminal logic & workspace switching
│   ├── wallpaper_ws1.png     # Workspace 1 wallpaper
│   ├── wallpaper_ws2.png     # Workspace 2 wallpaper
│   ├── wallpaper_ws3.png     # Workspace 3 wallpaper
│   ├── wallpaper_ws4.png     # Workspace 4 wallpaper
│   ├── neofetch_custom.png   # Workspace 1 Neofetch preview
│   ├── neofetch_ws2.png      # Workspace 2 Neofetch preview
│   ├── neofetch_ws3.png      # Workspace 3 Neofetch preview
│   └── neofetch_ws4_ascii.png # Workspace 4 Neofetch preview
├── src/
│   └── app.js                # Express app & Gemini AI integration
├── .env.example              # Example environment configuration
├── .gitignore                # Git exclusion rules
├── package.json              # Project dependencies & scripts
├── server.js                 # Server entry point
└── vercel.json               # Deployment configuration
```

---

## 📄 License

This project is open-source and available under the [ISC License](LICENSE).
