export const amplifyConfig = {
  Auth: {
    Cognito: {
      userPoolId: 'TU_USER_POOL_ID',
      userPoolClientId: 'TU_USER_POOL_CLIENT_ID',
      loginWith: {
        email: true
      }
    }
  }
};