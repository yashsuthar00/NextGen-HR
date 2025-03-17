import React, { useState, useEffect } from "react";
import api from "../utils/api";
import {
  Loader2,
  CheckCircle,
  AlertCircle,
  UserPlus,
  RefreshCw,
  Eye,
  EyeOff,
  Search,
  Filter,
  MoreVertical,
  Trash2,
  Edit,
  Moon,
  Sun,
} from "lucide-react";

function UserManagementSystem() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [formData, setFormData] = useState({
    username: "",
    fullname: "",
    email: "",
    department: "",
    role: "employee",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isGeneratingPassword, setIsGeneratingPassword] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("all");
  const [darkMode, setDarkMode] = useState(false);
  const [showAddUser, setShowAddUser] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [userToDelete, setUserToDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.department?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesFilter =
      filterRole === "all" ||
      user.role === filterRole ||
      user.role?.name === filterRole;

    return matchesSearch && matchesFilter;
  });

  // Calculate pagination
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);

  useEffect(() => {
    fetchUsers();
    // Check user preference for dark mode
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    setDarkMode(savedDarkMode);
    if (savedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await api.get("/users");
      setUsers(response.data);
      setError(null);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userData) => {
    setLoading(true);
    try {
      const updatedUserData = {
        ...userData,
        role: userData.role.name || userData.role, // Ensure role is sent as a string
      };
      await api.put(`/users/${userData._id}`, updatedUserData);
      setSuccess(`Successfully updated user: ${userData.fullname}`);
      fetchUsers();

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError("Failed to update user. Please try again.", err);
      console.log("Error updating user:", err);

      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await api.delete(`/users/${userId}`);
      setSuccess(`Successfully deleted user`);
      fetchUsers();

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      setError("Failed to delete user. Please try again.");
      console.error("Error deleting user:", err);

      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const generatePassword = () => {
    setIsGeneratingPassword(true);
    const chars =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
    let password = "";
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    setFormData({
      ...formData,
      password,
    });

    setTimeout(() => {
      setIsGeneratingPassword(false);
    }, 300);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/users", formData);
      setSuccess(
        `Successfully created new ${formData.role} account for ${formData.fullname}`
      );
      setFormData({
        username: "",
        fullname: "",
        email: "",
        department: "",
        role: "employee",
        password: "",
      });
      fetchUsers();

      // Close the form on mobile after successful submission
      if (window.innerWidth < 768) {
        setShowAddUser(false);
      }

      setTimeout(() => {
        setSuccess(null);
      }, 5000);
    } catch (err) {
      if (err.response && err.response.status === 409) {
        setError(
          "User already exists. Please try with a different email or username."
        );
      } else {
        setError("Failed to create user. Please try again.");
      }

      setTimeout(() => {
        setError(null);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className={`min-h-screen transition-colors duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-screen-2xl mx-auto px-6 sm:px-8 py-10">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold">User Management System</h1>
            <p
              className={`${darkMode ? "text-gray-400" : "text-gray-600"} mt-2`}
            >
              Create and manage HR and employee accounts
            </p>
          </div>
          <button
            onClick={toggleDarkMode}
            className={`p-3 rounded-full ${
              darkMode
                ? "bg-gray-800 text-yellow-300"
                : "bg-gray-200 text-gray-800"
            }`}
            aria-label="Toggle dark mode"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
        </header>

        {/* Mobile view - Toggle Form */}
        <div className="md:hidden mb-6">
          <button
            onClick={() => setShowAddUser(!showAddUser)}
            className={`w-full py-3 px-4 rounded-lg font-medium flex items-center justify-center ${
              darkMode
                ? showAddUser
                  ? "bg-gray-700 text-white"
                  : "bg-blue-600 text-white"
                : showAddUser
                ? "bg-gray-200 text-gray-800"
                : "bg-blue-600 text-white"
            }`}
          >
            {showAddUser ? (
              "Hide Form"
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" />
                Add New User
              </>
            )}
          </button>
        </div>

        <div className="grid md:grid-cols-12 gap-6">
          {/* Form Section */}
          <div
            className={`md:col-span-4 ${
              showAddUser || window.innerWidth >= 768 ? "block" : "hidden"
            }`}
          >
            <div
              className={`rounded-lg shadow-md p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <UserPlus className="mr-2 h-5 w-5" />
                Create New User
              </h2>

              {error && (
                <div
                  className={`mb-4 p-3 rounded-lg border-l-4 border-red-500 ${
                    darkMode
                      ? "bg-red-900/20 text-red-300"
                      : "bg-red-50 text-red-700"
                  } flex items-start`}
                >
                  <AlertCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{error}</p>
                </div>
              )}

              {success && (
                <div
                  className={`mb-4 p-3 rounded-lg border-l-4 border-green-500 ${
                    darkMode
                      ? "bg-green-900/20 text-green-300"
                      : "bg-green-50 text-green-700"
                  } flex items-start`}
                >
                  <CheckCircle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
                  <p>{success}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="username"
                  >
                    Username
                  </label>
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                    placeholder="johndoe"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="fullname"
                  >
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="fullname"
                    name="fullname"
                    value={formData.fullname}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="email"
                  >
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                    placeholder="john.doe@company.com"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="department"
                  >
                    Department
                  </label>
                  <input
                    type="text"
                    id="department"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                    placeholder="Engineering"
                  />
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="role"
                  >
                    Role
                  </label>
                  <select
                    id="role"
                    name="role"
                    value={formData.role}
                    onChange={handleInputChange}
                    required
                    className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      darkMode
                        ? "bg-gray-700 border-gray-600 text-white"
                        : "border border-gray-300 text-gray-900"
                    }`}
                  >
                    <option value="employee">Employee</option>
                    <option value="hr">HR</option>
                  </select>
                </div>

                <div>
                  <label
                    className={`block text-sm font-medium mb-1 ${
                      darkMode ? "text-gray-300" : "text-gray-700"
                    }`}
                    htmlFor="password"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      required
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 pr-24 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border border-gray-300 text-gray-900"
                      }`}
                      placeholder="••••••••"
                    />
                    <div className="absolute right-2 top-2 flex">
                      <button
                        type="button"
                        onClick={toggleShowPassword}
                        className={`p-1 ${
                          darkMode
                            ? "text-gray-300 hover:text-white"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                      <button
                        type="button"
                        onClick={generatePassword}
                        className={`ml-1 px-2 py-1 text-xs rounded flex items-center ${
                          darkMode
                            ? "bg-gray-600 hover:bg-gray-500 text-white"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                        aria-label="Generate password"
                      >
                        {isGeneratingPassword ? (
                          <Loader2 className="h-3 w-3 animate-spin mr-1" />
                        ) : (
                          <RefreshCw className="h-3 w-3 mr-1" />
                        )}
                        Generate
                      </button>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full font-medium py-2.5 px-4 rounded-md transition-colors flex justify-center items-center ${
                    loading
                      ? "bg-blue-500 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin mr-2 h-5 w-5" />
                      Creating...
                    </>
                  ) : (
                    "Create User"
                  )}
                </button>
              </form>
            </div>
          </div>

          {editingUser && (
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
            >
              <div
                className={`rounded-lg shadow-lg max-w-md w-full mx-4 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <h3 className="text-xl font-semibold mb-4">Edit User</h3>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const updatedUsers = users.map((u) =>
                      u._id === editingUser._id ? { ...editingUser } : u
                    );
                    setUsers(updatedUsers);
                    setEditingUser(null);
                    updateUser(editingUser);
                    setEditingUser(null);
                    setSuccess("User updated successfully");
                    setTimeout(() => setSuccess(null), 5000);
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Username
                    </label>
                    <input
                      type="text"
                      value={editingUser.username}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          username: e.target.value,
                        })
                      }
                      required
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Full Name
                    </label>
                    <input
                      type="text"
                      value={editingUser.fullname}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          fullname: e.target.value,
                        })
                      }
                      required
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Email Address
                    </label>
                    <input
                      type="email"
                      value={editingUser.email}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          email: e.target.value,
                        })
                      }
                      required
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Department
                    </label>
                    <input
                      type="text"
                      value={editingUser.department}
                      onChange={(e) =>
                        setEditingUser({
                          ...editingUser,
                          department: e.target.value,
                        })
                      }
                      required
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border border-gray-300 text-gray-900"
                      }`}
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-1 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Role
                    </label>
                    <select
                      value={
                        typeof editingUser.role === "object"
                          ? editingUser.role.name
                          : editingUser.role
                      }
                      onChange={(e) =>
                        setEditingUser({ ...editingUser, role: e.target.value })
                      }
                      required
                      className={`w-full px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="employee">Employee</option>
                      <option value="hr">HR</option>
                    </select>
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setEditingUser(null)}
                      className={`px-4 py-2 rounded-md ${
                        darkMode
                          ? "bg-gray-700 hover:bg-gray-600 text-white"
                          : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md"
                    >
                      Save Changes
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {userToDelete && (
            <div
              className={`fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50`}
            >
              <div
                className={`rounded-lg shadow-lg max-w-md w-full mx-4 ${
                  darkMode ? "bg-gray-800" : "bg-white"
                } p-6`}
              >
                <h3 className="text-xl font-semibold mb-4">Confirm Delete</h3>

                <p
                  className={`mb-6 ${
                    darkMode ? "text-gray-300" : "text-gray-600"
                  }`}
                >
                  Are you sure you want to delete the user{" "}
                  <span className="font-semibold">{userToDelete.fullname}</span>
                  ? This action cannot be undone.
                </p>

                <div className="flex justify-end space-x-3">
                  <button
                    onClick={() => setUserToDelete(null)}
                    className={`px-4 py-2 rounded-md ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                    }`}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      const updatedUsers = users.filter(
                        (u) => u._id !== userToDelete._id
                      );
                      setUsers(updatedUsers);
                      setUserToDelete(null);
                      deleteUser(userToDelete._id);
                      setUserToDelete(null);
                      setSuccess("User deleted successfully");
                      setTimeout(() => setSuccess(null), 5000);
                    }}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Users List Section */}
          <div
            className={`md:col-span-8 ${
              !showAddUser || window.innerWidth >= 768 ? "block" : "hidden"
            }`}
          >
            <div
              className={`rounded-lg shadow-md p-6 ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h2 className="text-xl font-semibold">Users</h2>
                <div className="flex flex-col sm:flex-row w-full sm:w-auto gap-3">
                  {/* Search Bar */}
                  <div className="relative w-full sm:w-64">
                    <input
                      type="text"
                      placeholder="Search users..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                          : "border border-gray-300 text-gray-900"
                      }`}
                    />
                    <Search
                      className={`absolute left-3 top-2.5 h-4 w-4 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>

                  {/* Filter Dropdown */}
                  <div className="relative w-full sm:w-36">
                    <select
                      value={filterRole}
                      onChange={(e) => setFilterRole(e.target.value)}
                      className={`w-full pl-9 pr-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                        darkMode
                          ? "bg-gray-700 border-gray-600 text-white"
                          : "border border-gray-300 text-gray-900"
                      }`}
                    >
                      <option value="all">All Roles</option>
                      <option value="employee">Employee</option>
                      <option value="hr">HR</option>
                    </select>
                    <Filter
                      className={`absolute left-3 top-2.5 h-4 w-4 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    />
                  </div>

                  {/* Refresh Button */}
                  <button
                    onClick={fetchUsers}
                    className={`flex items-center justify-center py-2 px-4 rounded-md text-sm transition-colors ${
                      darkMode
                        ? "bg-gray-700 hover:bg-gray-600 text-white"
                        : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                    }`}
                    aria-label="Refresh users list"
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Refresh
                  </button>
                </div>
              </div>
              {loading && users.length === 0 ? (
                <div className="flex flex-col justify-center items-center py-20">
                  <Loader2 className="h-10 w-10 animate-spin text-blue-500 mb-4" />
                  <p className={darkMode ? "text-gray-400" : "text-gray-500"}>
                    Loading users...
                  </p>
                </div>
              ) : (
                <>
                  {filteredUsers.length === 0 ? (
                    <div
                      className={`text-center py-20 ${
                        darkMode ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      {searchTerm || filterRole !== "all"
                        ? "No users match your search criteria."
                        : "No users found. Create your first user."}
                    </div>
                  ) : (
                    <>
                      {/* Changed table to table-auto */}
                      <div className="overflow-x-auto">
                        <table className="table-auto min-w-full divide-y divide-gray-200">
                          <thead
                            className={darkMode ? "bg-gray-700" : "bg-gray-50"}
                          >
                            <tr>
                              <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                  darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                              >
                                Name
                              </th>
                              <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                  darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                              >
                                Email
                              </th>
                              <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                  darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                              >
                                Department
                              </th>
                              <th
                                scope="col"
                                className={`px-6 py-3 text-left text-xs font-medium uppercase tracking-wider ${
                                  darkMode ? "text-gray-300" : "text-gray-500"
                                }`}
                              >
                                Role
                              </th>
                              <th scope="col" className="relative px-6 py-3">
                                <span className="sr-only">Actions</span>
                              </th>
                            </tr>
                          </thead>
                          <tbody
                            className={`${
                              darkMode ? "divide-gray-700" : "divide-gray-200"
                            }`}
                          >
                            {currentUsers.map((user, index) => (
                              <tr
                                key={user.id || user._id || index}
                                className={`${
                                  darkMode
                                    ? "hover:bg-gray-700"
                                    : "hover:bg-gray-50"
                                } transition-colors`}
                              >
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div
                                    className={
                                      darkMode
                                        ? "font-medium text-white"
                                        : "font-medium text-gray-900"
                                    }
                                  >
                                    {user.fullname}
                                  </div>
                                  <div
                                    className={`text-sm ${
                                      darkMode
                                        ? "text-gray-400"
                                        : "text-gray-500"
                                    }`}
                                  >
                                    @{user.username}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div
                                    className={`text-sm ${
                                      darkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {user.email}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <div
                                    className={`text-sm ${
                                      darkMode
                                        ? "text-gray-300"
                                        : "text-gray-700"
                                    }`}
                                  >
                                    {user.department}
                                  </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                  <span
                                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                      user.role === "hr" ||
                                      user.role?.name === "hr"
                                        ? darkMode
                                          ? "bg-purple-900 text-purple-200"
                                          : "bg-purple-100 text-purple-800"
                                        : darkMode
                                        ? "bg-blue-900 text-blue-200"
                                        : "bg-blue-100 text-blue-800"
                                    }`}
                                  >
                                    {user.role === "hr" ||
                                    user.role?.name === "hr"
                                      ? "HR"
                                      : "Employee"}
                                  </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                  <div className="flex justify-end items-center space-x-2">
                                    <button
                                      onClick={() => setEditingUser(user)}
                                      className={`p-1 rounded-full ${
                                        darkMode
                                          ? "hover:bg-gray-600"
                                          : "hover:bg-gray-200"
                                      }`}
                                      aria-label="Edit user"
                                    >
                                      <Edit
                                        size={16}
                                        className={
                                          darkMode
                                            ? "text-gray-300"
                                            : "text-gray-500"
                                        }
                                      />
                                    </button>
                                    <button
                                      onClick={() => setUserToDelete(user)}
                                      className={`p-1 rounded-full ${
                                        darkMode
                                          ? "hover:bg-gray-600"
                                          : "hover:bg-gray-200"
                                      }`}
                                      aria-label="Delete user"
                                    >
                                      <Trash2
                                        size={16}
                                        className={
                                          darkMode
                                            ? "text-gray-300"
                                            : "text-gray-500"
                                        }
                                      />
                                    </button>
                                    <button
                                      className={`p-1 rounded-full ${
                                        darkMode
                                          ? "hover:bg-gray-600"
                                          : "hover:bg-gray-200"
                                      }`}
                                      aria-label="More options"
                                    >
                                      <MoreVertical
                                        size={16}
                                        className={
                                          darkMode
                                            ? "text-gray-300"
                                            : "text-gray-500"
                                        }
                                      />
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Simple pagination */}
                      <div className="flex justify-between items-center mt-6">
                        <p
                          className={`text-sm ${
                            darkMode ? "text-gray-400" : "text-gray-500"
                          }`}
                        >
                          Showing{" "}
                          <span
                            className={
                              darkMode ? "text-white" : "text-gray-900"
                            }
                          >
                            {indexOfFirstUser + 1} -{" "}
                            {Math.min(indexOfLastUser, filteredUsers.length)}
                          </span>{" "}
                          of{" "}
                          <span
                            className={
                              darkMode ? "text-white" : "text-gray-900"
                            }
                          >
                            {filteredUsers.length}
                          </span>{" "}
                          users
                        </p>
                        <div className="flex space-x-2">
                          <button
                            onClick={() =>
                              setCurrentPage((prev) => Math.max(prev - 1, 1))
                            }
                            className={`px-3 py-1 rounded-md text-sm ${
                              darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            disabled={currentPage === 1}
                          >
                            Previous
                          </button>
                          <button
                            onClick={() =>
                              setCurrentPage((prev) =>
                                Math.min(prev + 1, totalPages)
                              )
                            }
                            className={`px-3 py-1 rounded-md text-sm ${
                              darkMode
                                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                            disabled={currentPage === totalPages}
                          >
                            Next
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserManagementSystem;
