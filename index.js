/**
 * Implements Singleton design pattern with several extra control methods.
 * @param {Class|Function} Cls Class or constructor function.
 * @param {Object} opts Options.
 * @param {boolean} opts.errorOnDuplicate Will throw an error if true and instance allready exists.
 * @returns {Object} A singleton object for the given class.
 */
module.exports = (Cls, opts = {}) => {
  let INSTANCE = null;
  let INSTANCES_COUNT = 0;

  return {
    get INSTANCE() {
      return INSTANCE;
    },

    /**
     * Block creating an instance.
     */
    block() {
      INSTANCES_COUNT = -1;
    },

    /**
     * Check if instance could be created.
     * @returns {boolean} True if if instance could be created.
     */
    canCreate() {
      return INSTANCES_COUNT === 0;
    },

    /**
     * Creates an instance of singleton class or returns existed instance.
     * @param  {...any} args
     * @returns {Object} Instance of the singleton class.
     */
    create(...args) {
      if (INSTANCES_COUNT === -1) {
        throw new Error(`Creating new instances of ${Cls.name} blocked!`);
      }
      if (INSTANCE === null) {
        INSTANCE = new Cls(...args);
        INSTANCES_COUNT = 1;
      } else if (opts.errorOnDuplicate === true) {
        throw new Error(`${Cls.name} instance already exists!`);
      }
      return INSTANCE;
    },
  };
};
