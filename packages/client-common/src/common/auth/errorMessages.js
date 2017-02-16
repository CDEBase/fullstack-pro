// @flow
import { defineMessages } from 'react-intl';

const errorMessages = defineMessages({
  required: {
    defaultMessage: `Please fill out {prop, select,
      email {email}
      password {password}
    }.`,
    id: 'auth.signInError.required',
  },
  email: {
    defaultMessage: 'Email address is not valid.',
    id: 'auth.signInError.email',
  },
  simplePassword: {
    defaultMessage: 'Password must contain at least {minLength} characters.',
    id: 'auth.signInError.simplePassword',
  },
});

export default errorMessages;
