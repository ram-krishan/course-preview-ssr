import gql from 'graphql-tag';

const GET_RECOMMENDED_BLOG_POST = gql`
  query recommendedBlogPosts {
    recommendedBlogPosts {
      title
      formattedPublishedDate
      duration
      url
      imageUrl
      imageAltText
    }
  }
`;

export {
  GET_RECOMMENDED_BLOG_POST,
};
