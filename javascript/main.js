const URL = "https://reambsbackend.herokuapp.com/api/v1";

const firstCharacterInUppercase = (text) => {
  let finalText = "";

  text.split(" ").forEach((txt) => {
    finalText += txt.charAt(0).toUpperCase() + txt.slice(1) + " ";
  });

  return finalText;
};

// Categories
const getCategoryContainer = () => {
  return document.querySelector("#opciones > ul");
};

const insertCategories = (categories, categoriesContainer) => {
  categoriesContainer.innerHTML = "";

  if (categories.length > 0) {
    categories.forEach((category) => {
      const newCategory = `
        <li>
          <a href="?category=${category.id}">${firstCharacterInUppercase(
        category.name
      )}</a>
        </li>
      `;

      categoriesContainer.innerHTML += newCategory;
    });
  }
};

// Products
const getProductContainer = () => {
  return document.querySelector("#productos");
};

const insertProducts = (products, productContainer) => {
  const PRODUCT_NOT_FOUND_IMG =
    "https://commercial.bunn.com/img/image-not-available.png";

  if (products.length > 0) {
    products.forEach((prod) => {
      const newProduct = `
        <div class="card">
          <div class="card-image">
            <img src="${
              prod.url_image === null || prod.url_image === ""
                ? PRODUCT_NOT_FOUND_IMG
                : prod.url_image
            }" alt="${prod.name} Image">
          </div>
          <div class="card-body">
            <p>${prod.name}</p>
          </div>
          ${
            prod.discount > 0
              ? `
              <div class="card-footer">
                <p class="prod-discount">${
                  prod.price * (1 - Number(prod.discount) / 100)
                }<span>$${prod.price}</span></p>
              </div>
            `
              : ""
          }

          <div class="addProduct">
            <i class='bx bx-plus' ></i>
          </div>
        </div>
      `;

      productContainer.innerHTML += newProduct;
    });
  }
};

window.addEventListener("DOMContentLoaded", () => {
  const searchButton = document.querySelector(".header-search > button");
  searchButton.addEventListener("click", () => {
    const searchInputValue = document.querySelector(
      ".header-search > input"
    ).value;

    location.href = "?search=" + searchInputValue;
  });

  // * Cargar Categorias
  fetch(`${URL}/categories`)
    .then((res) => res.json())
    .then((data) => {
      const categoriesContainer = getCategoryContainer();

      insertCategories(data, categoriesContainer);
    });

  // * Cargar Productos
  const params = window.location.search.substring(1).split("&");

  if (params[0] === "") {
    fetch(`${URL}/products`)
      .then((res) => res.json())
      .then((data) => {
        const productContainer = getProductContainer();

        insertProducts(data, productContainer);
      });

    return;
  }

  params.find((param) => {
    const paramValue = param.split("=");

    if (paramValue[0] === "search") {
      const searchValue = paramValue[1];

      fetch(`${URL}/products/search?value=${searchValue}`)
        .then((res) => res.json())
        .then((data) => {
          const productContainer = getProductContainer();
          insertProducts(data, productContainer);
        });

      return;
    }

    if (paramValue[0] === "category") {
      const categoryId = paramValue[1];

      fetch(`${URL}/products?category=${categoryId}`)
        .then((res) => res.json())
        .then((data) => {
          const productContainer = getProductContainer();
          insertProducts(data, productContainer);
        });

      return;
    }
  });
});
