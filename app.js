const $body = $("body");
const $main = $(".main-container");
const $tileContainer = $(".tile-container");
const $infoContainer = $(".info-container");
$infoContainer.hide();

//============================== REQUEST TOKEN DATA FROM API ==============================//
const callAPI = () => {
  $.get("https://api.coincap.io/v2/assets", (response) => {
    const tokenDataArray = response.data;
    $tileContainer.children().remove();
    for (let token of tokenDataArray) {
      createTokenTile(token);
    }
  });
};
callAPI();

// Refresh tiles periodically
setInterval(callAPI, 5000);

//=========================== CREATE/APPEND TILE FOR EACH TOKEN ===========================//
const createTokenTile = (token) => {
  const $tokenTile = $(`<div class="token-tile" id='${token.id}'></div>`);
  const $tokenInfoBasic = $('<div class="token-basic"></div>');
  const price = Number(token.priceUsd).toFixed(2);
  $tokenInfoBasic.html(`<b>${token.name}</b> (${token.symbol}): $${price}`);
  $tokenTile.append($tokenInfoBasic);
  $tileContainer.append($tokenTile);

  // Clicking on tile displays expanded info in info bar
  $tokenTile.click(() => {
    const id = $tokenTile[0].id;
    $.get(`https://api.coincap.io/v2/assets/${id}`, () => {
      const $infoBar = $(`<div class="info-bar"></div>`);
      const $infoBarHead = $(
        `<div class="info-bar-head"><b>${token.name}</b> (${token.symbol})</div>`
      );
      const $infoBarBody = $(`<div class="info-bar-body">Price: $${token.priceUsd}</br>
      Rank: ${token.rank}</br>
      Market Cap: $${Number(token.marketCapUsd).toFixed(2)}</br>
      Supply: ${token.supply}</br>
      Max Supply: ${token.maxSupply}</br>
      Volume Last 24hr: ${token.volumeUsd24hr}</br>
      Percent Change 24hr: ${token.changePercent24Hr}
      </div>`);
      $infoContainer.children().remove();
      $infoBar.append($infoBarHead);
      $infoBar.append($infoBarBody);
      $infoContainer.prepend($infoBar);
      $infoContainer.show();
    });
  });
};
