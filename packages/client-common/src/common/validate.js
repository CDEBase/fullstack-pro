// @flow
import { Validation, ValidationError } from './lib/validation';

class AppValidation extends Validation {

  // That's how we can add custom validations.
  superLongPassword() {
    return this.validate((value, prop) => {
      const minLength = 500;
      if (value.length >= minLength) return;
      throw new ValidationError('superLongPassword', { minLength, prop });
    });
  }

}

const validate = (json: Object) => new AppValidation(json);

export default validate;
