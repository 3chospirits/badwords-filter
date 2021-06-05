class Filter {
	/**
	 * Constructs filter
	 * @param {Object} config options for the filter
	 * @param {String[]} config.list filter list pulled in from default list or custom
	 * @param {Array<String | RegExp>} config.filter filter used in all functions
	 * @param {number} config.minFiltered minimum length string in filter (any other shorter word will be ignored)
	 * @param {String} config.cleanWith a character to replace bad words with [default: '*']
	 * @param {number} config.strictness 0: high, 1: medium, 2:low [default: 1]
	 * @param {boolean} config.useRegex true for enabling regex filtering, false for exact dictionary match *WARNING: large amounts of regex is much slower* [defailt: false]
	 */
	constructor(config) {
	  let list = config ? config.list : undefined
	  if (!list) list = require("./filtersets/en.json").filter //use default list
	  this.useRegex = config ? config.useRegex : false
	  if (this.useRegex) {
		this.filter = new Set(
		  list.map((r) => {
			return new RegExp(r, "g")
		  })
		)
	  } else {
		this.filter = new Set(list)
	  }
  
	  this.config = {}
	  this.cleanWith = config && config.cleanWith ? config.cleanWith : "*"
	  this.minFiltered = this.useRegex ? 0 : this.filter.values().next().value.length //ADD DEFAULT VALUE FOR DEFAULT LIST
	  if (!this.useRegex)
		this.filter.forEach((e) => {
		  if (typeof e !== "string") return
		  if (e.length < this.minFiltered) this.minFiltered = e.length
		})
  
	  //this.strictness = config && config.strictness; for the future
	  this.replacements = new Map([
		[/!/g, "i"],
		[/@/g, "a"],
		[/\$/g, "s"],
		[/3/g, "e"],
		[/8/g, "b"],
		[/1/g, "i"],
		[/0/g, "o"],
		[/4/g, "h"],
		[/7/g, "t"],
		[/9/g, "g"],
		[/6/g, "b"],
		[/8/g, "b"],
	  ])
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
		.replace(/[\u0300-\u036f]/g, "") //replaces accented characters
	  this.replacements.forEach((replWith, targ) => (string = string.replace(targ, replWith)))
	  return string.replace(/[^a-zA-Z\s]/g, "") //removes non-alphabetical characters
	}
	/**
	 * censors filtered words
	 * @param {String} string message to censor filter words
	 * @returns {String} cleaned up message with filter words censored by cleanWith string
	 */
	clean(string) {
	  let censorIndexes = new Set(this.getUncleanWordIndexes(string))
	  return string
		.split(/ +/g)
		.map((w, i) => {
		  if (censorIndexes.has(i)) return this.cleanWith.repeat(w.length)
		  return w
		})
		.join(" ")
	}
  
	/**
	 * gets all the combos for every word of a string
	 * @param {String} str string to get possible cases of
	 * @returns {String[][]} all possible combinations for each word
	 */
	getAllCombos(str) {
	  return str.split(/ +/g).map((w) => {
		if (/(.)\1{1,}/.test(w) && w.length > this.minFiltered)
		  //only tests those with at least one double char
		  return allPossibleCases(combos(w))
		return [w]
	  })
	}
  
	/**
	 * console.logs function calls with given string
	 * @param {String} str string to run tests on
	 */
	debug(str) {
	  console.log(`Normalized:\n\t${this.normalize(str)}`)
	  console.log(`isUnclean:\n\t${this.isUnclean(str)}`)
	  console.log(`uncleanWordIndexes:\n\t${this.getUncleanWordIndexes(str)}`)
	  console.log(`cleaned:\n\t${this.clean(str)}`)
	  console.log(`getCombos:\n\t${this.getAllCombos(str)}`)
	}
  
	/**
	 * gets all the indexes of words that are filtered
	 * @param {String} string message to check
	 * @returns {number[]} indexes of filtered words, empty if none detected
	 */
	getUncleanWordIndexes(string) {
	  string = this.normalize(string)
	  let uncleanIndexes = []
	  let arr = this.getAllCombos(this.normalize(string))
	  for (let i = 0; i < arr.length; i++)
		for (let j = 0; j < arr[i].length; j++) if (this.isWordUnclean(arr[i][j])) uncleanIndexes.push(i)
	  return uncleanIndexes
	}
  
	/**
	 * checks if a string has any filtered words
	 * @param {String} string message to test
	 * @returns {boolean} true if contains filtered words
	 */
	isUnclean(string) {
	  let arr = this.getAllCombos(this.normalize(string))
	  for (let i = 0; i < arr.length; i++)
		for (let j = 0; j < arr[i].length; j++) if (this.isWordUnclean(arr[i][j])) return true
  
	  return false
	}
  
	/**
	 * Checks if a word is filtered or not
	 * @param {String} word word to check
	 * @returns {boolean} returns true if is filtered word
	 */
	isWordUnclean(word) {
	  if (this.useRegex) {
		let detected = false
		this.filter.forEach((r) => {
		  if (r.test(word)) detected = true
		})
		return detected
	  } else return this.filter.has(word)
	}
  }
  /**
   * gets all possible cases for sentence
   * @param {String[][]} arr containing words of the sentence
   * @returns {String[]} flattened array containing all the possible combinations
   */
  function allPossibleCases(arr) {
	if (arr.length == 1) return arr[0]
	var result = []
	var allCasesOfRest = allPossibleCases(arr.slice(1)) // recur with the rest of array
	for (var i = 0; i < allCasesOfRest.length; i++)
	  for (var j = 0; j < arr[0].length; j++) result.push(arr[0][j] + allCasesOfRest[i])
	return result
  }
  /**
   * gets all the combos for a single word
   * @param {String} word word to get combos of
   * @returns {String[][]} possible combination for given word
   */
  function combos(word) {
	let val = []
	let chop = word[0]
	for (let i = 1; i <= word.length; i++)
	  if (chop[0] == word[i]) chop += word[i]
	  else {
		val.push(chop)
		chop = word[i]
	  }
	//return arr;
	let arr = []
	for (let i = 0; i < val.length; i++) {
	  let temp = []
	  if (val[i].length >= 2) temp.push(val[i][0].repeat(2))
	  temp.push(val[i][0])
	  arr.push(temp)
	}
	return arr
  }
  
  module.exports = Filter
  