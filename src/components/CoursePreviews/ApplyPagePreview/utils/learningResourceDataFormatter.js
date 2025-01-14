import { isEmpty } from 'lodash';


const nodes = (item) => (
  item.edges.map((edge) => edge.node)
);
const getFormattedTitle = (node) => (
  isEmpty(node.display_title) ? node.title : node.display_title
);

const getResourceUrl = (resourceNode) => {
  const learningResourceNode = nodes(resourceNode)
  
  if(isEmpty(learningResourceNode)) return null

  return learningResourceNode[0].url
}

const getImageUrl = (imageNode) => {
  const learningImageNode = nodes(imageNode)
  
  if(isEmpty(learningImageNode)) return null

  if(isEmpty(learningImageNode[0]["imageConnection"].edges)) return null

  return learningImageNode[0]["imageConnection"].edges[0].node.url 
}

const getDescriptionText = (descriptionNode) => {
  const learningDescriptionNode = nodes(descriptionNode)
  
  if(isEmpty(learningDescriptionNode)) return null

  return learningDescriptionNode[0].text 
}

const getId = (data) => data.system.uid;

const getCourseType = (courseType) => {
  switch (courseType) {
    case 'Level2Course':
      return 'level_2_course'
    case 'Level3Course':
      return 'level_3_course'
    default:
  }
}

const getCourseTitle = (learningResource) => {
  const title = learningResource["metadata"]["display_title"] || learningResource["title"]
  return title
  
}

const getLearningResourceFormattedData = (learningResourceData, courseType, courseCmsId) => {
  const learningResources = learningResourceData[`${getCourseType(courseType)}`]["metadata"]["learning_resourcesConnection"]["edges"]
  const learningResourceFormattedData = {
    id: courseCmsId,
    title: getCourseTitle(learningResourceData[`${getCourseType(courseType)}`]),
    courseLearningResources: []
  };
  if(isEmpty(learningResources)) return learningResourceFormattedData
  
  learningResources.map((learningResource) => 
  learningResourceFormattedData["courseLearningResources"].push(
  {
    id: getId(learningResource.node),
    title: getFormattedTitle(learningResource.node),
    resourceUrl: getResourceUrl(learningResource.node.resourceConnection),
    imageUrl: getImageUrl(learningResource.node.imageConnection),
    descriptionText: getDescriptionText(learningResource.node.descriptionConnection)
  }
  ))

  return learningResourceFormattedData
};

export default getLearningResourceFormattedData;
