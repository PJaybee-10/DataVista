import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MoreVertical, Edit, Flag, Trash2, Eye, Mail, Phone, Briefcase, CheckCircle } from 'lucide-react';
import type { Employee } from './EmployeeGrid';

interface EmployeeTileViewProps {
  employees: Employee[];
  onSelectEmployee: (id: number) => void;
  onEdit?: (id: number) => void;
  onFlag?: (id: number, flagged: boolean) => void;
  onDelete?: (id: number) => void;
  isAdmin?: boolean;
}

const EmployeeTileView: React.FC<EmployeeTileViewProps> = ({
  employees,
  onSelectEmployee,
  onEdit,
  onFlag,
  onDelete,
  isAdmin = false,
}) => {
  const [activeMenu, setActiveMenu] = useState<number | null>(null);

  const handleAction = (action: string, employeeId: number, flagged?: boolean) => {
    setActiveMenu(null);
    switch (action) {
      case 'view':
        onSelectEmployee(employeeId);
        break;
      case 'edit':
        onEdit?.(employeeId);
        break;
      case 'flag':
        onFlag?.(employeeId, !flagged);
        break;
      case 'delete':
        if (confirm('Are you sure you want to delete this employee?')) {
          onDelete?.(employeeId);
        }
        break;
    }
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {employees.map((employee, index) => (
        <motion.div
          key={employee.id}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.05 }}
          className="relative bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
        >
          {/* Flag indicator */}
          {employee.flagged && (
            <div className="absolute top-3 left-3 z-10">
              <Flag className="w-5 h-5 text-red-500 fill-red-500 drop-shadow" />
            </div>
          )}

          {/* Menu button */}
          <div className="absolute top-3 right-3 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setActiveMenu(activeMenu === employee.id ? null : employee.id);
              }}
              className="p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition-all"
            >
              <MoreVertical className="w-5 h-5 text-gray-700" />
            </button>

            <AnimatePresence>
              {activeMenu === employee.id && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -10 }}
                  className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 py-1 z-20"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleAction('view', employee.id)}
                    className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 transition"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                  {isAdmin && (
                    <>
                      <button
                        onClick={() => handleAction('edit', employee.id)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition"
                      >
                        <Edit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleAction('flag', employee.id, employee.flagged)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-yellow-50 hover:text-yellow-600 transition"
                      >
                        <Flag className="w-4 h-4" />
                        {employee.flagged ? 'Unflag' : 'Flag'}
                      </button>
                      <div className="border-t border-gray-100 my-1"></div>
                      <button
                        onClick={() => handleAction('delete', employee.id)}
                        className="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition"
                      >
                        <Trash2 className="w-4 h-4" />
                        Delete
                      </button>
                    </>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card content */}
          <div
            onClick={() => onSelectEmployee(employee.id)}
            className="cursor-pointer"
          >
            {/* Header with gradient */}
            <div className="h-24 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 relative">
              <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2">
                <img
                  src={employee.avatar}
                  alt={employee.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-xl"
                />
              </div>
            </div>

            {/* Content */}
            <div className="pt-14 px-4 pb-4">
              <div className="text-center mb-4">
                <h3 className="text-lg font-bold text-gray-900 mb-1">{employee.name}</h3>
                <p className="text-sm text-indigo-600 font-medium mb-2">{employee.position}</p>
                <span className="inline-block px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 rounded-full">
                  {employee.class}
                </span>
              </div>

              {/* Info */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{employee.email}</span>
                </div>
                {employee.phone && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Phone className="w-4 h-4 text-gray-400" />
                    <span>{employee.phone}</span>
                  </div>
                )}
                {employee.department && (
                  <div className="flex items-center gap-2 text-xs text-gray-600">
                    <Briefcase className="w-4 h-4 text-gray-400" />
                    <span>{employee.department}</span>
                  </div>
                )}
              </div>

              {/* Subjects */}
              <div className="mb-4">
                <div className="flex flex-wrap gap-1">
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
              </div>

              {/* Stats */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center gap-1 text-xs text-gray-500 mb-1">
                    Tasks
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="flex items-center gap-1 text-sm font-semibold text-green-600">
                      <CheckCircle className="w-4 h-4" />
                      {employee.tasks.filter(t => t.completed).length}
                    </span>
                    <span className="text-gray-400">/</span>
                    <span className="flex items-center gap-1 text-sm font-semibold text-gray-600">
                      {employee.tasks.length}
                    </span>
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-gray-500 mb-1">Attendance</div>
                  <div className="flex gap-1">
                    {employee.attendance.slice(0, 5).map((att) => (
                      <div
                        key={att.id}
                        className={`w-2 h-6 rounded-full ${
                          att.status === 'PRESENT' ? 'bg-green-500' :
                          att.status === 'LATE' ? 'bg-yellow-500' :
                          att.status === 'ABSENT' ? 'bg-red-500' :
                          'bg-blue-500'
                        }`}
                        title={`${new Date(att.date).toLocaleDateString()}: ${att.status}`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default EmployeeTileView;
