const { isFunc, isObj, isEmpty } = require('tm-is');
const singleton = require('../index');

const requiredMethods = [ 'block', 'canCreate' ];

class testClass {
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
    const testSingleton = singleton(testClass);
    
    requiredMethods.forEach((method) => {
      test(`Singleton should have '${method}' method.`, () => {
        expect(isFunc(testSingleton[method])).toBe(true);
      });
    });
  });

  describe('Test .INSTANCE getter', () => {
    const testSingleton = singleton(testClass);
    
    test('testSingleton.INSTANCE should return null before creating an instance', () => {     
      expect(testSingleton.INSTANCE === null).toBe(true);
    });

    test('testSingleton.INSTANCE should return an instance of object after creating.', () => {
      const testInstance = new testSingleton();
      expect(testSingleton.INSTANCE === testInstance).toBe(true);
    });
  });

  describe('Testing control methods.', () => {
    test('"canCreate" method returns "true" before creating an instance', () => {
      const testSingleton = singleton(testClass);
      expect(testSingleton.canCreate()).toBe(true);
    });

    test('"canCreate" method returns "false" after creating an instance', () => {
      const testSingleton = singleton(testClass);
      new testSingleton();
      expect(testSingleton.canCreate()).toBe(false);
    });

    test('"canCreate" method returns "false" after calling "block" method', () => {
      const testSingleton = singleton(testClass);
      testSingleton.block();
      expect(testSingleton.canCreate()).toBe(false);
    });
  });

  describe('Testing creating an instance with a "new" keyword.', () => {
    test('It creates a new instance of the given singleton class if called first time', () => {
      const testSingleton = singleton(testClass);
      const testInstance = new testSingleton();
      expect(isObj(testInstance) && testInstance instanceof testClass).toBe(true);
    });

    test('It returns the same instance if called several times', () => {
      const testSingleton = singleton(testClass);
      const testInstance = new testSingleton();
      expect(Array.from(Array(10).keys()).every(() => {
        return new testSingleton() === testInstance;
      })).toBe(true);
    });

    test('It throws an error if called more then once and option "errorOnDuplicate": true', () => {
      const testSingleton = singleton(testClass, { errorOnDuplicate: true });
      new testSingleton();
      expect(() => new testSingleton()).toThrow(/exists/i);
    });

    test('It throws an error if creating an instance has been blocked with "block" method', () => {
      const testSingleton = singleton(testClass);
      testSingleton.block();
      expect(() => new testSingleton()).toThrow(/blocked/i);
    });
  });
});
