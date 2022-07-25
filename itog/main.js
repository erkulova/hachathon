// Сохраняем API адрес (базу данных) в переменную API
const API = "http://localhost:8000/contact";
//вытаскиваем все инпуты и кнопки
let inpName = document.getElementById("inpName");
let inpSurname = document.getElementById("inpSurname");
let inpNum = document.getElementById("inpNum");
let kpiWeek = document.getElementById("inpKpiWeek");
let kpiMonth = document.getElementById("inpKpiMonth");
let btnAdd = document.getElementById("btnAdd");
let tbody = document.querySelector(".test");
let btnDelete = document.getElementsByClassName("btnDelete");
let searchValue = "";
let currentPage = 1;
//навешиваем событие на btnAdd
btnAdd.addEventListener("click", () => {
  if (
    !inpName.value.trim() ||
    !inpSurname.value.trim() ||
    !inpNum.value.trim() ||
    !kpiMonth.value.trim() ||
    !kpiWeek.value.trim()
  ) {
    Toastify({
      text: "please, write in all inputs",
      duration: 3000,
    }).showToast();
    return;
  }
  let newContact = {
    name: inpName.value,
    surname: inpSurname.value,
    number: +inpNum.value,
    kpiWeek: kpiWeek.value,
    kpiMonth: kpiMonth.value,
  };
  createContact(newContact);
});
//!create contact function start
function createContact(contactObj) {
  fetch(API, {
    method: "POST",
    headers: {
      "Content-Type": "application/json; charset=utf-8",
    },
    body: JSON.stringify(contactObj),
  })
    .then((res) => res.json())
    .then(() => {
      readContacts();
    });
  inpName.value = "";
  inpSurname.value = "";
  inpNum.value = "";
  kpiWeek.value = "";
  kpiMonth.value = "";
}
//!create function that shows contacts
function readContacts() {
  fetch(`${API}?q=${searchValue}&_page=${currentPage}&_limit=6`)
    .then((res) => res.json())
    .then((data) => {
      tbody.innerHTML = "";
      for (let i = 0; i < data.length; i++) {
        tbody.innerHTML += `
    <table>
      <tr>
      <th>${data[i].name}</th>
      <th>${data[i].surname}</th>
      <th>${data[i].number}</th>
      <th>${data[i].kpiWeek}</th>
      <th>${data[i].kpiMonth}</th>
      <th><button class="btnDelete" id="${data[i].id}">Delete</button></th>
      <th><button type="button" class="btn btn-warning btnEdit" id="${data[i].id}" data-bs-toggle="modal" data-bs-target="#exampleModal">
      Edit
    </button></th>
      </tr>
      </table>
      `;
      }
    });
}
readContacts();
// !функционал delete start==============================================

document.addEventListener("click", (e) => {
  let del_class = [...e.target.classList];
  if (del_class.includes("btnDelete")) {
    let del_id = e.target.id;
    fetch(`${API}/${del_id}`, {
      method: "DELETE",
    }).then(() => readContacts());
  }
});

// ! ============ EDIT START =============
let editInpName = document.getElementById("editInpName");
let editInpSurname = document.getElementById("editInpSurname");
let editInpNum = document.getElementById("editInpNum");
let editKpiWeek = document.getElementById("editKpiWeek");
let editKpiMonth = document.getElementById("editKpiMonth");
let btnEditSave = document.getElementById("btnEditSave");
// Событие на кнопку edit
document.addEventListener("click", (e) => {
  let arr = [...e.target.classList];

  if (arr.includes("btnEdit")) {
    let id = e.target.id;
    fetch(`${API}/${id}`)
      .then((res) => res.json())
      .then((data) => {
        editInpName.value = data.name;
        editInpSurname.value = data.surname;
        editInpNum.value = data.number;
        editKpiWeek.value = data.kpiWeek;
        editKpiMonth.value = data.kpiMonth;
        btnEditSave.setAttribute("id", data.id);
      });
  }
});

//? функция для отправления даных опять через saveChanges
btnEditSave.addEventListener("click", () => {
  let editedContact = {
    name: editInpName.value,
    surname: editInpSurname.value,
    number: editInpNum.value,
    kpiWeek: editKpiWeek.value,
    kpiMonth: editKpiMonth.value,
  };
  editContact(editedContact, btnEditSave.id);
});
function editContact(editObj, id) {
  fetch(`${API}/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json; charset=utf-8" },
    body: JSON.stringify(editObj),
  }).then(() => readContacts());
}
// ! ============ EDIT FINISH =============
//!==================SEARCH START=======================
let inpSearch = document.getElementById("inpSearch");
let btnSearch = document.getElementById("btnSearch");

inpSearch.addEventListener("input", (e) => {
  searchValue = e.target.value;
  readContacts();
});

//! ================SEARCH FINISH ===================
// ! =========== Paginate ==========
let prevBtn = document.getElementById("prevBtn");
let nextBtn = document.getElementById("nextBtn");

prevBtn.addEventListener("click", () => {
  currentPage--;
  readContacts();
});

nextBtn.addEventListener("click", () => {
  currentPage++;
  readContacts();
});
