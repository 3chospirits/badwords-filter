const Filter = require('./index.js');
const filter = new Filter({
    list: ["b.+d"], // any word that stars with b and ends with d
    useRegex: true});
// const filter = new Filter({
//         list: ["band"], // any word that stars with b and ends with d
//         useRegex: false});
console.log(filter.isUnclean("marching band")); // true
console.log(filter.clean("marching band")); // "marching ****"


// const Filter = require("./index.js");
// const filterDefault = new Filter();
// let testCases = [
//     "this sentence should be 100% clean",
//     "this sentence has one dirty word: porn",
//     "the filter detects duplicated letters in bad words: ppooooorrrnnnnn",
//     "also detects l33t attempts to bypass: p0rn",
//     "and ignores symbols that are not l33t: p.o~r*n",
//     "also works with multiple bad words in one sentence or accents: porn and héntai",
// ]
// testCases.forEach((c,num)=>{
//     // num = 1;
//     // c = "the filter detects duplicated letters in bad words: ppooooorrrnnnnn";
//     console.log("\x1b[4m%s\x1b[0m", `Test Case ${num}`);
//     console.log(`original message:`);
//     console.log("\x1b[31m%s\x1b[0m", `\t${c}`);
//     console.log(`filtered:`);
//     console.log("\x1b[32m%s\x1b[0m", `\t${filterDefault.clean(c)}`);
// })
// console.log("\x1b[0m", "");
