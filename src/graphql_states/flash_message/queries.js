import gql from 'graphql-tag';

const GET_FLASH_MESSAGE = gql`
  query {
    flashMessage @client {
      uid
      message
      messageType
      __typename: FlashMessage
    }
  }
`;

export { GET_FLASH_MESSAGE };
