const currencyEl_one = document.getElementById('currency-one');
const amountEl_one = document.getElementById('amount-one');
const currencyEl_two = document.getElementById('currency-two');
const amountEl_two = document.getElementById('amount-two');
const imgOne = document.querySelector('.imgOne');
const imgTwo = document.querySelector('.imgTwo');
const rateEl = document.getElementById('rate');
const infoEl = document.querySelector('.info');

function calculate() {
  const currency_one = currencyEl_one.value;
  const currency_two = currencyEl_two.value;
  const optionTextSelected =
    currencyEl_one.options[currencyEl_one.selectedIndex].text;

  async function upload() {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${currency_one}`
    );
    const resData = await response.json();
    return resData;
  }
  upload()
    .then((data) => {
      //set rate
      const rate = data.market_data.current_price[currency_two];
      console.log(rate);
      rateEl.innerText = `1 ${optionTextSelected} = ${rate} ${currency_two.toUpperCase()} `;

      //set info
      const info24H =
        data.market_data.price_change_percentage_24h_in_currency[
          currency_two
        ].toFixed(2);
      const info7D =
        data.market_data.price_change_percentage_7d_in_currency[
          currency_two
        ].toFixed(2);
      const info30D =
        data.market_data.price_change_percentage_30d_in_currency[
          currency_two
        ].toFixed(2);
      infoEl.innerHTML = `
      Percentage change 24hr: <span class= "day"> ${info24H}%</span><br>
      Percentage change 7d: <span class= " week"> ${info7D}%</span><br>
      Percentage change 30d: <span class= "month"> ${info30D}%</span><br>
      `;
      //set color of percentage num
      //24h
      if (info24H > 0) {
        infoEl.firstChild.nextSibling.classList.add('green');
      } else {
        infoEl.firstChild.nextSibling.classList.add('red');
      }
      //7D
      if (info7D > 0) {
        infoEl.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.classList.add(
          'green'
        );
      } else {
        infoEl.firstChild.nextSibling.nextSibling.nextSibling.nextSibling.classList.add(
          'red'
        );
      }
      //30D
      if (info30D > 0) {
        infoEl.lastChild.previousSibling.previousSibling.classList.add('green');
      } else {
        infoEl.lastChild.previousSibling.previousSibling.classList.add('red');
      }

      if (currency_two === 'usd' || currency_two === 'eur') {
        amountEl_two.value = (amountEl_one.value * rate).toFixed(2);
      } else {
        amountEl_two.value = (amountEl_one.value * rate).toFixed(8);
      }
    })
    .catch(() => {
      rateEl.innerText = new Error('failure to take data from API');
    });
}

//CARICA IMMAGINI
function uploadImgOne() {
  const currency_one = currencyEl_one.value;

  async function upload() {
    const response = await fetch(
      `https://api.coingecko.com/api/v3/coins/${currency_one}`
    );
    const resData = await response.json();
    return resData.image.small;
  }
  upload()
    .then((img) => (imgOne.src = img))
    .catch((err) => console.log(err));
}

function uploadImgTwo() {
  const currency_two = currencyEl_two.value;
  //ricevo la classe del option selezionato
  const optionClassSelected =
    currencyEl_two.options[currencyEl_two.selectedIndex].className;
  console.log(optionClassSelected);

  if (currency_two === 'usd') {
    imgTwo.src = './img/dollaro.png';
  } else if (currency_two === 'eur') {
    imgTwo.src = './img/eur.png';
  } else {
    async function upload() {
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${optionClassSelected}`
      );
      const resData = await response.json();
      return resData.image.small;
    }
    upload()
      .then((img) => (imgTwo.src = img))
      .catch((err) => console.log(err));
  }
}

//event listeners
document.addEventListener('DOMContentLoaded', function () {
  uploadImgOne();
  uploadImgTwo();
  calculate();
});
currencyEl_one.addEventListener('change', function () {
  uploadImgOne();
  calculate();
});
currencyEl_two.addEventListener('change', function () {
  uploadImgTwo();
  calculate();
});
amountEl_one.addEventListener('input', calculate);
