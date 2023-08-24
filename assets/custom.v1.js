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
function debounce(fn, wait) {
  var _this2 = this;
  let t;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(t);
    t = setTimeout(() => fn.apply(_this2, args), wait);
  };
}
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
function renderUpdateUrl(searchParams) {
  window.history.pushState(null, "", `${window.location.pathname}${searchParams && "?".concat(searchParams)}`);
}
async function fetchShopifySection(url) {
  const response = await fetch(url);
  const responseText = await response.text();
  return responseText;
}
async function productsGridRenderSections(e, searchParams) {
  let updateUrl = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  const mainCollectionProducts = document.querySelector(".main-collection-products");
  const productsGrid = document.querySelector(".products-grid-container");
  const filterResultsCounter = document.querySelectorAll(".collection-filters-results-counter");
  const sortBySelect = document.querySelector(".sort-by-select");
  const activeFilters = document.querySelectorAll(".collection-active-filters");
  const clickedFilter = e ? e.target.closest(".filter-by-group") : undefined;
  const shopifySectionId = productsGrid.dataset.sectionId;
  const url = `${window.location.pathname}?section_id=${shopifySectionId}&${searchParams}`;
  mainCollectionProducts.classList.add("loading");
  const htmlText = await fetchShopifySection(url);
  const htmlToRender = new DOMParser().parseFromString(htmlText, "text/html");
  const filtersToRender = htmlToRender.querySelectorAll(".filter-by-group");
  const productsGridToRender = htmlToRender.querySelector(".products-grid-container");
  const filterResultsCounterToRender = htmlToRender.querySelector(".collection-filters-results-counter");
  const sortBySelectToRender = htmlToRender.querySelector(".sort-by-select");
  const activeFiltersToRender = htmlToRender.querySelector(".collection-active-filters");
  if (clickedFilter) {
    filtersToRender.forEach(filter => {
      if (filter.dataset.filterIndex === clickedFilter.dataset.filterIndex) {
        clickedFilter.querySelector(".filter-by-group-options-header").innerHTML = filter.querySelector(".filter-by-group-options-header").innerHTML;
      } else if (filter.dataset.filterIndex !== clickedFilter.dataset.filterIndex) {
        document.querySelector(`.filter-by-group[data-filter-index='${filter.dataset.filterIndex}']`).innerHTML = filter.innerHTML;
      }
    });
  } else {
    filtersToRender.forEach(filter => {
      document.querySelector(`.filter-by-group[data-filter-index='${filter.dataset.filterIndex}']`).innerHTML = filter.innerHTML;
    });
  }
  filterResultsCounter.forEach(filter => {
    filter.innerHTML = filterResultsCounterToRender.innerHTML;
  });
  activeFilters.forEach(filter => {
    filter.innerHTML = activeFiltersToRender.innerHTML;
  });
  productsGrid.innerHTML = productsGridToRender.innerHTML;
  sortBySelect.innerHTML = sortBySelectToRender.innerHTML;
  if (updateUrl) renderUpdateUrl(searchParams);
  mainCollectionProducts.classList.remove("loading");
}
function sortFilterFormHandler(e, form) {
  const formData = new FormData(form);
  const formSearchParams = new URLSearchParams(formData).toString();
  productsGridRenderSections(e, formSearchParams);
}
const sortFilterFormDebounce = debounce((e, form) => {
  sortFilterFormHandler(e, form);
}, 500);
function filterGroupHandler(e, group) {
  const filterGroup = group;
  const filterGroupOptions = filterGroup.querySelector(".filter-by-group-options");
  if (filterGroup.classList.contains("open")) {
    filterGroup.classList.remove("open");
    filterGroupOptions.classList.remove("show");
  } else {
    filterGroup.classList.add("open");
    filterGroupOptions.classList.add("show");
  }
}
function filterResetHandler(e) {
  e.preventDefault();
  const resetUrl = e.target.href.indexOf("?") == -1 ? "" : e.target.href.slice(e.target.href.indexOf("?") + 1);
  productsGridRenderSections(null, resetUrl).then(() => {
    if (e.target.classList.contains("filter-by-group-reset-button") || e.target.classList.contains("filter-by-group-reset-button-mobile")) {
      document.querySelector(".filter-by-group.open .filter-by-group-options").classList.add("show");
    }
  });
}
function productsGridPopstateHandler(e) {
  const popstateUrl = window.location.search.slice(1);
  productsGridRenderSections(null, popstateUrl, false);
}
function mobileSortFilterDrawerHandler(e) {
  e.preventDefault();
  document.querySelector(".collection-filters").classList.toggle("show");
  document.querySelector(".collection-sort-filter-mobile-drawer-button").classList.toggle("open");
  const filterGroupOpen = document.querySelector(".filter-by-group.open");
  if (filterGroupOpen) {
    filterGroupOpen.classList.remove("open");
    filterGroupOpen.querySelector(".filter-by-group-options.show").classList.remove("show");
  }
}
function filterMobileBackHandler(e) {
  e.preventDefault();
  const _this = e.target;
  _this.closest(".filter-by-group-options").classList.remove("show");
  _this.closest(".filter-by-group").classList.remove("open");
}
function onScroll() {
  document.addEventListener("scroll", function () {
    addBodyScrolled();
  });
}
function init() {
  bodyPaddingTop();
  addBodyScrolled();
  onScroll();
  if (bodyWidth <= 1200) {
    toggleMobileNav(".mobile-nav-trigger", "add");
    toggleMobileNav(".nav-mobile-close", "remove");
  }
  indexHeroHeight();
  if (_body.dataset.template == "collection") {
    const collectionFiltersFrom = document.querySelector(".collection-filters-form");
    collectionFiltersFrom.addEventListener("input", function (e) {
      sortFilterFormDebounce(e, this);
    });
    collectionFiltersFrom.addEventListener("click", function (e) {
      if (e.target.closest(".filter-by-group-header")) {
        const filterGroup = e.target.closest(".filter-by-group");
        filterGroupHandler(e, filterGroup);
      } else if (e.target.closest(".filters-reset-button")) {
        filterResetHandler(e);
      } else if (e.target.closest(".filter-by-group-options-header-mobile-back-button")) {
        filterMobileBackHandler(e);
      } else if (e.target.closest(".collection-filters-mobile-apply-button")) {
        mobileSortFilterDrawerHandler(e);
      }
    });
    document.querySelector(".collection-sort-filter-mobile-header-active-filters").addEventListener("click", function (e) {
      if (e.target.closest(".filters-reset-button")) {
        filterResetHandler(e);
      }
    });
    window.addEventListener("popstate", function (e) {
      productsGridPopstateHandler(e);
    });
    const paginateClasses = ["page", "next", "prev"];
    const paginateScrollTo = document.querySelector("#main-collection-products").offsetTop - _mainHeader.offsetHeight;
    document.querySelector(".main-collection-products-grid").addEventListener("click", function (e) {
      const parentClassToCheck = e.target.parentNode.classList.toString();
      if (paginateClasses.includes(parentClassToCheck)) {
        e.preventDefault();
        const paginateUrl = e.target.href.slice(e.target.href.indexOf("?") + 1);
        productsGridRenderSections(null, paginateUrl).then(() => {
          window.scrollTo({
            top: paginateScrollTo,
            behavior: "smooth"
          });
        });
      }
    });
    document.querySelector(".collection-sort-filter-mobile-drawer-button").addEventListener("click", function (e) {
      mobileSortFilterDrawerHandler(e);
    });
    document.querySelector(".filters-mobile-header-close").addEventListener("click", function (e) {
      mobileSortFilterDrawerHandler(e);
    });
  }
}
init();

// TODO

// render from cache?
}();
/******/ })()
;
//# sourceMappingURL=custom.v1.js.map