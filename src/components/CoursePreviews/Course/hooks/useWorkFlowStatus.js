import { useState, useEffect, useRef } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { coursePreviewV2 } from '../../../../graphql_states/contentstack';
import { formatTitle } from '../../../shared/utils';

const ThreeMinutesInMillSeconds = 180000
const RefetchWorkflowStatusInterval =  process.env.REACT_APP_COURSE_WORKFLOW_PROCESSING_STATUS_INTERVAL || ThreeMinutesInMillSeconds

export const useWorkFlowStatus = (refetchWorkFlowStatus) => {
  const [workflowLoading, setWorkflowLoading] = useState(false);
  const [workflowStageCourses, setWorkflowStageCourses] = useState([]);
  const [dismissedCourseCmsId, setDismissedCourseCmsId] = useState([]);
  const recordIds = useRef([]);

  const dismissCourseAlert = (course) => {
    setDismissedCourseCmsId(prevArray => [...prevArray, course.cms_id]);
  }

  const getCoursesWithStatuses = async(args) => {
    const config = {
      method: 'POST',
      body: JSON.stringify(args),
      headers: {
        'x-api-key': process.env.REACT_APP_COURSE_WORKFLOW_UPDATE_SERVICE_API_KEY,
        'Content-Type': 'application/json'
      }
    }
    try{
      setWorkflowLoading(true)
      const response = await fetch(process.env.REACT_APP_COURSE_WORKFLOW_PROCESSING_STATUS_ENDPOINT, config);
      const json_response = await response.json();
      const courses = json_response.courses;
      setWorkflowStageCourses(courses);
      setWorkflowLoading(false)
    }
    catch(error){
      setWorkflowLoading(false)
      console.log(error);
    }
  }

  const get_request_params = () => {
    return {
      'where_criteria': "status: 'in_progress'",
      'per_page': 100,
      'record_ids': recordIds.current
    }
  };

  useEffect(() => {
    if (refetchWorkFlowStatus) {
      getCoursesWithStatuses(get_request_params());

      // Calling after specific interval in milliseconds
      const interval = setInterval(() => {
        getCoursesWithStatuses(get_request_params());
      }, RefetchWorkflowStatusInterval);

      return () => clearInterval(interval);
    } else {
      getCoursesWithStatuses(get_request_params());
    }

   }, [refetchWorkFlowStatus]);

  useEffect(() => {
    recordIds.current = workflowStageCourses.map((course) => course.id)
  }, [workflowStageCourses])

  const {
    data, loading
  } = useQuery(
    coursePreviewV2.queries.GET_COURSES,
    {
      fetchPolicy: 'network-only',
    },
  );


  if (loading || workflowLoading) {
    return {
      loading: true,
      courses: [],
      dismissCourseAlert,
    }
  }
  const lvl2courses = data && data.all_level_2_course.items;

  const lvl3courses = data && data.all_level_3_course.items;

  const courses = [...lvl2courses, ...lvl3courses]

  const getCourseName = (courses, cms_id) => {
    const course = courses.find((course) => course.system.uid === cms_id)
    return course ? formatTitle(course) : '';
  }

  const getProgressPercent = (progress_percent) => {
    return (progress_percent==null)? 0 : progress_percent.toFixed(2)
  }

  const mapCourseNames = (courses) => {
    return workflowStageCourses.map((workflowStage) => {
      return {...workflowStage, name: getCourseName(courses, workflowStage.cms_id), progress_percent: getProgressPercent(workflowStage.progress_percent)}
    })
  }

  return {
    loading: loading,
    courses: mapCourseNames(courses).filter((course) => !dismissedCourseCmsId.includes(course.cms_id)),
    dismissCourseAlert,
  }
}
