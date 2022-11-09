const tickerTasks = new Map<number, AbortController>()

window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply: function(target, thisArg, argumentsList: [FrameRequestCallback]) {
        const [ cb ] = argumentsList

        if (typeof cb !== 'function' || cb.name !== 'bound updateTimeout_') {
            // Probably not ticker
            return Reflect.apply(target, thisArg, argumentsList)
        }

        // Generate temporary key
        const key: number = Reflect.apply(target, thisArg, [() => {}])
        const controller = new AbortController()

        // Ticker run after 2 seconds
        setTimeout((signal: AbortSignal) => {
            if (!signal.aborted) {
                const id = Reflect.apply(target, thisArg, argumentsList)
                signal.addEventListener('abort', () => window.cancelAnimationFrame(id))
            }
            setTimeout(() => tickerTasks.delete(key), 1000);
        }, 2 * 1000, controller.signal)

        tickerTasks.set(key, controller)
        return key
    }
})

window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
    apply: function(target, thisArg, argumentsList: [number]) {
        const [ key ] = argumentsList

        const abortController = tickerTasks.get(key)
        if (abortController) {
            abortController.abort()
        }
        Reflect.apply(target, thisArg, argumentsList)
    }
})
