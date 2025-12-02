import React, { useState } from 'react';
import { Menu, X, Home, Users, Settings, ChevronDown, LogOut, Shield, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../store/authStore';

interface HamburgerMenuProps {
  onNavigate?: (page: string) => void;
}

const HamburgerMenu: React.FC<HamburgerMenuProps> = ({ onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const { user, logout } = useAuthStore();

  const menuItems = [
    { id: 'home', label: 'Home', icon: Home },
    {
      id: 'employees',
      label: 'Employees',
      icon: Users,
      submenu: [
        { id: 'all-employees', label: 'All Employees' },
        { id: 'departments', label: 'Departments' },
        { id: 'attendance', label: 'Attendance' },
      ],
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: Settings,
      submenu: [
        { id: 'profile', label: 'Profile' },
        { id: 'preferences', label: 'Preferences' },
      ],
    },
  ];

  const handleLogout = () => {
    logout();
    window.location.href = '/login';
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition"
        aria-label="Open menu"
      >
        <Menu className="w-6 h-6 text-gray-700" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-sm"
            />

            <motion.div
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25 }}
              className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl z-50 overflow-y-auto"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">DataVista</h2>
                    <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                      {user?.role === 'ADMIN' ? <Shield className="w-3 h-3" /> : <User className="w-3 h-3" />}
                      {user?.role}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition"
                  >
                    <X className="w-6 h-6 text-gray-700" />
                  </button>
                </div>

                <nav className="space-y-2">
                  {menuItems.map((item) => (
                    <div key={item.id}>
                      <button
                        onClick={() => {
                          if (item.submenu) {
                            setOpenSubmenu(openSubmenu === item.id ? null : item.id);
                          } else {
                            onNavigate?.(item.id);
                            setIsOpen(false);
                          }
                        }}
                        className="w-full flex items-center justify-between px-4 py-3 text-left text-gray-700 hover:bg-indigo-50 hover:text-indigo-600 rounded-lg transition group"
                      >
                        <div className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.label}</span>
                        </div>
                        {item.submenu && (
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              openSubmenu === item.id ? 'rotate-180' : ''
                            }`}
                          />
                        )}
                      </button>

                      <AnimatePresence>
                        {item.submenu && openSubmenu === item.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <div className="ml-4 mt-1 space-y-1 border-l-2 border-indigo-100 pl-4">
                              {item.submenu.map((subitem) => (
                                <button
                                  key={subitem.id}
                                  onClick={() => {
                                    onNavigate?.(subitem.id);
                                    setIsOpen(false);
                                  }}
                                  className="block w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-indigo-600 hover:bg-indigo-50 rounded transition"
                                >
                                  {subitem.label}
                                </button>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  ))}
                </nav>

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-left text-red-600 hover:bg-red-50 rounded-lg transition"
                  >
                    <LogOut className="w-5 h-5" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>

                <div className="mt-6 p-4 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-lg">
                  <p className="text-xs font-semibold text-gray-700 mb-1">Logged in as:</p>
                  <p className="text-sm text-gray-900 break-all">{user?.email}</p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

export default HamburgerMenu;
