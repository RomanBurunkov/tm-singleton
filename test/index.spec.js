const { isFunc, isObj, isEmpty } = require('tm-is');
const singleton = require('../index');

const requiredMethods = ['block', 'canCreate'];

class TestClass {
  constructor(a, b) {
    this.a = a;
    this.b = b;
  }

  sum() {
    return this.a + this.b;
  }
}

describe('Test singleton module', () => {
  test('Singletone should be defined', () => {
    expect(isEmpty(singleton)).toBe(false);
  });

  test('Singleton should be a function', () => {
    expect(isFunc(singleton)).toBe(true);
  });
});

describe('Test singleton emplementation', () => {
  describe('Check required methods defined', () => {
    const TestSingleton = singleton(TestClass);

    requiredMethods.forEach((method) => {
      test(`Singleton should have '${method}' method.`, () => {
        expect(isFunc(TestSingleton[method])).toBe(true);
      });
    });
  });

  describe('Test .INSTANCE getter', () => {
    const TestSingleton = singleton(TestClass);

    test('TestSingleton.INSTANCE should return null before creating an instance', () => {
      expect(TestSingleton.INSTANCE === null).toBe(true);
    });

    test('TestSingleton.INSTANCE should return an instance of object after creating.', () => {
      const testInstance = new TestSingleton();
      expect(TestSingleton.INSTANCE === testInstance).toBe(true);
    });
  });

  describe('Testing control methods and events.', () => {
    test('"canCreate" method returns "true" before creating an instance', () => {
      const TestSingleton = singleton(TestClass);
      expect(TestSingleton.canCreate()).toBe(true);
    });

    test('"canCreate" method returns "false" after creating an instance', () => {
      const TestSingleton = singleton(TestClass);
      new TestSingleton(); // eslint-disable-line no-new
      expect(TestSingleton.canCreate()).toBe(false);
    });

    test('"canCreate" method returns "false" after calling "block" method', () => {
      const TestSingleton = singleton(TestClass);
      TestSingleton.block();
      expect(TestSingleton.canCreate()).toBe(false);
    });
    test('It emits "create" event, after creating an instance', (done) => {
      const TestSingleton = singleton(TestClass);
      TestSingleton.eventEmitter.on('create', () => done());
      new TestSingleton(); // eslint-disable-line no-new
    });
  });

  describe('Testing creating an instance with a "new" keyword.', () => {
    test('It creates a new instance of the given singleton class if called first time', () => {
      const TestSingleton = singleton(TestClass);
      const testInstance = new TestSingleton();
      expect(isObj(testInstance) && testInstance instanceof TestClass).toBe(true);
    });

    test('It returns the same instance if called several times', () => {
      const TestSingleton = singleton(TestClass);
      const inst = new TestSingleton();
      expect(Array.from(Array(10).keys()).every(() => new TestSingleton() === inst)).toBe(true);
    });

    test('It throws an error if called more then once and option "errorOnDuplicate": true', () => {
      const TestSingleton = singleton(TestClass, { errorOnDuplicate: true });
      new TestSingleton(); // eslint-disable-line no-new
      expect(() => new TestSingleton()).toThrow(/exists/i);
    });

    test('It throws an error if creating an instance has been blocked with "block" method', () => {
      const TestSingleton = singleton(TestClass);
      TestSingleton.block();
      expect(() => new TestSingleton()).toThrow(/blocked/i);
    });
  });
});
