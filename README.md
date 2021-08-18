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
