const express = require("express");
const app = express();
const userRoutes = require("./routes/users");
const cors = require("cors");

const { scheduler, runUserSchedule } = require("./helpers");

// json middleware
app.use(express.json());

app.use(
  cors({
    origin: "*",
  })
);

app.get("/", (req, res) => {
  res.send(
    `<h1>Welcome to Copenotes sample</h1> 
    <p>This is the rest API, you can access the app 
    <a href="https://localhost:3000">here</a> after running the react app</p>`
  );
});

app.use("/api/v1/users", userRoutes);

// setup scheduler to run every minute
scheduler(runUserSchedule, 1);

const port = 3500;

app.listen(port, () => {
  console.log(`server listening on port ${port}`);
});
