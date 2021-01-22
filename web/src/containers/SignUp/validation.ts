import { makeValidator } from 'src/services/validation';

const schema = {
    required: ['email', 'password', 'firstName', 'lastName', 'birthDate', 'gender', 'ssn'],
    properties: {
        email: { format: 'email' },
        gender: { enum: ['male', 'female', 'other'] },
        ssn: {
            type: 'string',
            pattern: '^[0-9]{9}$',
        },
        password: {
            type: 'string',
            pattern: '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})',
        },
    },
    errorMessage: {
        required: `Required`,
        properties: {
            email: 'Should be a valid email',
            ssn: 'Should be 9 digits long',
            password:
                'Password must contain at least one of lower and uppercase letter, number, special character and be at least 8 characters long',
        },
    },
};

export default makeValidator(schema);
