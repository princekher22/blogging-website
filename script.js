// DAYLOG - simple JavaScript for the blog

// ---------- my diary entries (edit these!) ----------
var entries = [
  { date: "26 Oct 2026", title: "Monday reset", mood: "Focused",
    short: "Started the week with a clear to-do list.",
    full: "Woke up early, made a plan for the week and finished my web design homework before lunch. Using a to-do list really helps me stay calm." },
  { date: "25 Oct 2026", title: "Lazy Sunday", mood: "Calm",
    short: "No rush today, just rest and music.",
    full: "Slept in, cooked pasta and watched a documentary about space. Sometimes doing nothing is exactly what you need before a busy week." },
  { date: "24 Oct 2026", title: "Lab day", mood: "Tired",
    short: "Three hours of coding lab and one big bug.",
    full: "My code did not run for an hour because I missed one semicolon. Our lab teacher found it in five seconds. I am going to read my code slower from now on." },
  { date: "23 Oct 2026", title: "Group project win", mood: "Happy",
    short: "Our team finished the presentation!",
    full: "We practised three times and the presentation went really well. Everyone helped and we got good feedback. I love it when teamwork works." },
  { date: "22 Oct 2026", title: "Rainy commute", mood: "Tired",
    short: "Rain, traffic and a very late bus.",
    full: "Reached college 20 minutes late and missed the first lecture. I borrowed notes from a friend and caught up in the library." },
  { date: "21 Oct 2026", title: "Evening walk", mood: "Calm",
    short: "A walk after sunset cleared my head.",
    full: "After studying for hours I went for a 30 minute walk. No phone, just listening to the street. I came back with new ideas for my project." }
];

// ---------- highlight current page in the menu ----------
var page = location.pathname.split("/").pop() || "index.html";
var links = document.querySelectorAll("nav a");
for (var i = 0; i < links.length; i++) {
  if (links[i].getAttribute("href") === page) {
    links[i].classList.add("active");
  }
}

// ---------- live clock, greeting and day progress ----------
function updateClock() {
  var now = new Date();
  var clock = document.getElementById("clock");
  if (!clock) return;

  clock.textContent = now.toLocaleTimeString();
  document.getElementById("date").textContent =
    now.toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long", year: "numeric" });

  // how much of today has passed
  var minutes = now.getHours() * 60 + now.getMinutes();
  var percent = Math.round((minutes / 1440) * 100);
  document.getElementById("dayfill").style.width = percent + "%";
  document.getElementById("daytext").textContent = percent + "% of today is done";
}
updateClock();
setInterval(updateClock, 1000);

// ---------- typing effect with greeting ----------
var typed = document.getElementById("typed");
if (typed) {
  var hour = new Date().getHours();
  var greeting = "Good evening";
  if (hour < 12) greeting = "Good morning";
  else if (hour < 17) greeting = "Good afternoon";

  var text = greeting + ", welcome to my day.";
  var pos = 0;
  var timer = setInterval(function () {
    typed.textContent = text.slice(0, pos);
    pos++;
    if (pos > text.length) clearInterval(timer);
  }, 70);
}

// ---------- home page: latest entry and stats ----------
var latest = document.getElementById("latest");
if (latest) {
  var e = entries[0];
  latest.innerHTML = "<small>" + e.date + "</small><span class='tag'>" + e.mood + "</span>" +
    "<h3>" + e.title + "</h3><p>" + e.full + "</p><a class='btn' href='diary.html'>Read all entries</a>";
  document.getElementById("count").textContent = entries.length;
  document.getElementById("streak").textContent = entries.length;
}

// ---------- diary page: mood filter and read more ----------
var list = document.getElementById("list");
if (list) {
  var moods = ["All", "Happy", "Focused", "Calm", "Tired"];
  var chips = document.getElementById("chips");
  var current = "All";

  for (var m = 0; m < moods.length; m++) {
    var b = document.createElement("button");
    b.className = "chip" + (moods[m] === "All" ? " on" : "");
    b.textContent = moods[m];
    b.onclick = function () {
      current = this.textContent;
      var all = chips.children;
      for (var k = 0; k < all.length; k++) all[k].classList.remove("on");
      this.classList.add("on");
      showEntries();
    };
    chips.appendChild(b);
  }

  function showEntries() {
    var html = "";
    for (var n = 0; n < entries.length; n++) {
      var en = entries[n];
      if (current === "All" || en.mood === current) {
        html += "<div class='box entry'><small>" + en.date + "</small><span class='tag'>" + en.mood + "</span>" +
          "<h3>" + en.title + "</h3><p>" + en.short + "</p>" +
          "<p class='more'>" + en.full + "</p>" +
          "<button class='chip'>Read more</button></div>";
      }
    }
    list.innerHTML = html || "<p>No entries for this mood yet.</p>";
  }
  showEntries();

  // open and close an entry
  list.onclick = function (ev) {
    if (ev.target.tagName === "BUTTON") {
      var box = ev.target.parentElement;
      box.classList.toggle("open");
      ev.target.textContent = box.classList.contains("open") ? "Show less" : "Read more";
    }
  };
}

// ---------- contact form ----------
var form = document.getElementById("contactForm");
if (form) {
  form.onsubmit = function (ev) {
    ev.preventDefault();
    var name = document.getElementById("name").value.trim();
    var email = document.getElementById("email").value.trim();
    var msg = document.getElementById("msg").value.trim();
    var error = document.getElementById("error");
    var ok = document.getElementById("ok");
    ok.textContent = "";

    if (name === "") { error.textContent = "Please enter your name."; return; }
    if (email.indexOf("@") < 1 || email.indexOf(".") < 0) { error.textContent = "Please enter a valid email."; return; }
    if (msg.length < 10) { error.textContent = "Message must be at least 10 characters."; return; }

    error.textContent = "";
    ok.textContent = "Message sent! Thanks " + name + ", I will reply soon.";
    form.reset();
  };
}
