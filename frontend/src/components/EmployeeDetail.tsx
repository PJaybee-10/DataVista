import React from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { motion } from 'framer-motion';
import { ATTENDANCE_STATUS_COLORS, PRIORITY_COLORS } from '../config/constants';
import {
  Mail,
  Phone,
  MapPin,
  Calendar,
  DollarSign,
  Briefcase,
  GraduationCap,
  CheckCircle,
  Circle,
  Clock,
  ArrowLeft,
  Flag,
} from 'lucide-react';
import { GET_EMPLOYEE, UPDATE_TASK } from '../apollo/queries';

interface EmployeeDetailProps {
  employeeId: number;
  onClose: () => void;
}

const EmployeeDetail: React.FC<EmployeeDetailProps> = ({ employeeId, onClose }) => {
  const { data, loading, error } = useQuery(GET_EMPLOYEE, {
    variables: { id: employeeId },
  });

  const [updateTask] = useMutation(UPDATE_TASK, {
    refetchQueries: [{ query: GET_EMPLOYEE, variables: { id: employeeId } }],
  });

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (error || !data?.employee) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center">
        <div className="bg-white rounded-lg p-8">
          <p className="text-red-600">Error loading employee details</p>
          <button onClick={onClose} className="mt-4 px-4 py-2 bg-gray-200 rounded">
            Close
          </button>
        </div>
      </div>
    );
  }

  const employee = data.employee;

  const handleTaskToggle = (taskId: number, completed: boolean) => {
    updateTask({ variables: { id: taskId, completed: !completed } });
  };

  const getAttendanceColor = (status: string) => {
    return ATTENDANCE_STATUS_COLORS[status as keyof typeof ATTENDANCE_STATUS_COLORS] || 
           'bg-gray-100 text-gray-700 border-gray-200';
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 overflow-y-auto"
      onClick={onClose}
    >
      <div className="min-h-screen px-4 py-8 flex items-center justify-center">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
          className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full overflow-hidden"
        >
          {/* Header */}
          <div className="relative h-48 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            <button
              onClick={onClose}
              className="absolute top-4 left-4 p-2 bg-white/90 backdrop-blur-sm rounded-lg shadow-md hover:bg-white transition flex items-center gap-2"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </button>

            {employee.flagged && (
              <div className="absolute top-4 right-4">
                <Flag className="w-6 h-6 text-white fill-white drop-shadow" />
              </div>
            )}

            <div className="absolute -bottom-16 left-8">
              <img
                src={employee.avatar}
                alt={employee.name}
                className="w-32 h-32 rounded-2xl object-cover border-4 border-white shadow-xl"
              />
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pt-20 pb-8">
            {/* Basic Info */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{employee.name}</h1>
              <p className="text-xl text-indigo-600 font-medium mb-3">{employee.position}</p>
              <div className="flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm font-semibold">
                  {employee.class}
                </span>
                <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm font-semibold">
                  Age: {employee.age}
                </span>
                {employee.department && (
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-semibold">
                    {employee.department}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              {/* Contact Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Mail className="w-5 h-5 text-indigo-600" />
                  Contact Information
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Mail className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Email</p>
                      <p className="text-sm text-gray-900">{employee.email}</p>
                    </div>
                  </div>
                  {employee.phone && (
                    <div className="flex items-start gap-3">
                      <Phone className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Phone</p>
                        <p className="text-sm text-gray-900">{employee.phone}</p>
                      </div>
                    </div>
                  )}
                  {employee.address && (
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Address</p>
                        <p className="text-sm text-gray-900">{employee.address}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Employment Details */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                  Employment Details
                </h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <Calendar className="w-5 h-5 text-gray-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-gray-500 mb-1">Join Date</p>
                      <p className="text-sm text-gray-900">
                        {new Date(employee.joinDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>
                  {employee.salary && (
                    <div className="flex items-start gap-3">
                      <DollarSign className="w-5 h-5 text-gray-400 mt-0.5" />
                      <div>
                        <p className="text-xs text-gray-500 mb-1">Salary</p>
                        <p className="text-sm text-gray-900">
                          ${employee.salary.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Subjects */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-indigo-600" />
                Subjects / Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {employee.subjects.map((subject: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-2 bg-gradient-to-r from-purple-100 to-pink-100 text-purple-700 rounded-lg text-sm font-medium"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </div>

            {/* Tasks */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-indigo-600" />
                Tasks ({employee.tasks.length})
              </h3>
              <div className="space-y-2">
                {employee.tasks.map((task: any) => (
                  <div
                    key={task.id}
                    className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <button
                      onClick={() => handleTaskToggle(task.id, task.completed)}
                      className="mt-1"
                    >
                      {task.completed ? (
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-400" />
                      )}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          task.completed ? 'text-gray-500 line-through' : 'text-gray-900'
                        }`}
                      >
                        {task.title}
                      </p>
                      {task.description && (
                        <p className="text-xs text-gray-600 mt-1">{task.description}</p>
                      )}
                      {task.dueDate && (
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Due: {new Date(task.dueDate).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <span
                      className={`px-2 py-1 text-xs rounded ${
                        PRIORITY_COLORS[task.priority?.toUpperCase() as keyof typeof PRIORITY_COLORS] || 
                        PRIORITY_COLORS.LOW
                      }`}
                    >
                      {task.priority}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Attendance */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-indigo-600" />
                Recent Attendance
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {employee.attendance.slice(0, 9).map((record: any) => (
                  <div
                    key={record.id}
                    className={`p-3 rounded-lg border ${getAttendanceColor(record.status)}`}
                  >
                    <p className="text-sm font-semibold mb-1">
                      {new Date(record.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                      })}
                    </p>
                    <p className="text-xs font-medium">{record.status}</p>
                    {record.checkIn && (
                      <p className="text-xs mt-1">
                        In: {new Date(record.checkIn).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                    {record.checkOut && (
                      <p className="text-xs">
                        Out: {new Date(record.checkOut).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    )}
                    {record.notes && <p className="text-xs mt-1 italic">{record.notes}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EmployeeDetail;
