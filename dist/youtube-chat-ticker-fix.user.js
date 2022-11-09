// ==UserScript==
// @name        Youtube: Throttle a ticker repainting
// @description Reduce CPU usage on YouTube Live
// @namespace   https://github.com/sigsignv/youtube-chat-ticker-fix
// @updateURL   https://github.com/sigsignv/youtube-chat-ticker-fix/raw/main/dist/youtube-chat-ticker-fix.user.js
// @version     0.2.1
// @author      Sigsign
// @license     Apache-2.0
// @match       https://www.youtube.com/live_chat?*
// @match       https://www.youtube.com/live_chat_replay?*
// @run-at      document-start
// @grant       none
// ==/UserScript==
(function () {
'use strict';

const tickerTasks = new Map();
window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply: function (target, thisArg, argumentsList) {
        const [cb] = argumentsList;
        if (typeof cb !== 'function' || cb.name !== 'bound updateTimeout_') {
            // Probably not ticker
            return Reflect.apply(target, thisArg, argumentsList);
        }
        // Generate temporary key
        const key = Reflect.apply(target, thisArg, [() => { }]);
        const controller = new AbortController();
        // Ticker run after 2 seconds
        setTimeout((signal) => {
            if (!signal.aborted) {
                const id = Reflect.apply(target, thisArg, argumentsList);
                signal.addEventListener('abort', () => window.cancelAnimationFrame(id));
            }
            setTimeout(() => tickerTasks.delete(key), 1000);
        }, 2 * 1000, controller.signal);
        tickerTasks.set(key, controller);
        return key;
    }
});
window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
    apply: function (target, thisArg, argumentsList) {
        const [key] = argumentsList;
        const abortController = tickerTasks.get(key);
        if (abortController) {
            abortController.abort();
        }
        Reflect.apply(target, thisArg, argumentsList);
    }
});

})();
