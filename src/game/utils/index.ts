export function devLog(...args: any[]) {
    return process.env.NODE_ENV !== 'production' && console.log(...args)
}