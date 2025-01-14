import { useState, useEffect, useContext } from 'react';
import CourseValidationContext from '../CourseHierarchy/context/courseValidationContext';

const ThreeMinutesInMillSeconds = 180000
const RefetchValidationStatusInterval =  process.env.REACT_APP_COURSE_VALIDATION_STATUS_INTERVAL || ThreeMinutesInMillSeconds

export const useStartCourseValidation = ({
                                 selectedCourse,
                                 locale,
                                 setErrorMessage,
                                 }) => {

      const contentTypeUids = {
        "Level2Course": "level_2_course",
        "Level3Course": "level_3_course",
      }

       const locales = {"en-us": "en-US",
                        "de-de": "de-DE",
                        "zh-cn": "zh-CN",
                        "pt-br": "pt-BR",
                        "fr-fr": "fr-FR",
                        "es-419": "es-419",
                        "it-it": "it-IT",
                        "tr-tr": "tr-TR",
                        "ja-jp": "ja-JP" }

  const {
    setIsCourseValidating,
    setCourseDismissed,
    setCourseValidation,
  } = useContext(CourseValidationContext);
  
  const [loading, setLoading] = useState(false);
  
   useEffect(() => {
    setCourseDismissed(false);
   }, [selectedCourse.value, locale]);

   const startCourseValidation = async() => {
    setCourseDismissed(false);
    setLoading(true);
    const requestBody = {
      "content_type_uid": contentTypeUids[selectedCourse.typename],
      "entry_cms_uid": selectedCourse.value,
      "is_publish_requested": false,
      "locale": locales[locale]
    }

    if(locale !="en-us"){
      const base_version_id = window.prompt("Base Version ID")
      if(base_version_id == null) {
        setLoading(false);
        return;
      } else if(base_version_id == '') {
        setLoading(false);
        alert('Base Version ID is required to validate translation version');
        return;
      } else {
        requestBody["base_version_id"] = base_version_id;
      }
    }
  
    const config = {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'x-api-key': process.env.REACT_APP_VALIDATE_SERVICE__X_API_KEY,
        'Content-Type': 'application/json'
      }
    }
    try{

      setLoading(true)
      setCourseValidation(null)
      const response = await fetch(process.env.REACT_APP_VALIDATE_SERVICE__POST_TRIGGER, config);
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        setIsCourseValidating(true);
      }
      else {
        setErrorMessage(jsonResponse.errors || "")
      }
      setLoading(false)
    }
    catch(error){
      setLoading(false)
      setErrorMessage(error.message || "")
    }
  }

  return {
    loading,
    startCourseValidation,
  }
}
