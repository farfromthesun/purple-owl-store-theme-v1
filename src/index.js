import "./styles/main.scss";
import Glide from "@glidejs/glide";

("use strict");

const _body = document.querySelector("body");
const _mainHeader = document.querySelector(".main-header");
const bodyWidth = _body.offsetWidth;
const mainHeaderheight = _mainHeader.offsetHeight;
let shopifySectionsCache = [];

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

function renderUpdateUrl(searchParams) {
  window.history.pushState(
    null,
    "",
    `${window.location.pathname}${searchParams && "?".concat(searchParams)}`
  );
}

async function fetchShopifySection(url) {
  const response = await fetch(url);
  const responseText = await response.text();
  shopifySectionsCache = [...shopifySectionsCache, { responseText, url }];
  return responseText;
}

async function productsGridRenderSections(e, searchParams, updateUrl = true) {
  const mainCollectionProducts = document.querySelector(
    ".main-collection-products"
  );
  const productsGrid = document.querySelector(".products-grid-container");
  const filterResultsCounter = document.querySelectorAll(
    ".collection-filters-results-counter"
  );
  const sortBySelect = document.querySelector(".sort-by-select");
  const activeFilters = document.querySelectorAll(".collection-active-filters");
  const clickedFilter = e ? e.target.closest(".filter-by-group") : undefined;
  const shopifySectionId = productsGrid.dataset.sectionId;
  const url = `${window.location.pathname}?section_id=${shopifySectionId}&${searchParams}`;

  mainCollectionProducts.classList.add("loading");

  const htmlText = shopifySectionsCache.some((element) => element.url === url)
    ? shopifySectionsCache.find((element) => element.url === url).responseText
    : await fetchShopifySection(url);

  const htmlToRender = new DOMParser().parseFromString(htmlText, "text/html");
  const filtersToRender = htmlToRender.querySelectorAll(".filter-by-group");
  const productsGridToRender = htmlToRender.querySelector(
    ".products-grid-container"
  );
  const filterResultsCounterToRender = htmlToRender.querySelector(
    ".collection-filters-results-counter"
  );
  const sortBySelectToRender = htmlToRender.querySelector(".sort-by-select");
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

  filterResultsCounter.forEach((filter) => {
    filter.innerHTML = filterResultsCounterToRender.innerHTML;
  });
  activeFilters.forEach((filter) => {
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
  const filterGroupOptions = filterGroup.querySelector(
    ".filter-by-group-options"
  );

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

  const resetUrl =
    e.target.href.indexOf("?") == -1
      ? ""
      : e.target.href.slice(e.target.href.indexOf("?") + 1);

  productsGridRenderSections(null, resetUrl).then(() => {
    if (
      e.target.classList.contains("filter-by-group-reset-button") ||
      e.target.classList.contains("filter-by-group-reset-button-mobile")
    ) {
      document
        .querySelector(".filter-by-group.open .filter-by-group-options")
        .classList.add("show");
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
  document
    .querySelector(".collection-sort-filter-mobile-drawer-button")
    .classList.toggle("open");

  const filterGroupOpen = document.querySelector(".filter-by-group.open");
  if (filterGroupOpen) {
    filterGroupOpen.classList.remove("open");
    filterGroupOpen
      .querySelector(".filter-by-group-options.show")
      .classList.remove("show");
  }
}

function filterMobileBackHandler(e) {
  e.preventDefault();

  const _this = e.target;
  _this.closest(".filter-by-group-options").classList.remove("show");
  _this.closest(".filter-by-group").classList.remove("open");
}

function productQuantityButtonHandler(e) {
  e.preventDefault();
  const button = e.currentTarget;
  const input = button
    .closest(".product-quantity-selector")
    .querySelector(".product-quantity-input");
  const currentValue = input.value;

  button.dataset.action === "decrease" ? input.stepDown() : input.stepUp();

  const changeEvent = new Event("change");
  if (currentValue !== input.value) input.dispatchEvent(changeEvent);
}

function productQuantityInputRulesHandler(input) {
  const button = input
    .closest(".product-quantity-selector")
    .querySelector(".product-quantity-button[data-action=decrease]");
  const min = parseInt(input.min);
  const value = parseInt(input.value);
  if (min) {
    if (value <= min) {
      button.disabled = true;
    } else {
      button.disabled = false;
    }
  }
}

function productQuantityInputChangeHandler(e) {
  const input = e.target;

  productQuantityInputRulesHandler(input);
}

function productQuantityInputReset() {
  const productQuantityInput = document
    .querySelector(".product-main")
    .querySelector(".product-quantity-selector")
    .querySelector(".product-quantity-input");
  productQuantityInput.value = 1;
  productQuantityInputRulesHandler(productQuantityInput);
}

function productGetPickedVariant(e) {
  const optionsContainer = e.currentTarget;
  const allVariants = allProductVariantsJSON();
  const checkedOptionsArray = [];

  optionsContainer.querySelectorAll("input:checked").forEach((option) => {
    checkedOptionsArray.push(option.value);
  });
  const pickedVariantData = allVariants.find((variant) => {
    const optionsComparisonArray = [];
    for (const [index, option] of variant.options.entries()) {
      optionsComparisonArray.push(checkedOptionsArray[index] === option);
    }
    return !optionsComparisonArray.includes(false);
  });
  return pickedVariantData;
}

function productChangeATCStatus(disable, text = false) {
  const atcButtons = document.querySelectorAll(".product-buy-atc");

  if (atcButtons.length === 0) return;
  atcButtons.forEach((button) => {
    disable
      ? button.setAttribute("disabled", "disabled")
      : button.removeAttribute("disabled");
    if (text) button.textContent = text;
  });
}

function productOptionsChangeUpdateUrl(e, variantID) {
  window.history.replaceState(
    {},
    "",
    `${e.currentTarget.dataset.url}?variant=${variantID}`
  );
}

function allProductVariantsJSON() {
  const allVariants = JSON.parse(
    document.querySelector(".product-options").querySelector("script")
      .textContent
  );
  return allVariants;
}

async function productOptionsChangeUpdateInfo(
  e,
  variantID,
  variantFeaturedMedia
) {
  const productOptionsContainer = e.currentTarget;
  const url = `${productOptionsContainer.dataset.url}?variant=${variantID}&section_id=${productOptionsContainer.dataset.section}`;
  let htmlText = "";
  const productInfoContainer = productOptionsContainer.closest(".product-info");
  const productPrices = productInfoContainer.querySelector(".product-prices");
  const productQuantityTitle = productInfoContainer.querySelector(
    ".product-quantity-title-container"
  );
  const productOptionsInner = productInfoContainer.querySelector(
    ".product-options-inner"
  );
  const productImages = productOptionsContainer
    .closest(".product-main-inner")
    .querySelector(".product-images");
  // const productBuy = productInfoContainer.querySelector(".product-buy");

  // if (shopifySectionsCache.some((element) => element.url === url)) {
  //   htmlText = shopifySectionsCache.find(
  //     (element) => element.url === url
  //   ).responseText;
  // } else {
  //   productOptionsInner.classList.add("fetching-data");
  //   htmlText = await fetchShopifySection(url);
  // }

  productOptionsInner.classList.add("fetching-data");
  htmlText = await fetchShopifySection(url);

  const htmlToRender = new DOMParser().parseFromString(htmlText, "text/html");

  const productInfoContainerToRender =
    htmlToRender.querySelector(".product-info");
  const productPricesToRender =
    productInfoContainerToRender.querySelector(".product-prices");
  const productOptionsInnerToRender =
    productInfoContainerToRender.querySelector(".product-options-inner");
  const productQuantityTitleToRender =
    productInfoContainerToRender.querySelector(
      ".product-quantity-title-container"
    );
  const productImagesToRender = productInfoContainerToRender
    .closest(".product-main-inner")
    .querySelector(".product-images");
  // const productBuyToRender =
  //   productInfoContainerToRender.querySelector(".product-buy");

  productPrices.innerHTML = productPricesToRender.innerHTML;
  productOptionsInner.innerHTML = productOptionsInnerToRender.innerHTML;
  productQuantityTitle.innerHTML = productQuantityTitleToRender.innerHTML;
  if (
    productImages.firstElementChild.classList[0] !==
      productImagesToRender.firstElementChild.classList[0] ||
    variantFeaturedMedia
  ) {
    productImages.innerHTML = productImagesToRender.innerHTML;
    productGlideInit();
  }
  // productBuy.innerHTML = productBuyToRender.innerHTML;
  document.querySelectorAll("form[action='/cart/add']").forEach((form) => {
    form.querySelector("input[name='id']").value = variantID;
  });
  productOptionsInner.classList.remove("fetching-data");
  // productChangeATCStatus(false);
  productQuantityInputReset();
  productAddToCartErrorsHandler();

  // Can also be done with section rendering
  const allVariants = allProductVariantsJSON();
  const selectedVariantData = allVariants.find(
    (variant) => variant.id === variantID
  );
  if (selectedVariantData.available) {
    productChangeATCStatus(false, "Add to cart");
  } else {
    productChangeATCStatus(true, "Sold out");
  }
}

function productOptionsChangeHandler(e) {
  productChangeATCStatus(true);
  const pickedVariant = productGetPickedVariant(e);

  productOptionsChangeUpdateUrl(e, pickedVariant.id);
  productOptionsChangeUpdateInfo(
    e,
    pickedVariant.id,
    pickedVariant.featured_media
  );
}

function productGlideInit() {
  if (document.querySelector(".product-gallery")) {
    var glide = new Glide(".glide");
    glide.on("move.after", function () {
      document
        .querySelector(".product-gallery")
        .querySelector(".slides-status-current").innerHTML = glide.index + 1;
    });
    glide.mount();
  }
}

function cartDrawerVisibilityHandler(visibility) {
  const cartDrawerContainer = document.querySelector(".cart-drawer-container");
  const body = document.querySelector("body");

  if (visibility === "show") {
    cartDrawerContainer.classList.add("show");
    body.classList.add("overflowHidden");
  } else if (visibility === "hide") {
    cartDrawerContainer.classList.remove("show");
    body.classList.remove("overflowHidden");
  }
}

function productAddToCartErrorsHandler(errorDescription = false) {
  const errorContainer = document
    .querySelector(".product-main-inner")
    .querySelector(".product-buy")
    .querySelector(".product-buy-error-container");
  if (!errorContainer) return;
  if (errorDescription) {
    errorContainer.classList.add("show");
    errorContainer.querySelector(".product-buy-error-message").textContent =
      errorDescription;
  } else {
    errorContainer.classList.remove("show");
  }
}

async function productQuantityTitleUpdate() {
  const productInfo = document.querySelector(".product-info");
  const productOptions = productInfo.querySelector(".product-options");
  const productQuantityTitleContainer = productInfo.querySelector(
    ".product-quantity-title-container"
  );
  const variantID = productInfo
    .querySelector("form[action='/cart/add']")
    .querySelector("input[name='id']").value;
  const url = `${productOptions.dataset.url}?variant=${variantID}&section_id=${productOptions.dataset.section}`;

  const htmlText = await fetchShopifySection(url);
  const htmlToRender = new DOMParser().parseFromString(htmlText, "text/html");
  const productQuantityTitleContainerToRender = htmlToRender
    .querySelector(".product-info")
    .querySelector(".product-quantity-title-container");
  productQuantityTitleContainer.innerHTML =
    productQuantityTitleContainerToRender.innerHTML;
}

function productAddToCart(e) {
  const form = e.currentTarget;
  const formData = new FormData(form);
  const cartDrawer = document.getElementById("cart-drawer");
  const sectionsToUpdate = [
    {
      sectionName: "cart-drawer-po",
      htmlId: "cart-drawer",
    },
    {
      sectionName: "header-cart-drawer-button",
      htmlId: "header-cart-drawer-button",
    },
  ];

  formData.append(
    "sections",
    sectionsToUpdate.map((section) => section.sectionName)
  );
  formData.append("sections_url", window.location.pathname);

  productChangeATCStatus(true);

  fetch(window.Shopify.routes.root + "cart/add.js", {
    method: "POST",
    headers: {
      Accept: "application/javascript",
      "X-Requested-With": "XMLHttpRequest",
    },
    body: formData,
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status) {
        productAddToCartErrorsHandler(response.description);
      } else {
        sectionsToUpdate.forEach((section) => {
          const htmlToInject = new DOMParser()
            .parseFromString(
              response.sections[section.sectionName],
              "text/html"
            )
            .getElementById(section.htmlId);
          document.getElementById(section.htmlId).innerHTML =
            htmlToInject.innerHTML;
        });
        if (cartDrawer.classList.contains("is-empty"))
          cartDrawer.classList.remove("is-empty");
        cartDrawerVisibilityHandler("show");
        productAddToCartErrorsHandler();
        productQuantityInputReset();
        productQuantityTitleUpdate();
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
    })
    .finally(() => {
      productChangeATCStatus(false);
    });
}

function atcFormSubmithandler(e) {
  e.preventDefault();
  productAddToCart(e);
}

function cartDrawerItemRemoveHandler(e) {
  const button = e.target.closest(".cart-drawer-item-remove-button");
  const itemLine = button.dataset.index;
  const cartDrawer = e.currentTarget;
  const sectionsToUpdate = [
    {
      sectionName: "cart-drawer-po",
      htmlId: "cart-drawer",
    },
    {
      sectionName: "header-cart-drawer-button",
      htmlId: "header-cart-drawer-button",
    },
  ];

  e.preventDefault();

  fetch(window.Shopify.routes.root + "cart/change.js", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Accept: `application/json`,
    },
    body: JSON.stringify({
      line: itemLine,
      quantity: 0,
      sections: sectionsToUpdate.map((section) => section.sectionName),
      sections_url: window.location.pathname,
    }),
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status) {
        console.log("Error: ", response.status, response.description);
      } else {
        sectionsToUpdate.forEach((section) => {
          const htmlToInject = new DOMParser()
            .parseFromString(
              response.sections[section.sectionName],
              "text/html"
            )
            .getElementById(section.htmlId);
          document.getElementById(section.htmlId).innerHTML =
            htmlToInject.innerHTML;
        });

        if (response.item_count === 0) cartDrawer.classList.add("is-empty");
        productQuantityTitleUpdate();
        console.log("response", response);
      }
    })
    .catch((error) => {
      console.log("Error: ", error);
    })
    .finally(() => {
      // productChangeATCStatus(false);
    });
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

  document
    .querySelector(".header-cart-drawer-button")
    .addEventListener("click", function (e) {
      e.preventDefault();
      cartDrawerVisibilityHandler("show");
    });
  document
    .getElementById("cart-drawer")
    .addEventListener("click", function (e) {
      if (e.target.closest(".cart-drawer-header-close")) {
        cartDrawerVisibilityHandler("hide");
      } else if (e.target.closest(".cart-drawer-item-remove")) {
        cartDrawerItemRemoveHandler(e);
      }
    });
  document
    .querySelector(".cart-drawer-overlay")
    .addEventListener("click", function (e) {
      cartDrawerVisibilityHandler("hide");
    });

  if (_body.dataset.template == "collection") {
    const collectionFiltersFrom = document.querySelector(
      ".collection-filters-form"
    );

    collectionFiltersFrom.addEventListener("input", function (e) {
      sortFilterFormDebounce(e, this);
    });

    collectionFiltersFrom.addEventListener("click", function (e) {
      if (e.target.closest(".filter-by-group-header")) {
        const filterGroup = e.target.closest(".filter-by-group");
        filterGroupHandler(e, filterGroup);
      } else if (e.target.closest(".filters-reset-button")) {
        filterResetHandler(e);
      } else if (
        e.target.closest(".filter-by-group-options-header-mobile-back-button")
      ) {
        filterMobileBackHandler(e);
      } else if (e.target.closest(".collection-filters-mobile-apply-button")) {
        mobileSortFilterDrawerHandler(e);
      }
    });

    document
      .querySelector(".collection-sort-filter-mobile-header-active-filters")
      .addEventListener("click", function (e) {
        if (e.target.closest(".filters-reset-button")) {
          filterResetHandler(e);
        }
      });

    window.addEventListener("popstate", function (e) {
      productsGridPopstateHandler(e);
    });

    const paginateClasses = ["page", "next", "prev"];
    const paginateScrollTo =
      document.querySelector("#main-collection-products").offsetTop -
      _mainHeader.offsetHeight;
    document
      .querySelector(".main-collection-products-grid")
      .addEventListener("click", function (e) {
        const parentClassToCheck = e.target.parentNode.classList.toString();
        if (paginateClasses.includes(parentClassToCheck)) {
          e.preventDefault();
          const paginateUrl = e.target.href.slice(
            e.target.href.indexOf("?") + 1
          );
          productsGridRenderSections(null, paginateUrl).then(() => {
            window.scrollTo({
              top: paginateScrollTo,
              behavior: "smooth",
            });
          });
        }
      });

    document
      .querySelector(".collection-sort-filter-mobile-drawer-button")
      .addEventListener("click", function (e) {
        mobileSortFilterDrawerHandler(e);
      });
    document
      .querySelector(".filters-mobile-header-close")
      .addEventListener("click", function (e) {
        mobileSortFilterDrawerHandler(e);
      });
  }

  if (_body.dataset.template == "product") {
    productGlideInit();

    document
      .querySelector(".product-options")
      .addEventListener("change", function (e) {
        productOptionsChangeHandler(e);
      });
  }

  document.querySelectorAll(".product-quantity-button").forEach((button) => {
    button.addEventListener("click", function (e) {
      productQuantityButtonHandler(e);
    });
  });
  document.querySelectorAll(".product-quantity-input").forEach((input) => {
    input.addEventListener("change", function (e) {
      productQuantityInputChangeHandler(e);
    });
    productQuantityInputRulesHandler(input);
  });

  document.querySelectorAll("form[action='/cart/add']").forEach((form) => {
    form.addEventListener("submit", function (e) {
      atcFormSubmithandler(e);
    });
  });
}

init();
