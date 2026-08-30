const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");

const desktopWindow = document.getElementById("desktopWindow");
const desktopWindowTitlebar = document.getElementById("desktopWindowTitlebar");
const desktopWindowTitle = document.getElementById("desktopWindowTitle");
const desktopWindowContent = document.getElementById("desktopWindowContent");

const windowMinimize = document.getElementById("windowMinimize");
const windowMaximize = document.getElementById("windowMaximize");
const windowClose = document.getElementById("windowClose");

const taskButton = document.querySelector(".task-button");
const startMenuItems = document.querySelectorAll(".start-menu-item");

/* ---------------------------------
   START MENU
--------------------------------- */

function setStartMenu(open) {
    startMenu.classList.toggle("open", open);
    startButton.classList.toggle("pressed", open);
}

startButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = startMenu.classList.contains("open");

    setStartMenu(!isOpen);
});

document.addEventListener("click", (event) => {
    if (
        !startMenu.contains(event.target) &&
        !startButton.contains(event.target)
    ) {
        setStartMenu(false);
    }
});

/* ---------------------------------
   WINDOW CONTENT
--------------------------------- */

const windowPages = {
    projects: {
        title: "TRINITY - PROJECTS",
        heading: "PROJECTS",
        text: "COMING SOON"
    },

    radio: {
        title: "TRINITY - RADIO",
        heading: "RADIO",
        text: "COMING SOON"
    },

    tests: {
        title: "TRINITY - TESTS",
        heading: "TESTS",
        text: "COMING SOON"
    },

    about: {
        title: "TRINITY - ABOUT",
        heading: "ABOUT",
        text: "COMING SOON"
    },

    members: {
        title: "TRINITY - MEMBERS ONLY",
        heading: "MEMBERS ONLY",
        text: "COMING SOON"
    }
};

/* Start with the window closed */

desktopWindow.style.display = "none";

/* ---------------------------------
   OPEN WINDOW FROM START MENU
--------------------------------- */

startMenuItems.forEach((item) => {
    item.addEventListener("click", () => {
        const pageName = item.dataset.window;
        const page = windowPages[pageName];

        if (!page) {
            return;
        }

        desktopWindowTitle.textContent = page.title;

        desktopWindowContent.innerHTML = `
            <h2>${page.heading}</h2>
            <p>${page.text}</p>
        `;

        desktopWindow.style.display = "flex";

        taskButton.classList.add("active");

        setStartMenu(false);
    });
});

/* ---------------------------------
   CLOSE WINDOW
--------------------------------- */

windowClose.addEventListener("click", () => {
    desktopWindow.style.display = "none";

    taskButton.classList.remove("active");
});

/* ---------------------------------
   MINIMIZE WINDOW
--------------------------------- */

windowMinimize.addEventListener("click", () => {
    desktopWindow.style.display = "none";

    taskButton.classList.remove("active");
});

/* Clicking TRINITY on the taskbar
   restores/minimizes the window */

taskButton.addEventListener("click", () => {
    const isVisible = desktopWindow.style.display !== "none";

    if (isVisible) {
        desktopWindow.style.display = "none";
        taskButton.classList.remove("active");
    } else {
        desktopWindow.style.display = "flex";
        taskButton.classList.add("active");
    }
});

/* ---------------------------------
   MAXIMIZE / RESTORE WINDOW
--------------------------------- */

let maximized = false;

let previousWindowState = {};

windowMaximize.addEventListener("click", () => {
    if (!maximized) {
        previousWindowState = {
            left: desktopWindow.style.left,
            top: desktopWindow.style.top,
            width: desktopWindow.style.width,
            height: desktopWindow.style.height,
            transform: desktopWindow.style.transform
        };

        desktopWindow.style.position = "fixed";
        desktopWindow.style.left = "0";
        desktopWindow.style.top = "0";
        desktopWindow.style.width = "100vw";
        desktopWindow.style.height = "calc(100vh - 34px)";
        desktopWindow.style.transform = "none";

        maximized = true;
    } else {
        desktopWindow.style.position = "absolute";

        desktopWindow.style.left =
            previousWindowState.left || "50%";

        desktopWindow.style.top =
            previousWindowState.top || "50%";

        desktopWindow.style.width =
            previousWindowState.width || "420px";

        desktopWindow.style.height =
            previousWindowState.height || "320px";

        desktopWindow.style.transform =
            previousWindowState.transform ||
            "translate(-50%, -50%)";

        maximized = false;
    }
});

/* ---------------------------------
   DRAG WINDOW
--------------------------------- */

let dragging = false;

let dragOffsetX = 0;
let dragOffsetY = 0;

desktopWindowTitlebar.addEventListener("pointerdown", (event) => {
    if (maximized) {
        return;
    }

    if (event.target.closest(".desktop-window-control")) {
        return;
    }

    dragging = true;

    const rect = desktopWindow.getBoundingClientRect();

    dragOffsetX = event.clientX - rect.left;
    dragOffsetY = event.clientY - rect.top;

    desktopWindow.style.transform = "none";

    desktopWindow.style.left = `${rect.left}px`;
    desktopWindow.style.top = `${rect.top}px`;

    desktopWindowTitlebar.setPointerCapture(event.pointerId);
});

desktopWindowTitlebar.addEventListener("pointermove", (event) => {
    if (!dragging) {
        return;
    }

    const windowRect = desktopWindow.getBoundingClientRect();

    let newLeft = event.clientX - dragOffsetX;
    let newTop = event.clientY - dragOffsetY;

    const maxLeft =
        window.innerWidth - windowRect.width;

    const maxTop =
        window.innerHeight - 34 - windowRect.height;

    newLeft = Math.max(
        0,
        Math.min(newLeft, maxLeft)
    );

    newTop = Math.max(
        0,
        Math.min(newTop, maxTop)
    );

    desktopWindow.style.left = `${newLeft}px`;
    desktopWindow.style.top = `${newTop}px`;
});

desktopWindowTitlebar.addEventListener("pointerup", (event) => {
    dragging = false;

    desktopWindowTitlebar.releasePointerCapture(
        event.pointerId
    );
});

/* ---------------------------------
   CLOCK
--------------------------------- */

function updateClock() {
    const clock = document.getElementById("taskbarClock");

    if (!clock) {
        return;
    }

    const now = new Date();

    clock.textContent = now.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit"
    });
}

updateClock();

setInterval(updateClock, 1000);