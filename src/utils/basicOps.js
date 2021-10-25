
export { Function_cast, String_is, Array_is, Function_is, Object_is, Undefined_is, CeilDivisible }

// Function Operations
function Function_is (value) {
  return typeof value === 'function'
}

function Function_cast (value) {
  return Function_is(value) ? value : Function_constant(value)
}

function Function_constant (value) {
  return function () {
    return value
  }
}

// String Operations
function String_is (value) {
  return typeof value === 'string'
}

// Array Opeartions
function Array_is (value) {
  return Array.isArray(value)
}

// Object Operations
function Object_is (value) {
  if (value) {
    return typeof value === 'object' || Function_is(value)
  }
  return false
}

function Undefined_is (value) {
  return typeof value === 'undefined'
}

function CeilDivisible (num, div) {
  return Math.ceil(num / div) * div
}
