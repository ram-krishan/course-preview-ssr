const courseVersionTableInitialState = {
  searchText: '',
  selectedPage: '',
};

const courseVersionTableReducer = (state, action) => {
  switch (action.type) {
    case 'UPDATE_TABLE_WITH_SEARCH_TEXT':
      return {
        ...state,
        selectedPage: '',
        searchText: action.payload.searchText,
      };
      case 'UPDATE_PAGINATION_DATA':
        return {
          ...state,
          selectedPage: action.payload.selectedPage,
        };
    default:
      return state;
  }
};

export { courseVersionTableInitialState, courseVersionTableReducer };
