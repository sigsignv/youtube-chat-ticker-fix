// ==UserScript==
// @name        Youtube: Throttle a ticker repainting
// @description Reduce CPU usage on YouTube Live
// @namespace   https://github.com/sigsignv/youtube-chat-ticker-fix
// @version     0.1.3
// @author      Sigsign
// @license     Apache-2.0
// @match       https://www.youtube.com/live_chat?*
// @match       https://www.youtube.com/live_chat_replay?*
// @run-at      document-start
// @grant       none
// ==/UserScript==
(function () {
'use strict';

const tickerQueue = new Map();
let tickerTimer = null;
const pseudoArgs = [
    () => { }
];
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply: function (target, thisArg, argumentsList) {
        const [cb] = argumentsList;
        if (typeof cb !== 'function' || cb.name !== 'bound updateTimeout_') {
            // Probably not ticker
            return Reflect.apply(target, thisArg, argumentsList);
        }
        // Generate pseudo id
        const id = Reflect.apply(target, thisArg, pseudoArgs);
        tickerQueue.set(id, argumentsList);
        // Ticker run at every 2 seconds
        if (tickerTimer === null) {
            tickerTimer = setTimeout(() => {
                tickerQueue.forEach(async (args) => {
                    Reflect.apply(target, thisArg, args);
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
