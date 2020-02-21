// Based on solution found here: https://github.com/facebook/react/issues/5465#issuecomment-157888325

export const makeCancellable = (promise) => {
    let isCancelled = false

    const wrappedPromise = new Promise((resolve, reject) => {
        promise.then( (val) => {
            isCancelled ? reject({isCancelled: true}) : resolve(val)
        });

        promise.catch( (error) => {
            isCancelled ? reject({isCancelled: true}) : reject(error)
        })
    })
    
    return {
        promise: wrappedPromise,
        cancel() {
            isCancelled = true
        },
    }
}
