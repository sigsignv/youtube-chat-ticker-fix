type TickerQueue = Map<number, [FrameRequestCallback]>

const tickerQueue: TickerQueue = new Map()
let tickerTimer: number | null = null

const pseudoArgs = [
    () => {}
]

window.requestAnimationFrame = new Proxy(window.requestAnimationFrame, {
    apply: function(target, thisArg, argumentsList: [FrameRequestCallback]) {
        const [ cb ] = argumentsList

        if (typeof cb !== 'function' || cb.name !== 'bound updateTimeout_') {
            // Probably not ticker
            return Reflect.apply(target, thisArg, argumentsList)
        }

        // Generate pseudo id
        const id: number = Reflect.apply(target, thisArg, pseudoArgs)
        tickerQueue.set(id, argumentsList)

        // Ticker run at every 2 seconds
        if (tickerTimer === null) {
            tickerTimer = setTimeout(() => {
                tickerQueue.forEach(async (args) => {
                    Reflect.apply(target, thisArg, args)
                })
                tickerQueue.clear()
                tickerTimer = null
            }, 2 * 1000)
        }

        return id
    }
})

window.cancelAnimationFrame = new Proxy(window.cancelAnimationFrame, {
    apply: function(target, thisArg, argumentsList: [number]) {
        const [ key ] = argumentsList

        if (tickerQueue.delete(key)) {
            return
        }
        Reflect.apply(target, thisArg, argumentsList)
    }
})
