function FormatDate(dateToFormat) {
  const date = document.querySelector(".date");
  const dateFormated = dateToFormat.slice(0, 10);
  const finalDate = dayjs(dateFormated).format("dddd, MMMM D YYYY");
  date.innerHTML = `<i class="far fa-calendar-alt"></i>${finalDate}`;
}

module.exports = FormatDate;
