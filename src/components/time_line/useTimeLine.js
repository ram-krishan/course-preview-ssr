import { get, isFunction } from 'lodash';

const getStatus = (data, statusKeyOrFunction) => {
  if (isFunction(statusKeyOrFunction)) {
    return statusKeyOrFunction(data);
  }
  return get(data, statusKeyOrFunction) || 'open';
};

function useTimeLine(timeLineRawData, idKey, titleKey, statusKeyOrFunction) {
  return timeLineRawData.map((data, index) => ({
    id: get(data, idKey),
    title: get(data, titleKey),
    status: getStatus(data, statusKeyOrFunction),
    position: index + 1,
  }));
}

export default useTimeLine;
