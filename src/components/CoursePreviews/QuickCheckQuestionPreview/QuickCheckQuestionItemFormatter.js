const getByTitle = (item) => {
  return item.title
}

const getStem = (item) => {
  const variantData = getFormattedVariants(item);
  if (variantData[0] === '') {
    return {};
  }
  return variantData.map((variant) => {
    return variant.stem;
  });
};

const getTopics = (item) => {
  const topics = []
  const edges = item.topicConnection.edges;
  edges.forEach((edge) => {
    topics.push(edge.node.display_name)
  })
  return topics;
}

const getFormattedVariants = (questionitem) => {
  const { variants } = questionitem;
  const variantData = variants.map((variant) => (
    getVarientData(variant)
  ));
  return variantData;
}

const getVarientData = (variant) => {
  switch (variant.__typename) {
    case 'QuestionitemVariantsMcquestion':
      return variant.mcquestion;
    default:
      return '';
  }
}

const prepareQuestionItemData = (all_questionitem) => {
  return all_questionitem.items.map((item) => ({
    title: getByTitle(item),
    stem: getStem(item),
    topics: getTopics(item),
    choicesAndFeedback: getChoicesAndFeedback(item)
  }));
};

const getChoicesAndFeedback = (item) => {
  const variants = getFormattedVariants(item);
  if (variants[0] === '') {
    return {};
  }
  const choices = [];
  variants.forEach((variant) => {
    const variantChoices = variant.choices;
    variantChoices.forEach((choice) => {
      choices.push(choice.choice);
    });
  });
  return choices;
};

const getQuickCheckQuestionItemFormattedData = (allQuickCheckQuestioItemData) => {
  const { all_questionitem } = allQuickCheckQuestioItemData;
  return {
    questionItemData: prepareQuestionItemData(all_questionitem),
  };
};

export default getQuickCheckQuestionItemFormattedData;