import "./styles/main.scss";

("use strict");

const _body = document.querySelector("body");
const _mainHeader = document.querySelector(".main-header");
const bodyWidth = _body.offsetWidth;
const mainHeaderheight = _mainHeader.offsetHeight;
const _selectSortBy = document.querySelector("#sort-by-select");

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

// LEGACY FUNCTION THAT WORKS, BUT IS WAY UGLIER AND MESSIER THAN THE ONE CURRENTLY IN USE
// function sortProducts() {
//   if (_selectSortBy) {
//     Shopify.queryParamsArray = [];
//     let sortByFlag = false;

//     // if any parameters are already provided - preserve them
//     if (location.search.length) {
//       const existingParamsArray = location.search.substring(1).split("&");

//       for (let i = 0; i < existingParamsArray.length; i++) {
//         const existingParamKeyAndValueArray = existingParamsArray[i].split("=");

//         Shopify.queryParamsArray[i] = [
//           existingParamKeyAndValueArray[0] + "=",
//           existingParamKeyAndValueArray[1] +
//             `${i < existingParamsArray.length - 1 ? "&" : ""}`,
//         ];
//       }
//     }

//     _selectSortBy.addEventListener("change", function (e) {
//       // Shopify.queryParams.sort_by = e.target.value;

//       if (Shopify.queryParamsArray.length > 0) {
//         for (let i = 0; i < Shopify.queryParamsArray.length; i++) {
//           if (Shopify.queryParamsArray[i][0].includes("sort_by")) {
//             Shopify.queryParamsArray[i][1] =
//               e.target.value +
//               `${i < Shopify.queryParamsArray.length - 1 ? "&" : ""}`;
//             sortByFlag = true;
//           }
//         }
//         if (sortByFlag === true) {
//           location.search = new URLSearchParams(
//             Shopify.queryParamsArray.toString().replaceAll(",", "")
//           );
//         } else {
//           location.search = new URLSearchParams(
//             "sort_by=" +
//               e.target.value +
//               "&" +
//               Shopify.queryParamsArray.toString().replaceAll(",", "")
//           );
//         }
//       } else {
//         location.search = new URLSearchParams("sort_by=" + e.target.value);
//       }
//     });
//   }
// }

async function fetchShopifySection(url) {
  const response = await fetch(url);
  const responseText = await response.json();
  return responseText;
}

async function renderShopifySections(sections, urlParams) {
  const sectionsIds = sections.split(",");
  let shopifySectionsIdsArray = [];
  for (const sectionId of sectionsIds) {
    shopifySectionsIdsArray.push(
      document.getElementById(sectionId).dataset.sectionid
    );
  }
  const shopifySectionsIds = shopifySectionsIdsArray.join();
  urlParams === undefined ? (urlParams = "") : (urlParams = "&" + urlParams);
  const url = `${window.location.pathname}?sections=${shopifySectionsIds}${urlParams}`;

  const fetchResponse = await fetchShopifySection(url);
  for (const [key, value] of Object.entries(fetchResponse)) {
    // console.log(" ###\n\n\n\n " + value);
    const sectionHtmlToRender = new DOMParser()
      .parseFromString(value, "text/html")
      .getElementById("shopify-section-" + key).innerHTML;
    document.getElementById("shopify-section-" + key).innerHTML =
      sectionHtmlToRender;
    // console.log(sectionHtmlToRender);
  }
}

function collectionFiltersFormHandler(e) {
  const _form = e.target;
  const formData = new FormData(_form);
  const formSearchParams = new URLSearchParams(formData).toString();
  const currentSortValue = "sort_by=" + _selectSortBy.value;
  // const newSearchParams = new URLSearchParams(currentSortValue + "&" + formSearchParams);
  const newSearchParams = currentSortValue + "&" + formSearchParams;

  renderShopifySections(
    "main-collection-products,collection-filters",
    newSearchParams
  );

  // static updateURLHash(searchParams) {
  //   history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  // }

  // move collection filters to collection grid section so they can be re-rendered together with grid section after filters are applied
  // change filters from on submit to on input change
  // debounce
  // render from cache?
  // add active filters section above grid

  // section rendering on paginate
}

function collectionSortProductsHandler(e) {
  const newSortValue = e.target.value;
  const existingParams = new URLSearchParams(location.search);
  const newParams = [];

  if (location.search) {
    for (let param of existingParams) {
      let paramKey = param[0];
      let paramValue = param[1];
      paramKey !== "sort_by" && newParams.push(paramKey + "=" + paramValue);
    }
    newParams.unshift("sort_by=" + newSortValue);
    location.search = new URLSearchParams(newParams.join("&"));
  } else {
    location.search = new URLSearchParams("sort_by=" + e.target.value);
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
  // sortProducts();
  indexHeroHeight();

  document
    .querySelector(".filter-by-form")
    .addEventListener("submit", function (e) {
      e.preventDefault();
      collectionFiltersFormHandler(e);
    });

  document
    .querySelector("#sort-by-select")
    .addEventListener("change", function (e) {
      e.preventDefault();
      collectionSortProductsHandler(e);
    });

  bodyPaddingTop();
  addBodyScrolled();
  onScroll();
}

init();
