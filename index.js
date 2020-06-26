class Filter {
	/**
	 * Constructs filter 
	 * @param {Array} list option to insert your own array of bad words
	 * @param {Object} config options for the filter
	 * @param {String} config.cleanWith a character to replace bad words with [default: '*']
	 * @param {number} config.strictness 0: high, 1: medium, 2:low, 3: off [default: 1]
	 * @param {boolean} config.useRegex true for enabling regex filtering, false for exact dictionary match *WARNING: large amounts of regex is much slower* [defailt: false]
	 */
	constructor(list, config) {
		if (!list) list = require("./filtersets/en.json").filter;
		this.useRegex = config ? config.useRegex : false;
		if (this.useRegex) {
			this.filter = new Set(
				list.map((r) => {
					return new RegExp(r, "g");
				})
			);
		} else {
			this.filter = new Set(list);
		}

		this.config = {};
		this.cleanWith = config && config.cleanWith ? config.cleanWith : "*";
		this.minFiltered = this.useRegex ? 0 : this.filter.values().next().value.length; //ADD DEFAULT VALUE FOR DEFAULT LIST
		if (!this.useRegex)
			this.filter.forEach((e) => {
				if (e.length < this.minFiltered) this.minFiltered = e.length;
			});

		this.strictness = config && config.strictness;
		this.replacements = new Map([
			["!", "i"],
			["@", "a"],
			["$", "s"],
			["3", "e"],
			["8", "b"],
			["1", "i"],
			["0", "o"],
			["4", "h"],
			["7", "t"],
			["9", "g"],
			["6", "b"],
			["8", "b"],
		]);
	}
	/**
	 * converts to lowercase, replaces accented characters, replaces common symbol/l33t text, removes non-alphabetical characters
	 * @param {String} string string to normalize
     * @returns {String} cleaned string
	 */
	normalize(string) {
		string = string
			.toLowerCase()
			.normalize("NFD")
			.replace(/[\u0300-\u036f]/g, ""); //removes accented characters
		this.replacements.forEach((replWith, targ) => (string = string.replace(new RegExp(targ, "g"), replWith)));
		return string.replace(/[^a-zA-Z\s]/g, ""); //removes non-alphabetical characters
	}
    /**
     * censors filtered words
     * @param {String} string message to censor filter words 
     * @returns {String} cleaned up message with filter words censored by cleanWith string
     */
	clean(string) {
        let censorIndexes = new Set(this.getUncleanWordIndexes(string));
        return string.split(/ +/g).map((w, i) => {
            if (censorIndexes.has(i)) return this.cleanWith.repeat(w.length);
            return w;
        }).join(" ");
    }
	getAllCombos(string) {
		return string.split(/ +/g).map((w) => {
			if (/(.)\1{1,}/.test(w) && w.length > this.minFiltered)
				//only tests those with at least one double char
				return allPossibleCases(combos(w));
			return [w];
		});
	}
	debug() {
		
    }
    /**
     * gets all the indexes of words that are filtered
     * @param {String} string message to check
     * @returns {Array} indexes of filtered words, empty if none detected
     */
    getUncleanWordIndexes(string){
        let uncleanIndexes = [];
        let arr = this.getAllCombos(this.normalize(string));
		for (let i = 0; i < arr.length; i++) 
			for (let j = 0; j < arr[i].length; j++) 
				if (this.isWordUnclean(arr[i][j])) uncleanIndexes.push(i);
		return uncleanIndexes;
    }
    /**
     * checks if a string has any filtered words
     * @param {String} string message to test 
     * @returns {boolean} true if contains filtered words
     */
	isUnclean(string) {
		let arr = this.getAllCombos(this.normalize(string));
		for (let i = 0; i < arr.length; i++) 
			for (let j = 0; j < arr[i].length; j++) 
				if (this.isWordUnclean(arr[i][j])) return true;
		return false;
    }
    /**
     * Checks if a word is filtered or not
     * @param {String} word word to check
     * @returns {boolean} Returns true if is filtered word
     */
	isWordUnclean(word) {
		if (this.useRegex) {
            let unclean = false;
			this.filter.forEach((r) => {
				if (r.test(word)) unclean = true;
            });
            return unclean;
        }
        else
            return this.filter.has(word);
	}
}
module.exports = Filter;

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
		for (var j = 0; j < arr[0].length; j++) result.push(arr[0][j] + allCasesOfRest[i]);
	return result;
}
function combos(word) {
	let val = [];
	let chop = word[0];
	for (let i = 1; i <= word.length; i++)
		if (chop[0] == word[i]) chop += word[i];
		else {
			val.push(chop);
			chop = word[i];
		}
	//return arr;
	let arr = [];
	for (let i = 0; i < val.length; i++) {
		let temp = [];
		if (val[i].length >= 2) temp.push(val[i][0].repeat(2));
		temp.push(val[i][0]);
		arr.push(temp);
	}
	return arr;
}
