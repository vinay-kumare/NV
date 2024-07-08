// loading the package (Creating web server)
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const noteRoutes = require("./routes/noteRoutes");
const { errorHandler, notFound } = require("./middlewares/errorMiddleware");
const path = require("path");

// object of loaded package
const app = express();
dotenv.config();
connectDB();
app.use(express.json());

// API endpoint (Creating API)
// app.get("/", (req, res) => {
//   res.send("API is running..");
// });

app.use("/api/users", userRoutes);
app.use("/api/notes", noteRoutes);

// -----------------------Deployment-----------------------

// This variable signifies current working directory
const __dirname1 = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "/frontend/build")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
  });
} else {
  app.get("/", (req, res) => {
    res.send("API is running..");
  });
}

// -----------------------Deployment-----------------------

app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on PORT ${PORT}`));

// .env is a file where we store secret or confedential information
