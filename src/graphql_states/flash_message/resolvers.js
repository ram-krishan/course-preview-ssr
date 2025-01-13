const resolvers = {
  Mutation: {
    updateFlashMessage: (_, { message, messageType }, { cache }) => {
      cache.writeData({
        data: {
          flashMessage: {
            uid: new Date().getTime(),
            message,
            messageType,
            __typename: 'FlashMessage',
          },
        },
      });
      return null;
    },
  },
};

export default resolvers;
