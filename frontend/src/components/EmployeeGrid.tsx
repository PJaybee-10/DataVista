import React from 'react';
import { motion } from 'framer-motion';
import { Mail, Flag, CheckCircle, Circle } from 'lucide-react';

export interface Employee {
  id: number;
  name: string;
  email: string;
  age: number;
  class: string;
  subjects: string[];
  department: string | null;
  position: string;
  avatar: string;
  phone: string | null;
  address: string | null;
  flagged: boolean;
  tasks: Array<{
    id: number;
    title: string;
    completed: boolean;
    priority: string;
  }>;
  attendance: Array<{
    id: number;
    date: string;
    status: string;
  }>;
}

interface EmployeeGridProps {
  employees: Employee[];
  onSelectEmployee: (id: number) => void;
}

const EmployeeGrid: React.FC<EmployeeGridProps> = ({ employees, onSelectEmployee }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm">
        <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Avatar</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Name</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Email</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Age</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Class</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Department</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Position</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Subjects</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Tasks</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider border-b">Attendance</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {employees.map((employee, index) => (
            <motion.tr
              key={employee.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              onClick={() => onSelectEmployee(employee.id)}
              className="hover:bg-indigo-50/50 cursor-pointer transition-colors"
            >
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="relative">
                  <img
                    src={employee.avatar}
                    alt={employee.name}
                    className="w-10 h-10 rounded-full object-cover ring-2 ring-white shadow"
                  />
                  {employee.flagged && (
                    <Flag className="absolute -top-1 -right-1 w-4 h-4 text-red-500 fill-red-500" />
                  )}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="font-medium text-gray-900">{employee.name}</div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="text-sm text-gray-600 flex items-center gap-1">
                  <Mail className="w-3 h-3" />
                  {employee.email}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-700">{employee.age}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="px-2 py-1 text-xs font-medium bg-blue-100 text-blue-700 rounded-full">
                  {employee.class}
                </span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-700">{employee.department || 'N/A'}</span>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <span className="text-sm text-gray-700">{employee.position}</span>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-1 max-w-xs">
                  {employee.subjects.slice(0, 3).map((subject, i) => (
                    <span key={i} className="px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded">
                      {subject}
                    </span>
                  ))}
                  {employee.subjects.length > 3 && (
                    <span className="px-2 py-1 text-xs bg-gray-100 text-gray-700 rounded">
                      +{employee.subjects.length - 3}
                    </span>
                  )}
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex items-center gap-2 text-xs">
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle className="w-3 h-3" />
                    {employee.tasks.filter(t => t.completed).length}
                  </span>
                  <span className="text-gray-400">/</span>
                  <span className="flex items-center gap-1 text-gray-600">
                    <Circle className="w-3 h-3" />
                    {employee.tasks.length}
                  </span>
                </div>
              </td>
              <td className="px-4 py-3 whitespace-nowrap">
                <div className="flex gap-1">
                  {employee.attendance.slice(0, 3).map((att) => (
                    <div
                      key={att.id}
                      className={`w-2 h-6 rounded-full ${
                        att.status === 'PRESENT' ? 'bg-green-500' :
                        att.status === 'LATE' ? 'bg-yellow-500' :
                        att.status === 'ABSENT' ? 'bg-red-500' :
                        'bg-blue-500'
                      }`}
                      title={`${att.date}: ${att.status}`}
                    />
                  ))}
                </div>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default EmployeeGrid;
