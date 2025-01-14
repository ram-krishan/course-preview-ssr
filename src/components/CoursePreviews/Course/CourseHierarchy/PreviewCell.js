import React, {memo, useContext, useState, useEffect, useMemo} from 'react';
import CourseContext from './context/courseContext';
import { Link } from 'react-router-dom';

const PreviewCell = memo(({id, objectType, objectId, locale}) => {
  const {selectedCourse, courseData} = useContext(CourseContext);
  const [previewLink, setPreviewLink] = useState("#");

  const findRecord = (recordId) => {
    return courseData.find((row) => row.id === recordId)
  }

  const findParent = (recordId) => {
    const object = findRecord(recordId);
    return courseData.find((row) => row.id === object.parentId)
  };

  const l2BreakRoomPathForL2Course = () => {
    const parent = findParent(id);
    const contentType = parent.name === "Core Content" ? 'core' : 'enrichment';
    return `/course-preview/${locale}/${selectedCourse.typename}/${selectedCourse.value}/${contentType}/l2/${objectId}/preview`;
  }

  const l2BreakRoomPathForL3Course = () => {
    const level3 = findParent(id)
    const parent = findParent(level3.id);
    const contentType = parent.name === "Core Content" ? 'core' : 'enrichment';

    return (`/course-preview/${locale}/${selectedCourse.typename}/${selectedCourse.value}/${contentType}/l3/${level3.objectId}/l2/${objectId}/preview`);
  }

  const pagePathForL2Course = () => {
    const level1 = findParent(id)
    const level2 = findParent(level1.id)
    const parent = findParent(level2.id)
    const contentType = parent.name === "Core Content" ? 'core' : 'enrichment';

    return `/course-preview/${locale}/${selectedCourse.typename}/${selectedCourse.value}/${contentType}/l2/${level2.objectId}/l1/${level1.objectId}/page/${objectId}/preview`;
  }

  const pagePathForL3Course = () => {
    const level1 = findParent(id)
    const level2 = findParent(level1.id)
    const level3 = findParent(level2.id)
    const parent = findParent(level3.id)
    const contentType = parent.name === "Core Content" ? 'core' : 'enrichment';

    return (`/course-preview/${locale}/${selectedCourse.typename}/${selectedCourse.value}/${contentType}/l3/${level3.objectId}/l2/${level2.objectId}/l1/${level1.objectId}/page/${objectId}/preview`);
  }

  const pagePath = () => {
    switch (selectedCourse.typename) {
      case 'Level2Course':
        return pagePathForL2Course();
      case 'Level3Course':
        return pagePathForL3Course();
      default:
        throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
    }
  };

  const l2BreakRoomPath = () => {
    switch (selectedCourse.typename) {
      case 'Level2Course':
        return l2BreakRoomPathForL2Course();
      case 'Level3Course':
        return l2BreakRoomPathForL3Course();
      default:
        throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
    }
  };

  const findLastLevel1 = (level2Id) => {
    const children = courseData.filter(
      (row) => row.parentId === level2Id && row.objectType === 'Level1'
    );
    return children[children.length - 1];
  }

  const findLastChild = (recordId) => {
    const children = courseData.filter((row) => row.parentId === recordId)
    return children[children.length - 1];
  }

  const l2ExamPreviewPathForL2Course = (exam) => {
    const level2 = findParent(exam.id)
    const parent = findParent(level2.id)
    const contentType = parent.name === "Core Content" ? 'core' : 'enrichment';
    const lastLevel1 = findLastChild(level2.id);

    return (`/course-preview/${locale}/${selectedCourse.typename}/${selectedCourse.value}/${contentType}/l2/${level2.objectId}/ll1/${lastLevel1.objectId}/lp/${lastLevel1.opts.lastPageCmsId}/exam/${exam.objectId}/preview`);
  }

  const l2ExamPreviewPathForL3Course = (exam) => {
    const level2 = findParent(exam.id)
    const level3 = findParent(level2.id)
    const parent = findParent(level3.id)
    const contentType = parent.name === "Core Content" ? 'core' : 'enrichment';
    const lastLevel1 = findLastChild(level2.id);

    return (`/course-preview/${locale}/${selectedCourse.typename}/${selectedCourse.value}/${contentType}/l3/${level3.objectId}/l2/${level2.objectId}/ll1/${lastLevel1.objectId}/lp/${lastLevel1.opts.lastPageCmsId}/exam/${exam.objectId}/preview`)
  }

  const l2ExamPreviewPath = (exam) => {
    switch (selectedCourse.typename) {
      case 'Level2Course':
        return l2ExamPreviewPathForL2Course(exam);
      case 'Level3Course':
        return l2ExamPreviewPathForL3Course(exam);
      default:
        throw new Error(`Sorry, we are out of ${selectedCourse.typename}.`);
    }
  };

  const questionPreviewPath = () => {
    const exam = findParent(id);
    return `${l2ExamPreviewPath(exam)}?question=${objectId}`
  };

  const assessmentCmsId = useMemo(() => {
    return courseData.find((row) => row.objectType === "Assessments")?.objectId
  });

  const assessmentExamCmsId = useMemo(() => {
    const parent = findParent(id);
    return courseData.find((row) => row.objectType === "AssessmentExam" && parent?.id === row.id)?.objectId
  });

  const practiceQuestionPath = () => (`/course-preview/${locale}/practice_question/${objectId}/preview`);

  const QuickCheckQuestionItemPath = () => `/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${locale}/quick_check_questions/preview`;
  
  const assessmentQuestionPath = () => `/course-preview/${locale}/assessment/${assessmentCmsId}/exam/${assessmentExamCmsId}/question/${objectId}/preview`;

  const slmPath = () => `/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${locale}/senior_leader_message/${objectId}/preview`;

  const applyPath = () => `/course-preview/${selectedCourse.typename}/${selectedCourse.value}/${locale}/apply/preview`;

  const getPreviewLink = () => {
    if (objectType === 'PracticeQuestion') {
      return practiceQuestionPath;
    }

    if (objectId === 'quickcheck_taxonomyConnection') {
      return QuickCheckQuestionItemPath;
    }

    if(objectType === 'AssessmentQuestion') {
      return assessmentQuestionPath();
    }

    if(objectType === 'Level2') {
      return l2BreakRoomPath();
    }

    if(objectType === 'Pagev4') {
      return pagePath();
    }

    if (objectType === 'Exam') {
      const exam = findRecord(id);
      return l2ExamPreviewPath(exam);
    }

    if(objectType === 'Question') {
      return questionPreviewPath();
    }

    if(objectType === 'SeniorLeaderMessage') {
      return slmPath();
    }

    if(objectId === 'learning_resourcesConnection'){
      return applyPath();
    }

    return "#";
  }

  useEffect(() => {
    setPreviewLink(getPreviewLink());
  }, []);

  if (!objectType && (objectId !== 'learning_resourcesConnection' && objectId !== 'quickcheck_taxonomyConnection')) {
    return null;
  }

  if(previewLink === "#") {return null;}

  return (
    <Link to={previewLink} target="_blank" id="previewLink">Preview</Link>
  );
});

export default PreviewCell;
