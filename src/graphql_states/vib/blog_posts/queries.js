import gql from 'graphql-tag';

const GET_BLOG_POST = gql`
  query contentstackBlogPost(
    $vibBlogPostId: ID!
  ) {
    contentstackBlogPost(vibBlogPostId: $vibBlogPostId) {
      id
      blogTitle
      publishedDate
      formattedPublishedDate
      duration
      headerImage {
        url
      }
      author {
        authorName
      }

    }
  }
`;

const GET_ALL_BLOGS = gql`
  query allBlogs {
    allBlogs {
      id
      vibBlogTitle
    }
  }
`;

export {
  GET_BLOG_POST, GET_ALL_BLOGS,
};
