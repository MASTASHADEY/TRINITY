const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");

startButton.addEventListener("click", () => {
    startMenu.classList.toggle("open");
});

document.addEventListener("click", (event) => {
    if (
        !startMenu.contains(event.target) &&
        !startButton.contains(event.target)
    ) {
        startMenu.classList.remove("open");
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