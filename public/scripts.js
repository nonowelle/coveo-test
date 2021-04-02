//-------------------EVENTS------------------//
function display() {
  fetch("/events")
    .then(async (response) => {
      const data = await response.json();
      return data;
    })
    .then(displayResults)
    .catch(function (error) {
      console.log(error);
    });
}

function createSpeakers(arr) {
  //Create a speaker div for each speaker of Relevance 360
  for (let i = 0; i < 6; i++) {
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

function formatDate(dateToFormat) {
  const date = document.querySelector(".first-section__date");
  const dateFormated = dateToFormat.slice(0, 10);
  const finalDate = dayjs(dateFormated).format("dddd, MMMM D YYYY");
  console.log(finalDate);
  date.innerHTML = `<i class="far fa-calendar-alt"></i>${finalDate}`;
}

function displayResults(data) {
  displayRelevance();
  displayEvents();

  function displayRelevance() {
    //Select the h1 and change it
    const title = document.querySelector("h1");
    title.textContent = data[4].name;

    //Select the description paragraph and change it
    const par = document.querySelector(".first-section__par");
    par.textContent = data[4].description;

    // DATE
    const dateToFormat = data[4].date;
    formatDate(dateToFormat);

    // const speakers = document.querySelector(".speakers");
    // const speakersInfo = data[4].speakers_id;
    // createSpeakers(speakersInfo);
  }

  function displayEvents() {
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
}

//-------------------SPEAKERS------------------//
fetch("/speakers")
  .then(async (response) => {
    const infos = await response.json();
    console.log(infos);
    return infos;
  })
  .then((infos) => {
    const speakersInfo = infos;
    // const speakers = document.querySelector(".speakers");

    // function keepInfoRel() {
    //   const speakersId = [2, 1, 3, 7, 9];
    //   const speakersInfo = infos;
    //   for (let i = 0; i < speakersInfo.length; i++) {
    //     const id = parseInt(speakersInfo[i].id);

    //     console.log(id);

    //     console.log(speakersId);
    //     speakersId.includes(speakersInfo[i].id)
    //       ? console.log("YES")
    //       : console.log("no");
    //   }
    // }
    // keepInfoRel();

    createSpeakers(speakersInfo);
  })
  .catch(function (error) {
    console.log(error);
  });

//----FORM-VALIDATION-----------------------//
const email = document.querySelector("#mail");
const form = document.querySelector("form");
const name = document.querySelector("#name");
const firstName = document.querySelector("#firstname");
const error = document.querySelector("span");
const button = document.querySelector("button");
const inputs = document.getElementsByTagName("input");
console.log(inputs);

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

//-----------------------------------------//
display();
