import { useState, useEffect, useRef } from 'react';

const ThreeMinutesInMillSeconds = 180000
const RefetchValidationStatusInterval =  process.env.REACT_APP_COURSE_VALIDATION_STATUS_INTERVAL || ThreeMinutesInMillSeconds

export const useCourseValidationStatus = ({
                                  isCourseValidating,
                                setIsCourseValidating,
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

  const intervalRef = useRef();
  const [loading, setLoading] = useState(false);
  const [courseValidationRecord, setCourseValidation] = useState(null);
  const [showValidateDetailsModal, setShowValidateDetailsModal] = useState(false);

  const isValidationInProgress = (validationRecord) => {
    if (validationRecord.record === null) {
      return false
    }

    return validationRecord.record.status === 'in_progress'
  }

  const fetchCourseValidationStatus = async(args) => {
    const getValidationDataEndpoint = `${process.env.REACT_APP_VALIDATE_SERVICE__GET_COURSE_VERSION_STATUS}?locale=${locales[locale]}&content_type_uid=${contentTypeUids[selectedCourse.typename]}&entry_cms_uid=${selectedCourse.value}`;

    const config = {
      method: 'GET',
      body: JSON.stringify(args),
      mode: "cors",
      cache: "no-cache",
      headers: {
        'x-api-key': process.env.REACT_APP_VALIDATE_SERVICE__X_API_KEY,
        'Content-Type': 'application/json'
      }
    }

    try{
      setLoading(true)
      const response = await fetch(getValidationDataEndpoint, config);
      const jsonResponse = await response.json();
      const validationRecord = jsonResponse;
      setLoading(false)
      setCourseValidation(validationRecord);
      setIsCourseValidating(isValidationInProgress(validationRecord));
    }
    catch(error){
      setLoading(false)
      setErrorMessage(error.message);
      console.log(error);
    }
  }

  useEffect(() => {
    if(selectedCourse.value) {
      fetchCourseValidationStatus();
    }
   }, [selectedCourse.value, locale]);


  useEffect(() => {
    if(isCourseValidating) {
      const interval = setInterval(() => {
        fetchCourseValidationStatus()
      }, RefetchValidationStatusInterval)
      intervalRef.current = interval;
    }
    else {
      clearInterval(intervalRef.current)
      intervalRef.current = null;
    }

    return () => intervalRef.current && clearInterval(intervalRef.current)

   }, [isCourseValidating, locale]);


   if(loading) {
    return {
      loading,
      lastValidatedAt: "",
      isValid: null,
      getCourseId: "",
      courseValidationRecord,
      showValidateDetailsModal,
      setShowValidateDetailsModal,
      setCourseValidation,
    }
   }

   const lastValidatedAt = (validationRecord) => {
    return validationRecord && validationRecord.record && getFormattedDate(validationRecord.record.updated_at)
   }

   const getCourseId = (validationRecord) => {
    return validationRecord && validationRecord.record && validationRecord.record.course_id
   } 

   const isValid = (validationRecord) => {
    return validationRecord && validationRecord.record && validationRecord.record.is_valid
   }

   const validationStatus = (validationRecord) => {
    if(isValid(validationRecord) === null) {
      return "not_validate_yet"
    }

    if(isValid(validationRecord)) {
     return "valid"
    }

    return "invalid"
   }


   const completedPercentage = (validationRecord) => {
    return validationRecord && validationRecord.progress_percent
   }

   const getFormattedDate = (lastValidatedAtDate) => {
    var date = new Date(lastValidatedAtDate);
    const month = date.toLocaleString('default', { month: 'long' });
    return `${month} ` + date.getDate() + ' at ' + date.toLocaleTimeString([], {timeStyle: 'short', hour12: true }).toLocaleUpperCase() + getTimeZoneUTC(date)
   }

   const getTimeZoneUTC = (date) => {
    var tzo = -date.getTimezoneOffset(),
        dif = tzo >= 0 ? '+' : '-',
        pad = function(num) {
            return (num < 10 ? '0' : '') + num;
        };

    return dif + pad(Math.floor(Math.abs(tzo) / 60)) +
           ':' + pad(Math.abs(tzo) % 60);
  }


  return {
    loading,
    lastValidatedAt: lastValidatedAt(courseValidationRecord),
    getCourseId: getCourseId(courseValidationRecord),
    isValidationNotRunning: !isCourseValidating,
    isValid: isValid(courseValidationRecord),
    validationStatus: validationStatus(courseValidationRecord),
    courseValidationRecord,
    showValidateDetailsModal,
    setShowValidateDetailsModal,
    completedPercentage: completedPercentage(courseValidationRecord),
    setCourseValidation: setCourseValidation,
  }
}
