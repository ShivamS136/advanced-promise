# advanced-promise

A simple extension to the native Promise API

## Overview

This simple library provides you some handy extensions to the native Promise API like below:

-   Make the promise/fetch abortable
-   Get status of the promise at any stage
-   Bind some data to the promise and get that

## How to install

Simply run below:

```sh
npm install @shivams136/advanced-promise
```

## How to use

### Signature

```js
AdvancedPromise(([resolve] [, reject] [, signal])=>{
    // ...
} [, data]): AdvancedPromise
```

### Creating

There are below 2 ways to create an `AdvancedPromise`:

#### 1. Constructor

```js
const advPromise = new AdvancedPromise((resolve, reject, signal) => {
	//....
}, data);
```

#### 2. Existing Promise

```js
// Pass existing promise to the static `from` method
const advPromise = AdvancedPromise.from(promise);
```

### Abort

```js
// Abort with default reason - Aborted
advPromise.abort();

// Abort with custom reason
advPromise.abort("I just want to abort");

// cancel is alias of abort so you can use that too
advPromise.cancel();
```

### Getters

#### Abort Reason

```js
advPromise.abortReason; // default: Aborted
```

#### Status Methods

##### isFulfilled

```js
advPromise.isFulfilled; // true/false
```

##### isSettled

```js
advPromise.isSettled; // true/false
```

##### isRejected

```js
advPromise.isRejected; // true/false
```

##### status

```js
advPromise.status; // "pending" | "resolved" | "rejected"
```

### Examples:

#### Use with Fetch

```js
const loadData = (id) => {
	return new AdvancedPromise((resolve, reject, abortSignal) => {
		fetch(url, { signal: abortSignal })
			.then((response) => response.json())
			.then(parsedData)
			.then(resolve)
			.catch(reject);
	});
};

const advPromise = loadData(id);
advPromise.abort();
```

#### Hook the abort

You can add event listener on Abort action and do anything on abort of the error

```js
const advPromise = new AdvancedPromise((resolve, reject, abortSignal) => {
	abortSignal.addEventListener("abort", () => {
		// Do something when abort happens
	});
	// ...
});
```

### Use status

```js
const advPromise = new AdvancedPromise((resolve, reject, abortSignal) => {
	// ...
});
//...
//...
//...
const iconColor = advPromise.isFulfilled ? (advPromise.isSettled ? "green" : "red") : "orange";
```

### Use Data

```js
const advPromise = new AdvancedPromise(
	(resolve, reject, abortSignal) => {
		// ...
	},
	{ name: "Shivam", age: 25 }
);
//...
//...
//...
const promiseData = advPromise.data; // {name:"Shivam",age:25}
```

### Working Example with plain JS

You can find the code sandbox [here](https://codesandbox.io/s/advanced-promise-ej59h?file=/src/index.js).

```js
import AdvancedPromise from "@shivams136/advanced-promise";

const loadData = (id) => {
	return new AdvancedPromise((resolve, reject, abortSignal) => {
		fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
			signal: abortSignal,
		})
			.then((response) => response.json())
			.then(resolve)
			.catch(reject);
	});
};

const id = 1;
const advPromise = loadData(id);
advPromise
	.then((myData) => {
		console.log(myData);
	})
	.catch((err) => console.log("My Error:\n", err));
advPromise.abort();
```

### A working example on node

You can find the code sandbox [here](https://replit.com/@shivams136/Advanced-Promise#index.js).

```js
const fetch = require("node-fetch");
const AdvancedPromise = require("@shivams136/advanced-promise");

const loadData = (id) => {
	return new AdvancedPromise((resolve, reject, abortSignal) => {
		fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, { signal: abortSignal })
			.then((response) => response.json())
			.then(resolve)
			.catch(reject);
	});
};

const id = 1;
const advPromise = loadData(id);
advPromise
	.then((myData) => {
		console.log(myData);
	})
	.catch((err) => console.log("My Error:\n", err));
advPromise.abort();
```

## Contact

You can contact me on [github](https://github.com/ShivamS136) anytime.

This package is inspired by [this package](https://github.com/zzdjk6/simple-abortable-promise) from [Thor(Shenghan) Chen](https://github.com/zzdjk6).
