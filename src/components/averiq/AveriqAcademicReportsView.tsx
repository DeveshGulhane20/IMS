import React from 'react';
import { AveriqExamsAndResults } from './AveriqExamsAndResults';

export const AveriqAcademicReportsView: React.FC<{ defaultTab?: 'exams' | 'results' }> = ({ defaultTab = 'exams' }) => {
  return <AveriqExamsAndResults defaultTab={defaultTab} />;
};

export { AveriqExamsAndResults };
