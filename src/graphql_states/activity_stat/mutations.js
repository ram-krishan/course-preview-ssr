import gql from 'graphql-tag';

const CREATE_USER_ACTIVITY_STAT = gql`
  mutation ActivityStatCreateOrUserActivityStat(
    $dateTime: String
    $isFromSfdcSalesToolsPageView: Boolean
  ) {
    createUserActivityStat(
      input: {
        dateTime: $dateTime
        isFromSfdcSalesToolsPageView: $isFromSfdcSalesToolsPageView
      }
    ) {
      errorMessage
    }
  }
`;

export { CREATE_USER_ACTIVITY_STAT };
