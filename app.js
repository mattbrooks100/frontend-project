const $body = $("body");
const $main = $(".main-container");
const $tileContainer = $(".tile-container");
const $infoContainer = $(".info-container");
$infoContainer.hide();

//============================= REQUEST TOKEN DATA FROM API =============================//
const callAPI = () => {
  $.get("https://api.coincap.io/v2/assets", (response) => {
    tokenDataArray = response.data;
    for (let token of tokenDataArray) {
      createTokenTile(token);
    }
  });
};
callAPI();

//========================== CREATE/APPEND TILE FOR EACH TOKEN ==========================//
const createTokenTile = (token) => {
  const $tokenTile = $(`<div class="token-tile" id='${token.id}'></div>`);
  const $tokenInfoBasic = $(`<div class="token-basic"></div>`);
  const $tokenPrice = $(`<div class="token-price">$${Number(token.priceUsd).toFixed(2)}</div>`);
  $tokenInfoBasic.html(`<b>${token.name}</b> (${token.symbol}): `);
  $tokenTile.append($tokenInfoBasic);
  $tokenTile.append($tokenPrice);
  $tileContainer.append($tokenTile);

  const $infoBar = $(`<div class="info-bar" id="${token.id}-info"></div>`);
  const $infoBarHead = $(`<div class="info-bar-head"><b>${token.name}</b> (${token.symbol})</div>`);
  let $infoBarBody = $(`<div class="info-bar-body">Price: $${token.priceUsd}</br>
            Rank: ${token.rank}</br>
            Market Cap: $${Number(token.marketCapUsd).toFixed(2)}</br>
            Supply: ${token.supply}</br>
            Max Supply: ${token.maxSupply}</br>
            Volume Last 24hr: ${token.volumeUsd24Hr}</br>
            Percent Change 24hr: ${token.changePercent24Hr}
            </div>`);
  $infoBar.append($infoBarHead);
  $infoBar.append($infoBarBody);
  $infoBar.hide();
  $infoContainer.append($infoBar);

  // Clicking on tile displays expanded info bar
  const infoBarDisplay = (event) => {
    $infoContainer.children().hide();
    const id = event.target.id + "-info";
    $(`#${id}`).show();
    $infoContainer.show();
    const $close = $(`<button class="close">X</button>`);
    $infoContainer.append($close);
    $close.click(() => {
      $infoContainer.hide();
    });
  };
  $tokenTile.click(infoBarDisplay);
};

//================================= REFRESH TOKEN DATA =================================//
const refreshPrice = () => {
  $.get("https://api.coincap.io/v2/assets", (response) => {
    tokenDataArray = response.data;
    const $tokenPrice = $(".token-price");
    let i = 0;
    for (let token of tokenDataArray) {
      $tokenPrice[i].innerText = `$${Number(token.priceUsd).toFixed(2)}`;
      let $infoBarBody = $(".info-bar-body");
      $infoBarBody[i].innerHTML = `Price: $${token.priceUsd}</br>
                Rank: ${token.rank}</br>
                Market Cap: $${Number(token.marketCapUsd).toFixed(2)}</br>
                Supply: ${token.supply}</br>
                Max Supply: ${token.maxSupply}</br>
                Volume Last 24hr: ${token.volumeUsd24Hr}</br>
                Percent Change 24hr: ${token.changePercent24Hr}`;
      i++;
    }
  });
};
setTimeout(setInterval(refreshPrice, 3000), 3000);

//===================================== SEARCH BAR =====================================//
const $input = $(".input");
// Hide tiles that do not include the search text as the user types it in the search bar
const searchBar = () => {
  const searchRaw = $input[0].value.toLowerCase();
  for (let token of $tileContainer[0].children) {
    if (token.id.indexOf(searchRaw) > -1) {
      token.style.display = "";
    } else {
      token.style.display = "none";
    }
  }
};
const clear = () => {
    $input.reset();
};