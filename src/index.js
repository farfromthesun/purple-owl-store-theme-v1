import "./styles/main.scss";

("use strict");

const _body = document.querySelector("body");
const _mainHeader = document.querySelector(".main-header");
const bodyWidth = _body.offsetWidth;
const mainHeaderheight = _mainHeader.offsetHeight;

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

function addBodyScrolled() {
  if (window.scrollY > _body.offsetTop + mainHeaderheight) {
    _body.classList.add("scrolled");
  } else {
    _body.classList.remove("scrolled");
  }
}

function bodyPaddingTop() {
  _body.style.paddingTop = mainHeaderheight + "px";
}

function indexHeroHeight() {
  if (bodyWidth > 1200 && _body.dataset.template.includes("index")) {
    document.querySelector(".index-hero .hero-inner").style.height =
      "calc(100vh - " + mainHeaderheight + "px)";
  }
}

function onScroll() {
  document.addEventListener("scroll", function () {
    addBodyScrolled();
  });
}

function init() {
  if (bodyWidth <= 1200) {
    toggleMobileNav(".mobile-nav-trigger", "add");
    toggleMobileNav(".nav-mobile-close", "remove");
  }
  indexHeroHeight();
  bodyPaddingTop();
  addBodyScrolled();
  onScroll();
}

init();

// fix js:
// - add padding-top to body based on header size
