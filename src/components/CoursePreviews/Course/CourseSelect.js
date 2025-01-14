import PropTypes from 'prop-types';
import { Col, Form, FormGroup } from 'react-bootstrap'
import Select from 'react-select';
import Loader from '../../shared/Loader';
import AlertMessage from '../../shared/AlertMessage';
import useSuperScript from '../../shared/hooks/useSuperScript';
import { isEmpty,orderBy } from 'lodash';
import useAllCourseData from '../../shared/hooks/useAllCourseData';


const CourseSelect = ({
  query,
  handleChange,
  selectedCourse,
  courseKey,
  placeholder,
  fieldTitle,
  selectedLocale,
}) => {
  
  const { allItems, loading, error } = useAllCourseData(query, courseKey);

  if (error) {
    const errorObject = error;
    return (
      <AlertMessage
        alertType="danger"
        customClass="m-3"
        message={errorObject && errorObject.graphQLErrors && errorObject.message}
      />
    );
  }

  if (loading) return <Loader />;

  return (
    <CourseSelectContainer
      fieldTitle={fieldTitle}
      selectedCourse={selectedCourse}
      data={allItems}
      handleChange={handleChange}
      placeholder={placeholder}
      courseKey={courseKey}
    />
  );
};

const CourseSelectContainer = ({
  fieldTitle,
  selectedCourse,
  data,
  handleChange,
  placeholder,
}) => {
  useSuperScript();

  const renderOptions = (collection) => orderBy(collection,[coll => isEmpty(coll.metadata.display_title)? coll.title.toLowerCase() : coll.metadata.display_title.toLowerCase()]).map((obj) => ({
    value: obj.system.uid,
    label: obj.metadata.display_title || obj.title,
    typename: obj.__typename,
  }));

  const getSelectedOption = () => {
    return renderOptions(data).find(option => option.value === selectedCourse?.value)
  }

  return (
    <Col md="4">
      <Form>
        <FormGroup>
          <Form.Label htmlFor={`crmContactRole-${fieldTitle}`}>
            {fieldTitle}
          </Form.Label>
          <Select
            name="course"
            value={getSelectedOption()}
            options={renderOptions(data)}
            onChange={handleChange}
            menuPlacement="bottom"
            minMenuHeight="400"
            placeholder={placeholder}
            inputId={`crmContactRole-${fieldTitle}`}
          />
        </FormGroup>
      </Form>
    </Col>
  );
};

CourseSelect.propTypes = {
  query: PropTypes.object.isRequired,
  handleChange: PropTypes.func.isRequired,
  selectedCourse: PropTypes.instanceOf(Object),
  courseKey: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  fieldTitle: PropTypes.string.isRequired,
};

export default CourseSelect;
