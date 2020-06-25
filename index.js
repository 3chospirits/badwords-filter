class Filter {
    /**
     * 
     * @param {Array} list option to insert your own array of bad words
     * @param config options for the filter
     * @param {String} config.cleanWith a character to replace bad words with
     * @param {number} config.strictness 0: high, 1: medium, 2:low, 3: off 
     */
    constructor(list, config){
        this.filter = new Set(!list?require("./filtersets/en.json").filter:list);
        this.config = {};
        this.config.cleanWith = (config && config.cleanWith)?config.cleanWith:"*";
        this.minFiltered = this.filter.values().next().value.length; //ADD DEFAULT VALUE FOR DEFAULT LIST
        this.filter.forEach(e=>{
            if (e.length < this.minFiltered) this.minFiltered = e.length;
        })
        this.strictness = (config && config.strictness)
        //console.log(this.minFiltered);
    }

    clean(string){

    }
    debug(string){
        return splitIntoCombos(string);
    }
}
module.exports = Filter;

function splitIntoCombos(string){
    //return console.log(string.split(/ +/g))//.map(w=>console.log(w + "\n"));
    return string.split(/ +/g).map(w=>{
        if (/(.)\1{1,}/.test(w) && w.length > this.maxFiltered) //only tests those with at least one double char
            return allPossibleCases(combos(charSplitter(w)));
        return w;
    });
}
function comboWord(word){
    return allPossibleCases(combos(charSplitter(word)))
}
function charSplitter(word) {
	let arr = [];
	let chop = word[0];
	for (let i = 1; i <= word.length; i++)
		if (chop[0] == word[i]) chop += word[i];
		else {
			arr.push(chop);
			chop = word[i];
		}
	return arr;
}
function allPossibleCases(arr) {
	if (arr.length == 1) {
		return arr[0];
	}
	var result = [];
	var allCasesOfRest = allPossibleCases(arr.slice(1)); // recur with the rest of array
	for (var i = 0; i < allCasesOfRest.length; i++)
		for (var j = 0; j < arr[0].length; j++) 
			result.push(arr[0][j] + allCasesOfRest[i]);
	return result;
}
function combos(val) {
	let arr = [];
	for (let i = 0; i < val.length; i++) {
		let temp = [];
		if (val[i].length >= 2) temp.push(val[i][0].repeat(2));
		temp.push(val[i][0]);
		arr.push(temp);
	}
	return arr;
}