import React from 'react';

interface Props {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  className?: string;
}

export const FormContainer: React.FC<Props> = ({ title, subtitle, children, className = '' }) => {
  return (
    <div className={`bg-white rounded-lg shadow-md overflow-hidden ${className}`}>
      {(title || subtitle) && (
        <div className="bg-gradient-to-r from-blue-50 to-blue-100 px-6 py-4 border-b border-blue-100">
          {title && <h2 className="text-xl font-semibold text-gray-800">{title}</h2>}
          {subtitle && <p className="mt-1 text-sm text-gray-600">{subtitle}</p>}
        </div>
      )}
      <div className="p-6 bg-[#E6F3FF]">{children}</div>
    </div>
  );
};