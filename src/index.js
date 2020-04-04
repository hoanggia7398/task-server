const express = require("express");
const groupRouter = require("./routes/group");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(groupRouter);
app.use(userRouter);
app.use(taskRouter);
app.listen(port, () => {
  console.log("Server is on Port " + port);
});
