import "./styles/main.scss";

("use strict");

function toggleMobileNav(button, action) {
  document.querySelector(button).addEventListener("click", function () {
    switch (action) {
      case "add":
        document.querySelector(".nav-mobile-container").classList.add("show");
        break;
      case "remove":
        document
          .querySelector(".nav-mobile-container")
          .classList.remove("show");
        break;
    }
  });
}

toggleMobileNav(".mobile-nav-trigger", "add");
toggleMobileNav(".nav-mobile__close", "remove");
