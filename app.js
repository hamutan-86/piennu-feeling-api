// import express from 'express';
const express = require("express");
const fs = require('fs');

const app = express();
app.use(express.json())
app.use(express.urlencoded({ extended: true}))

app.get('/', (req, res) => {
  res.send('Piennu Feeling API');
});

app.get('/getCount', (req, res) => {
  fetch("https://object.piennu777.jp/feelings/api/getcount.php", {method: "GET", headers: {
    "accept": "*/*",
    "origin": "https://object.piennu777.jp",
    "referer": "https://object.piennu777.jp/feelings/",
    "accept-encoding": "gzip, deflate, br",
    "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/604.1",
    "content-length": "0",
    "accept-language": "en-US,en;q=0.9"
  }},).then(data => data.text()).then((resp) => {
    res.status(200).send(resp);
  })
});

app.post('/increment/createTask', (req, res) => {
  if (!req.body.amount){
    res.status(400).json({"error": "Form body Invalid"})
    return false;
  } else if (typeof req.body.amount != "number"){
    res.status(400).json({"error": "Form body Invalid"})
    return false;
  }
  let count = 0;
  var taskId = Math.floor(Math.random()* 100000000)
  let jsonObject = JSON.parse(fs.readFileSync('./tasks.json', 'utf8'));
  jsonObject[taskId.toString()] = "pending";
  fs.writeFileSync('./tasks.json', JSON.stringify(jsonObject));
  res.status(200).json({"taskId": taskId})
  while (true) {
    fetch("https://object.piennu777.jp/feelings/api/increment.php", {method: "POST", headers: {
        "accept": "*/*",
        "origin": "https://object.piennu777.jp",
        "referer": "https://object.piennu777.jp/feelings/",
        "accept-encoding": "gzip, deflate, br",
        "user-agent": "Mozilla/5.0 (iPhone; CPU iPhone OS 16_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.2 Mobile/15E148 Safari/604.1",
        "content-length": "0",
        "accept-language": "en-US,en;q=0.9"
      }},).then((data) => {})
    count++
    if (count == req.body.amount){
      break;
    }
  }
  jsonObject[taskId.toString()] = "success";
  fs.writeFileSync('./tasks.json', JSON.stringify(jsonObject));
  return true;
});

app.post('/increment/getTaskResult', (req, res) => {
  if (!req.body.taskId){
    res.status(400).json({"error": "Form body Invalid"})
    return false;
  } else if (typeof req.body.taskId != "number" && typeof req.body.taskId != "string"){
    res.status(400).json({"error": "Form body Invalid"})
    return false;
  }
  let taskId = req.body.taskId;
  if (typeof taskId === "number"){
    taskId = taskId.toString();
  }
  let jsonObject = JSON.parse(fs.readFileSync('./tasks.json', 'utf8'));
  for (var obj in jsonObject){
    if (obj === taskId){
      res.status(200).json({"status": jsonObject[taskId]})
      return true;
    }
    res.status(400).json({"error": "Task not exists"})
    return false;
  }
});

app.listen(3000, () => {
  console.log('Express server initialized');
});
