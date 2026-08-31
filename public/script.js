/* =========================================================
   TRINITY DESKTOP
   Windows 98 / Windows 2000 style window manager
   ========================================================= */


/* =========================================================
   MAIN ELEMENTS
   ========================================================= */

const startButton = document.getElementById("startButton");
const startMenu = document.getElementById("startMenu");

const desktop = document.getElementById("desktop");

const taskbarApps = document.getElementById("taskbarApps");

const trinityTaskButton =
    document.getElementById("trinityTaskButton");

const startMenuItems =
    document.querySelectorAll(".start-menu-item");


/* =========================================================
   REMOVE OLD TEST WINDOW
   ========================================================= */

/*
    The HTML currently contains our old PROJECTS test window.

    We remove it because from this point onward JavaScript
    creates each application window independently.
*/

const oldTestWindow =
    document.getElementById("desktopWindow");

if (oldTestWindow) {
    oldTestWindow.remove();
}


/* =========================================================
   WINDOW DEFINITIONS
   ========================================================= */

const windowPages = {

    projects: {
        title: "TRINITY - PROJECTS",
        taskbarTitle: "Projects",
        heading: "PROJECTS",
        text: "COMING SOON"
    },

    radio: {
        title: "TRINITY - RADIO",
        taskbarTitle: "Radio",
        heading: "RADIO",
        text: "COMING SOON"
    },

    tests: {
        title: "TRINITY - TESTS",
        taskbarTitle: "Tests",
        heading: "TESTS",
        text: "COMING SOON"
    },

    about: {
        title: "TRINITY - ABOUT",
        taskbarTitle: "About",
        heading: "ABOUT",
        text: "COMING SOON"
    },

    members: {
        title: "TRINITY - MEMBERS ONLY",
        taskbarTitle: "Members Only",
        heading: "MEMBERS ONLY",
        text: "COMING SOON"
    }

};


/* =========================================================
   WINDOW STATE
   ========================================================= */

/*
    Stores every currently open application.

    Example:

    openWindows.get("projects")
*/

const openWindows = new Map();


/*
    Controls stacking order.

    Every time a window receives focus,
    it gets a higher z-index.
*/

let highestZIndex = 500;


/*
    Used to stagger newly opened windows,
    similar to classic Windows.
*/

let windowCascade = 0;


/* =========================================================
   START MENU
   ========================================================= */

function setStartMenu(open) {

    startMenu.classList.toggle("open", open);

    startButton.classList.toggle("pressed", open);

}


startButton.addEventListener("click", (event) => {

    event.stopPropagation();

    const isOpen =
        startMenu.classList.contains("open");

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


/* =========================================================
   CREATE WINDOW
   ========================================================= */

function createWindow(pageName) {

    const page = windowPages[pageName];

    if (!page) {
        return;
    }


    /*
        If this application is already open,
        do NOT create another copy.

        Restore it and bring it to the front.
    */

    if (openWindows.has(pageName)) {

        const existing =
            openWindows.get(pageName);

        restoreWindow(existing);

        focusWindow(existing);

        return;

    }


    /* -----------------------------------------------------
       CREATE WINDOW ELEMENT
       ----------------------------------------------------- */

    const windowElement =
        document.createElement("div");

    windowElement.className =
        "window trinity-window";

    windowElement.dataset.window =
        pageName;


    /*
        Cascading initial placement.

        Each new window appears slightly farther
        down/right than the previous one.
    */

    const offset =
        windowCascade * 28;

    const startLeft =
        Math.max(
            20,
            (window.innerWidth / 2) -
            210 +
            offset
        );

    const startTop =
        Math.max(
            70,
            (window.innerHeight / 2) -
            160 +
            offset
        );


    windowElement.style.left =
        `${startLeft}px`;

    windowElement.style.top =
        `${startTop}px`;

    windowElement.style.transform =
        "none";


    windowCascade++;

    if (windowCascade > 6) {
        windowCascade = 0;
    }


    /* -----------------------------------------------------
       WINDOWS 98 MARKUP
       ----------------------------------------------------- */

    windowElement.innerHTML = `

        <div class="title-bar">

            <div class="title-bar-text">
                ${page.title}
            </div>

            <div class="title-bar-controls">

                <button
                    type="button"
                    aria-label="Minimize"
                    data-action="minimize"
                ></button>

                <button
                    type="button"
                    aria-label="Maximize"
                    data-action="maximize"
                ></button>

                <button
                    type="button"
                    aria-label="Close"
                    data-action="close"
                ></button>

            </div>

        </div>


        <div class="window-body trinity-window-body">

            <h2>
                ${page.heading}
            </h2>

            <p>
                ${page.text}
            </p>

        </div>

    `;


    desktop.appendChild(windowElement);


    /* -----------------------------------------------------
       CREATE TASKBAR BUTTON
       ----------------------------------------------------- */

    const taskbarButton =
        document.createElement("button");

    taskbarButton.className =
        "win-button taskbar-app-button";

    taskbarButton.dataset.window =
        pageName;


    taskbarButton.innerHTML = `

        <img
            class="task-icon-img"
            src="assets/trinity-logo.png"
            alt=""
            width="16"
            height="16"
        />

        <span>
            ${page.taskbarTitle}
        </span>

    `;


    taskbarApps.appendChild(taskbarButton);


    /* -----------------------------------------------------
       SAVE WINDOW STATE
       ----------------------------------------------------- */

    const windowState = {

        name: pageName,

        element: windowElement,

        taskbarButton: taskbarButton,

        minimized: false,

        maximized: false,

        restoreState: null

    };


    openWindows.set(
        pageName,
        windowState
    );


    /* -----------------------------------------------------
       INITIALIZE WINDOW
       ----------------------------------------------------- */

    setupWindowControls(windowState);

    setupWindowDragging(windowState);

    setupWindowFocus(windowState);

    setupTaskbarButton(windowState);


    focusWindow(windowState);

}


/* =========================================================
   START MENU APPLICATIONS
   ========================================================= */

startMenuItems.forEach((item) => {

    item.addEventListener("click", () => {

        const pageName =
            item.dataset.window;

        setStartMenu(false);

        createWindow(pageName);

    });

});


/* =========================================================
   WINDOW FOCUS
   ========================================================= */

function focusWindow(windowState) {

    /*
        Remove active state from all windows.
    */

    openWindows.forEach((state) => {

        state.element.classList.remove("active");

        state.taskbarButton.classList.remove("active");

    });


    /*
        Increase stacking order.
    */

    highestZIndex++;

    windowState.element.style.zIndex =
        highestZIndex;


    /*
        Active window receives the blue gradient
        from style.css.
    */

    windowState.element.classList.add("active");

    windowState.taskbarButton.classList.add("active");

}


/* =========================================================
   CLICK WINDOW TO FOCUS
   ========================================================= */

function setupWindowFocus(windowState) {

    windowState.element.addEventListener(
        "pointerdown",
        () => {

            if (!windowState.minimized) {

                focusWindow(windowState);

            }

        }
    );

}


/* =========================================================
   WINDOW CONTROLS
   ========================================================= */

function setupWindowControls(windowState) {

    const windowElement =
        windowState.element;


    const minimizeButton =
        windowElement.querySelector(
            '[data-action="minimize"]'
        );


    const maximizeButton =
        windowElement.querySelector(
            '[data-action="maximize"]'
        );


    const closeButton =
        windowElement.querySelector(
            '[data-action="close"]'
        );


    /* MINIMIZE */

    minimizeButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            minimizeWindow(windowState);

        }
    );


    /* MAXIMIZE / RESTORE */

    maximizeButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            toggleMaximize(windowState);

        }
    );


    /* CLOSE */

    closeButton.addEventListener(
        "click",
        (event) => {

            event.stopPropagation();

            closeWindow(windowState);

        }
    );

}


/* =========================================================
   MINIMIZE
   ========================================================= */

function minimizeWindow(windowState) {

    windowState.minimized = true;

    windowState.element.style.display =
        "none";

    windowState.element.classList.remove(
        "active"
    );

    windowState.taskbarButton.classList.remove(
        "active"
    );

}


/* =========================================================
   RESTORE FROM TASKBAR
   ========================================================= */

function restoreWindow(windowState) {

    if (!windowState.minimized) {
        return;
    }

    windowState.minimized = false;

    windowState.element.style.display =
        "flex";

}


/* =========================================================
   CLOSE WINDOW
   ========================================================= */

function closeWindow(windowState) {

    windowState.element.remove();

    windowState.taskbarButton.remove();

    openWindows.delete(
        windowState.name
    );

}


/* =========================================================
   MAXIMIZE / RESTORE
   ========================================================= */

function toggleMaximize(windowState) {

    const windowElement =
        windowState.element;


    const maximizeButton =
        windowElement.querySelector(
            '[data-action="maximize"], [data-action="restore"]'
        );


    /* -----------------------------------------------------
       MAXIMIZE
       ----------------------------------------------------- */

    if (!windowState.maximized) {

        const rect =
            windowElement.getBoundingClientRect();


        windowState.restoreState = {

            left: rect.left,

            top: rect.top,

            width: rect.width,

            height: rect.height

        };


        windowElement.style.position =
            "fixed";

        windowElement.style.left =
            "0px";

        windowElement.style.top =
            "0px";

        windowElement.style.width =
            "100vw";

        windowElement.style.height =
            "calc(100vh - 34px)";

        windowElement.style.transform =
            "none";


        /*
            Native resize handle should disappear
            while maximized.
        */

        windowElement.style.resize =
            "none";


        /*
            Change the actual 98.css caption glyph
            from Maximize to Restore.
        */

        maximizeButton.setAttribute(
            "aria-label",
            "Restore"
        );

        maximizeButton.dataset.action =
            "restore";


        windowState.maximized = true;


        focusWindow(windowState);

        return;

    }


    /* -----------------------------------------------------
       RESTORE
       ----------------------------------------------------- */

    const previous =
        windowState.restoreState;


    windowElement.style.position =
        "absolute";

    windowElement.style.left =
        `${previous.left}px`;

    windowElement.style.top =
        `${previous.top}px`;

    windowElement.style.width =
        `${previous.width}px`;

    windowElement.style.height =
        `${previous.height}px`;

    windowElement.style.transform =
        "none";

    windowElement.style.resize =
        "both";


    /*
        Switch the 98.css icon back to Maximize.
    */

    maximizeButton.setAttribute(
        "aria-label",
        "Maximize"
    );

    maximizeButton.dataset.action =
        "maximize";


    windowState.maximized = false;


    focusWindow(windowState);

}


/* =========================================================
   TASKBAR APPLICATION BUTTON
   ========================================================= */

function setupTaskbarButton(windowState) {

    windowState.taskbarButton.addEventListener(
        "click",
        () => {

            /*
                If minimized, restore it.
            */

            if (windowState.minimized) {

                restoreWindow(windowState);

                focusWindow(windowState);

                return;

            }


            /*
                If this is already the active window,
                clicking its taskbar button minimizes it.
            */

            if (
                windowState.element.classList.contains(
                    "active"
                )
            ) {

                minimizeWindow(windowState);

                return;

            }


            /*
                Otherwise bring it to the front.
            */

            focusWindow(windowState);

        }
    );

}


/* =========================================================
   DRAG WINDOWS
   ========================================================= */

function setupWindowDragging(windowState) {

    const windowElement =
        windowState.element;


    const titleBar =
        windowElement.querySelector(
            ".title-bar"
        );


    let dragging = false;

    let dragOffsetX = 0;

    let dragOffsetY = 0;


    titleBar.addEventListener(
        "pointerdown",
        (event) => {

            /*
                Don't drag maximized windows.
            */

            if (windowState.maximized) {
                return;
            }


            /*
                Clicking a caption control must not
                begin dragging the window.
            */

            if (
                event.target.closest(
                    ".title-bar-controls"
                )
            ) {

                return;

            }


            dragging = true;


            focusWindow(windowState);


            const rect =
                windowElement.getBoundingClientRect();


            dragOffsetX =
                event.clientX -
                rect.left;


            dragOffsetY =
                event.clientY -
                rect.top;


            windowElement.style.left =
                `${rect.left}px`;

            windowElement.style.top =
                `${rect.top}px`;

            windowElement.style.transform =
                "none";


            titleBar.setPointerCapture(
                event.pointerId
            );

        }
    );


    titleBar.addEventListener(
        "pointermove",
        (event) => {

            if (!dragging) {
                return;
            }


            const rect =
                windowElement.getBoundingClientRect();


            let newLeft =
                event.clientX -
                dragOffsetX;


            let newTop =
                event.clientY -
                dragOffsetY;


            /*
                Prevent window from being dragged
                completely outside the desktop.
            */

            const maxLeft =
                window.innerWidth -
                rect.width;


            const maxTop =
                window.innerHeight -
                34 -
                rect.height;


            newLeft =
                Math.max(
                    0,
                    Math.min(
                        newLeft,
                        Math.max(
                            0,
                            maxLeft
                        )
                    )
                );


            newTop =
                Math.max(
                    0,
                    Math.min(
                        newTop,
                        Math.max(
                            0,
                            maxTop
                        )
                    )
                );


            windowElement.style.left =
                `${newLeft}px`;


            windowElement.style.top =
                `${newTop}px`;

        }
    );


    titleBar.addEventListener(
        "pointerup",
        (event) => {

            if (!dragging) {
                return;
            }


            dragging = false;


            if (
                titleBar.hasPointerCapture(
                    event.pointerId
                )
            ) {

                titleBar.releasePointerCapture(
                    event.pointerId
                );

            }

        }
    );


    titleBar.addEventListener(
        "pointercancel",
        () => {

            dragging = false;

        }
    );

}


/* =========================================================
   PERMANENT TRINITY TASKBAR BUTTON
   ========================================================= */

/*
    For now the permanent TRINITY button simply
    represents the desktop itself.

    Later this can become its own application/window.
*/

trinityTaskButton.addEventListener(
    "click",
    () => {

        /*
            Remove focus from application windows.
        */

        openWindows.forEach((state) => {

            state.element.classList.remove(
                "active"
            );

            state.taskbarButton.classList.remove(
                "active"
            );

        });


        trinityTaskButton.classList.add(
            "active"
        );

    }
);


/* =========================================================
   CLOCK
   ========================================================= */

function updateClock() {

    const clock =
        document.getElementById(
            "taskbarClock"
        );


    if (!clock) {
        return;
    }


    const now =
        new Date();


    clock.textContent =
        now.toLocaleTimeString(
            [],
            {
                hour: "numeric",
                minute: "2-digit"
            }
        );

}


updateClock();

setInterval(
    updateClock,
    1000
);