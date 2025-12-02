import React from 'react';

interface SkeletonLoaderProps {
  count?: number;
  viewMode?: 'grid' | 'tile';
}

const SkeletonLoader: React.FC<SkeletonLoaderProps> = ({ count = 6, viewMode = 'tile' }) => {
  if (viewMode === 'grid') {
    return (
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
              <tr>
                {['Name', 'Email', 'Department', 'Position', 'Tasks', 'Attendance', 'Actions'].map((header) => (
                  <th key={header} className="px-6 py-4 text-left">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: count }).map((_, idx) => (
                <tr key={idx} className="border-t border-gray-100">
                  {Array.from({ length: 7 }).map((_, colIdx) => (
                    <td key={colIdx} className="px-6 py-4">
                      <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100"
        >
          <div className="h-48 bg-gradient-to-br from-gray-200 to-gray-300 animate-pulse" />
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse" />
              <div className="flex-1 space-y-2">
                <div className="h-5 bg-gray-200 rounded animate-pulse w-3/4" />
                <div className="h-4 bg-gray-200 rounded animate-pulse w-1/2" />
              </div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 bg-gray-200 rounded animate-pulse w-5/6" />
            </div>
            <div className="flex gap-2 pt-4">
              <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
              <div className="h-10 bg-gray-200 rounded animate-pulse flex-1" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
