// ==UserScript==
// @name         Cobmais - Util
// @namespace    http://app.cobmais.com.br/
// @version      1.0.5
// @description  Add IdEvento
// @author       Rodrigo Mescua
// @match        http*://*.cobmais.com.br/*/telecobranca*
// @match        http*://localhost:*/telecobranca*
// @match        http*://172.36.1.4/*/telecobranca*
// @match        http*://192.36.1.4/*/telecobranca*
// @icon         https://raw.githubusercontent.com/romesc/cobmais-utils/master/favicon.ico
// @require  http://code.jquery.com/jquery-3.4.1.min.js
// @require  https://cdnjs.cloudflare.com/ajax/libs/clipboard.js/2.0.6/clipboard.min.js
// @grant    GM_addStyle
// @grant    GM_setClipboard
// ==/UserScript==
this.$ = this.jQuery = jQuery.noConflict(true) // eslint-disable-line no-undef
waitForKeyElements ("div.ev-item", actionFunction);
waitForKeyElements ("span.btneventofinal", testeCopy);


function actionFunction (jNode) {
    var torrents = document.querySelectorAll('span.ev-item-titulo');
    var teste = '';
    for ( var i = 0; i < torrents.length; i++ ) {
        var idEvento = torrents[i].parentElement.parentElement.id.replace('ev-item-','');
        teste = '  <span id="btnEv' + idEvento + '" title="Clique para Copiar o ID Evento" class="btn btnevento badge badge-primary" style="cursor: pointer" data-clipboard-text="' + idEvento + '">' + idEvento + '</span>';
        if (i == torrents.length - 1) {
            teste = '  <span id="btnEv' + idEvento + '" title="Clique para Copiar o ID Evento" class="btn btnevento btneventofinal badge badge-primary" style="cursor: pointer" data-clipboard-text="' + idEvento + '">' + idEvento + '</span>';
        }
        if (torrents[i].innerHTML.indexOf(teste) == -1){
            torrents[i].innerHTML = torrents[i].innerHTML.concat(teste);
        }
    }
}

function testeCopy (teste) {
    var btns = document.querySelectorAll('span.btnevento');
    var clipboard = new ClipboardJS(btns);

    clipboard.on('success', function(e) {
        toastr.success('ID Evento copiado para a Área de Transferência');
    });
}

/*--- waitForKeyElements():  A utility function, for Greasemonkey scripts,
    that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements (
            "div.comments"
            , commentCallbackFunction
        );

        //--- Page-specific function to do what we want when the node is found.
        function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/
function waitForKeyElements (selectorTxt, actionFunction, bWaitOnce, iframeSelector) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined") {
        targetNodes = $(selectorTxt);
    }
    else {
        targetNodes = $(iframeSelector).contents().find(selectorTxt);
    }

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}
