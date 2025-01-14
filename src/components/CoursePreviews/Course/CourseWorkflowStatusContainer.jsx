import React from "react";
import CourseWorkflowStatus from "./CourseWorkflowStatus";
import { useWorkFlowStatus } from "./hooks/useWorkFlowStatus";
import Loader from "../../shared/Loader";

const CourseWorkflowStatusContainer = ({ refetchWorkFlowStatus }) => {
  const { loading, courses, dismissCourseAlert } = useWorkFlowStatus(
    refetchWorkFlowStatus
  );

  if(loading) return <Loader/>

  return (
    <CourseWorkflowStatus
      loading={loading}
      courses={courses}
      dismissCourseAlert={dismissCourseAlert}
    />
  );
};

export default CourseWorkflowStatusContainer;
