/*
    5217 - Web
    Based on 5217 by Francisco Franco
    Developed by Jackson Hayes
*/

/*
  Constants
*/

const minute = 60000;
const pauseNotifyMinutesInterval = 5;

const worktime = 52;
const breaktime = 17;

const originalTitle = document.title;

/*
  Variables
*/

var startTimeStamp;
var endTimeStamp;
var startPauseTimeStamp;
var minutesAwayStamp;
var currentTimeStamp;
var placeHolderTime;
var currentCycle;

// A literal ARRAY of colors. Ha!
var workColors = ["#238aff", "#278cff", "#2c8fff", "#3091ff", "#3493ff", "#3996ff", "#3d98ff", "#419aff", "#469cff", "#4a9fff", "#4ea1ff", "#53a3ff", "#57a6ff", "#5ba8ff", "#60aaff", "#64adff", "#68afff", "#6db1ff", "#71b4ff", "#75b6ff", "#7ab8ff", "#7ebaff", "#82bdff", "#87bfff", "#8bc1ff", "#8fc4ff", "#94c6ff", "#98c8ff", "#9ccbff", "#a1cdff", "#a5cfff", "#a9d1ff", "#aed4ff", "#b2d6ff", "#b6d8ff", "#bbdbff", "#bfddff", "#c3dfff", "#c8e2ff", "#cce4ff", "#d0e6ff", "#d5e9ff", "#d9ebff", "#ddedff", "#e2efff", "#e6f2ff", "#eaf4ff", "#eff6ff", "#f3f9ff", "#f7fbff", "#fcfdff", "#ffffff"];

var breakMessages = ["have a cup of tea!", "put your feet up!", "take a deep breath!", "ponder infinity…", "enjoy the moment!", "order a pizza?", "say hi to a stranger!", "take a walk around!", "stand up and stretch!", "grab some coffee!", "strike a pose!", "catch up on reading!", "have a brainstorm!", "clean your junk drawer!", "have a daydream!", "share your progress!", "clear your mind!", "meditate!", "just relax!", "find a good playlist!", "rest your eyes!", "stretch your legs!", "think of a joke!", "make a quick call!", "read a listicle!", "have a snack!", "play a quick game!", "consider the universe!", "watch a funny video!", "treat yo self!", "… have a KitKat!", "tweet the world!", "tell someone you love 'em"];

var notificationTitle = {
  "break": "Time for a break",
  "work": "Keep working!",
  "pause": "Timer paused!",
  "resume": "Timer resumed",
  "still_paused": "Still paused"
};
var notificationBody = {
  "break": "_MINS_ left - ",
  "work": "_MINS_ left in this cycle",
  "pause": "Resume soon to keep up your productivity",
  "resume": "_MINS_ paused total.  Back to it!",
  "resume_0m": "Less than a minute paused",
  "still_paused": "_MINS_ paused so far!"
}

var chosenBreakMessage;

var minutesAwayRounded = worktime;
var frontLayer = "2";
var backLayer = "1";
var timerRunning = false;
var isPaused = false;
var pauseNotifyIntervalLast = 0;

/*
  Elements
*/

var timerFab1Element = document.getElementById("timerfab1");
var resetButton1Element = document.getElementById("resetButton1");
var timerFab2Element = document.getElementById("timerfab2");
var resetButton2Element = document.getElementById("resetButton2");
var playPause1Element = document.getElementById("playPause1");
var playPause2Element = document.getElementById("playPause2");
var playPause1IconElement = playPause1Element.firstElementChild;
var playPause2IconElement = playPause2Element.firstElementChild;
var hero1Element = document.getElementById("heroNumber1");
var hero2Element = document.getElementById("heroNumber2");
var moreButton1Element = document.getElementById("moreButton1");
var moreButton2Element = document.getElementById("moreButton2");
var layer1DivElement = document.getElementById("layer1div");
var layer2DivElement = document.getElementById("layer2div");
var breakMessage1Element = document.getElementById("breakMessage1");
var breakMessage2Element = document.getElementById("breakMessage2");


/*
  Event Listeners
*/

// An event listener must be added for both copies of the elements, as there are two.
timerFab1Element.addEventListener("click", startTimer);
resetButton1Element.addEventListener("click", reset);
timerFab2Element.addEventListener("click", startTimer);
resetButton2Element.addEventListener("click", reset);
playPause1Element.addEventListener("click", togglePlayPause);
playPause2Element.addEventListener("click", togglePlayPause);

/*
  Functions
*/

function togglePlayPause() {
  const icon = {'play_arrow': 'pause', 'pause': 'play_arrow'};

  var which = !isPaused ? "pause" : "play_arrow";
  console.log("playPause value: " + which);

  playPause1IconElement.innerHTML = icon[which]
  playPause2IconElement.innerHTML = icon[which]

  if (which == "pause") {
    notify("pause", 0);
    playPause1Element.classList.remove("pulseStart");
    playPause2Element.classList.remove("pulseStart");

    pauseNotifyIntervalLast = 0;
    startPauseTimeStamp = getCurrentTime();
  } else {
    var timeDiff = getCurrentTime() - startPauseTimeStamp;
    notify("resume", Math.floor(timeDiff / minute));
    endTime = endTime + timeDiff;

    playPause1Element.classList.add("pulseStart");
    playPause2Element.classList.add("pulseStart");
  }

  isPaused = !isPaused;
  updatePauseTitle();
}

function startTimer() {
  currentCycle = "work";
  timerRunning = true;

  startNewType();

  setTimeout(function() {
    /* Animate FAB out */
    timerFab1Element.classList.add("hide");
    timerFab2Element.classList.add("hide");
  }, 200);

  resetButton1Element.classList.remove("inactive-element");
  resetButton2Element.classList.remove("inactive-element");

  resetButton1Element.classList.add("active-element");
  resetButton2Element.classList.add("active-element");

  timerFab1Element.classList.add("hide-fab");
  timerFab1Element.classList.remove("show-fab");

  timerFab2Element.classList.add("hide-fab");
  timerFab2Element.classList.remove("show-fab");

  isPaused = false;

  playPause1IconElement.innerHTML = "pause";
  playPause2IconElement.innerHTML = "pause";

  setTimeout(function() {
    playPause1Element.classList.remove("hide-fab");
    playPause2Element.classList.remove("hide-fab");

    playPause1Element.style.zIndex = 1001;
    playPause2Element.style.zIndex = 1001;

    playPause1Element.classList.add("show-fab");
    playPause2Element.classList.add("show-fab");

    setTimeout(function() {
      /* Animate Pulsing Dot in */
      playPause1Element.classList.remove("show-fab");
      playPause2Element.classList.remove("show-fab");

      playPause1Element.classList.add("pulseStart");
      playPause2Element.classList.add("pulseStart");
    }, 1200);
  }, 400);

  var x = setInterval(function() {
    if (!timerRunning) {
      // TODO: Try to animate this down the road
      hero1Element.innerHTML = worktime;
      hero2Element.innerHTML = worktime;

      clearInterval(x);
      return;
    }

    if (isPaused) {
      checkPauseIntervals();
      return;
    }

    getCurrentTime();
    getMinutesAway(currentTime, endTime);
    updateTimer(currentCycle);

    if (timerRunning && (minutesAwayRounded === 0)) {
      switchCycles();
      startNewType();
    }
  }, 10);

}

function switchCycles() {
  currentCycle = currentCycle === "work" ? "break" : "work";
}

function startNewType() {
  setTheme(currentCycle);

  getStartTime();
  getEndTime(currentCycle);
  getCurrentTime();
  getMinutesAway(currentTime, endTime);

  updateTitle(currentCycle);
  notify(currentCycle, minutesAwayRounded);
}

function reset() {
  if (timerRunning !== true) return;

  resetButton1Element.classList.remove("active-element");
  resetButton2Element.classList.remove("active-element");
  resetButton1Element.classList.add("spinit");
  resetButton2Element.classList.add("spinit");


  setTimeout(function() {
    resetButton1Element.classList.remove("spinit");
    resetButton2Element.classList.remove("spinit");
    resetButton1Element.classList.add("inactive-element");
    resetButton2Element.classList.add("inactive-element");
  }, 610);

  timerRunning = false;
  minutesAwayRounded = worktime;

  updateTitle(null);

  timerFab1Element.classList.remove("hide-fab", "hide");
  timerFab2Element.classList.remove("hide-fab", "hide");

  if (!timerFab1Element.classList.contains("show-fab") || !timerFab2Element.classList.contains("show-fab")) {
    timerFab1Element.classList.add("show-fab");
    timerFab2Element.classList.add("show-fab");
  }

  playPause1Element.classList.add("hide-fab");
  playPause2Element.classList.add("hide-fab");
  playPause1Element.classList.remove("pulseStart");
  playPause2Element.classList.remove("pulseStart");

  playPause1Element.style.zIndex = -1;
  playPause2Element.style.zIndex = -1;

  setTheme("work");

  currentCycle = null;
}

function setTheme(cycleType) {
  if (cycleType === "work") {
    breakMessage1Element.style.visibility = "hidden";
    breakMessage2Element.style.visibility = "hidden";
    hero1Element.style.color = "#ffffff";
    resetButton1Element.style.color = "#ffffff";
    moreButton1Element.style.color = "#ffffff";
    hero2Element.style.color = "#ffffff";
    resetButton2Element.style.color = "#ffffff";
    moreButton2Element.style.color = "#ffffff";
    layer2DivElement.style.backgroundColor = "#237aff";
    layer1DivElement.style.backgroundColor = "#237aff";
  }
  if (cycleType === "break") {
    chosenBreakMessage = "Time for a break!" + "<br>" + capitalizeFirstLetter(chooseBreakMessage());
    breakMessage1Element.innerHTML = chosenBreakMessage;
    breakMessage2Element.innerHTML = chosenBreakMessage;
    breakMessage1Element.style.visibility = "visible";
    breakMessage2Element.style.visibility = "visible";
    hero1Element.style.color = "#237aff";
    resetButton1Element.style.color = "#237aff";
    moreButton1Element.style.color = "#237aff";
    hero2Element.style.color = "#237aff";
    resetButton2Element.style.color = "#237aff";
    moreButton2Element.style.color = "#237aff";
    layer2DivElement.style.backgroundColor = "#ffffff";
    layer1DivElement.style.backgroundColor = "#ffffff";
    swipeLayer();
  }
}

function updateTimer(cycleType) {
  hero1Element.innerHTML = minutesAwayRounded;
  hero2Element.innerHTML = minutesAwayRounded;
  // Run notification at 51 mins
  if (placeHolderTime === minutesAwayRounded) return;

  updateTitle(cycleType);

  switch (minutesAwayRounded) {
    case 35:
    case 14:
    case 5:
      notify(cycleType, minutesAwayRounded);
  }

  placeHolderTime = minutesAwayRounded;

  if (cycleType === "work") {
    setMinuteColors(currentCycle);

    if (minutesAwayRounded < worktime) {
      swipeLayer();
    }
  }
}

function getStartTime() {
  startTime = new Date().getTime();
  return startTime;
}

function getCurrentTime() {
  currentTime = new Date().getTime();
  return currentTime;
}

function getEndTime(cycleType) {
  if (cycleType === "work") {
    endTime = new Date(startTime + (worktime * minute)).getTime();
    placeHolderTime = worktime;
  } else if (cycleType === "break") {
    endTime = new Date(startTime + (breaktime * minute)).getTime();
    placeHolderTime = breaktime;
  }
  return endTime;
}

function getMinutesAway(now, finish) {
  minutesAway = (finish - now) / minute;
  minutesAwayRounded = Math.ceil(minutesAway);
  return minutesAwayRounded;
}

function getLayerOrder() {
  var aLayer = layer1DivElement;
  var aLayerProp = window.getComputedStyle(aLayer, null).getPropertyValue("z-index");
  var bLayer = layer2DivElement;
  var bLayerProp = window.getComputedStyle(bLayer, null).getPropertyValue("z-index");
  if (bLayerProp > aLayerProp) {
    console.log("layer2div is in front, at position: " + bLayerProp);
    f = 2;
    r = 1;
  } else if (aLayerProp > bLayerProp) {
    console.log("layer1div is in front, at position: " + aLayerProp);
    f = 1;
    r = 2;
  }
}

function setMinuteColors(cycleType) {
  getLayerOrder();
  (f === 1 ? layer1DivElement : layer2DivElement).style.backgroundColor = workColors[Math.abs(worktime - minutesAwayRounded)];
  (r === 1 ? layer1DivElement : layer2DivElement).style.backgroundColor = workColors[Math.abs(worktime - minutesAwayRounded) + 1];
  if (minutesAwayRounded === 30) {
    hero1Element.style.color = "#237aff";
    hero2Element.style.color = "#237aff";
    resetButton1Element.style.color = "#237aff";
    moreButton1Element.style.color = "#237aff";
    resetButton2Element.style.color = "#237aff";
    moreButton2Element.style.color = "#237aff";

  }
}

function swipeLayer() {
  getLayerOrder();

  if (f === 2) {
    layer2DivElement.classList.add("swipe-background");
    setTimeout(function() {
      layer2DivElement.classList.add("unswipe-background");
    }, 520);
    setTimeout(function() {
      layer2DivElement.style.zIndex = "-2";
      setTimeout(function() {
        layer1DivElement.style.zIndex = "0";
      }, 1);
      setTimeout(function() {
        layer2DivElement.style.zIndex = "-1";
      }, 2);
    }, 512);
    setTimeout(function() {
      layer2DivElement.classList.remove("unswipe-background", "swipe-background");
    }, 1000);
  } else if (f === 1) {
    layer1DivElement.classList.add("swipe-background");
    setTimeout(function() {
      layer1DivElement.classList.add("unswipe-background");
    }, 520);
    setTimeout(function() {
      layer1DivElement.style.zIndex = "-2";
      setTimeout(function() {
        layer2DivElement.style.zIndex = "0";
      }, 1);
      setTimeout(function() {
        layer1DivElement.style.zIndex = "-1";
      }, 2);
    }, 512);
    setTimeout(function() {
      layer1DivElement.classList.remove("unswipe-background", "swipe-background");
    }, 1000);
  }
}

function updateTitle(cycleType) {
  if (cycleType == null) {
    document.title = originalTitle;
  } else {
    document.title = `${minutesAwayRounded}m ${cycleType} remaining - ${originalTitle}`;
  }
}

function updatePauseTitle() {
    if (isPaused) {
        document.title = `[paused] ${document.title}`;
    } else {
      updateTitle(currentCycle);
    }
}

/* Break Message Code */
function chooseBreakMessage() {
  return breakMessages[Math.floor(Math.random() * breakMessages.length)];
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

/*
  Notification code
*/

// request notification permission on page load
document.addEventListener('DOMContentLoaded', function() {
  if (Notification.permission !== "granted") {
    Notification.requestPermission();
  }
});

function checkIfMobile() {
  if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i) || navigator.userAgent.match(/Windows Phone/i)) {
    return true;
  } else {
    return false;
  }
}

function notify(type, minutes) {
  showNotification(type, notificationTitle[type], getNotificationBody(type, minutes))
}

function showNotification(type, title, body) {
  if (!checkIfMobile()) {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    } else {
      var options = {
        icon: 'images/icon.png',
        body: body,
      };
      var notification = new Notification(title, options);
      notification.onclick = function () {
        window.focus();
        notification.close();
      }
    }
  }
}

function getNotificationBody(type, minutes) {
  var body;

  switch (type) {
    case "break":
      body = addMinutes(minutes, notificationBody[type]) + chooseBreakMessage();
      break;
    case "work":
    case "pause":
    case "still_paused":
      body = addMinutes(minutes, notificationBody[type]);
      break;
    case "resume":
      if (minutes == 0) {
        body = notificationBody["resume_0m"]
      } else {
        body = addMinutes(minutes, notificationBody[type]);
      }
  }
  return body;
}

function maybePluralizeMinutes(num) {
    var str = num + " minute";
    if (num != 1) {
        str += "s";
    }
    return str;
}

function addMinutes(num, str) {
    return str.replace("_MINS_", maybePluralizeMinutes(num))
}

function checkPauseIntervals() {
    // Divide the amount of time paused by 5m and round down
    // If this amount is greater than 'notify interval last'
    // Another chunk of 5 mins has gone by and we can notify the user

    var timeDiff = getCurrentTime() - startPauseTimeStamp;
    var pauseChunkOfTime = Math.floor(timeDiff / (pauseNotifyMinutesInterval * minute));
    if (pauseChunkOfTime > pauseNotifyIntervalLast && pauseChunkOfTime > 0) {
        pauseNotifyIntervalLast = pauseChunkOfTime;
        notify("still_paused", pauseChunkOfTime * pauseNotifyMinutesInterval);
    }
}
