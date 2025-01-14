import { useApolloClient } from '@apollo/react-hooks';
import { useEffect, useState } from 'react'
import { isEmpty } from 'lodash';
import { coursePreview } from '../../../../graphql_states/contentstack';


const useCourseTitleAndDisplayTitle = ({ cmsId, courseType }) => {
  const [courseData, setcourseData] = useState([])
  const [loading, setLoading] = useState(false)

  const client = useApolloClient();
  let query = null;

  useEffect(() => {
    switch (courseType) {
      case 'level_2_course':
        query = coursePreview.queries.GET_LEVEL_TWO_COURSE_TITLE_AND_DISPLAY_TITLE;
        break;
      case 'level_3_course':
        query = coursePreview.queries.GET_LEVEL_THREE_COURSE_TITLE_AND_DISPLAY_TITLE;
        break;
      default:
        throw new Error(`Sorry, not valid course type.`);
    }
    const controller = new AbortController();
    getCourseData(query, controller)
    return () => {
      controller.abort();
    }
  }, [cmsId, courseType]);

  const getCourseData = async (query, controller) => {
    setLoading(true)
    try{
      const response = await client.query({
        query,
          variables: {
            cms_id: cmsId
          },
          context: {
            fetchOptions: {
              signal: controller.signal
            }
          },
          fetchPolicy: 'network-only',
      });
      setcourseData(response.data)
      setLoading(false)
    }
    catch(error){
      setLoading(false)
    }
  }

  const findTitleInLevelCourse = (level_course_type) => {
    return level_course_type.title || level_course_type.metadata.display_title
  }

  const findDisplayTitle = () => {
    if (!isEmpty(courseData)) {
      const courseObj = courseData["level_2_course"] || courseData["level_3_course"] || courseData["level_4_course"]
      return findTitleInLevelCourse(courseObj)
    }
  }

  return({
    title: findDisplayTitle(),
    loading
  })
}

export default useCourseTitleAndDisplayTitle