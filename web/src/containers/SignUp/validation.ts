import { makeValidator } from 'src/services/validation';

const schema = {
    required: ['email', 'password'],
    properties: {
        email: { format: 'email' },
    },
    errorMessage: {
        required: `Required`,
        properties: {
            email: 'Should be a valid email',
        },
    },
};

export default makeValidator(schema);
