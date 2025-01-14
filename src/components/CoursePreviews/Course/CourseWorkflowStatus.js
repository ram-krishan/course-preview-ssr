import React, { useState } from 'react';
import Loader from '../../shared/Loader';
import UpdateWorkflowErrorModal from './UpdateWorkflowErrorModal'
import CourseWorkflowStatusAlert from './CourseWorkflowStatusAlert'

const CourseWorkflowStatus = ({
  loading,
  courses,
  dismissCourseAlert,
}) => {
  const [selectedCourse, setSelectedCourse] = useState(null);
  if (loading) return <Loader/>;

  const handleViewDetails = (course) => {
    setSelectedCourse(course);
  };

  const handleCloseModal = () => {
    setSelectedCourse(null);
  };
  
  return (
    <div className="display-5 pl-2 mb-2 ">
      { courses && courses.map(course =>
          <CourseWorkflowStatusAlert
            key={course.cms_id}
            course={course}
            handleViewDetails={handleViewDetails}
            dismissCourseAlert={dismissCourseAlert}
          />
        )
      }
      {selectedCourse && (
        <UpdateWorkflowErrorModal
          record={selectedCourse}
          showModal={true}
          setShowModal={handleCloseModal}
        />
      )}
    </div>
  )
}

export default CourseWorkflowStatus;