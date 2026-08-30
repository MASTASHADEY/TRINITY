const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");

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
    if (!startMenu.contains(event.target)) {
        setStartMenu(false);
    }
});

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