const express = require("express");
const sql = require("mssql");
const router = new express.Router();
const User = require("../models/user");
const connectToServer = require("../db/connection");

listOfUser = [];

getAllUser = async () => {
  await connectToServer();
  try {
    const result = await sql.query`select * from [User]`;
    listOfUser = result.recordset;
  } catch (error) {
    console.log(error);
  }
  sql.close();
};

isUserIdExist = async id => {
  await getAllUser();

  try {
    const result = listOfUser.filter(user => user.Id == id);
    return result.length > 0 ? true : false;
  } catch (error) {
    console.log(error);
  }
};

isUsernameExist = async username => {
  await getAllUser();
  try {
    const result = listOfUser.filter(user => user.Username == username);
    return result.length > 0 ? true : false;
  } catch (error) {
    console.log(error);
  }
};

isPasswordMatch = async password => {
  await getAllUser();
  try {
    const result = listOfUser.filter(user => user.Password == password);
    return result.length > 0 ? true : false;
  } catch (error) {
    console.log(error);
  }
};

router.post("/login", async (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
  console.log(username, password);
  if ((await isUsernameExist(username)) && (await isPasswordMatch(password))) {
    res.send(listOfUser.filter(user => user.Username == username));
  } else {
    res.status(404).send({ errorMessage: "Wrong username or password" });
  }
});

router.get("/user", async (req, res) => {
  await connectToServer();
  try {
    const result = await sql.query`select * from [User]`;
    res.status(201).send(result.recordset);
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
  sql.close();
});

router.get("/user/:id", async (req, res) => {
  const id = req.params.id;
  console.log(id);
  await connectToServer();
  try {
    const result = await sql.query`select * from [User] where Id = ${id}`;
    console.log(result.recordset);
    if (result.recordset.length == 0) {
      return res.status(404).send();
    }
    res.send(result.recordset);
  } catch (error) {
    res.status(500).send();
  }
});

router.post("/user/", async (req, res) => {
  const request = req.body;
  const user = new User(
    request.id,
    request.username,
    request.password,
    request.fullname,
    request.age,
    request.phone,
    request.groupId,
    request.role
  );
  if (
    (await isUserIdExist(user.id)) == true &&
    (await isUsernameExist(user.username)) == true
  ) {
    console.log("khong hop le");
    return res.status(404).send();
  }
  await connectToServer();
  try {
    const result = await sql.query`insert into [User] values (${user.id}, ${user.username}, ${user.password}, ${user.fullname}, ${user.age}, ${user.phone}, ${user.groupId}, ${user.role})`;
    res.status(201).send(result.recordset);
  } catch (error) {
    res.status(404).send();
  }
  sql.close();
});

router.delete("/user/:id", async (req, res) => {
  const id = req.params.id;
  if ((await isUserIdExist(id)) == false) {
    return res.status(404).send();
  }

  await connectToServer();
  try {
    const result = sql.query`delete from [User] where Id=${id}`;
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

router.patch("/user/:id", async (req, res) => {
  const id = req.params.id;
  const request = req.body;
  const user = new User();
  user.password = request.password;
  user.fullname = request.fullname;
  user.age = request.age;
  user.phone = request.phone;
  user.groupId = request.groupId;
  user.role = request.role;
  await connectToServer();
  try {
    const result = await sql.query`update [User] set Password=${user.password}, Fullname=${user.fullname}, Age=${user.age}, GroupId=${user.groupId}, Role=${user.role} where Id=${id}`;
    res.status(201).send();
  } catch (error) {
    console.log(error);
    res.status(404).send();
  }
});

//   await connectToServer();

// });

module.exports = router;
