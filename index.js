// // Q10 Palindrome
// function checkPalindrome(str){
// const length = str.length
//     for(let i=0; i< length/2; i++){
//         if(str[i] !== str[length-1-i]){
//             return "Its is not palindorme"
//         }
//     }
//     return "It is palindorme"
// }

// console.log(checkPalindrome("BoB"))

// Q. Prime to uppercase   
function manipulateString(str) {
    let digitPattern = /[0-9]/g;
    let isDigitExists = digitPattern.test(str);
    if(isDigitExists) {
        return 'EXCEPTION';
    }
    for(let  i = 0; i < str.length; i++) {
        let isIndexPrime = isPrime(i+1);
        if(isIndexPrime) {
            str = str.substr(0, i) +  str.charAt(i).toUpperCase() + str.substr(i+1, str.length);
        }
    }
    return str;
}
function isPrime(num) { 
    for(var i = 2; i < num; i++) { 
        if(num % i === 0) {
            return false; 
        }
        return num > 1;
    }
}

console.log(manipulateString("qset"))

