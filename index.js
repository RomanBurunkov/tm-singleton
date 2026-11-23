const process = require('node:process');
const EventEmitter = require('node:events');

/**
 * @typedef {Object} SingletonOptions
 * @property {boolean} [errorOnDuplicate] Will throw on duplicate if true(def false).
 */

/**
 * @template {unknown[]} Args
 * @template T
 * @typedef {(new (...args: Args) => T) & {
 *   readonly INSTANCE: T | null,
 *   readonly eventEmitter: EventEmitter,
 *   block: () => void,
 *   canCreate: () => boolean
 * }} SingletonConstructor
 */

/**
 * @template T
 * @typedef {Object} SingletonContext
 * @property {T | null} instance The singleton instance.
 * @property {number} instancesCount Number of instances created.
 */

/** @type {SingletonOptions} */
const DEFAULT_OPTS = {
  errorOnDuplicate: false,
};

/**
 * Wraps a constructor in a singleton.
 * @template {unknown[]} Args
 * @template T
 * @param {new (...args: Args) => T} Cls Constructor to wrap.
 * @param {SingletonOptions} [options] Singleton options.
 * @returns {SingletonConstructor<Args, T>} Singleton constructor.
 */
module.exports = (Cls, options) => {
  if (!Cls || typeof Cls !== 'function') {
    throw new Error('Class is required');
  }

  /** Singleton options @type {SingletonOptions} */
  const opts = { ...DEFAULT_OPTS };
  if (options && typeof options.errorOnDuplicate === 'boolean') {
    opts.errorOnDuplicate = options.errorOnDuplicate;
  }

  /** Singleton context for current instance @type {SingletonContext<T>} */
  const context = {
    instance: null,
    instancesCount: 0,
  };

  const eventEmitter = new EventEmitter();

  return class Singleton {
    /**
     * Creates a new instance or returns an existed instance of the given class.
     * @param  {...any} args Argumets to pass to the instance's constructor.
     * @returns {Object} Instance of the singleton class.
     */
    constructor(...args) {
      if (context.instancesCount === -1) {
        throw new Error(`Creating new instances of ${Cls.name} was blocked!`);
      }

      if (opts.errorOnDuplicate && context.instance) {
        throw new Error(`${Cls.name} instance already exists!`);
      }

      if (context.instance === null) {
        context.instance = new Cls(...args);
        context.instancesCount = 1;
        process.nextTick(() => eventEmitter.emit('create'));
      }

      // Explicitly return the instance to enforce singleton
      return context.instance; // eslint-disable-line no-constructor-return
    }

    /**
     * Gets the singleton instance.
     * @returns {Object} The instance.
     */
    static get INSTANCE() { return context.instance; }

    /**
     * Event emitter for singleton events.
     * @returns {EventEmitter} The event emitter.
     */
    static get eventEmitter() { return eventEmitter; }

    /**
     * Blocks creating an instance.
     * After this, new instances can't be created.
     * @returns {void}
     */
    static block() { context.instancesCount = -1; }

    /**
     * Checks if instance could be created.
     * @returns {boolean} True if an instance could be created.
     */
    static canCreate() { return context.instancesCount === 0; }
  };
};
