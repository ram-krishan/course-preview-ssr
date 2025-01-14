import { useEffect, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';

const useAllCourseData = (query, courseKey) => {
const [allItems, setAllItems] = useState([]);
const [loading, setLoading] = useState(true);
const [skip, setSkip] = useState(0);
const pageSize = 100;

  const { data, error, loading: queryLoading } = useQuery(query, {
    variables: { skip, limit: pageSize },
    fetchPolicy: 'network-only',
  });

  useEffect(() => {
    if (data && !queryLoading) {
      const newItems = data[courseKey].items;
      setAllItems(prevAllItems => [...prevAllItems, ...newItems]);
      setSkip(prevSkip => {
        const newSkip = prevSkip + pageSize;
        if (newSkip < data[courseKey].total) {
          return newSkip;
        } else {
          setLoading(false);
          return prevSkip;
        } 
      });
    }
  }, [courseKey, queryLoading, data]);

  return { allItems, loading, error };
};

export default useAllCourseData;
