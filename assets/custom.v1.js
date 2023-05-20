/******/ (function() { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/styles/main.scss":
/*!******************************!*\
  !*** ./src/styles/main.scss ***!
  \******************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	!function() {
/******/ 		// define __esModule on exports
/******/ 		__webpack_require__.r = function(exports) {
/******/ 			if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 				Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 			}
/******/ 			Object.defineProperty(exports, '__esModule', { value: true });
/******/ 		};
/******/ 	}();
/******/ 	
/************************************************************************/
var __webpack_exports__ = {};
// This entry need to be wrapped in an IIFE because it need to be isolated against other modules in the chunk.
!function() {
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _styles_main_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./styles/main.scss */ "./src/styles/main.scss");

"use strict";
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
        document.querySelector(".nav-mobile-container").classList.remove("show");
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
    document.querySelector(".index-hero .hero-inner").style.height = "calc(100vh - " + mainHeaderheight + "px)";
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
  const responseJson = await response.json();
  return responseJson;
}
async function sortFilterRenderSections(searchParams) {
  searchParams === undefined ? searchParams = "" : searchParams = "&" + searchParams;
  // const sectionsIds = ["collection-filters", "products-grid-container"];
  const sectionsToRender = [{
    id: "collection-filters",
    shopifyId: "",
    elementsToRender: ".sort-by-container,.collection-filters-results-counter,.collection-active-filters"
  }, {
    id: "products-grid-container",
    shopifyId: "",
    elementsToRender: ".products-grid-container"
  }];
  const sectionsShopifyIds = [];
  for (const section of sectionsToRender) {
    section.shopifyId = document.getElementById(section.id).dataset.sectionId;
    sectionsShopifyIds.push(section.shopifyId);
  }
  const url = `${window.location.pathname}?sections=${sectionsShopifyIds}${searchParams}`;
  const htmlToRenderObject = await fetchShopifySection(url);
  for (const section of sectionsToRender) {
    const sectionHtml = new DOMParser().parseFromString(htmlToRenderObject[section.shopifyId], "text/html");
    for (const element of section.elementsToRender.split(",")) {
      document.querySelector(element).innerHTML = sectionHtml.querySelector(element).innerHTML;
    }
  }

  // loading
}

function sortFilterFormHandler(e, form) {
  // const clickedElement = e.target;
  const formData = new FormData(form);
  const formSearchParams = new URLSearchParams(formData).toString();
  sortFilterRenderSections(formSearchParams);
}

//////////////////////////////////////////////////////////////

async function renderShopifySections(sections, urlParams) {
  const sectionsIds = sections.split(",");
  let shopifySectionsIdsArray = [];
  for (const sectionId of sectionsIds) {
    shopifySectionsIdsArray.push(document.getElementById(sectionId).dataset.sectionid);
  }
  const shopifySectionsIds = shopifySectionsIdsArray.join();
  urlParams === undefined ? urlParams = "" : urlParams = "&" + urlParams;
  const url = `${window.location.pathname}?sections=${shopifySectionsIds}${urlParams}`;
  const fetchResponse = await fetchShopifySection(url);
  for (const [key, value] of Object.entries(fetchResponse)) {
    // console.log(" ###\n\n\n\n " + value);
    const sectionHtmlToRender = new DOMParser().parseFromString(value, "text/html").getElementById("shopify-section-" + key).innerHTML;
    document.getElementById("shopify-section-" + key).innerHTML = sectionHtmlToRender;
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
  renderShopifySections("main-collection-products,collection-filters", newSearchParams);
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
function sortFilterHandler(e) {
  const _this = e.target;
  const filtersForm = document.querySelector(".filter-by-form");
  const filtersData = new FormData(filtersForm);
  const sortData = document.querySelector(".sort-by-select").value;
  const filtersSearchParams = new URLSearchParams(filtersData).toString();
  const sortSearchParams = "sort_by=" + sortData;
  console.log("_formData", filtersData);
  if (location.search) {
    if (filtersData) {
      const newParams = filtersSearchParams + "&" + sortSearchParams;
      location.search = new URLSearchParams(newParams);
    } else {
      location.search = new URLSearchParams("sort_by=" + sortData);
    }
  } else {
    if (_this.getAttribute("id") === "sort-by-select") {
      location.search = new URLSearchParams("sort_by=" + sortData);
    } else {
      location.search = new URLSearchParams(filtersData).toString();
    }
  }
}
function filterGroupHandler(e, group) {
  const filterGroup = group;
  const filterGroupOptions = filterGroup.querySelector(".filter-by-group-options");
  if (filterGroup.classList.contains("open")) {
    if (e.target.classList == filterGroup.classList) {
      filterGroup.classList.remove("open");
      filterGroupOptions.classList.remove("show");
    }
  } else {
    filterGroup.classList.add("open");
    filterGroupOptions.classList.add("show");
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
  const collectionFiltersFrom = document.querySelector(".collection-filters-form");
  collectionFiltersFrom.addEventListener("input", function (e) {
    sortFilterFormHandler(e, this);
  });
  collectionFiltersFrom.addEventListener("click", function (e) {
    if (e.target.closest(".filter-by-group")) {
      const filterGroup = e.target.closest(".filter-by-group");
      filterGroupHandler(e, filterGroup);
    }
  });
  bodyPaddingTop();
  addBodyScrolled();
  onScroll();
}
init();

// TODO

// static updateURLHash(searchParams) {
//   history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
// }

// change filters from on submit to on input change
// debounce
// render from cache?
// section rendering on paginate
// make if statements that check if filter event listeners are mounted only if elements are on the page (x.length > 0 or body.data-template = x)
// mobile
}();
/******/ })()
;
//# sourceMappingURL=custom.v1.js.map