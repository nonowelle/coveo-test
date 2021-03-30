const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
const axios = require("axios");
const morgan = require("morgan");
app.use(express.json({ limit: "1mb" }));

//Setting up the .env file
require("dotenv").config();
const api_key = process.env.API_KEY;

// Display the files in public folder
app.use(express.static("public"));

app.use(morgan("tiny"));

//Get the data from the Coveo API
app.get("/speakers", async (req, res) => {
  let config = {
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

//Make the app listen to a port
app.listen(port, () => {
  console.log(`listening at ${port}`);
});
