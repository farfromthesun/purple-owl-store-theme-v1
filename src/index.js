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

function sortProducts() {
  const _selectSortBy = document.querySelector("#sort-by-select");

  if (_selectSortBy) {
    Shopify.queryParams = {};

    // if any parameters are already provided - preserve them
    if (location.search.length) {
      const existingParamsArray = location.search.substring(1).split("&");

      for (let i = 0; i < existingParamsArray.length; i++) {
        const existingParamKeyAndValueArray = existingParamsArray[i].split("=");

        Shopify.queryParams[existingParamKeyAndValueArray[0]] =
          existingParamKeyAndValueArray[1];
      }
    }

    _selectSortBy.addEventListener("change", function (e) {
      Shopify.queryParams.sort_by = e.target.value;
      location.search = new URLSearchParams(Shopify.queryParams).toString();
    });
  }
}

async function fetchShopifySections(url) {
  const response = await fetch(url);
  const responseText = await response.text();
  return responseText;
}

async function renderShopifySections(sections) {
  let urlParams = location.search.substring(1);
  urlParams !== "" && (urlParams = "&" + urlParams);
  const url = `${window.location.pathname}?sections=${sections}${urlParams}`;

  const fetchResponse = await fetchShopifySections(url);
  console.log("fetchResponse ", fetchResponse);
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
  sortProducts();
  indexHeroHeight();

  renderShopifySections("template--18682269630773__products-grid");

  bodyPaddingTop();
  addBodyScrolled();
  onScroll();
}

init();
