//-------------------EVENTS------------------//
const events = fetch("/events").then(async (response) => {
  console.log(response);
  const data = await response.json();
  console.log(data);

  //Select the h1 and change it
  const title = document.querySelector("h1");
  title.textContent = data[4].name;

  //Select the description paragraph and change it
  const par = document.querySelector(".first-section__par");
  par.textContent = data[4].description;

  //Select the data of Relevance 360
  // DATE
  const date = document.querySelector(".first-section__date");
  const dateToFormat = data[4].date;
  const dateFormated = dateToFormat.slice(0, 10);
  const finalDate = dayjs(dateFormated).format("dddd, MMMM D YYYY");
  console.log(finalDate);
  date.innerHTML = `<i class="far fa-calendar-alt"></i>${finalDate}`;

  const speakers = document.querySelector(".speakers");
  const speakersInfo = data[4].speakers_id;
  console.log(speakersInfo);

  //Create a speaker div for each speaker of Relevance 360

  for (let i = 0; i < speakersInfo.length; i++) {
    let par = document.createElement("div");
    par.classList.add("speaker__div");
    par.innerHTML = `<div class="__info">
                <img src="https://reqres.in/img/faces/1-image.jpg" alt="" class="__avatar" />
                <p class="__name">${speakersInfo[i]}</p>
                <p class="__title">Hola !</p>
              </div>
      `;
    document.querySelector(".speakers").appendChild(par);
  }

  //select the cards div
  const cards = document.querySelector(".cards");

  //Generate a card for each events

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
});

//-------------------SPEAKERS------------------//

const speakers = fetch("/speakers").then(async (response) => {
  console.log(response);
  const data = await response.json();
  console.log(data);

  //Select the p we want to change
  const title = document.querySelector(".__title");
  const name = document.querySelector(".__name");
  const avatar = document.querySelector(".__avatar");
  avatar.src = data[0].avatar;
  title.textContent = data[0].title;
  name.textContent = data[0].last_name;
});
