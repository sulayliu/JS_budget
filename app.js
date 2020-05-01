class Transaction{
  constructor(description, amount, id) {
    this.description = description;
    this.amount = amount;
    this.date = this._curentDate();
    this.id = id;
  }

  _curentDate() { 
    const now = new Date();
    let year = now.getFullYear(); 
    let month = monthArray[now.getMonth()];     
    let day = now.getDate();
    
    switch(day.toString().slice(-1)) {
      case `1`:
        day += "st";
        break;
      case `2`:
        day += "nd";
        break;
      case `3`:
        day += "rd";
        break;
      default:
        day += "th";
    }
    return month + " " + day + ", " + year;
  };
};

class TransactionList{
  constructor() {
    this.incomeList = [];
    this.expenseList = [];
    this.id = 0;
  }

  addNewTransaction(description, value) {
    if(value >= 0) {
      this.incomeList.push(new Transaction(description, Math.abs(value), this.id++));
    } else {
      this.expenseList.push(new Transaction(description, Math.abs(value), this.id++));
    }
    this.redraw();
  };

  removeTransaction(id) {
    this.incomeList = this.incomeList.filter(item => item.id != id);
    this.expenseList = this.expenseList.filter(item => item.id != id);
    this.redraw();
  };

  redraw() {
    income.innerHTML = ``;
    expenses.innerHTML = ``;

    let incomeItems = ``;
    let expenseItems = ``;
    let incomeAmount = 0;
    let expenseAmount = 0;

    this.incomeList.forEach(item => {
      incomeItems = `
      <div class="item" data-transaction-id="${item.id}">
      <div class="item__description">${item.description}</div>            
      <div class="right">
        <div class="item__value">+ $${item.amount.toFixed(2)}</div>
        <div class="item__delete">
          <button class="item__delete--btn">
            <i class="ion-ios-close-outline"></i>
          </button>
        </div>
      </div>
      <div class="item__date">${item.date}</div>
      </div>` + incomeItems;

      incomeAmount += item.amount;
    });
    
    // Update the income lists.
    income.insertAdjacentHTML(`afterbegin`, incomeItems);

    // Update the budget values of incomes.
    document.querySelector(`.budget__income--value`).textContent = `+ $${incomeAmount.toFixed(2)}`;

    this.expenseList.forEach(item => {
      let itemPercentage;

      if(incomeAmount === 0) {
        itemPercentage = `∞ `;
      } else {
        itemPercentage = (item.amount/incomeAmount * 100).toFixed(0);
      }

      expenseItems = `
      <div class="item" data-transaction-id="${item.id}">
        <div class="item__description">${item.description}</div>
        <div class="right">
          <div class="item__value">- $${item.amount.toFixed(2)}</div>
          <div class="item__percentage">${itemPercentage}%</div>
          <div class="item__delete">
            <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
          </div>
        </div>
        <div class="item__date">${item.date}</div>
      </div>` + expenseItems;

      expenseAmount += item.amount;
    });

    // Update the expense list.
    expenses.insertAdjacentHTML(`afterbegin`, expenseItems);

    // Update the budget values of expenses and the rest budget.
    let budgetValue = incomeAmount - expenseAmount;
    let expensesPercentage;

    if(expenseAmount === 0) {
      expensesPercentage = 0;
    } else if(incomeAmount === 0) {
      expensesPercentage = `∞ `;
    } else {
      expensesPercentage = (expenseAmount/incomeAmount * 100).toFixed(0);
    }

    document.querySelector(`.budget__expenses--value`).textContent = `- $${expenseAmount.toFixed(2)}`;
    document.querySelector(`.budget__expenses--percentage`).textContent = `${expensesPercentage}%`;
    document.querySelector(`.budget__value`).textContent = `${budgetValue >= 0 ? `+` : `-`} $${Math.abs(budgetValue).toFixed(2)}`
  };
};

const monthArray = [`Jan.`, `Feb.`, `Mar.`, `Apr.`, `May`, `Jun.`, `Jul.`, `Aug.`, `Sep.`, `Oct.`, `Nov.`, `Dec.`];
const addcontainer = document.querySelector(`.add__container`);
const description = document.querySelector(`.add__description`);
const addValue = document.querySelector(`.add__value`);
const income = document.querySelector(`.income__list`);
const expenses = document.querySelector(`.expenses__list`);
const container = document.querySelector(`.container`);
const transactionList = new TransactionList();
let date = new Date();

// Update the budget title with current month and year.
document.querySelector(`.budget__title--month`).textContent = `${monthArray[date.getMonth()]} ${date.getFullYear()}`

addcontainer.addEventListener('click', function(event) {
  if(event.target.nodeName === `I` && description.value !== `` && addValue.value !== `` && addValue.value != 0) {
    transactionList.addNewTransaction(description.value, addValue.value);
    description.value = "";
    addValue.value = ""; 
  }
});

container.addEventListener(`click`, function(event) {
  if(event.target.nodeName === `I`) {
    transactionList.removeTransaction(event.target.closest(`.item`).dataset.transactionId);
  }
});