
export { castFunction, isString, isArray, isFunction, isObject, isUndefined, CeilDivisible, workerCall }

// Function Operations
function isFunction (value) {
  return typeof value === 'function'
}

function castFunction (value) {
  return isFunction(value) ? value : constFunction(value)
}

function constFunction (value) {
  return function () {
    return value
  }
}

// String Operations
function isString (value) {
  return typeof value === 'string'
}

// Array Opeartions
function isArray (value) {
  return Array.isArray(value)
}

// Object Operations
function isObject (value) {
  if (value) {
    return typeof value === 'object' || isFunction(value)
  }
  return false
}

function isUndefined (value) {
  return typeof value === 'undefined'
}

function CeilDivisible (num, div) {
  return Math.ceil(num / div) * div
}

// call worker's function and get information (like rpc)
function workerCall (worker, data) {
  worker.postMessage(data)
  return getWorkerMessage(worker)
}

// receive data from worker
function getWorkerMessage (worker) {
  return new Promise(
    (resolve, reject) => {
      const dispose = () => {
        worker.removeEventListener('message', messageHandler)
        worker.removeEventListener('error', errorHandler)
      }
      const messageHandler = ({ data }) => {
        dispose()
        resolve(data)
      }
      const errorHandler = ({ error }) => {
        dispose()
        reject(error)
      }
      worker.addEventListener('message', messageHandler)
      worker.addEventListener('error', errorHandler)
    }
  )
}
