const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");
const morgan = require("morgan");
const fetch = require("node-fetch");

app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended: true }));

//Setting up the .env file
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const api_key = process.env.API_KEY;

// Display the files in public folder
app.use(express.static("public"));

app.use(morgan("tiny"));

//Get the data from the Coveo API

app.get("/speakers", async (req, res) => {
  let config = {
    id: req.params.id,
    method: "get",
    url: "https://isfrontendtest.coveo.com/rest/speakers",
    headers: {
      "x-apikey": api_key,
    },
  };

  await axios(config)
    .then(async function (response) {
      const data = await response.data;
      console.log(data);
      res.json(data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.get("/events", async (req, res) => {
  let config = {
    method: "get",
    url: "https://isfrontendtest.coveo.com/rest/events",
    headers: {
      "x-apikey": api_key,
    },
  };

  await axios(config)
    .then(async function (response) {
      const data = await response.data;
      res.json(data);
    })
    .catch(function (error) {
      console.log(error);
    });
});

app.post("/", async (req, res) => {
  const lastName = req.body.name;
  const firstName = req.body.firstName;
  const email = req.body.email;

  //POST REQUEST TO COVEO API
  const params = new URLSearchParams();
  params.append("email", email);
  params.append("firstname", firstName);
  params.append("lastname", lastName);
  let requestOptions = {
    method: "POST",
    headers: {
      "x-apikey": api_key,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: params,
    redirect: "follow",
  };

  fetch("https://isfrontendtest.coveo.com/rest/registration", requestOptions)
    .then((response) => response.json())
    .then((result) => {
      const message = result;
      console.log(message);

      if (message._createdby) {
        res.send(message);
      } else {
        res.send(message);
      }
    })
    .catch((error) => console.log("error", error));
});

//Make the app listen to a port
app.listen(port, () => {
  console.log(`listening at ${port}`);
});
