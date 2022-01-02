    import { readable } from 'svelte/store';
    let unsubscribe;

    // set up a readable store which returns the number of milliseconds between the moment the store is subscribed and following an interval
    export const time = readable(0, function start(set) {
        const beginning = new Date();
        const beginningTime = beginning.getTime();

        const interval = setInterval(() => {
            const currentTime = new Date().getTime();
            set(currentTime - beginningTime);
        }, 10);
        return function stop() {
            set(0);
            clearInterval(interval);
        };
    });


    let lapse = 0;
    let previous = 0;

    export function start() {
        unsubscribe = time.subscribe(value => {
            lapse = value + previous;
        });
    }
    export function pause() {
        previous = lapse;
        terminate();
	}
    export function terminate() {
        if (unsubscribe) {
            unsubscribe();
            unsubscribe = null;
        }
    }
    export function getTime(ms) { return new Date(ms).toISOString().slice(11, -1) }