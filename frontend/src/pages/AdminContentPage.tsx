/**
 * Admin Content Page
 * Main entry point for the CMS admin section
 * Following Clean Architecture and instruction file standards
 */

import React from 'react';
import { ContentDashboard } from '../components/admin';

const AdminContentPage: React.FC = () => {
  return <ContentDashboard />;
};

export default AdminContentPage;
