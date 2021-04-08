const dayjs = require("dayjs");
const advancedFormat = require("dayjs");
dayjs.extend(advancedFormat);
const validator = require("validator");
const formatDate = require("./utils/formatDate");
const createSpeakers = require("./utils/createSpeakers");
const loopL = require("./utils/animation");

//--------------------MAIN FUNCTION DISPLAY REL 360 -----------------//
function display() {
  //fetch the events data from API
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

      // return allEvents informations;
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
    const shortDesc = `${trimmedDesc}...`;

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
//-----VALIDATE FORM EVERYTIME A USER TYPE SOMETHING OR TRIES TO SUBMIT THE FORM ------//
validateOnEntry();
validateOnSubmit();

//-----------------------------------RENDER ALL INFOS ON THE PAGE---------------------------------------------//

display();
loopL();
