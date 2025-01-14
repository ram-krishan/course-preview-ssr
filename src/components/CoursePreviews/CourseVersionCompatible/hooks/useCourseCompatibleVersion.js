import { useState, useReducer, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { courseVersionTableInitialState, courseVersionTableReducer } from '../reducer';

const PERPAGE = 10;

const useCourseCompatibleVersion = ({ 
  cmsId,
  courseType,
}) => {
  const [loading, setLoading] = useState(false);
  const [courseVersionCompatibleData, setCourseVersionCompatibleData] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [errorMessage, setErrorMessage] = useState("")

  const [courseVersionTableState, courseVersionTableDispatcher] = useReducer(
    courseVersionTableReducer,
    courseVersionTableInitialState
  );
  const {
    searchText: searchTextParam,
    selectedPage: selectedPageToken
  } = courseVersionTableState;

  const [pageTokenList, setPageTokenList] = useState([]);
  const [selectedPage, setSelectedPage] = useState(-1);
  const [searchText, setSearchText] = useState('');
  const [publishRequested, setPublishRequested] = useState(true);
  const publishRequestedOptions = [{
    value: 'All',
    label: 'All'
  },
  {
    value: true,
    label: 'Yes',
  },
  {
    value: false,
    label: 'No'
  }]

  useEffect(()=> {
    if(nextPageToken !== null && (pageTokenList.indexOf(nextPageToken) === -1)) {
      setPageTokenList( arr => [...arr, nextPageToken]);
    }
  }, [nextPageToken]);

  const handlePageClick = (direction) => {
    let nextOrPrevPage;
    switch (direction) {
      case 'next':
        nextOrPrevPage = selectedPage + 1;
        break;
      case 'previous':
        nextOrPrevPage = selectedPage - 1;
        break;
      default:
        break;
    }

    setSelectedPage(nextOrPrevPage);
    const pageToken = pageTokenList[nextOrPrevPage];

    courseVersionTableDispatcher({
      type: 'UPDATE_PAGINATION_DATA',
      payload: { selectedPage: (isEmpty(pageToken) ? '' : pageToken) },
    });
  };
  
  useEffect(()=>{
    const controller = new AbortController()
    getCourseVersion(controller);
    return () => {
      controller.abort()
    }
  }, [cmsId, courseType, courseVersionTableState.searchText, selectedPage, publishRequested]);

  const disablePrevious = () => {
    return selectedPage === -1;
  }

  const disableNext = () => {
    return selectedPage === (pageTokenList.length - 1);
  }

  const handleClearSearchText = () => {
    setSearchText('')
    courseVersionTableDispatcher({
      type: 'UPDATE_TABLE_WITH_SEARCH_TEXT',
      payload: { searchText: '' },
    });
  }

  const handleSubmitSearchText = () => {
    setSelectedPage(-1);
    setPageTokenList([]);
    courseVersionTableDispatcher({
      type: 'UPDATE_TABLE_WITH_SEARCH_TEXT',
      payload: { searchText },
    });
  };

  const handlePublishRequested = (selectedOption) => {
    setPublishRequested(selectedOption.value);
  }

  const getCourseVersion = async(controller) => {
    const getCourseCompatibleVersionDataEndpoint = process.env.REACT_APP_VALIDATE_SERVICE__GET_COMPATIBLE_COURSE_VERSIONS
      + `?cms_id=${cmsId}&course_type=${courseType}&per_page=${PERPAGE}&search=${searchTextParam}&next_page_token=${selectedPageToken}&is_publish_requested=${publishRequested}`;

      setLoading(true);
    const config = {
      method: 'GET',
      headers: {
        'x-api-key': process.env.REACT_APP_VALIDATE_SERVICE__X_API_KEY,
        'Content-Type': 'application/json'
      },
      signal: controller.signal
    }
    try{
      setLoading(true)
      const response = await fetch(getCourseCompatibleVersionDataEndpoint, config);
      const jsonResponse = await response.json();
      if (jsonResponse.success) {
        setCourseVersionCompatibleData(jsonResponse.records);
        setNextPageToken(jsonResponse.next_page_token);
      }
      else {
        setErrorMessage(jsonResponse.errors)
      }
      setLoading(false)
    }
    catch(error){
      if (error.name !== 'AbortError') {
        setLoading(false)
        setErrorMessage(error.message)
      }
    }
  }
  return {
    data: isEmpty(courseVersionCompatibleData) ? null : courseVersionCompatibleData,
    errorMessages: errorMessage,
    loading: loading,
    pageTokenList,
    setPageTokenList,
    disableNext,
    disablePrevious,
    setSelectedPage,
    searchText,
    setSearchText,
    publishRequested,
    handlePublishRequested,
    publishRequestedOptions,
    courseVersionTableDispatcher,
    handlePageClick,
    handleSubmitSearchText,
    handleClearSearchText,
  }
}

export default useCourseCompatibleVersion;