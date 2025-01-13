import gql from 'graphql-tag';

const UPDATE_USER_PROFILE = gql`
  mutation UserUpdateUserProfile($profileInput: UpdateUserProfileInput!) {

    updateUserProfile(input: $profileInput) {
      errorMessage{
        password,
        passwordConfirmation,
        currentPassword,
        languagePreference,
        firstName,
        lastName,
      }
      user {
        id
        fullName
        firstName
        lastName
        isManager
        accountImageUrl
        languagePreference
        accountId
        userIdentity
        profilePictureUrl
      }
    }
  }
`;

export { UPDATE_USER_PROFILE };
