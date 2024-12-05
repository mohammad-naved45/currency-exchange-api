const api_key = "2a0bc61a141bae5af2333e10";
const dropdowns = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form button");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const amountInput = document.querySelector(".amount input");



for (let select of dropdowns) {
  for (let currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = "selected";
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = "selected";
    }
    select.append(newOption);
  }

  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
  });
}

const updateExchangeRate = async () => {
  let amtVal = amountInput.value;
  if (amtVal === "" || amtVal < 1) {
    amtVal = 1;
    amountInput.value = "1";
  }

  const BASE_URL = `https://v6.exchangerate-api.com/v6/${api_key}/latest/${fromCurr.value}`;
  
  try {
    const response = await fetch(BASE_URL);
    if (!response.ok) {
      throw new Error("Failed to fetch exchange rates.");
    }
    const data = await response.json();

    const rate = data.conversion_rates[toCurr.value];
    const finalAmount = (amtVal * rate).toFixed(2);

    msg.innerText = `${amtVal} ${fromCurr.value} = ${finalAmount} ${toCurr.value}`;
  } catch (error) {
    msg.innerText = "Error fetching exchange rates. Please try again later.";
    console.error(error);
  }
};

const updateFlag = (element) => {
  const currCode = element.value;
  const countryCode = countryList[currCode];
  if (!countryCode) return; // Safety check

  const newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  const img = element.parentElement.querySelector("img");
  if (img) {
    img.src = newSrc;
  }
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

window.addEventListener("load", () => {
  updateExchangeRate();
});
