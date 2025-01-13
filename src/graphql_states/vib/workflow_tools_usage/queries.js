import gql from 'graphql-tag';

const GET_WORKFLOW_USAGE = gql`
  query WorkflowToolsUsageStack {
    workflowToolsUsageStack {
      callPlanWorkflowToolsUsageStack {
        user {
          fullName
        }
        percentage
      }
      sosWorkflowToolsUsageStack {
        user {
          fullName
        }
        percentage
      }
    }
  }
`;

export { GET_WORKFLOW_USAGE };
