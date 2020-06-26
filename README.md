[![npm](https://img.shields.io/npm/v/badwords-filter.svg)](https://www.npmjs.com/package/badwords-filter/)
[![npm](https://img.shields.io/npm/dt/badwords-filter.svg?maxAge=3600)](https://www.npmjs.com/package/badwords-filter/)
[![install size](https://packagephobia.now.sh/badge?p=badwords-filter)](https://packagephobia.now.sh/result?p=badwords-filter)

[![NPM](https://nodei.co/npm/badwords-filter.png?downloads=true&downloadRank=true&stars=true)](https://nodei.co/npm/badwords-filter/)

# badwords-filter

## Installation

```
npm i -s badwords-filter
```

An easy-to-use word filter with advanced detection techniques. A lightweight package with zero dependencies.

## Features

- no case-sensitivity
- detects L33t text
- detects accented characters
- detects extra/missing repeated characters
- works with regex strings or normal strings

## Usage

```js
const Filter = require("badwords-filter");
const config = {
	list: ["test", "hello"],
	cleanWith: "$",
	useRegex: false,
};
const filter = new Filter(config);
```

## Configuration options for filter

| Property    | Type      | Default           | Description                                              |
| ----------- | --------- | ----------------- | -------------------------------------------------------- |
| `list`      | `Array`   | en.json filterset | Array of filters in string format                        |
| `cleanWith` | `String`  | `"*"`             | Character to replace bad words with in clean function    |
| `useRegex`  | `boolean` | `false`           | Option to convert strings in `list` to regex expressions |

## Functions

| Function | Parameters | Returns | Description |
| --- | --- | --- | --- |
| `normalize` | `String` message to normalize | `String` normalized message | converts to lowercase, normalizes accented characters, converts l33t text to normal text, removes excess non-alphabetical characters _(automatically used in all package functions)_ |
| `isUnclean` | `String` message to check for cleanliness | `Boolean` true if contains any filtered word | parses message for any filtered words |
| `clean` | `String` message to clean | `String` cleaned message | replaces all filtered words with `cleanWith` character |
| `getUncleanWordIndexes` | `String` message to parse | `Array <number>` indexes of words that contain filtered words | gets indexes of all filtered words |
| `isWordUnclean` | `String` word to check | `Boolean` true if word is detected as a filtered word | checks if a word is filtered |
| `debug` | `String` message to test | `undefined` | prints to console the outputs of all functions on the given string |

## Example Detection

```js
const Filter = require("badwords-filter");
const config = { list: ["hello"] };
const filter = new Filter(config);

//All the following would return true
filter.isUnclean("hello");
filter.isUnclean("HeLlO");
filter.isUnclean("h3ll0");
filter.isUnclean("heeeellloooo");
filter.isUnclean("heeeeellllooooooo there!!!");
filter.isUnclean("héllo");
filter.isUnclean("h.#ell-o");
```

## Examples

### Using a custom filter list

#### Normal strings filter

```js
const Filter = require("badwords-filter");
const filter = new Filter({ list: ["badword"] });
filter.isUnclean("This sentence contains 'badword'"); // true
filter.isUnclean("This sentence does not contain any nasty words"); // false
filter.clean("This sentence contains 'badword'"); // "This sentence contains *********"
filter.getUncleanWordIndexes("This sentence contains 'badword'"); //[3]
filter.getUncleanWordIndexes("baaadword, goodword, okayword, badword"); // [0,3]
filter.isUnclean("baaaaaadw0rd"); //true
```

#### Regex strings filter

```js
const Filter = require("badwords-filter");
const filter = new Filter({
	list: ["b.+d"], // any word that stars with b and ends with d
	useRegex: true,
});
filter.isUnclean("marching band"); // true
filter.clean("marching band"); // "marching ****"
```

## Future Features

- support with phrases
- detects words with whitespace seperation
- more efficiency optimization
- sensitivity option for detection

```

```
