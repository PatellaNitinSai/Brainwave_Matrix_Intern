let expenses = [];
let totalAmount = 0;

const categorySelect = document.getElementById("category_select");
const amountInput = document.getElementById("amount_input");
const InfoInput = document.getElementById("info");
const dateInput = document.getElementById("date_input");
const addBtn = document.getElementById("add_btn");
const expenseTableBody = document.getElementById("expense-table-body");
const totalAmountCell = document.getElementById("total-amount");
document.querySelector("form").addEventListener("submit", function (event) {
  event.preventDefault();

  const category = categorySelect.value;
  const info = InfoInput.value;
  const amount = Number(amountInput.value);
  const date = dateInput.value;

  if (category === "") {
    alert("Please select a category");
    return;
  }
  if (isNaN(amount) || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  if (info === "") {
    alert("Please enter a valid info");
    return;
  }
  if (date === "") {
    alert("Please select a date");
    return;
  }

  const expense = { category, amount, info, date };
  expenses.push(expense);

  if (category === "Income") {
    totalAmount += amount;
  } else {
    totalAmount -= amount;
  }
  totalAmountCell.textContent = totalAmount;
  addExpenseToTable(expense);
  fetch("/add", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(expense),
  })
    .then((response) => response.json())
    .then((data) => console.log("Server response:", data))
    .catch((error) => console.error("Error:", error));
});
function addExpenseToTable(expense) {
  const newRow = expenseTableBody.insertRow();

  const categoryCell = newRow.insertCell();
  const AmountCell = newRow.insertCell();
  const InfoCell = newRow.insertCell();
  const dateCell = newRow.insertCell();
  const deleteCell = newRow.insertCell();

  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");

  deleteBtn.addEventListener("click", function () {
    expenses.splice(expenses.indexOf(expense), 1);
    if (expense.category === "Income") {
      totalAmount -= expense.amount;
    } else {
      totalAmount += expense.amount;
    }
    totalAmountCell.textContent = totalAmount;
    expenseTableBody.removeChild(newRow);
  });

  categoryCell.textContent = expense.category;
  AmountCell.textContent = expense.amount;
  InfoCell.textContent = expense.info;
  dateCell.textContent = expense.date;
  deleteCell.appendChild(deleteBtn);
}
