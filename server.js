const app = require("./src/app");

const PORT = process.env.PORT || 3000;

// Locally run karte waqt
if (process.env.NODE_ENV !== 'production') {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

// Vercel ke liye export karo
module.exports = app;