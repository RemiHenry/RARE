const PRODUCTS_FILE = "rare-products.json";

/* RUN WHEN PAGE LOADS */

const runOnPageLoad = () => {
  showAllProducts();
  showIndividualProduct();
};

addEventListener("DOMContentLoaded", runOnPageLoad);

/* LOAD PRODUCTS FROM JSON */

const getProducts = async () => {
  const response = await fetch(`/api/products`);

  if (!response.ok) {
    throw new Error("Could not load rare-products.json");
  }

  const data = await response.json();

  return data.products;
};

/* FORMAT PRODUCT PRICE */

const formatPrice = (price, currency = "USD") => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(price);
};

/*
  PRODUCTS PAGE
  Creates one product card for every product in JSON
*/

const createProductCard = (product) => {
  return `
        <article class="product-list-card">
            <a
                class="product-list-image"
                href="product.html?id=${product.id}"
            >
                <img
                    src="${product.thumbnail}"
                    alt="${product.name}"
                >
                ${product.tags[0] ? `<span class="product-tag">${product.tags[0]}</span>` : "NEW"}
            </a>
            <div class="product-list-info">
                <p class="product-category-label">
                    ${product.category}
                </p>
                <h3>
                    <a href="product.html?id=${product.id}">
                        ${product.name}
                    </a>
                </h3>
                <p class="product-short-description">
                    ${product.shortDescription}
                </p>
                <div class="product-list-meta">
                    <strong>
                        ${formatPrice(product.price, product.currency)}
                    </strong>
                    <span>
                        ${product.availability}
                    </span>
                </div>
            </div>
        </article>
    `;
};

/* DISPLAY THE FIRST 4 PRODUCTS ON THE HOMEPAGE */

const showHomepageProducts = async () => {
  const productsGrid = document.getElementById("homepage-products-grid");

  /*
    If homepage-products-grid does not exist,
    we are probably on products.html instead.
  */

  if (!productsGrid) {
    return;
  }

  try {
    const products = await getProducts();

    /*
      Create a product card for the first
      four products found in the JSON file.
    */

    productsGrid.innerHTML = products
      .slice(0, 4)
      .map(createProductCard)
      .join("");
  } catch (error) {
    console.error(error);
  }
};

/* DISPLAY ALL PRODUCTS */

const showAllProducts = async () => {
  const productsGrid = document.getElementById("products-grid");

  /*
    If products-grid does not exist,
    we are probably on product.html instead.
  */

  if (!productsGrid) {
    return;
  }

  const productCount = document.getElementById("product-count");

  const errorMessage = document.getElementById("products-error");

  try {
    const products = await getProducts();

    /*
      Create a product card for every
      product found in the JSON file.
    */

    productsGrid.innerHTML = products.map(createProductCard).join("");

    /*
      Display number of products.
    */

    productCount.textContent = `${products.length} PRODUCTS`;
  } catch (error) {
    console.error(error);

    productCount.textContent = "";

    errorMessage.hidden = false;
  }
};

/* CREATE INDIVIDUAL PRODUCT PAGE */

const createProductDetail = (product) => {
  /*
    Use the images array if the product has
    multiple images.
    Otherwise use the thumbnail.
  */

  const images =
    product.images && product.images.length
      ? product.images
      : [product.thumbnail];

  return `
        <div class="product-detail-grid">
            <!-- PRODUCT IMAGES -->
            <div class="product-gallery">
                <div class="product-main-image">
                    <img
                        id="main-product-image"
                        src="${images[0]}"
                        alt="${product.name}"
                    >
                </div>
                <div class="product-thumbnail-list">
                    ${images
                      .map(
                        (image, index) => `
                        <button
                            type="button"
                            class="product-thumbnail
                            ${index === 0 ? "active" : ""}"
                            data-image="${image}"
                        >
                            <img
                                src="${image}"
                                alt="${product.name} image ${index + 1}"
                            >
                        </button>
                    `,
                      )
                      .join("")}
                </div>
            </div>

            <!-- PRODUCT INFORMATION -->

            <div class="product-detail-info">
                <p class="product-category-label">
                    ${product.brand}
                    /
                    ${product.category}
                </p>
                <h1>
                    ${product.name}
                </h1>
                <p class="product-detail-price">
                    ${formatPrice(product.price, product.currency)}
                </p>
                <p class="product-description">
                    ${product.description}
                </p>

                <!-- STOCK -->

                <div class="product-stock-row">
                    <span>
                        ${product.availability}
                    </span>
                    <span>
                        ${product.stock} in stock
                    </span>
                </div>

                <!-- COLORS -->

                <div class="product-choice">
                    <h2>COLOR</h2>
                    <div class="product-choice-buttons">
                        ${product.colors
                          .map(
                            (color, index) => `
                            <button
                                type="button"
                                class="choice-button
                                ${index === 0 ? "selected" : ""}"
                            >
                                ${color}
                            </button>
                        `,
                          )
                          .join("")}
                    </div>
                </div>

                <!-- SIZES -->

                <div class="product-choice">
                    <h2>SIZE</h2>
                    <div class="product-choice-buttons">
                        ${product.sizes
                          .map(
                            (size, index) => `
                            <button
                                type="button"
                                class="choice-button
                                ${index === 0 ? "selected" : ""}"
                            >
                                ${size}
                            </button>
                        `,
                          )
                          .join("")}
                    </div>
                </div>

                <!-- ADD TO BAG -->

                <button
                    type="button"
                    class="primary-button product-add-button"
                >
                    ADD TO BAG
                </button>

                <!-- PRODUCT SPECIFICATIONS -->

                <div class="product-specifications">
                    <div>
                        <span>SKU</span>
                        <strong>
                            ${product.sku}
                        </strong>
                    </div>
                    <div>
                        <span>Material</span>
                        <strong>
                            ${product.material}
                        </strong>
                    </div>
                    <div>
                        <span>Fit</span>
                        <strong>
                            ${product.fit}
                        </strong>
                    </div>
                    <div>
                        <span>Condition</span>
                        <strong>
                            ${product.condition}
                        </strong>
                    </div>
                    <div>
                        <span>Release</span>
                        <strong>
                            ${product.releaseInfo}
                        </strong>
                    </div>
                </div>

                <!-- PRODUCT FEATURES -->

                <div class="product-features">
                    <h2>PRODUCT DETAILS</h2>
                    <ul>
                        ${product.features
                          .map(
                            (feature) => `
                            <li>
                                ${feature}
                            </li>
                        `,
                          )
                          .join("")}
                    </ul>
                </div>

                <!-- PRODUCT TAGS -->

                <div class="product-tags">
                    ${product.tags
                      .map(
                        (tag) => `
                        <span>
                            ${tag}
                        </span>
                    `,
                      )
                      .join("")}
                </div>
            </div>
        </div>
    `;
};

/* DISPLAY INDIVIDUAL PRODUCT */

const showIndividualProduct = async () => {
  const productContainer = document.getElementById("product-detail");

  /*
    product-detail only exists on product.html.
    If it doesn't exist, stop this function.
  */

  if (!productContainer) {
    return;
  }

  const errorMessage = document.getElementById("product-error");

  /*
    Read the product ID from the URL.
    Example:
    product.html?id=rare-hoodie-001
  */

  const urlParameters = new URLSearchParams(window.location.search);

  const productId = urlParameters.get("id");

  try {
    const products = await getProducts();

    /*
      Find the product whose ID matches
      the ID from the URL.
    */

    const product = products.find((item) => item.id === productId);

    /*
      Product was not found.
    */

    if (!product) {
      productContainer.hidden = true;
      errorMessage.hidden = false;
      return;
    }

    /*
      Change browser tab title.
    */

    document.title = `${product.name} | RARE.`;

    /*
      Display product information.
    */

    productContainer.innerHTML = createProductDetail(product);

    /* PRODUCT IMAGE THUMBNAILS */

    const thumbnails = document.querySelectorAll(".product-thumbnail");

    thumbnails.forEach((thumbnail) => {
      thumbnail.addEventListener("click", function () {
        const mainImage = document.getElementById("main-product-image");

        /*
          Change main image.
        */

        mainImage.src = this.dataset.image;

        /*
          Remove active class from
          every thumbnail.
        */

        thumbnails.forEach((item) => {
          item.classList.remove("active");
        });

        /*
          Highlight selected thumbnail.
        */
        this.classList.add("active");
      });
    });

    /* SIZE AND COLOR BUTTONS */

    const optionGroups = document.querySelectorAll(".product-choice-buttons");

    optionGroups.forEach((group) => {
      const buttons = group.querySelectorAll(".choice-button");
      buttons.forEach((button) => {
        button.addEventListener("click", function () {
          /*
            Remove selected style
            from the other buttons
            in this group.
          */

          buttons.forEach((item) => {
            item.classList.remove("selected");
          });

          /*
            Select clicked button.
          */

          this.classList.add("selected");
        });
      });
    });
  } catch (error) {
    console.error(error);
    productContainer.hidden = true;
    errorMessage.hidden = false;
  }
};
