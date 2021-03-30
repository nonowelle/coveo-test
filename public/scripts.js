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
  const date = document.querySelector(".first-section__date");
  const dateToFormat = data[4].date;
  dateToFormat;
  date.textContent = data[4].date;

  //select the cards div
  const cards = document.querySelector(".cards");

  //Generate a card for each events
  for (let i = 0; i < data.length - 1; i++) {
    let card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
            <img
              class="card-img-top"
              src="${data[i].logo}"
              alt="Card image cap"
            />
            <div class="card-body">
              <h5 class="card-title"> ${data[i].name}</h5>
              <p class="card-text">
              ${data[i].description}
              </p>
            </div>
         
`;
    document.querySelector(".cards").appendChild(card);
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
