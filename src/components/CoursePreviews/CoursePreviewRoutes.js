import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Loader from '../shared/Loader';
import componentLoader from '../componentLoader';

const L2PagePreview = lazy(() => componentLoader(() => import('./L2PagePreview')));
const PagePreview = lazy(() => componentLoader(() => import('./PagePreview/CmsPreview')));
const L3PagePreview = lazy(() => componentLoader(() => import('./L3PagePreview')));
const CoursePreview = lazy(() => componentLoader(() => import('./Course')));
const QuestionPreview = lazy(() => componentLoader(() => import('./QuestionPreview')));
const LevelTwoCollectionPreview = lazy(() => componentLoader(() => import('./LevelTwoCollectionPreview')));
const AssessmentQuestionPreview = lazy(() => componentLoader(() => import('./AssessmentQuestionPreview')));
const PracticeQuestionPreview = lazy(() => componentLoader(() => import('./PracticeQuestionPreview')));
const ExamPreview = lazy(() => componentLoader(() => import('./ExamPreview')));
const SeniorLeaderMessagePreview = lazy(() => componentLoader(() => import('./SeniorLeaderMessagePreview')));
const CourseVersionCompatible = lazy(() =>componentLoader(() => import('./CourseVersionCompatible')));
const QuickCheckQuestionPreview = lazy(() =>componentLoader(() => import('./QuickCheckQuestionPreview')));

const ApplyPagePreview = lazy(() => componentLoader(() => import('./ApplyPagePreview')));
const CoursePreviewRoutes = () => {
  return (
    <div>
      <Suspense fallback={<Loader />}>
        <Switch>
          <Route
            exact
            path="/"
            render={() => (
              <Redirect to={`/course-preview/${process.env.REACT_APP_DEFAULT_LOCALE}`}/>
            )}
          />
          <Route
            exact
            path="/course-preview"
            render={() => (
              <Redirect to={`/course-preview/${process.env.REACT_APP_DEFAULT_LOCALE}`}/>
            )}
          />
          <Route
            exact
            path="/course-preview/:locale?/:course_level?/:cms_id?"
            name="Course Preview"
            component={CoursePreview}
          />
          <Route
            exact
            path="/course-preview/:locale/page/:pageCmsId/preview"
            name="Page Preview"
            component={PagePreview}
          />
          <Route
            exact
            path="/course-preview/:locale/:courseType/:courseCmsId/:contentType/l2/:levelTwoCollectionCmsId/l1/:levelOneCollectionCmsId/page/:pageCmsId/preview"
            name="Page Preview for L2 course"
            component={L2PagePreview}
          />
          <Route
            exact
            path="/course-preview/:locale/:courseType/:courseCmsId/:contentType/l3/:levelThreeCollectionCmsId/l2/:levelTwoCollectionCmsId/l1/:levelOneCollectionCmsId/page/:pageCmsId/preview"
            name="Page Preview for L3 course"
            component={L3PagePreview}
          />
          <Route
            exact
            path="/course-preview/:locale/exam/:exam_id/question/:question_cms_id/preview"
            name="Question Preview"
            component={QuestionPreview}
          />
          <Route
            exact
            path="/course-preview/:locale/assessment/:assessment_cms_id/exam/:assessment_exam_cms_id/question/:question_cms_id/preview"
            name="Assessment Question Preview"
            component={AssessmentQuestionPreview}
          />
          <Route
            exact
            path="/course-preview/:locale/:courseType/:courseCmsId/:contentType/l2/:levelTwoCollectionCmsId/preview"
            name="L2 Break Room Page Preview"
            component={LevelTwoCollectionPreview}
          />
          <Route
            exact
            path="/course-preview/:locale/:courseType/:courseCmsId/:contentType/l3/:levelThreeCollectionCmsId/l2/:levelTwoCollectionCmsId/preview"
            name="level Three L2 Break Room Page Preview"
            component={LevelTwoCollectionPreview}
          />
          <Route
            exact
            path="/course-preview/:locale/:courseType/:courseCmsId/:contentType/l4/:levelFourCollectionCmsId/l3/:levelThreeCollectionCmsId/l2/:levelTwoCollectionCmsId/preview"
            name="level Four L2 Break Room Page Preview"
            component={LevelTwoCollectionPreview}
          />
          <Route
            exact
            path="/course-preview/:locale/:courseType/:courseCmsId/:contentType/l2/:levelTwoCollectionCmsId/ll1/:lastL1CmsId/lp/:lastPageCmsId/exam/:examCmsId/preview"
            name="L2 Exam Preview"
            component={ExamPreview}
          />
          <Route
            exact
            path="/course-preview/:locale/:courseType/:courseCmsId/:contentType/l3/:levelThreeCollectionCmsId/l2/:levelTwoCollectionCmsId/ll1/:lastL1CmsId/lp/:lastPageCmsId/exam/:examCmsId/preview"
            name="L3 Exam Preview"
            component={ExamPreview}
          />
          <Route
            exact
            path="/course-preview/:locale/practice_question/:practice_question_cms_id/preview"
            name="Practice Question Preview"
            component={PracticeQuestionPreview}
          />
           <Route
            exact
            path="/course-preview/:courseType/:courseCmsId/:locale/quick_check_questions/preview"
            name="Practice Question Preview"
            component={QuickCheckQuestionPreview}
          />
          <Route
            exact
            path="/course-preview/:courseType/:courseCmsId/:locale/senior_leader_message/:senior_leader_message_cms_id/preview"
            name="Senior Leader Message"
            component={SeniorLeaderMessagePreview}
          />
          <Route
            exact
            path="/compatible-version/:locale/:courseType/:cmsId"
            name="Course version lists"
            component={CourseVersionCompatible}
          />
          <Route
            exact
            path="/course-preview/:courseType/:courseCmsId/:locale/apply/preview"
            name="Learning Resource"
            component={ApplyPagePreview}
          />
        </Switch>
      </Suspense>
    </div>
  )
};
export default CoursePreviewRoutes;