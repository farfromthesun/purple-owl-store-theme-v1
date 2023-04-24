import "./styles/main.scss";

("use strict");

const bodyWidth = document.querySelector("body").offsetWidth;

function toggleMobileNav(button, action) {
  document.querySelector(button).addEventListener("click", function (e) {
    e.preventDefault();

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

if (bodyWidth <= 1200) {
  toggleMobileNav(".mobile-nav-trigger", "add");
  toggleMobileNav(".nav-mobile-close", "remove");
}

function headerOnScroll() {
  const _body = document.querySelector("body");

  document.addEventListener("scroll", function () {
    if (window.scrollY > _body.offsetTop) {
      _body.classList.add("scrolled");
    } else {
      _body.classList.remove("scrolled");
    }
  });
}

headerOnScroll();

// fix js:
// - add scrolled class to body (if appropriate) after reload, not only on scroll
// - add padding-top to body based on header size
