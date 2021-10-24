import { isArray } from "core-js/core/array";

export {Function_cast};




// Function Operations 
function Function_is(value) {
    return typeof value === 'function';    
}

function Function_cast(value) {
    return Function_is(value)?value:Function_constant(value);
}

function Function_constant(value) {
    return function(){
        return value;
    }
}

// String Operations
function String_is(value){
    return typeof value === 'string';
}

// Array Opeartions 
function Array_is(value){
    return Array.isArray(value);
}