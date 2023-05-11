const API = "http://localhost:8000/products";

// ? переменные для инпутов: для добавления товаров
// let inp = document.querySelector(".inp");
let title = document.querySelector("#title");
let price = document.querySelector("#price");
let descr = document.querySelector("#descr");
let image = document.querySelector("#image");
let btnAdd = document.querySelector("#btn-add");

// ? переменные для инпутов: для редактирования товаров
let editTitle = document.querySelector("#edit-title");
let editPrice = document.querySelector("#edit-price");
let editDescr = document.querySelector("#edit-descr");
let editImage = document.querySelector("#edit-image");
let editSaveBtn = document.querySelector("#btn-save-edit");
let exampleModal = document.querySelector("#exampleModal");

// ? блок куда добавляются карточки товара
let list = document.querySelector("#products-list");

// ! навесили событие на кнопку "добавить"
btnAdd.addEventListener("click", async function () {
  // собираем объект для добавления в db.json
  let obj = {
    title: title.value,
    price: price.value,
    descr: descr.value,
    image: image.value,
  };
  //   console.log(obj);

  // проверка на заполненность инпутов
  if (
    !obj.title.trim() ||
    !obj.price.trim() ||
    !obj.descr.trim() ||
    !obj.image.trim()
  ) {
    alert("Заполните поля");
    return;
  }

  //   запрос для добавления
  await fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(obj),
  });

  //   очищаем инпуты
  title.value = "";
  price.value = "";
  descr.value = "";
  image.value = "";

  //   отображение обновленного db.json
  render();
});

// ! отображение карточек товаров
async function render() {
  let products = await fetch(API)
    .then((res) => res.json())
    .catch((err) => console.log(err));

  list.innerHTML = "";

  products.forEach((element) => {
    console.log(element);
    let newElem = document.createElement("div");
    newElem.innerHTML = `
    <div class="card m-5" style="width: 18rem;">
    <img src="${element.image}" class="card-img-top" alt="...">
    <div class="card-body">
      <h5 class="card-title">${element.title}</h5>
      <p class="card-text">${element.descr}</p>
      <p class="card-text">$ ${element.price}</p>
      <a href="#" id=${element.id} class="btn btn-danger btn-delete">DELETE</a>
      <a href="#" id=${element.id} data-bs-toggle="modal" data-bs-target="#exampleModal" class="btn btn-dark btn-edit">EDIT</a>
    </div>
  </div>
  `;
    list.append(newElem);
  });
}

render();

// ! Удаление товара

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-delete")) {
    let id = e.target.id;
    fetch(`${API}/${id}`, {
      method: "DELETE",
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        render();
      });
  }
});

// ! Редактирование товара
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editTitle.value = data.title; // заполняем поля данными
        editPrice.value = data.price;
        editDescr.value = data.descr;
        editImage.value = data.image;

        editSaveBtn.setAttribute("id", data.id);
      });
  }
});

// todo Сохраняем изменения товара
// кнопка из модакли, для сохранения изменений

editSaveBtn.addEventListener("click", function () {
  let id = this.id; // вытаскиваем из кнопки id и ложим его в переменную
  let title = editTitle.value;
  let price = editPrice.value;
  let descr = editDescr.value;
  let image = editImage.value;

  if (!title || !descr || !image || !price) return; // проверка на заполненность и пустоту полей

  let editedProduct = {
    title,
    price,
    descr,
    image,
  };

  saveEdit(editedProduct, id);
});

function saveEdit(editedProduct, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(editedProduct),
  }).then(() => {
    render();
  });

  // close modal
  let modal = bootstrap.Modal.getInstance(exampleModal);
  modal.hide();
}
