const response = fetch("/speakers").then(async (response) => {
  console.log(response);
  const data = await response.json();
  console.log(data);
  const obj = JSON.parse(JSON.stringify(data));
  console.log(obj);

  //Select the p we want to change
  const title = document.querySelector(".__title");
  const name = document.querySelector(".__name");
  const avatar = document.querySelector(".__avatar");
  avatar.src = obj[0].avatar;
  title.textContent = obj[0].title;
  name.textContent = obj[0].last_name;
});
