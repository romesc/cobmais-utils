// ==UserScript==
// @name         Cobmais - Util
// @namespace    http://app.cobmais.com.br/
// @version      0.1
// @description  Add IdEvento
// @author       Rodrigo Mescua
// @match        http*://app.cobmais.com.br/cob/telecobranca*
// @match        http*://hmlapp.cobmais.com.br/cob/telecobranca*
// @match        http*://localhost:*/telecobranca*
// @require  http://code.jquery.com/jquery-3.4.1.slim.min.js
// @require  https://gist.github.com/raw/2625891/waitForKeyElements.js
// @grant    GM_addStyle
// ==/UserScript==

waitForKeyElements ("div.ev-item", actionFunction);

function actionFunction (jNode) {
    var torrents = document.querySelectorAll('span.ev-item-titulo');

    for ( var i = 0; i < torrents.length; i++ ) {
        var teste = ' - IdEv: ' + torrents[i].parentElement.parentElement.id.replace('ev-item-','') + '.';
        if (torrents[i].innerText.indexOf(teste) == -1){
            torrents[i].innerText = torrents[i].innerText.concat(teste)
        }
    }
}
