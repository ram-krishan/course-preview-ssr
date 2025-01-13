import gql from 'graphql-tag';

const subRowFieldsFragment = gql`
  fragment SubRowFields on Preview {
    id
    parentId
    typename
    name
    measurementCategoryTitles
    activityPoints
    isEqual
    isValid
    errorMessages
    expanded
    cmsId
    sourceCmsVersion
    targetCmsVersion
    contentType
    parentCmsId
    parentOfParentCmsId
  }
`;

const subRowsRecursiveFragment = gql`
  fragment SubRowsRecursive on Preview {
    subRows {
      ...SubRowFields
      subRows {
        ...SubRowFields
        subRows {
          ...SubRowFields
          subRows {
            ...SubRowFields
            subRows {
              ...SubRowFields
              subRows {
                ...SubRowFields
              }
            }
          }
        }
      }
    }
  }
  ${subRowFieldsFragment}
`;

export {
  subRowFieldsFragment,
  subRowsRecursiveFragment,
};
