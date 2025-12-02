import React from 'react';
import { useQuery } from '@apollo/client';
import { GET_EMPLOYEES } from '../apollo/queries';

interface Task {
  id: number;
  title: string;
  completed: boolean;
}

interface Employee {
  id: number;
  name: string;
  role: string;
  avatar: string;
  tasks: Task[];
}

interface GetEmployeesData {
  employees: Employee[];
}

const GridView: React.FC = () => {
  const { loading, error, data } = useQuery<GetEmployeesData>(GET_EMPLOYEES);

  if (loading) {
    return (
      <div className="w-full px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading employees...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full px-4 py-8">
        <div className="flex justify-center items-center min-h-[400px]">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
            <h3 className="text-red-800 font-semibold mb-2">Error loading data</h3>
            <p className="text-red-600 text-sm">{error.message}</p>
            <p className="text-gray-600 text-xs mt-2">Make sure the backend server is running on port 4000</p>
          </div>
        </div>
      </div>
    );
  }

  const employees = data?.employees || [];

  return (
    <div className="w-full px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
        {employees.map((employee: Employee) => (
          <div
            key={employee.id}
            className="bg-white rounded-lg shadow-md p-6 flex flex-col items-center transition-transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            <img
              src={employee.avatar}
              alt={employee.name}
              className="w-24 h-24 rounded-full mb-4 object-cover"
            />
            <h3 className="text-lg font-bold text-gray-800 text-center mb-2">
              {employee.name}
            </h3>
            <p className="text-sm text-gray-500 text-center mb-3">
              {employee.role}
            </p>
            {employee.tasks && employee.tasks.length > 0 && (
              <div className="w-full mt-2 pt-3 border-t border-gray-200">
                <p className="text-xs font-semibold text-gray-700 mb-2">
                  Tasks: {employee.tasks.length}
                </p>
                <div className="flex gap-1 justify-center">
                  <span className="text-xs text-green-600">
                    ✓ {employee.tasks.filter(t => t.completed).length}
                  </span>
                  <span className="text-xs text-gray-400">|</span>
                  <span className="text-xs text-yellow-600">
                    ⧗ {employee.tasks.filter(t => !t.completed).length}
                  </span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {employees.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No employees found. Run the seed script to populate data.</p>
        </div>
      )}
    </div>
  );
};

export default GridView;
