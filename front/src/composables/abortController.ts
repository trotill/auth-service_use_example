export function useAbortController () {
  let abortController: AbortController
  return <T, K>(getData: (...args: Array<T>) => Promise<K>, reqRaw: T) => {
    if (typeof AbortController !== 'function') {
      return getData({ ...reqRaw })
    }

    if (abortController !== undefined) {
      abortController.abort()
    }
    abortController = new AbortController()
    return getData({ ...reqRaw, options: { signal: abortController.signal } })
  }
}
