import "./styles/main.scss";

("use strict");

const _body = document.querySelector("body");
const _mainHeader = document.querySelector(".main-header");
const bodyWidth = _body.offsetWidth;
const mainHeaderheight = _mainHeader.offsetHeight;
const _selectSortBy = document.querySelector("#sort-by-select");

function debounce(fn, wait) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn.apply(this, args), wait);
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

async function fetchShopifySection(url) {
  const response = await fetch(url);
  const responseText = await response.text();
  return responseText;
}

async function sortFilterRenderSections(e, searchParams) {
  const mainCollectionProducts = document.querySelector(
    ".main-collection-products"
  );
  const productsGrid = document.querySelector(".products-grid-container");
  const filterResultsCounter = document.querySelector(
    ".collection-filters-results-counter"
  );
  const activeFilters = document.querySelector(".collection-active-filters");
  const clickedFilter = e.target.closest(".filter-by-group");
  searchParams === undefined
    ? (searchParams = "")
    : (searchParams = "&" + searchParams);
  const shopifySectionId = productsGrid.dataset.sectionId;
  const url = `${window.location.pathname}?section_id=${shopifySectionId}${searchParams}`;

  mainCollectionProducts.classList.add("loading");

  const htmlText = await fetchShopifySection(url);
  const htmlToRender = new DOMParser().parseFromString(htmlText, "text/html");
  const filtersToRender = htmlToRender.querySelectorAll(".filter-by-group");
  const productsGridToRender = htmlToRender.querySelector(
    ".products-grid-container"
  );
  const filterResultsCounterToRender = htmlToRender.querySelector(
    ".collection-filters-results-counter"
  );
  const activeFiltersToRender = htmlToRender.querySelector(
    ".collection-active-filters"
  );

  if (clickedFilter) {
    filtersToRender.forEach((filter) => {
      if (filter.dataset.filterIndex === clickedFilter.dataset.filterIndex) {
        clickedFilter.querySelector(
          ".filter-by-group-options-header"
        ).innerHTML = filter.querySelector(
          ".filter-by-group-options-header"
        ).innerHTML;
      } else if (
        filter.dataset.filterIndex !== clickedFilter.dataset.filterIndex
      ) {
        document.querySelector(
          `.filter-by-group[data-filter-index='${filter.dataset.filterIndex}']`
        ).innerHTML = filter.innerHTML;
      }
    });
  } else {
    filtersToRender.forEach((filter) => {
      document.querySelector(
        `.filter-by-group[data-filter-index='${filter.dataset.filterIndex}']`
      ).innerHTML = filter.innerHTML;
    });
  }

  filterResultsCounter.innerHTML = filterResultsCounterToRender.innerHTML;
  activeFilters.innerHTML = activeFiltersToRender.innerHTML;
  productsGrid.innerHTML = productsGridToRender.innerHTML;
  mainCollectionProducts.classList.remove("loading");
}

function sortFilterFormHandler(e, form) {
  const formData = new FormData(form);
  const formSearchParams = new URLSearchParams(formData).toString();

  sortFilterRenderSections(e, formSearchParams);
}

const sortFilterFormDebounce = debounce((e, form) => {
  sortFilterFormHandler(e, form);
}, 500);

function filterGroupHandler(e, group) {
  const filterGroup = group;
  const filterGroupOptions = filterGroup.querySelector(
    ".filter-by-group-options"
  );

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

function filterResetHandler(e) {
  e.preventDefault();

  const resetUrl =
    e.target.href.indexOf("?") == -1
      ? ""
      : e.target.href.slice(e.target.href.indexOf("?") + 1);

  sortFilterRenderSections(e, resetUrl);
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

  const collectionFiltersFrom = document.querySelector(
    ".collection-filters-form"
  );
  collectionFiltersFrom.addEventListener("input", function (e) {
    sortFilterFormDebounce(e, this);
  });
  collectionFiltersFrom.addEventListener("click", function (e) {
    if (e.target.closest(".filter-by-group")) {
      const filterGroup = e.target.closest(".filter-by-group");
      filterGroupHandler(e, filterGroup);
    }
    if (e.target.closest(".filters-reset-button")) {
      filterResetHandler(e);
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

// render from cache?
// section rendering on paginate
// make if statements that check if filter event listeners are mounted only if elements are on the page (x.length > 0 or body.data-template = x)
// mobile

// fix price input: add max avlue to max input when value is inserterd only in the min input
