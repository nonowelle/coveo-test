const response = fetch("/speakers").then(async (response) => {
  console.log(response);
  const data = await response.json();
  console.log(data);
  const obj = JSON.parse(JSON.stringify(data));
  console.log(obj);

  //Select the p we want to change
  const div_data = document.querySelector(".data");
  const name = document.querySelector(".name");
  const avatar = document.querySelector(".avatar");
  console.log(div_data);
  avatar.src = obj[0].avatar;
  div_data.textContent = obj[0].title;
  name.textContent = obj[0].last_name;
});
