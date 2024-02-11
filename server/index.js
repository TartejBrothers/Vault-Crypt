const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const app = express();
const port = 3000;
const { MongoClient } = require("mongodb");
app.use(bodyParser.json());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version"
  );
  next();
});

app.get("/", (req, res) => {
  res.send("Hello World!");
});

// app.post("/saveData", (req, res) => {
//   const { username, hashedPassword } = req.body;

//   const data = `Username: ${username}\nHashed Password: ${hashedPassword}\n\n`;

//   fs.appendFile("userdata.txt", data, (err) => {
//     if (err) {
//       console.error("Error saving data:", err);
//       res.status(500).send("Error saving data");
//     } else {
//       console.log("Data has been appended to userdata.txt");
//       res.send("Data has been saved");
//     }
//   });
// });
const uri = "";

app.post("/saveData", async (req, res) => {
  const { username, hashedPassword } = req.body;
  const client = new MongoClient(uri);

  try {
    await client.connect();

    const database = client.db("vaultcrypt");
    const collection = database.collection("user");

    await collection.insertOne({ username, hashedPassword });

    res.send("Data has been saved to MongoDB");
  } catch (error) {
    console.error("Error saving data:", error);
    res.status(500).send("Error saving data");
  } finally {
    if (client.isConnected) {
      await client.close();
    }
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
