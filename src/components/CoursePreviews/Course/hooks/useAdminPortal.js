import { useEffect, useState } from 'react';

export const useAdminPortal = () => {
  const [isAdminPortal, setIsAdminPortal] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    setIsAdminPortal(url.hostname.includes('admin'));
  }, []);

  return isAdminPortal;
};
