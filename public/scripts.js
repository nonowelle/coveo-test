//-----------POLYFILL FOR FOR EACH IN E11-----------------//
if (window.NodeList && !NodeList.prototype.forEach) {
  NodeList.prototype.forEach = Array.prototype.forEach;
}
if (window.HTMLCollection && !HTMLCollection.prototype.forEach) {
  HTMLCollection.prototype.forEach = Array.prototype.forEach;
}

//-------------------DISPLAY OTHER EVENTS ------------------//
function displayE() {
  fetch("/events")
    .then(async (response) => {
      const data = await response.json();
      return data;
    })
    .then(async (data) => {
      displayEvents(data);
    })

    .catch(function (error) {
      console.log(error);
    });
}

//--------------------DISPLAY REL 360 -----------------//
function displayRelevanceEvent() {
  fetch("/events")
    .then(async (response) => {
      const data = await response.json();
      console.log(data);
      // LOOP THROUGH ALL EVENTS TO FIND WICH ONE IS RELEVANCE 360
      const relevance = [];
      for (let i = 0; i < data.length; i++) {
        data[i].name === "Relevance 360"
          ? relevance.push(data[i])
          : console.log("not this event");
      }
      const relevanceEvent = relevance[0];
      console.log(relevanceEvent);
      return relevanceEvent;
    })
    .then(async (relevanceEvent) => {
      displayRelevance(relevanceEvent);
      displaySpeakers(relevanceEvent);
    })
    .catch(function (error) {
      console.log(error);
    });
}
//------------------------FORMAT DATE-----------------------------//

function formatDate(dateToFormat) {
  const date = document.querySelector(".first-section__date");
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
    let lastName = arr[i].last_name;
    par.classList.add("speaker__div");
    par.innerHTML = `<div class="__info">
            <img src="${arr[i].avatar}" alt="" class="__avatar" />
            <p class="__name">${firstName} ${lastName}</p>
            <p class="__title">${arr[i].title} at ${arr[i].company}</p>
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
  const par = document.querySelector(".first-section__par");
  par.textContent = data.description;

  // DATE
  const dateToFormat = data.date;
  formatDate(dateToFormat);

  // const speakers = document.querySelector(".speakers");
  const speakersRelId = data.speakers_id;
  console.log(speakersRelId);
  // createSpeakers(speakersInfo);
}

//------------------------DISPLAY OTHER EVENTS----------------------------//

function displayEvents(data) {
  //select the cards div
  const cards = document.querySelector(".cards");
  for (let i = 0; i < data.length - 1; i++) {
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
        <img
          class="card-img-top"
          src="${data[i].logo}"
          alt="Card image cap"
        />
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
      // fetchEvents();

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
            speakers[i].id == speakersRelId[j]
              ? relSpeaker.push(speakers[i])
              : console.log("NO");
          }
        }
        console.log(relSpeaker);
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

form.addEventListener("submit", (e) => {
  console.log("Trying to submit");
  validateForm(e);
});

function validateForm(e) {
  if (email.value && name.value && firstName.value) {
    email.classList.remove("invalid");
    name.classList.remove("invalid");
    firstName.classList.remove("invalid");
    button.classList.add("ready");
    submitForm();
  } else {
    button.classList.remove("ready");
    e.preventDefault();
  }

  if (validator.isEmpty(name.value)) {
    name.classList.add("invalid");
    e.preventDefault();
  }
  if (validator.isEmpty(firstName.value)) {
    firstName.classList.add("invalid");
    e.preventDefault();
  }

  if (!validator.isEmail(email.value)) {
    email.classList.add("invalid");
    e.preventDefault();
  }
}

const submitForm = async () => {
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

  const response = await fetch("/", options);
  const data = await JSON.stringify(response);
  console.log(data);
};

//-----------------------------------RENDER ALL INFOS ON THE PAGE---------------------------------------------//
displayE();
displayRelevanceEvent();
