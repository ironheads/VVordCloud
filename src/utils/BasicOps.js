
export { castFunction, isString, isArray, isFunction, isObject, isUndefined, CeilDivisible }

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
