let maxState;

function rightClickMenu() {
    // Custom context menu

    const menuEl = document.querySelector("div.contextmenu");
    document.addEventListener("contextmenu", (event) => {
        event.preventDefault();
        menuEl.style.display = "flex";
        menuEl.style.top = event.pageY + "px";
        menuEl.style.left = event.pageX + "px";
        let menuRect = menuEl.getBoundingClientRect();
        let bottomEdge = window.innerHeight - menuRect.height;
        if (event.pageY > bottomEdge) {
            menuEl.style.top = (bottomEdge - 5) + "px";
        }
        let rightEdge = window.innerWidth - menuRect.width;
        if (event.pageX > rightEdge) {
            menuEl.style.left = (rightEdge - 5) + "px";
        }
    
        let isTextSelected = window.getSelection().toString() !== "";
        let isTextAreaOrInput = event.target.tagName === "TEXTAREA" || (event.target.tagName === "INPUT" && event.target.type === "text");
        if (isTextSelected || isTextAreaOrInput) {
            handleContextmenu(1);
        } else {
            handleContextmenu(0);
        }
    })
    
    document.addEventListener("click", (event) => {
        if (!event.target.closest("div.contextmenu")) {
            menuEl.style.display = "none";
        }
    })

    function handleContextmenu(text) {
        // Handling selections for the context menu

        document.querySelector("div.contextmenu p.back").addEventListener("click", () => {
            history.back();
        })
        document.querySelector("div.contextmenu p.forward").addEventListener("click", () => {
            history.forward();
        })
        document.querySelector("div.contextmenu p.Reload").addEventListener("click", () => {
            location.reload();
        })
        document.querySelector("div.contextmenu p.page-address").addEventListener("click", () => {
            navigator.clipboard.writeText(window.location.href);
            menuEl.style.display = "none";
        })
    
        if (text == 1) {
            document.querySelector("div.contextmenu div.section.text").style.display = "flex";
            document.querySelector("div.contextmenu p.cut").addEventListener("click", () => {
                document.execCommand("cut");
                menuEl.style.display = "none";
            })
            document.querySelector("div.contextmenu p.copy").addEventListener("click", () => {
                document.execCommand("copy");
                menuEl.style.display = "none";
            })
            document.querySelector("div.contextmenu p.paste").addEventListener("click", () => {
                document.execCommand("paste");
                menuEl.style.display = "none";
            })
        } else {
            document.querySelector("div.contextmenu div.section.text").style.display = "none";
        }
    }
}

// rightClickMenu();

function nameplateBackground() {
    // Random nameplate background

    let totalSVGs = 3;
    let randomSVG = Math.floor(Math.random() * totalSVGs) + 1;
    let nameplateEl = document.querySelector("section.nameplate");
    nameplateEl.style.backgroundImage = `url(https://raw.githubusercontent.com/austinkden/r/refs/heads/main/img/s/me/blob${randomSVG}.svg)`;
}

nameplateBackground();

function globalInputs() {
    // Changes things about ALL inputs

    const inputs = document.querySelectorAll("input, textarea");

    inputs.forEach(input => {
        input.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                input.scrollLeft += e.deltaY;
            }
        });

        input.setAttribute('spellcheck', 'false');
        input.setAttribute('autocorrect', 'off');
        input.setAttribute('autocomplete', 'off');
    });
}

globalInputs();

function ignoreClicks() {
    // Ignore clicks for certain things

    const listToIgnore = document.querySelectorAll("p.enter-hint");
    listToIgnore.forEach(item => {
        item.addEventListener("click", (event) => {
            event.preventDefault();
            event.stopPropagation();
        })
    })
}

ignoreClicks();

function homeSearch() {
    // Handles search of the site

    const searchInput = document.querySelector("div.search input");
    const searchBar = document.querySelector("div.search");

    searchBar.addEventListener("click", () => {
        searchBar.classList.add("focused");
        searchInput.focus();

        document.addEventListener("click", (event) => {
            if (!event.target.closest("div.search")) {
                searchBar.classList.remove("focused");
                searchInput.blur();
            }
        })
    })

    searchBar.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            doSearch();
        } else if (event.key === "Escape") {
            searchBar.classList.remove("focused");
            searchInput.blur();
        }
    })

    searchBar.querySelector("p.enter-hint").addEventListener("click", () => {
        doSearch();
    })

    searchInput.addEventListener("input", () => {
        if (searchInput.value.length > 29) {
            document.querySelector("div.search p.enter-hint").classList.add("hide");
        } else {
            document.querySelector("div.search p.enter-hint").classList.remove("hide");
        }
    })

    function doSearch() {
        let searchQuery = searchInput.value;
        let contentItems = document.querySelectorAll("section.panel div.content");

        if (searchQuery.length < 1) {
            contentItems.forEach(item => {
                let currentSearchedTitle = item.classList[1];
                let changingItem = document.querySelector(`section.home div.list div.item.${currentSearchedTitle}`);
                if (changingItem) {
                    changingItem.style.display = "flex";
                }
            });
            return;
        }

        contentItems.forEach(item => {
            let currentSearchedTitle = item.classList[1];
            console.log(currentSearchedTitle);
            console.log(document.querySelector(`section.home div.list div.item.${currentSearchedTitle}`));
            if (item.innerHTML.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0) {
                let changingItem = document.querySelector(`section.home div.list div.item.${currentSearchedTitle}`);
                if (changingItem) {
                    changingItem.style.display = "flex";
                }
            } else if (searchQuery.length > 0) {
                let changingItem = document.querySelector(`section.home div.list div.item.${currentSearchedTitle}`);
                if (changingItem) {
                    changingItem.style.display = "none";
                }
            }
        });
        // let contentItems = document.querySelectorAll("section.panel div.content");
        // contentItems.forEach(item => {
        //     if (item.innerHTML.toLowerCase().includes(searchQuery.toLowerCase()) && searchQuery.length > 0) {
        //         item.style.display = "flex";
        //     } else if (searchQuery.length > 0) {
        //         item.style.display = "none";
        //     }
        // });
    }
}

homeSearch();

function pages() {
    // Opening the pages

    const listItems = document.querySelectorAll("section.home div.list div.item");
    listItems.forEach(item => {
        item.addEventListener("click", (event) => {
            let pageName = item.querySelector("p").innerHTML;
            console.log(pageName);

            document.querySelectorAll("section.panel div.content").forEach(content => {
                console.log(content.classList.contains(pageName));
                if (!content.classList.contains(pageName)) {
                    content.style.display = "none";
                }
            })

            if (event.shiftKey) {
                // Maximize immediately
            } else {
                content("min");
            }

            if (pageName) {
                document.querySelector("section.panel div.bar p.path").innerHTML = pageName;
                document.querySelector(`section.panel div.content.${pageName}`).style.display = "flex";
            } else {
                document.querySelector("section.panel div.bar p.path").innerHTML = "error";
            }
        })
    })

    const maxButton = document.querySelector("section.panel div.bar div.actions i.maximize");
    const closeButton = document.querySelector("section.panel div.bar div.actions i.close");
    maxButton.addEventListener("click", () => {
        if (maxState == "min") {
            content("max");
        } else if (maxState == "max") {
            content("min");
        }
    })

    closeButton.addEventListener("click", () => {
        content("close")
    })
}

pages();

function content(mod) {
    // Hides, minimizes, maximizes, or shows the content

    console.log(mod, maxState);
    let panel = document.querySelector("section.panel");
    let homePg = document.querySelector("section.home");

    if (mod == "min") {
        console.log("MINIMIZING >>>");
        panel.classList.add("open");
        panel.classList.remove("maximized");
        maxState = "min";
        homePg.style.display = "flex";
        setTimeout(() => {
            homePg.classList.remove("hidden");
        }, 1);
    } else if (mod == "max") {
        console.log("MAXIMIZING >>>");
        panel.classList.add("open", "maximized");
        homePg.classList.add("hidden");
        maxState = "max";
        setTimeout(() => {
            homePg.style.display = "none";
        }, 300);
    } else if (mod == "close") {
        console.log("CLOSING >>>");
        document.querySelectorAll("section.panel div.content").forEach(content => {
            setTimeout(() => {
                content.style.display = "none";
            }, 200);
        })
        panel.classList.remove("open", "maximized");
        homePg.style.display = "flex";
        setTimeout(() => {
            homePg.classList.remove("hidden");
        }, 1);
        maxState = "closed";
    }
}

function openPortfolioPages() {
    // Open pages from the portfolio section

    const cards = document.querySelectorAll("section.panel div.content.portfolio div.card");
    let openerList = {
        "tasivi": "https://austinkden.github.io/projects/personal/tasivi",
        "mvhs schedule tracker": "https://csmvhs.github.io/schedule",
        "sigma": "https://austinkden.github.io/projects/school/apcsp/sigma-chatbot",
        "starter": "https://github.com/austinkden/starter"
    }

    cards.forEach(cd => {
        cd.addEventListener("click", () => {
            let titleInner = cd.querySelector("p.title").innerHTML;
            window.open(openerList[titleInner], titleInner === "tasivi" ? "_self" : "_blank");
        })
    })
}

openPortfolioPages();
