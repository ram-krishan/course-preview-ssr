import React, { useState } from 'react';
import { Row } from 'react-bootstrap';
import CourseSelect from './CourseSelect';
import LocaleSelect from './LocaleSelect';
import { coursePreview } from '../../../graphql_states/contentstack';
import CourseHierarchy from './CourseHierarchy';
import CourseValidateData from './CourseValidateData';
import { CourseValidationProvider } from "./CourseHierarchy/context/courseValidationContext"
import './course-version-style.scss';
import CourseWorkflowStatusContainer from './CourseWorkflowStatusContainer';
import ContentStackExportContainer from './ContentStackExportContainer';

const courseSelect = [
  {
    id: 'l2',
    type: 'Level2Course',
    courseKey: 'all_level_2_course',
    placeholder: 'Level Two Course',
    query: coursePreview.queries.GET_LEVEL_TWO_COURSES,
  },
  {
    id: 'l3',
    type: 'Level3Course',
    courseKey: 'all_level_3_course',
    placeholder: 'Level Three Course',
    query: coursePreview.queries.GET_LEVEL_THREE_COURSES,
  },
]
const Course = (props) => {
  const { history, location, match } = props;
  const { locale, course_level, cms_id } = match.params

  const locales = () => {
    const lang = JSON.parse(process.env.REACT_APP_LOCALE)
    return (Object.keys(lang).map((item) => ({ value: item, label: lang[item] }))).sort((currentElement, nextElement) => (currentElement.label > nextElement.label) ? 1 : -1)
  };

  const getSelectedLocale = () => {
    return locales().find((item) => item["value"] === locale);
  }

  const getSelectedCourse = () => {
    if (!cms_id || !course_level) return null;

    const data = courseSelect.find(({ id }) => id.toLowerCase() === course_level.toLowerCase());
    return data ? ({
      label: "",
      typename: data.type,
      value: cms_id
    }) : null
  }

  const selectedLocale = getSelectedLocale();
  const selectedCourse = getSelectedCourse();
  const [refetchWorkFlowStatus, setRefetchWorkFlowStatus] = useState(false)

  const handleCourseChange = (args, type) => {
    const newUrl = course_level ? location.pathname.replace(course_level, type).replace(cms_id, args.value) : `${location.pathname}/${type}/${args.value}`
    history.push(newUrl)
  };

  const handleChangeLocale = (args) => {
    const newUrl = locale ? location.pathname.replace(locale, args.value) : `${location.pathname}/${args.value}`
    history.push(newUrl)
  }

  const getSelectedCourseFor = (type) => {
    if (selectedCourse && selectedCourse.typename === type) {
      return (selectedCourse);
    }
    return (null);
  };
  return (
    <>
      <Row>
        {
          courseSelect.map((item, index) => (
            <CourseSelect
              query={item.query}
              handleChange={(args) => handleCourseChange(args, item.id)}
              selectedCourse={getSelectedCourseFor(item.type)}
              courseKey={item.courseKey}
              placeholder={item.placeholder}
              selectedLocale={selectedLocale}
              fieldTitle={item.id.toUpperCase()}
              // Need to fix key issue.
              key={Math.random()}
            />
          ))
        }
        <LocaleSelect
          LocaleOptions={locales()}
          handleChangeLocale={handleChangeLocale}
          selectedLocale={selectedLocale}
          fieldTitle="Language"
        />
      </Row>

      < CourseWorkflowStatusContainer refetchWorkFlowStatus={refetchWorkFlowStatus}/>
      < ContentStackExportContainer />

      {selectedCourse ?
        <CourseValidationProvider selectedCourse={selectedCourse} locale={selectedLocale.value}>
          <>
            <CourseValidateData />
            <CourseHierarchy
              selectedLocale={selectedLocale}
              selectedCourse={selectedCourse}
              setRefetchWorkFlowStatus={setRefetchWorkFlowStatus}
            />
          </>
        </CourseValidationProvider> : null}
    </>
  );
};
export default Course;