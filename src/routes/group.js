const express = require("express");
const sql = require("mssql");
const router = new express.Router();
const connectToServer = require("../db/connection");
const Group = require("../models/group");

listOfGroup = [];

getAllGroup = async () => {
  await connectToServer();
  try {
    const result = await sql.query`Select * from [Group]`;
    listOfGroup = result.recordset;
  } catch (e) {}
};

isGroupIdExist = async id => {
  await getAllGroup();
  const result = listOfGroup.filter(group => group.Id == id);
  return result.length > 0 ? true : false;
};

router.get("/group", async (req, res) => {
  await connectToServer();
  try {
    const result = await sql.query`Select * from [Group]`;
    res.send(result.recordset);
  } catch (e) {
    res.status(500).send();
  }
  sql.close();
});

router.get("/group/:id", async (req, res) => {
  const _id = req.params.id;

  await connectToServer();
  try {
    const result = await sql.query`Select * from [Group] where id = ${_id}`;

    if (result.recordset.length == 0) {
      return res.status(404).send();
    }
    res.send(result.recordset);
  } catch (e) {
    res.status(500).send();
  }
});

router.post("/group", async (req, res) => {
  const group = new Group(req.body.id, req.body.name);

  if ((await isGroupIdExist(group.id)) == false) {
    await connectToServer();
    try {
      const result = await sql.query`insert into [Group](Id, Name) values (${group.id}, ${group.name}) `;

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

router.delete("/group/:id", async (req, res) => {
  await connectToServer();
  try {
    if ((await isGroupIdExist(req.params.id)) == false) {
      res.status(404).send();
      console.log("cannot find");
    } else {
      try {
        const result = await sql.query`delete from [Group] where id =${req.params.id}`;
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

router.patch("/group/:id", async (req, res) => {
  await connectToServer();

  if (await isGroupIdExist(req.params.id)) {
    try {
      const result = sql.query`update [Group] set Name=${req.body.name} where id=${req.params.id}`;
      res.status(201).send();
    } catch (error) {
      res.status(404).send();
    }
  } else {
    res.status(404).send();
  }
});

module.exports = router;
