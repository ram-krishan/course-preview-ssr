import gql from 'graphql-tag';

const UPDATE_FLASH_MESSAGE = gql`
  mutation FlashMessageUpdateFlashMessage(
    $message: String!
    $messageType: String!
  ) {
    updateFlashMessage(message: $message, messageType: $messageType) @client {
      message
      messageType
    }
  }
`;

export { UPDATE_FLASH_MESSAGE };
