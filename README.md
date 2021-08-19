# tm-singleton

[![npm](https://img.shields.io/npm/v/tm-singleton.svg)](https://www.npmjs.org/package/tm-singleton)
[![codecov](https://codecov.io/gh/RomanBurunkov/tm-singleton/branch/main/graph/badge.svg?token=Z6DEN34H73)](https://codecov.io/gh/RomanBurunkov/tm-singleton)

Implements a Singleton design pattern with several extra control methods.

### Installation

```bash
npm i tm-singleton
```

### Tests

```bash
npm test
```

Tests with coverage

```bash
npm run test:coverage
```

### Options

You can pass options object to the singleton factory function, as a second argument.

```javascript
const singleton = require('tm-singleton');

const MyCounter = singletone(MySuperCounter, options);
const counter = new MyCounter();
```

Available options:

- `errorOnDuplicate` Will throw an error if you try to create instance with new operator, available values: true/false, default is false.

### API.

To create a new instance, just use a new operator.

e.g

```javascript
const singleton = require('tm-singleton');

const MyCounter = singletone(MySuperCounter);
const counter = new MyCounter();
```

To access an existing instance use INSTANCE getter.
If instance hasn't been created it will return null.

```javascript
const singleton = require('tm-singleton');

const MyCounter = singletone(MySuperCounter);

....

const counter = MyCounter.INSTANCE;
```

### Events

Singleton provides an event emitter.
You can access it due eventEmitter getter.

```javascript
const singleton = require('tm-singleton');

const MyCounter = singletone(MySuperCounter);

....

MyCounter.eventEmitter.on('create', () => doSomething());
```

Available events

* `create` emits once after creating an instance.

### Example

Create a module with a class which you want to make a singleton by wrapping it into a tm-singleton object:

```javascript

const singleton = require('tm-singleton');

// Below is an example of the counter class
// Which we are going to make a singleton.
class MySuperCounter {
  constructor(start = 0) {
    this.value = start;
  }

  increase(amount = 1) {
    this.value += amount;
    return this.value;
  }
}

// Wrapping it into a singleton object.
module.exports = singletone(MySuperCounter);
```

Require it somewhere in the code and create an instance.

```javascript

const MySuperCounter = require('./mySuperCounter');

const counter = new MySuperCounter(5);

console.log(counter.increase(5)); // Will show 10;
```

Require it another part of the code and create an instance.

```javascript

const MySuperCounter = require('./mySuperCounter');

const counter = new MySuperCounter(); // or const counter = MySuperCounter.INSTANCE;

console.log(counter.increase(5)); // Will show 15, since it is the same instance of your counter;
```
