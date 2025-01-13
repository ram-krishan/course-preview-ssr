import gql from 'graphql-tag';

const GET_TENANT_COURSES = gql`
  query getTenantCourse{
    tenantCourses {
      id
      course {
        id
        title
      }
    }
  }
`;

export {
  GET_TENANT_COURSES,
};
