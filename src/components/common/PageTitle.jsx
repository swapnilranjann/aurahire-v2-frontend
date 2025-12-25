import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const PAGE_TITLES = {
  '/': 'Home | JobPortal',
  '/home': 'Home | JobPortal',
  '/about': 'About Us | JobPortal',
  '/contact': 'Contact Us | JobPortal',
  '/jobs': 'All Jobs | JobPortal',
};

const PageTitle = () => {
  const location = useLocation();

  useEffect(() => {
    const title = PAGE_TITLES[location.pathname] || 'JobPortal - Find Your Dream Career';
    document.title = title;
  }, [location.pathname]);

  return null;
};

export default PageTitle;


