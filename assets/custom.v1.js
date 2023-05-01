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
function sortProducts() {
  if (_selectSortBy) {
    Shopify.queryParams = {};

    // if any parameters are already provided - preserve them
    if (location.search.length) {
      const existingParamsArray = location.search.substring(1).split("&");
      for (let i = 0; i < existingParamsArray.length; i++) {
        const existingParamKeyAndValueArray = existingParamsArray[i].split("=");
        Shopify.queryParams[existingParamKeyAndValueArray[0]] = existingParamKeyAndValueArray[1];
      }
    }
    _selectSortBy.addEventListener("change", function (e) {
      Shopify.queryParams.sort_by = e.target.value;
      location.search = new URLSearchParams(Shopify.queryParams).toString();
    });
  }
}
async function fetchShopifySection(url) {
  const response = await fetch(url);
  const responseText = await response.text();
  return responseText;
}
async function renderShopifySection(sectionId) {
  const _shopifySection = document.getElementById(sectionId).dataset.sectionid;
  let urlParams = location.search.substring(1);
  urlParams !== "" && (urlParams = "&" + urlParams);
  const url = `${window.location.pathname}?section_id=${_shopifySection}${urlParams}`;
  const fetchResponse = await fetchShopifySection(url);
  const sectionHtmlToRender = new DOMParser().parseFromString(fetchResponse, "text/html").getElementById("products-grid-container").innerHTML;
  document.getElementById(sectionId).innerHTML = sectionHtmlToRender;
}
function collectionFiltersFormHandler(e) {
  const _form = e.target;
  const formData = new FormData(_form);
  const formSearchParams = new URLSearchParams(formData).toString();
  const currentSortValue = "sort_by=" + _selectSortBy.value;
  const newSearchParams = "?" + currentSortValue + "&" + formSearchParams;
  console.log(newSearchParams);

  // renderShopifySection("products-grid-container");

  // static updateURLHash(searchParams) {
  //   history.pushState({ searchParams }, '', `${window.location.pathname}${searchParams && '?'.concat(searchParams)}`);
  // }

  // debounce

  // render from cache?

  // fix sorting
  // this wors -    http://127.0.0.1:9292/collections/all?sort_by=price-ascending&filter.v.availability=1&filter.v.availability=0&filter.v.price.gte=10&filter.v.price.lte=15
  // this doesn't - http://127.0.0.1:9292/collections/all?sort_by=title-ascending&filter.v.availability=0&filter.v.price.gte=10&filter.v.price.lte=15
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
  document.querySelector(".filter-by-form").addEventListener("submit", function (e) {
    e.preventDefault();
    collectionFiltersFormHandler(e);
  });
  bodyPaddingTop();
  addBodyScrolled();
  onScroll();
}
init();
}();
/******/ })()
;
//# sourceMappingURL=custom.v1.js.map