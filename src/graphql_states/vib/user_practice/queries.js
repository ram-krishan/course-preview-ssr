import gql from 'graphql-tag';

const GET_USER_PRACTICE_DATA = gql`
  query vibUserCoursePractice(
    $vibCoursePracticeSessionId: ID!
  ) {
  coursePracticeSession(coursePracticeSessionId: $vibCoursePracticeSessionId){
    id
    points
    attemptQuestionCount
    userCoursePractice{
      id
      streakCount
      sessionCount
      totalActivityPoints
      userPositionOnLeaderBoard
      leaderBoardDetails{
        id
        streakCount
      }
    }
    user{
      id
    }
    measurementCategory{
      id
      title
    }
  }
}
`;

export {
  GET_USER_PRACTICE_DATA,
};
