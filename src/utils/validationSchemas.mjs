export const createUserValidationSchema = {
    userName: {
        isLength: {
            options: {min: 3, max: 32},errorMessage: 'UserName must be from 3 to 32 characters'
        },
        notEmpty: {
            errorMessage: 'UserName cannot be empty'
        },
        isString: {
            errorMessage: 'UserName must be a string'
        }
    },
    displayName: {
        isLength: {
            options: {min: 4, max: 32},errorMessage: 'displayName must be from 4 to 32 characters'
        },
        notEmpty: {
            errorMessage: 'displayName cannot be empty'
        },
        isString: {
            errorMessage: 'displayName must be a string'
        }
    } 
}