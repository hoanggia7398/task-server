const express = require("express");
const sql = require("mssql");
const router = new express.Router();
const Task = require("../models/task");
const connectToServer = require("../db/connection");

listOfTask = [];

getAllTask = async () => {
  await connectToServer();
  try {
    const result = await sql.query`Select * from [Task]`;
    listOfTask = result.recordset;
  } catch (e) {}
};

isTaskIdExist = async id => {
  await getAllTask();
  const result = listOfTask.filter(Task => Task.Id == id);
  return result.length > 0 ? true : false;
};

router.get("/task", async (req, res) => {
  await connectToServer();
  try {
    const result = await sql.query`select Task.Id, Task.Name, Task.Description, Comment, Mark, CommentTime,Start, Finish, Status,CreateTime,CreateID,ImageConfirm,handleID,
        a.Fullname as handleName,
        b.Fullname as createName
        from [Task]
            join [User] as a on [Task].handleID = a.Id
            join [User] as b on [Task].CreateID = b.Id`;
    res.send(result.recordset);
  } catch (e) {
    res.status(500).send();
  }
  sql.close();
});

router.get("/task/:id", async (req, res) => {
  const _id = req.params.id;

  await connectToServer();
  try {
    const result = await sql.query`Select * from [Task] where id = ${_id}`;

    if (result.recordset.length == 0) {
      return res.status(404).send();
    }
    res.send(result.recordset);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/task", async (req, res) => {
  const request = req.body;
  const task = new Task(
    request.id,
    request.name,
    request.description,
    request.comment,
    request.mark,
    request.commentTime,
    request.start,
    request.finish,
    request.status,
    request.createTime,
    request.createId,
    request.linkImageConFirm,
    request.handleId
  );
  console.log(task);
  if ((await isTaskIdExist(Task.id)) == false) {
    await connectToServer();
    try {
      const result = await sql.query`insert into [Task](Id, Name, Description, Comment, Mark, CommentTime, Start, Finish, Status, CreateTime, CreateID, ImageConfirm, handleID) 
      values (${task.id}, ${task.name}, ${task.description}, ${task.comment}, ${task.mark}, ${task.commentTime}, ${task.start}, ${task.finish}, ${task.status}, ${task.createTime}, ${task.createID}, ${task.linkImageConfirm},${task.handleId}) `;
      res.status(201).send(result.recordset);
    } catch (e) {
      res.status(404).send();
      console.log(e);
    }
  } else {
    res.status(404).send();
  }

  sql.close();
});

router.delete("/task/:id", async (req, res) => {
  await connectToServer();
  try {
    if ((await isTaskIdExist(req.params.id)) == false) {
      res.status(404).send();
      console.log("cannot find");
    } else {
      try {
        const result = await sql.query`delete from [Task] where id =${req.params.id}`;
        res.status(201).send();
      } catch (e) {
        console.log(e);
        res.status(404).send();
      }
    }
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
  sql.close();
});

router.patch("/Task/:id", async (req, res) => {
  const id = req.params.id;
  const request = req.body;
  const task = new Task(
    request.id,
    request.name,
    request.description,
    request.comment,
    request.mark,
    request.commentTime,
    request.start,
    request.finish,
    request.status,
    request.linkImageConFirm,
    request.handleId
  );
  console.log("Time is ", task.createTime);
  await connectToServer();

  try {
    const result = await sql.query`update 
    [Task] set Name=${task.name}, Description=${task.description}, 
    Comment=${task.comment}, Mark=${task.mark}, CommentTime=${task.commentTime}, 
    Start=${task.start}, Finish=${task.finish}, Status= ${task.status},  
    ImageConfirm=${task.linkImageConfirm}, handleID=${task.handleId} where Id=${id}`;
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

module.exports = router;
