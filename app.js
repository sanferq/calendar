const calendar = document.querySelector(".calendar"),
  date = document.querySelector(".date"),
  daysContainer = document.querySelector(".days"),
  prev = document.querySelector(".prev"),
  next = document.querySelector(".next"),
  todayBtn = document.querySelector(".today-btn"),
  gotoBtn = document.querySelector(".goto-btn"),
  dateInput = document.querySelector(".date-input"),
  eventDay = document.querySelector(".event-day"),
  eventDate = document.querySelector(".event-date"),
  eventsContainer = document.querySelector(".events"),
  addEventBtn = document.querySelector(".add-event"),
  addEventWrapper = document.querySelector(".add-event-wrapper"),
  addEventCloseBtn = document.querySelector(".close"),
  addEventTitle = document.querySelector(".event-name"),
  addEventFrom = document.querySelector(".event-time-from"),
  addEventTo = document.querySelector(".event-time-to"),
  addEventSubmit = document.querySelector(".add-event-btn");

let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

const months = [
  "Январь",
  "Февраль",
  "Март",
  "Апрель",
  "Май",
  "Июнь",
  "Июль",
  "Август",
  "Сентябрь",
  "Октябрь",
  "Ноябрь",
  "Декабрь",
];

const eventsArr = [];
getEvents();

const weekdays = ["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"];

function initCalendar() {
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const prevLastDay = new Date(year, month, 0);
  const prevDays = prevLastDay.getDate();
  const lastDate = lastDay.getDate();

  let day = firstDay.getDay() - 1;
  if (day === -1) day = 6;

  date.innerHTML = months[month] + " " + year;

  let weekdaysHtml = "";
  weekdays.forEach((day) => {
    weekdaysHtml += `<div>${day}</div>`;
  });
  document.querySelector(".weekdays").innerHTML = weekdaysHtml;

  let days = "";
  let totalDays = 0;

  for (let x = day; x > 0; x--) {
    days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    totalDays++;
  }

  for (let i = 1; i <= lastDate; i++) {
    let event = false;
    eventsArr.forEach((eventObj) => {
      if (
        eventObj.day === i &&
        eventObj.month === month + 1 &&
        eventObj.year === year
      ) {
        event = true;
      }
    });

    if (
      i === new Date().getDate() &&
      year === new Date().getFullYear() &&
      month === new Date().getMonth()
    ) {
      activeDay = i;
      getActiveDay(i);
      updateEvents(i);
      days += event
        ? `<div class="day today active event">${i}</div>`
        : `<div class="day today active">${i}</div>`;
    } else {
      days += event
        ? `<div class="day event">${i}</div>`
        : `<div class="day">${i}</div>`;
    }
    totalDays++;
  }

  let nextDay = 1;
  while (totalDays < 42) {
    days += `<div class="day next-date">${nextDay}</div>`;
    nextDay++;
    totalDays++;
  }

  daysContainer.innerHTML = days;
  addListener();
}

function prevMonth() {
  month--;
  if (month < 0) {
    month = 11;
    year--;
  }
  initCalendar();
}

function nextMonth() {
  month++;
  if (month > 11) {
    month = 0;
    year++;
  }
  initCalendar();
}

prev.addEventListener("click", prevMonth);
next.addEventListener("click", nextMonth);

initCalendar();

function addListener() {
  const days = document.querySelectorAll(".day");
  days.forEach((day) => {
    day.addEventListener("click", (e) => {
      getActiveDay(e.target.innerHTML);
      updateEvents(Number(e.target.innerHTML));
      activeDay = Number(e.target.innerHTML);

      days.forEach((day) => {
        day.classList.remove("active");
      });

      if (e.target.classList.contains("prev-date")) {
        prevMonth();
      } else if (e.target.classList.contains("next-date")) {
        nextMonth();
      } else {
        e.target.classList.add("active");
      }
    });
  });
}

todayBtn.addEventListener("click", () => {
  today = new Date();
  month = today.getMonth();
  year = today.getFullYear();
  initCalendar();
});

dateInput.addEventListener("input", (e) => {
  dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
  if (dateInput.value.length === 2) {
    dateInput.value += "/";
  }
  if (dateInput.value.length > 7) {
    dateInput.value = dateInput.value.slice(0, 7);
  }
});

gotoBtn.addEventListener("click", gotoDate);

function gotoDate() {
  const dateArr = dateInput.value.split("/");
  if (dateArr.length === 2) {
    if (dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
      month = dateArr[0] - 1;
      year = dateArr[1];
      initCalendar();
      return;
    }
  }
  alert("Неверная дата");
}

function getActiveDay(date) {
  const days = [
    "Воскресенье",
    "Понедельник",
    "Вторник",
    "Среда",
    "Четверг",
    "Пятница",
    "Суббота",
  ];
  const day = new Date(year, month, date);
  const dayName = days[day.getDay()];
  eventDay.innerHTML = dayName;
  eventDate.innerHTML = date + " " + months[month] + " " + year;
}

function updateEvents(date) {
  let events = "";
  eventsArr.forEach((event) => {
    if (
      date === event.day &&
      month + 1 === event.month &&
      year === event.year
    ) {
      event.events.forEach((event) => {
        events += `<div class="event">
            <div class="title">
              <i class="fas fa-circle"></i>
              <h3 class="event-title">${event.title}</h3>
            </div>
            <div class="event-time">
              <span class="event-time">${event.time}</span>
            </div>
        </div>`;
      });
    }
  });
  if (events === "") {
    events = `<div class="no-event">
            <h3>Нет событий</h3>
        </div>`;
  }
  eventsContainer.innerHTML = events;
  saveEvents();
}

// Добавление событий
addEventBtn.addEventListener("click", () => {
  addEventWrapper.classList.toggle("active");
});

addEventCloseBtn.addEventListener("click", () => {
  addEventWrapper.classList.remove("active");
});

document.addEventListener("click", (e) => {
  if (e.target !== addEventBtn && !addEventWrapper.contains(e.target)) {
    addEventWrapper.classList.remove("active");
  }
});

addEventTitle.addEventListener("input", (e) => {
  addEventTitle.value = addEventTitle.value.slice(0, 60);
});

function formatTimeInput(input) {
  let value = input.value.replace(/\D/g, "");
  if (value.length > 2) {
    value = value.substring(0, 2) + ":" + value.substring(2, 4);
  }
  input.value = value.substring(0, 5);
}

addEventFrom.addEventListener("input", (e) => {
  formatTimeInput(e.target);
});

addEventTo.addEventListener("input", (e) => {
  formatTimeInput(e.target);
});

function isValidTime(time) {
  const [hours, minutes] = time.split(":").map(Number);
  return hours >= 0 && hours <= 23 && minutes >= 0 && minutes <= 59;
}

addEventSubmit.addEventListener("click", () => {
  const eventTitle = addEventTitle.value.trim();
  const eventTimeFrom = addEventFrom.value.trim();
  const eventTimeTo = addEventTo.value.trim();

  if (!eventTitle || !eventTimeFrom || !eventTimeTo) {
    alert("Заполните все поля");
    return;
  }

  if (!isValidTime(eventTimeFrom) || !isValidTime(eventTimeTo)) {
    alert("Неверный формат времени. Используйте ЧЧ:ММ (24-часовой формат)");
    return;
  }

  const [fromHours, fromMins] = eventTimeFrom.split(":").map(Number);
  const [toHours, toMins] = eventTimeTo.split(":").map(Number);

  if (toHours < fromHours || (toHours === fromHours && toMins <= fromMins)) {
    alert("Время окончания должно быть позже времени начала");
    return;
  }

  const eventExists = eventsArr.some(
    (event) =>
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year &&
      event.events.some((e) => e.title === eventTitle)
  );

  if (eventExists) {
    alert("Событие с таким названием уже существует");
    return;
  }

  const newEvent = {
    title: eventTitle,
    time: `${eventTimeFrom} - ${eventTimeTo}`,
  };

  const dayEvents = eventsArr.find(
    (event) =>
      event.day === activeDay &&
      event.month === month + 1 &&
      event.year === year
  );

  if (dayEvents) {
    dayEvents.events.push(newEvent);
  } else {
    eventsArr.push({
      day: activeDay,
      month: month + 1,
      year: year,
      events: [newEvent],
    });
  }

  addEventWrapper.classList.remove("active");
  addEventTitle.value = "";
  addEventFrom.value = "";
  addEventTo.value = "";
  updateEvents(activeDay);

  const activeDayEl = document.querySelector(".day.active");
  if (activeDayEl && !activeDayEl.classList.contains("event")) {
    activeDayEl.classList.add("event");
  }
});

eventsContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("event")) {
    if (confirm("Удалить это событие?")) {
      const eventTitle = e.target.querySelector(".event-title").textContent;

      eventsArr.forEach((event) => {
        if (
          event.day === activeDay &&
          event.month === month + 1 &&
          event.year === year
        ) {
          event.events = event.events.filter(
            (item) => item.title !== eventTitle
          );

          if (event.events.length === 0) {
            eventsArr.splice(eventsArr.indexOf(event), 1);
            const activeDayEl = document.querySelector(".day.active");
            if (activeDayEl) {
              activeDayEl.classList.remove("event");
            }
          }
        }
      });

      updateEvents(activeDay);
    }
  }
});

function saveEvents() {
  localStorage.setItem("events", JSON.stringify(eventsArr));
}

function getEvents() {
  const savedEvents = JSON.parse(localStorage.getItem("events"));
  if (savedEvents) {
    eventsArr.length = 0;
    eventsArr.push(...savedEvents);
  }
}
