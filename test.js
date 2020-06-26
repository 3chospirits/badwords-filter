const Filter = require("./index.js");
const filter = new Filter(undefined, {cleanWith: "$", useRegex: true});

console.log(filter.clean("uedsflisjdjalisd"));
console.log(filter.isUnclean(""));