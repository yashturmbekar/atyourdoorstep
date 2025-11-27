import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const ScrollToTop = () => {
  const location = useLocation();

  useEffect(() => {
    // Don't scroll to top if there's a hash fragment (let the page handle it)
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.pathname, location.hash]);

  return null;
};
