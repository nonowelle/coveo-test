const dayjs = require("dayjs");
const advancedFormat = require("dayjs");
dayjs.extend(advancedFormat);
const validator = require("validator");

//-----------POLYFILL FOR FOR EACH IN E11-----------------//
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

//--------------------DISPLAY REL 360 -----------------//
function display() {
  fetch("/events")
    .then(async (response) => {
      const data = await response.json();

      // LOOP THROUGH ALL EVENTS TO FIND WICH ONE IS RELEVANCE 360
      const relevance = [];
      const otherEvents = [];
      for (let i = 0; i < data.length; i++) {
        if (data[i].name === "Relevance 360") {
          relevance.push(data[i]);
        } else {
          otherEvents.push(data[i]);
        }
      }

      const allEvents = { relevance: relevance[0], others: otherEvents };

      // return relevanceEvent;
      return allEvents;
    })
    .then(async (allEvents) => {
      displayRelevance(allEvents.relevance);
      displaySpeakers(allEvents.relevance);
      displayEvents(allEvents.others);
    })
    .catch(function (error) {
      console.log(error);
    });
}
//------------------------FORMAT DATE-----------------------------//

function formatDate(dateToFormat) {
  const date = document.querySelector(".date");
  const dateFormated = dateToFormat.slice(0, 10);
  const finalDate = dayjs(dateFormated).format("dddd, MMMM D YYYY");
  date.innerHTML = `<i class="far fa-calendar-alt"></i>${finalDate}`;
}

//------------------------CREATE SPEAKERS----------------------------//
function createSpeakers(arr) {
  //Create a speaker div for each speaker of Relevance 360
  for (let i = 0; i < arr.length; i++) {
    let par = document.createElement("div");
    let firstName = arr[i].first_name;
    let saneFirstName = sanitize(firstName);

    let lastName = arr[i].last_name;
    let saneLastName = sanitize(lastName);

    par.classList.add("speaker-wrap");
    par.innerHTML = `<div class="informations">
            <img src="${arr[i].avatar}" alt="" class="avatar" />
            <p class="name">${saneFirstName} ${saneLastName}</p>
            <p class="title">${arr[i].title} at ${arr[i].company}</p>
          </div>
  `;
    document.querySelector(".speakers").appendChild(par);
  }
}

//------------------------DISPLAY RELEVANCE DATA----------------------------//
function displayRelevance(data) {
  //Select the h1 and change it
  const title = document.querySelector("h1");
  title.textContent = data.name;

  //Select the description paragraph and change it
  const par = document.querySelector(".par");
  par.textContent = data.description;

  // DATE
  const dateToFormat = data.date;
  formatDate(dateToFormat);

  // const speakers = document.querySelector(".speakers");
  const speakersRelId = data.speakers_id;

  // createSpeakers(speakersInfo);
}

//------------------------DISPLAY OTHER EVENTS----------------------------//

function displayEvents(data) {
  //select the cards div
  const cards = document.querySelector(".cards");
  for (let i = 0; i < data.length; i++) {
    //SHORTEN THE DESCRIPTION OF EACH EVENT
    let desc = data[i].description;
    const maxLength = 80;
    //trim the description
    let trimmedDesc = desc.substr(0, maxLength);
    //re-trim if we are in the middle of a word
    trimmedDesc = trimmedDesc.substr(
      0,
      Math.min(trimmedDesc.length, trimmedDesc.lastIndexOf(" "))
    );
    shortDesc = `${trimmedDesc}...`;

    //GENERATE A CARD FOR EACH EVENT
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
    <div class="img-container">    
    <img
          class="card-img-top"
          src="${data[i].logo}"
          alt="Card image cap"
        />
        </div>
        <div class="card-body">
          <p class="card-title"> ${data[i].name}</p>
          <p class="card-text">
          ${shortDesc}
          </p>
        </div>     
`;
    cards.appendChild(card);
  }
}

//-------------------DISPLAY SPEAKERS------------------//
function displaySpeakers(data) {
  fetch("/speakers")
    .then(async (response) => {
      const infos = await response.json();
      return infos;
    })
    .then((infos) => {
      const speakers = infos;
      // const speakersRelId = [2, 1, 3, 7, 9];
      const speakersRelId = data.speakers_id;

      //CREATE A NEW ARRAY CONTAINING ONLY RELEVANCE 360 SPEAKERS DATA
      function isRelSpeaker(speakers, speakersRelId) {
        //LOOP THROUGH SPEAKERS ARRAY
        const relSpeaker = [];
        for (let i = 0; i < speakers.length; i++) {
          //LOOP THROUGH RELEVANCE SPEAKERS ARR
          for (let j = 0; j < speakersRelId.length; j++) {
            if (speakers[i].id == speakersRelId[j]) {
              relSpeaker.push(speakers[i]);
            }
          }
        }
        createSpeakers(relSpeaker);
      }
      isRelSpeaker(speakers, speakersRelId);
    })

    .catch(function (error) {
      console.log(error);
    });
}

//--------------------FORM-VALIDATION------------------------------------//

const email = document.querySelector("#mail");
const form = document.querySelector("form");
const name = document.querySelector("#name");
const firstName = document.querySelector("#firstname");
const error = document.querySelector("span");
const button = document.querySelector("button");
const inputs = document.getElementsByTagName("input");

function validateOnSubmit() {
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    for (let i = 0; i < inputs.length; i++) {
      inputs[i].addEventListener("input", () => {
        validateInputs(inputs[i]);
      });
    }
  });

  button.addEventListener("click", submitForm);
}

function validateOnEntry() {
  for (let i = 0; i < inputs.length; i++) {
    inputs[i].addEventListener("input", () => {
      validateInputs(inputs[i]);
    });
  }
}

function validateInputs(field) {
  // Check presence of values
  if (field.value.trim() == "") {
    field.classList.add("invalid");
    button.classList.remove("ready");
  } else {
    field.classList.remove("invalid");
  }

  // check for a valid email address
  if (field.type === "email") {
    if (!validator.isEmail(field.value)) {
      field.classList.add("invalid");
      button.classList.remove("ready");
    } else {
      button.classList.add("ready");
    }
  }
}

function submitForm() {
  const userData = {
    name: name.value,
    firstName: firstName.value,
    email: email.value,
  };
  const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  };
  if (button.classList.contains("ready")) {
    fetch("/", options).then(async (response) => {
      const data = await response.json();
      const email = document.querySelector("#mail");
      const error = document.querySelector("span");

      if (data._created) {
        const form = document.querySelector("form");
        const secondSection = document.querySelector(".second-section");
        form.parentNode.removeChild(form);
        const success = document.createElement("div");
        success.innerHTML = `
    <div class="success">
    <i class="far fa-check-circle"></i>
    <p>Thank you for your register.</p>
    </div> `;
        secondSection.appendChild(success);
      }
      if (email.classList.contains("invalid")) {
        error.classList.remove("error");
      } else {
        error.classList.add("error");
        error.innerText =
          "Sorry the user already exists, please use another email.";
      }
    });
  }
}

validateOnEntry();
validateOnSubmit();

//------------------------SANITIZE RESPONSE REMOVE HTML TAGS FROM SPEAKERS INFOS----------------------//

function sanitize(string) {
  if (string.includes("<script>" && "</script>")) {
    const idx = string.indexOf("<script>");

    const idxTwo = string.lastIndexOf(">");

    newString = `${string.slice(0, idx)} ${string.slice(idxTwo + 1)}`;

    return newString;
  } else if (string.includes("<") && string.includes(">")) {
    const idx = string.indexOf("<");
    const idx2 = string.lastIndexOf("<");
    const idxTwo = string.indexOf(">");
    newString = `${string.slice(0, idx)} ${string.slice(idxTwo + 1, idx2)}`;
    return newString;
  }
  return string;
}

//-----------------------------------RENDER ALL INFOS ON THE PAGE---------------------------------------------//

display();
