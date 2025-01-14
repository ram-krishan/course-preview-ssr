import { isEmpty, keys } from 'lodash';

const nodes = (item) => (
  item.edges.map((edge) => edge.node)
);

const getId = (data) => data.system.uid;

const locales = () => {
  const lang = JSON.parse(process.env.REACT_APP_LOCALE)
  return(Object.keys(lang).map((item)=> ({value: item, label: lang[item]}))).sort((currentElement, nextElement) => (currentElement.label > nextElement.label) ? 1 : -1)
};

const map_language_with_label = (subtitle, fileConnection) => {
  const url = nodes(fileConnection)[0].url;
  const locale = subtitle.system.locale;
  const lable = locales().find((loc) => loc.value === locale).label;
  return {
    url: url,
    language: locale,
    label: lable
  }
}

const getFormattedInlineText = (mainContentData, typeName) => {
  if (isEmpty(mainContentData.inline_text)) return null;

  return {
    type: typeName,
    text: mainContentData.inline_text.text,
    __typename: 'InlineText',
  };
};

const getFormattedTextReference = (mainContentData, typeName) => {
  if (isEmpty(mainContentData.text_reference)) return null;

  const textConnection = nodes(mainContentData.text_reference.textConnection)[0];

  if (isEmpty(textConnection)) return null;
  return {
    type: typeName,
    text: textConnection.text,
    emphasis: isEmpty(textConnection.emphasis) ? '' : textConnection.emphasis.emphasis_selection,
    __typename: 'TextReference',
  };
};

const formateContentComponent = (mainContentData) => {
  let componentHash;

  // 1: {__typename: "PageComponentsComponentsInlineText", inline_text: {…}}
  // 2: {__typename: "PageComponentsComponentsTextReference", text_reference: {…}}

  // eslint-disable-next-line no-underscore-dangle
  const typeName = mainContentData.__typename;
  switch (typeName) {
    case 'PageComponentsComponentsTextReference':
      componentHash = getFormattedTextReference(mainContentData, typeName);
      break;
    case 'PageComponentsComponentsInlineText':
      componentHash = getFormattedInlineText(mainContentData, typeName);
      break;
    default:
  }
  return componentHash;
};

const getAssociatedContents = (componentsData) => {
  componentsData = componentsData.filter((element) => keys(element).length > 1)
  const formattedAssociatedContents = componentsData.map(
    (ele) => formateContentComponent(ele),
  );
  return formattedAssociatedContents.filter(element => element != null)
}

const getSeniorLeaderMessageContents = (
  modular_blocks,
) => {
  const textBlock = modular_blocks.find((modular_block) => modular_block["__typename"] === "SeniorLeaderMessageModularBlocksText")
  const videoBlock = modular_blocks.find((modular_block) => modular_block["__typename"] === "SeniorLeaderMessageModularBlocksVideo")


  let rich_text = "";

  if (!isEmpty(textBlock)) {
    const textConnection = textBlock["text"]["textConnection"];
    rich_text = nodes(textConnection)[0]?.text || "";
  }
  
  if (!isEmpty(videoBlock)) {
    const videoConnection = nodes(videoBlock["video"]["videoConnection"])[0]
    if (!isEmpty(videoConnection)) {
      const video = nodes(videoConnection['videoConnection'])[0]

      const subtitlesConnections = nodes(videoConnection['subtitlesConnection'])

      const preview_imageConnection = nodes(videoConnection['preview_imageConnection'])[0]
      let thumbnailUrl;
      let subtitles;

      if (!isEmpty(preview_imageConnection)) {
        thumbnailUrl = preview_imageConnection.url
      }

      if (!isEmpty(subtitlesConnections)) {
        subtitles = subtitlesConnections.map(conn => map_language_with_label(conn, conn["fileConnection"]))
      }

      return [
        {
          "rich_text": rich_text,
          "video_block": {
            "video": {
              "fileUrl": video.url,
              "thumbnailUrl": thumbnailUrl,
              "contentType": "video/mp4",
              "subtitles": isEmpty(subtitles) ? [] : subtitles,
              "associatedContent": videoConnection.show_associated_content_ ? getAssociatedContents(videoConnection.associated_content.components) : [],
              "showAssociatedContent": videoConnection.show_associated_content_
            }
          }
        }
      ]
    }
  }

  return [{"rich_text": rich_text, "video_block": {"video": null }}]
}

const getCourseLevelData = (courseType, seniorLeaderMessageGoalsData) => {
  switch (courseType) {
    case 'Level2Course':
      return seniorLeaderMessageGoalsData.level_2_course
    case 'Level3Course':
      return seniorLeaderMessageGoalsData.level_3_course
    default:
      console.log("invalid course found")
  }
};

const getFormattedGoals = (goal) => {
  return {
    id: getId(goal),
    title: goal.display_title || goal.title
  }
}

const getFormattedContentstackCourse = (courseType, seniorLeaderMessageGoalsData) => {
  const levelCourse = getCourseLevelData(courseType, seniorLeaderMessageGoalsData)
  const goalsConnection = levelCourse.metadata.goalsConnection.edges.map((edge) => edge.node)
  return {
    title: levelCourse.metadata.display_title || levelCourse.title,
    goals: goalsConnection.map(goal => getFormattedGoals(goal))
  }
}

const SeniorLeaderMessageCmsDataFormatter = (
  slmData,
  courseType,
  seniorLeaderMessageGoalsData,
) => {
  const { senior_leader_message } = slmData;
  return {
    id: getId(senior_leader_message),
    seniorLeaderMessageContents: getSeniorLeaderMessageContents(
      senior_leader_message.modular_blocks,
    ),
    contentStackCourse: getFormattedContentstackCourse(courseType, seniorLeaderMessageGoalsData)
  };
};

export default SeniorLeaderMessageCmsDataFormatter;
