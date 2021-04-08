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
//------------------------SANITIZE RESPONSE REMOVE HTML TAGS FROM SPEAKERS INFOS----------------------//

function sanitize(string) {
  if (string.includes("<script>" && "</script>")) {
    const idx = string.indexOf("<script>");

    const idxTwo = string.lastIndexOf(">");

    const newString = `${string.slice(0, idx)} ${string.slice(idxTwo + 1)}`;

    return newString;
  } else if (string.includes("<") && string.includes(">")) {
    const idx = string.indexOf("<");
    const idx2 = string.lastIndexOf("<");
    const idxTwo = string.indexOf(">");
    const newString = `${string.slice(0, idx)} ${string.slice(
      idxTwo + 1,
      idx2
    )}`;
    return newString;
  }
  return string;
}

module.exports = createSpeakers;
