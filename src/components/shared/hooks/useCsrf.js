import { useState, useEffect } from 'react';

const useCsrf = () => {
  const [csrf, setCsrf] = useState(null);

  useEffect(() => {
    setCsrf(document.querySelector('meta[name="csrf-token"]').content);
  }, []);
  return csrf;
};

export default useCsrf;
