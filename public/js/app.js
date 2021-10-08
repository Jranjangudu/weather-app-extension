"use strict";

// check online / offline status
window.addEventListener("load", (event) => {
  const statusDisplay = document.getElementById("status");
  statusDisplay.classList = navigator.onLine ? "online" : "offline";
  let code = navigator.onLine ? true : false;
  localStorage.setItem("status", code);
});
window.addEventListener("offline", (event) => {
  const statusDisplay = document.getElementById("status");
  statusDisplay.classList = "offline";
  localStorage.setItem("status", false);
});

window.addEventListener("online", (event) => {
  const statusDisplay = document.getElementById("status");
  statusDisplay.classList = "online";
  localStorage.setItem("status", true);
});

let storage = localStorage.getItem("location");
if (!storage) {
  localStorage.setItem("location", "delhi");
}
const api_key = "a1eaf28583d42c2f30fbfef8a6cd4b99";
const base_url = "https://api.openweathermap.org/data/2.5/";

if (localStorage.getItem("status") === "true") {
  makeAPICall();

  async function makeAPICall(quary) {
    try {
      const response = await fetch(
        `${base_url}weather?q=${
          quary ? quary : storage
        }&units=metric&appid=${api_key}
     `,
        {
          method: "GET",
        }
      );
      const cur_data = await response.json();
      localStorage.setItem("location", cur_data.name);
      let bg = document.getElementById("container_background");
      cur_data.main.temp > 12
        ? (bg.classList = "sunny")
        : (bg.classList = "cloud");
      timerId = undefined;
      let html = "";
      let img = `https://openweathermap.org/img/wn/${cur_data.weather[0].icon}@2x.png`;
      let htmlSegment = `
        <div class="location" >
          <h1 > ${cur_data.name}, ${cur_data.sys.country}</h1>
          <p>${new Date().toLocaleDateString()} </p>
         <div class="weather-box">
          <div class="temp ">
            <img src= ${img} alt="..." width="100px" />
            <b class="temp-value">${Math.round(cur_data.main.temp)}°c</b>
          </div>
          <div class="weather ">${cur_data.weather[0].main}</div>
        </div>
        </div>
    
      `;
      html += htmlSegment;
      document.getElementById("main").innerHTML = html;
    } catch (error) {
      let quary = document.getElementById("search");

      if (quary.value) {
        document.getElementById(
          "main"
        ).innerHTML = `<h3 class="error_message">Location / city not found</h3>`;
      } else {
        document.getElementById("main").innerHTML = null;
      }
    }
  }

  let timerId;
  const debounceFunction = (func, text, delay) => {
    clearInterval(timerId);

    timerId = setTimeout(() => {
      func(text);
    }, delay);
  };

  document.getElementById("search").addEventListener("input", () => {
    let quary = document.getElementById("search");
    debounceFunction(makeAPICall, quary.value, 300);
  });
} else {
  document.getElementById("main").innerHTML = `<pre class="status_message">
  No internet

  Try:
  Checking the network cables, 
  modem, and router
  Reconnecting to Wi-Fi
  </pre>`;
}
