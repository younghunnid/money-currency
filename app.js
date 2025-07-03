
let exchangeRates = {};
async function fetchRates(base = 'USD') {
  try {
    const response = await fetch('https://v6.exchangerate-api.com/v6/4c6d59ce5af45be8f877c813/latest/' + base);
    const data = await response.json();
    if (data.result !== 'success') throw new Error('API failed');
    exchangeRates = data.conversion_rates;
  } catch (error) {
    alert("Error fetching exchange rates.");
    console.error(error);
  }
}
async function convertCurrency() {
  const amount = parseFloat(document.getElementById('amount').value);
  const from = document.getElementById('fromCurrency').value;
  const to = document.getElementById('toCurrency').value;
  if (isNaN(amount)) {
    alert("Please enter a valid number.");
    return;
  }
  if (!exchangeRates[from] || !exchangeRates[to]) {
    await fetchRates(from);
  }
  const rate = exchangeRates[to];
  const converted = amount * rate;
  const display = `${amount} ${from} = ${converted.toFixed(2)} ${to}`;
  document.getElementById('result').innerText = display;
  saveToHistory(display);
}
function toggleDarkMode() {
  const body = document.getElementById('body');
  body.classList.toggle('dark');
  body.classList.toggle('bg-blue-50');
  body.classList.toggle('bg-gray-900');
  body.classList.toggle('text-white');
  body.classList.toggle('text-black');
}
function swapCurrencies() {
  const from = document.getElementById('fromCurrency');
  const to = document.getElementById('toCurrency');
  const temp = from.value;
  from.value = to.value;
  to.value = temp;
  convertCurrency();
}
function saveToHistory(entry) {
  let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  history.unshift(entry);
  if (history.length > 5) history = history.slice(0, 5);
  localStorage.setItem("conversionHistory", JSON.stringify(history));
  displayHistory();
}
function displayHistory() {
  const history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  const historyList = document.getElementById("history");
  historyList.innerHTML = "";
  history.forEach((item, index) => {
    const li = document.createElement("li");
    li.classList.add("flex", "justify-between", "items-center", "text-sm");
    const span = document.createElement("span");
    span.textContent = item;
    const delBtn = document.createElement("button");
    delBtn.textContent = "🗑️";
    delBtn.className = "ml-2 text-red-500";
    delBtn.onclick = () => {
      if (confirm("Are you sure you want to delete this conversion?")) {
        deleteHistory(index);
      }
    };
    li.appendChild(span);
    li.appendChild(delBtn);
    historyList.appendChild(li);
  });
  if (history.length > 0) {
    const clearBtn = document.createElement("button");
    clearBtn.textContent = "Clear All";
    clearBtn.className = "mt-2 text-sm text-red-600 underline";
    clearBtn.onclick = () => {
      if (confirm("Are you sure you want to clear all conversions?")) {
        clearAllHistory();
      }
    };
    historyList.appendChild(clearBtn);
  }
}
function clearAllHistory() {
  localStorage.removeItem("conversionHistory");
  displayHistory();
}
function deleteHistory(index) {
  let history = JSON.parse(localStorage.getItem("conversionHistory")) || [];
  history.splice(index, 1);
  localStorage.setItem("conversionHistory", JSON.stringify(history));
  displayHistory();
}
function filterOptions(inputId, selectId) {
  const input = document.getElementById(inputId).value.toLowerCase();
  const select = document.getElementById(selectId);
  for (let i = 0; i < select.options.length; i++) {
    const option = select.options[i];
    const text = option.textContent.toLowerCase();
    option.style.display = text.includes(input) ? "" : "none";
  }
}
window.onload = async () => {
  await fetchRates('USD');
  displayHistory();
};
