const app = require("./src/app");

// const PORT = process.env.PORT || 3000;

// app.listen(PORT,function(){
//     console.log("server chal raha hai")
// })

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});