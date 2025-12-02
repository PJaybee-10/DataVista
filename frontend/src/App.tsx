import { useState } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { AnimatePresence } from 'framer-motion';
import { Grid, LayoutGrid, Search, Filter, RefreshCw } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { useViewStore } from './store/viewStore';
import Login from './components/Login';
import HamburgerMenu from './components/HamburgerMenu';
import HorizontalMenu from './components/HorizontalMenu';
import EmployeeGrid from './components/EmployeeGrid';
import EmployeeTileView from './components/EmployeeTileView';
import EmployeeDetail from './components/EmployeeDetail';
import { GET_EMPLOYEES, FLAG_EMPLOYEE, DELETE_EMPLOYEE } from './apollo/queries';
import './App.css';

function App() {
  const { isAuthenticated, user } = useAuthStore();
  const { viewMode, setViewMode, selectedEmployeeId, setSelectedEmployeeId } = useViewStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');

  const { data, loading, error, refetch } = useQuery(GET_EMPLOYEES, {
    variables: {
      limit: 100,
      offset: 0,
      filter: departmentFilter ? { department: departmentFilter } : undefined,
    },
    skip: !isAuthenticated,
  });

  const [flagEmployee] = useMutation(FLAG_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { limit: 100, offset: 0 } }],
  });

  const [deleteEmployee] = useMutation(DELETE_EMPLOYEE, {
    refetchQueries: [{ query: GET_EMPLOYEES, variables: { limit: 100, offset: 0 } }],
  });

  if (!isAuthenticated) {
    return <Login />;
  }

  const employees = data?.employees?.edges || [];
  
  const filteredEmployees = employees.filter((emp: any) =>
    emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    emp.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const departments = [...new Set(employees.map((e: any) => e.department).filter(Boolean))];

  const handleFlag = (id: number, flagged: boolean) => {
    flagEmployee({ variables: { id, flagged } });
  };

  const handleDelete = (id: number) => {
    deleteEmployee({ variables: { id } });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <HamburgerMenu />
      <HorizontalMenu />

      <div className="max-w-7xl mx-auto px-4 py-8 ml-0 md:ml-0">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Employee Management
          </h1>
          <p className="text-gray-600">
            Welcome back, <span className="font-semibold text-indigo-600">{user?.email}</span>
          </p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Search */}
            <div className="flex-1 w-full md:w-auto">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
                />
              </div>
            </div>

            {/* Department Filter */}
            <div className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-gray-400" />
              <select
                value={departmentFilter}
                onChange={(e) => setDepartmentFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none"
              >
                <option value="">All Departments</option>
                {departments.map((dept: any) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={() => setViewMode('tile')}
                className={`p-2 rounded-md transition ${
                  viewMode === 'tile'
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Tile View"
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 rounded-md transition ${
                  viewMode === 'grid'
                    ? 'bg-white text-indigo-600 shadow'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                title="Grid View"
              >
                <Grid className="w-5 h-5" />
              </button>
            </div>

            {/* Refresh */}
            <button
              onClick={() => refetch()}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
              title="Refresh"
            >
              <RefreshCw className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          {/* Stats */}
          <div className="flex gap-6 mt-4 pt-4 border-t border-gray-200">
            <div>
              <p className="text-2xl font-bold text-indigo-600">{filteredEmployees.length}</p>
              <p className="text-sm text-gray-600">Total Employees</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">{departments.length}</p>
              <p className="text-sm text-gray-600">Departments</p>
            </div>
            {user?.role === 'ADMIN' && (
              <div>
                <p className="text-2xl font-bold text-yellow-600">
                  {employees.filter((e: any) => e.flagged).length}
                </p>
                <p className="text-sm text-gray-600">Flagged</p>
              </div>
            )}
          </div>
        </div>

        {/* Content */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
            <p className="text-red-600">Error loading employees: {error.message}</p>
          </div>
        )}

        {!loading && !error && filteredEmployees.length === 0 && (
          <div className="bg-white rounded-lg p-12 text-center">
            <p className="text-gray-500">No employees found</p>
          </div>
        )}

        {!loading && !error && filteredEmployees.length > 0 && (
          <>
            {viewMode === 'grid' ? (
              <EmployeeGrid
                employees={filteredEmployees}
                onSelectEmployee={setSelectedEmployeeId}
              />
            ) : (
              <EmployeeTileView
                employees={filteredEmployees}
                onSelectEmployee={setSelectedEmployeeId}
                onFlag={handleFlag}
                onDelete={handleDelete}
                isAdmin={user?.role === 'ADMIN'}
              />
            )}
          </>
        )}
      </div>

      {/* Employee Detail Modal */}
      <AnimatePresence>
        {selectedEmployeeId && (
          <EmployeeDetail
            employeeId={selectedEmployeeId}
            onClose={() => setSelectedEmployeeId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
