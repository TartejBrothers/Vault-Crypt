const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

app.post("/saveData", (req, res) => {
  const { username, hashedPassword } = req.body;

  const data = `Username: ${username}\nHashed Password: ${hashedPassword}\n\n`;

  fs.appendFile("userdata.txt", data, (err) => {
    if (err) {
      console.error("Error saving data:", err);
      res.status(500).send("Error saving data");
    } else {
      console.log("Data has been appended to userdata.txt");
      res.send("Data has been saved");
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
