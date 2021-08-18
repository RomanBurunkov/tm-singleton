/**
 * Implements a Singleton design pattern with several extra control methods.
 * @param {Class|Function} Cls Class or constructor function.
 * @param {Object} opts Options.
 * @param {boolean} opts.errorOnDuplicate Will throw an error if true and instance allready exists.
 * @returns {Object} A singleton object for the given class.
 */
module.exports = (Cls, opts = {}) => {
  let INSTANCE = null;
  let INSTANCES_COUNT = 0;

  return class Singleton {
    /**
     * Creates a new instance or returns an existed instance of the given class.
     * @param  {...any} args Argumets to pass to the instance's constructor.
     * @returns {Object} Instance of the singleton class.
     */
    constructor(...args) {
      if (INSTANCES_COUNT === -1) {
        throw new Error(`Creating new instances of ${Cls.name} was blocked!`);
      }
      if (INSTANCE === null) {
        INSTANCE = new Cls(...args);
        INSTANCES_COUNT = 1;
      } else if (opts.errorOnDuplicate === true) {
        throw new Error(`${Cls.name} instance already exists!`);
      }
      return INSTANCE;
    }

    static get INSTANCE() { return INSTANCE; }

    /**
     * Blocks creating an instance.
     */
    static block() { INSTANCES_COUNT = -1; }

    /**
     * Checks if instance could be created.
     * @returns {boolean} True if an instance could be created.
     */
    static canCreate() { return INSTANCES_COUNT === 0; }
  };
};
