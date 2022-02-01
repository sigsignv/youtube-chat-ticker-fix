// ==UserScript==
// @name      Youtube: Chat ticker throttling
// @namespace https://github.com/sigsignv/userjs-youtube-chat-ticker-throttling
// @version   0.1.0
// @author    Sigsign
// @license   MIT or Apache-2.0
// @match     https://www.youtube.com/live_chat?*
// @match     https://www.youtube.com/live_chat_replay?*
// @run-at    document-start
// @grant     none
// ==/UserScript==
(function () {
'use strict';

const tickerQueue = new Map();
let tickerTimer = null;
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply: function (target, thisArg, argumentsList) {
        const [cb] = argumentsList;
        if (typeof cb !== 'function' || cb.name !== 'bound updateTimeout_') {
            // Probably not ticker
            return Reflect.apply(target, thisArg, argumentsList);
        }
        // Generate pseudo id
        const id = Reflect.apply(target, thisArg, [() => { }]);
        tickerQueue.set(id, cb);
        // Ticker run at every 2 seconds
        if (tickerTimer === null) {
            tickerTimer = setTimeout(() => {
                tickerQueue.forEach(async (cb) => {
                    Reflect.apply(target, thisArg, [cb]);
                });
                tickerQueue.clear();
                tickerTimer = null;
            }, 2 * 1000);
        }
        return id;
    }
});
window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
    apply: function (target, thisArg, argumentsList) {
        const [key] = argumentsList;
        if (tickerQueue.delete(key)) {
            return;
        }
        Reflect.apply(target, thisArg, argumentsList);
    }
});

})();
