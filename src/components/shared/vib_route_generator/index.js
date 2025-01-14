const learnPagePrefix = '/l';
const lvl3LearnPagePrefix = '/l3';
const todayPagePrefix = '/t';
const adminPagePrefix = '/a';
class VibRouteGenerator {
  // Common Learn page url
  static getCommonLearnPageUrl(courseId) {
    return `${learnPagePrefix}/courses/${courseId}/learn`;
  }

  static getResultPageUrl(userId, isAdminSite) {
    if (isAdminSite) {
      return `/admin-ui/user-result/${userId}`;
    }
    return `/user-result/${userId}`;
  }

  // Learn page url
  static getLearnPageUrl(courseId, levelTwoCollectionCourseId) {
    return `${learnPagePrefix}/courses/${courseId}/topic/${levelTwoCollectionCourseId}`;
  }

  // Level 3 Learn page url
  static getLvl3LearnPageUrl(lvl3CollectionCourseId, lvl3Lvl2CollectionId) {
    return `${lvl3LearnPagePrefix}/courses/${lvl3CollectionCourseId}/topic/${lvl3Lvl2CollectionId}`;
  }

  // Syllabus page url
  static getSyllabusPageUrl(courseId) {
    return `${learnPagePrefix}/courses/${courseId}/syllabus`;
  }

  // Senior leader page url
  static getSeniorLeaderPageUrl(courseId) {
    return `${todayPagePrefix}/courses/${courseId}/senior_leader_message`;
  }

  // Assessment page url
  static getAssessmentPageUrl(courseId, assessmentType) {
    return `${todayPagePrefix}/courses/${courseId}/${assessmentType}/assessment`;
  }

  // Lesson page url
  static getLessonPageUrl(courseId, levelTwoLevelOneCollectionId, levelTwoCollectionProgressId) {
    return `${learnPagePrefix}/courses/${courseId}/lessons/${levelTwoLevelOneCollectionId}/progress/${levelTwoCollectionProgressId}`;
  }

  // Topic exam page url
  static getTopicExamPageUrl(courseId, topicId) {
    return `${learnPagePrefix}/courses/${courseId}/topics/${topicId}/exam`;
  }

  // Apply page url
  static getApplyPageUrl() {
    return '/apply';
  }

  // Today page url
  static getTodayPageUrl() {
    return '/today';
  }

  // Learn page url
  static getLeftNavLearnPageUrl() {
    return '/learn';
  }

  // Assessment Question page url
  static getAssessmentQuestionPageUrl(courseId, assessmentAttemptId) {
    return `${todayPagePrefix}/courses/${courseId}/assessment/${assessmentAttemptId}`;
  }

  // Assessment Status page url
  static getAssessmentStatusPageUrl(courseId, assessmentAttemptId) {
    return `${todayPagePrefix}/courses/${courseId}/assessment/${assessmentAttemptId}/status`;
  }

  // Assessment Result page url
  static getAssessmentResultPageUrl(courseId, assessmentAttemptId) {
    return `${todayPagePrefix}/courses/${courseId}/assessment/${assessmentAttemptId}/result`;
  }

  // Blog page url
  static getBlogPageUrl(vibBlogId) {
    return `${todayPagePrefix}/blogs/${vibBlogId}`;
  }

  // My profile page url
  static getMyProfilePageUrl() {
    return '/my-profile';
  }

  // Results page url
  static getResultsPageUrl() {
    return '/results';
  }

  // Sentiment page url
  static getSentimentSurveyPageUrl(courseId, sentimentSurveyProgressId) {
    return `${todayPagePrefix}/courses/${courseId}/sentiment_survey/${sentimentSurveyProgressId}`;
  }

  // My team page url
  static getMyTeamPageUrl() {
    return `${todayPagePrefix}/my-team`;
  }

  // Notification page url
  static getNotificationPageUrl() {
    return `${todayPagePrefix}/notifications`;
  }

  // Term page url
  static getTermPageUrl() {
    return '/terms';
  }

  // Privacy page url
  static getPrivacyPageUrl() {
    return '/privacy';
  }

  // Practice page url
  static getPracticePageUrl() {
    return '/practice';
  }

  // Outline page url
  static getOutlinePageUrl(courseId) {
    return `${learnPagePrefix}/courses/${courseId}/outline`;
  }

  // Admin Dashboard page url
  static getAdminDashboardPageUrl() {
    return `${adminPagePrefix}/dashboard`;
  }

  // Practice question url
  static getPracticeQuestionUrl(userCoursePracticeId, categoryDataId) {
    return `/practice/${userCoursePracticeId}/measurement_category/${categoryDataId}`;
  }

  // Practice Page result url
  static getPracticePageResultUrl(coursePracticeSessionId) {
    return `/practice/${coursePracticeSessionId}/result`;
  }

  // User Result show page url
  static getUserResultPageUrl(userId) {
    return `/user-result/${userId}`;
  }
}

export default VibRouteGenerator;
