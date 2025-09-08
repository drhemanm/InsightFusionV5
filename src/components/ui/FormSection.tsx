import React from 'react';

interface Props {
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const FormSection: React.FC<Props> = ({ title, description, children }) => {
  return (
    <div className="space-y-4">
      {(title || description) && (
        <div>
          {title && <h3 className="text-lg font-medium text-gray-800">{title}</h3>}
          {description && <p className="mt-1 text-sm text-gray-600">{description}</p>}
        </div>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};