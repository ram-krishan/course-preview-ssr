import { useEffect } from 'react';


const useTextSearch = (callback, text) => {
  useEffect(() => {
    const timer = setTimeout(callback, 500);

    return () => {
      clearTimeout(timer);
    };
  }, [text]);
};

export default useTextSearch;
