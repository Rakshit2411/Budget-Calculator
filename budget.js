// This veriables are for updating date, month and year. 
const date = new Date();
const fullNameMonth = ["January", "February", "March", "April", "May", "June", "July",
  "August", "September", "October", "November", "December"];
const shortNameMonth = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];


class TransactionList {
  constructor() {
    this.id = 0;  // an id to keep track of every transaction. 
    this.incomeList = [];  //an array to store incomes. 
    this.expenseList = [];  // an array to store expenses.
  }

  // This method will add new transaction to perticular array.
  addNewTransaction(description, amount) {
    if (amount < 0) {
      this.expenseList.push(new Transaction(description, amount, this.id++));
    } else {
      this.incomeList.push(new Transaction(description, amount, this.id++));
    }
    CreateTransactions.generateIncome();
    CreateTransactions.generateExpense();
  }

  // This method will remove perticular transaction from the arrays. 
  removeTransaction(id) {
    this.incomeList = this.incomeList.filter(income => income.id != id);
    this.expenseList = this.expenseList.filter(expense => expense.id != id)

    CreateTransactions.generateIncome();
    CreateTransactions.generateExpense();
  }

  // this method will make total of incomes.  
  totalOfIncomes() {
    let totalOfIncome = 0;
    this.incomeList.forEach(transaction => {
      totalOfIncome += parseFloat(transaction.amount);
    });
    return totalOfIncome.toFixed(2);
  }

  // this method will make total of expenses.
  totalOfExpenses() {
    let totalOfExpense = 0;
    this.expenseList.forEach(transaction => {
      totalOfExpense -= parseFloat(transaction.amount);
    });
    return totalOfExpense.toFixed(2);
  }
}

// A class to create new transaction.  
class Transaction {
  constructor(description, amount, id) {
    this.amount = amount;
    this.description = description;
    this.date = shortNameMonth[date.getMonth()] + ". " + date.getDate() + "th," + " " + date.getFullYear();
    this.id = id;
  }
}

// This class has different methods that will make changes in the programe and html file.  
class CreateTransactions {

  // this methode will generate html codes for each income entry. 
  static generateIncome() {
    const income__list = document.querySelector(".income__list");
    income__list.innerHTML = '';
    transactionList.incomeList.forEach(income => {
      income__list.insertAdjacentHTML("beforeend", `
          <div class="item" data-transaction-id= ${income.id}>
          <div class="item__description">${income.description}</div>
            <div class="right">
              <div class="item__value">+ $${parseFloat(income.amount).toFixed(2)}</div>
                <div class="item__delete">
                  <button class="item__delete--btn">
                    <i class="ion-ios-close-outline"></i>
                  </button>
                </div>
              </div>
            <div class="item__date">${income.date}</div>
          </div>`)
    });
    CreateTransactions.updateTotalOfIncomes();
    CreateTransactions.updateFinalTotal();
    CreateTransactions.updateMainPercentages();
  }

  // this methode will generate html codes for each expense entry.
  static generateExpense() {
    const expense__list = document.querySelector(".expenses__list");
    expense__list.innerHTML = '';
    transactionList.expenseList.forEach(expense => {
      expense__list.insertAdjacentHTML("beforeend", `
        <div class="item" data-transaction-id=${expense.id}>
        <div class="item__description">${expense.description}</div>
          <div class="right">
            <div class="item__value"> - $${parseFloat(-expense.amount).toFixed(2)}</div>
            <div class="item__percentage">${(parseFloat((-expense.amount) / transactionList.totalOfIncomes()) * 100).toFixed()}%</div>
              <div class="item__delete">
                <button class="item__delete--btn">
                  <i class="ion-ios-close-outline"></i>
                </button>
              </div>
            </div>
          <div class="item__date">${expense.date}</div>
        </div>`)
    });
    CreateTransactions.updateTotalOfExpenses();
    CreateTransactions.updateFinalTotal();
    CreateTransactions.updateMainPercentages();
  }

  // a method to update the total of all incomes.
  static updateTotalOfIncomes() {
    const totalImcome = document.querySelector(".budget__income--value");
    totalImcome.textContent = "+ $" + transactionList.totalOfIncomes();
  }

  // a method to update the total of all expenses.
  static updateTotalOfExpenses() {
    const totalExpence = document.querySelector(".budget__expenses--value");
    totalExpence.textContent = "- $" + transactionList.totalOfExpenses();
  }

  // a method to update the final total using total of incomes and total of expenses.
  static updateFinalTotal() {
    const finalTotal = document.querySelector(".budget__value");
    let total = transactionList.totalOfIncomes() - transactionList.totalOfExpenses();
    if (total != 0) {
      if (total > 0) {
        finalTotal.textContent = `+ $${parseFloat(total).toFixed(2)}`;
      } else {
        finalTotal.textContent = `- $${parseFloat(-total).toFixed(2)}`;
      }
    } else {
      finalTotal.textContent = `$0.00`;
    }
  }

  // a methode to calculate and update the main percentages of expenses total.
  static updateMainPercentages() {
    const percentage = document.querySelector(".budget__expenses--percentage");
    let calculatedPercentages = (transactionList.totalOfExpenses() / transactionList.totalOfIncomes()) * 100;
    if (transactionList.incomeList.length === 0 && transactionList.expenseList.length === 0) {
      percentage.textContent = "0%";
    } else {
      percentage.textContent = `${calculatedPercentages.toFixed()}%`;
    }
  }
}

// some constants to make this programe work and to add eventlistener. 
const transactionList = new TransactionList();
const checkmarkButton = document.querySelector('.ion-ios-checkmark-outline');
const descriptionField = document.querySelector(".add__description");
const valueField = document.querySelector(".add__value");
const deleteTransaction = document.querySelector(".container");
const budgetMonth = document.querySelector(".budget__title--month");
budgetMonth.innerHTML = fullNameMonth[date.getMonth()] + " " + date.getFullYear();

// an event listener method to make new entry.
checkmarkButton.addEventListener('click', function () {
  if (descriptionField.value !== '' && valueField.value !== '') {
    transactionList.addNewTransaction(descriptionField.value, valueField.value);
    // reset both values for next input.
    descriptionField.value = '';
    valueField.value = '';
  }
});

// an event listener method to delete entry.
deleteTransaction.addEventListener('click', event => {
  if (event.target.classList.contains("ion-ios-close-outline")) {
    let div = event.target.parentElement;
    while (div.className != 'item') {
      div = div.parentElement;
    }
    transactionList.removeTransaction(div.dataset.transactionId);
  }
});