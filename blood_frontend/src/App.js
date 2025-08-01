import React, { useState, useEffect, createContext, useContext } from 'react';
import { Heart, User, Plus, Search, Filter, MapPin, Phone, Calendar, Droplets, Bell, LogOut } from 'lucide-react';

const AuthContext = createContext();

const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setLoading(false);
    }
  }, [token]);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/auth/profile/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
      } else {
        localStorage.removeItem('token');
        setToken(null);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username, password) => {
    const response = await fetch('http://localhost:8000/api/auth/login/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error };
    }
  };

  const register = async (userData) => {
    const response = await fetch('http://localhost:8000/api/auth/register/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    
    if (response.ok) {
      const data = await response.json();
      setUser(data.user);
      setToken(data.token);
      localStorage.setItem('token', data.token);
      return { success: true };
    } else {
      const error = await response.json();
      return { success: false, error };
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

// Login
const LoginForm = ({ onSwitchToRegister }) => {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await login(formData.username, formData.password);
    if (!result.success) {
      setError(result.error.error || 'Login failed');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <Heart className="w-12 h-12 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-gray-800">Blood Donation Portal</h1>
          <p className="text-gray-600">Sign in to save lives</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.username}
              onChange={(e) => setFormData({...formData, username: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToRegister}
              className="text-red-500 hover:text-red-600 font-medium"
            >
              Register here
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

// Register
const RegisterForm = ({ onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
    phone: '',
    blood_group: '',
    user_type: 'donor',
    date_of_birth: '',
    address: '',
    city: '',
    state: '',
    pincode: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const userTypes = [
    { value: 'donor', label: 'Donor' },
    { value: 'recipient', label: 'Recipient' },
    { value: 'hospital', label: 'Hospital' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    const result = await register(formData);
    if (!result.success) {
      setErrors(result.error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 p-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-8 mt-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <Heart className="w-12 h-12 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Join Our Community</h1>
            <p className="text-gray-600">Register to start saving lives</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Username *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                />
                {errors.username && <p className="text-red-500 text-sm mt-1">{errors.username[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
                {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  First Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.first_name}
                  onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Last Name *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.last_name}
                  onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password *
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
                {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password[0]}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm Password *
                </label>
                <input
                  type="password"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.password_confirm}
                  onChange={(e) => setFormData({...formData, password_confirm: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.phone}
                  onChange={(e) => setFormData({...formData, phone: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Blood Group
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.blood_group}
                  onChange={(e) => setFormData({...formData, blood_group: e.target.value})}
                >
                  <option value="">Select Blood Group</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  User Type
                </label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.user_type}
                  onChange={(e) => setFormData({...formData, user_type: e.target.value})}
                >
                  {userTypes.map(type => (
                    <option key={type.value} value={type.value}>{type.label}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.date_of_birth}
                  onChange={(e) => setFormData({...formData, date_of_birth: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.city}
                  onChange={(e) => setFormData({...formData, city: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.state}
                  onChange={(e) => setFormData({...formData, state: e.target.value})}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pincode
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={formData.pincode}
                  onChange={(e) => setFormData({...formData, pincode: e.target.value})}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Address
              </label>
              <textarea
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.address}
                onChange={(e) => setFormData({...formData, address: e.target.value})}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Register'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <button
                onClick={onSwitchToLogin}
                className="text-red-500 hover:text-red-600 font-medium"
              >
                Sign in here
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Header 
const Header = () => {
  const { user, logout } = useAuth();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Heart className="w-8 h-8 text-red-500 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">Blood Donation Portal</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-gray-600" />
              <span className="text-gray-700">{user?.first_name} {user?.last_name}</span>
              <span className="bg-red-100 text-red-800 px-2 py-1 rounded-full text-xs font-medium">
                {user?.blood_group}
              </span>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

// Blood Request Card
const BloodRequestCard = ({ request, onRespond }) => {
  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case 'critical': return 'bg-red-100 text-red-800 border-red-200';
      case 'high': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-red-500">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className="bg-red-100 p-2 rounded-full">
            <Droplets className="w-6 h-6 text-red-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              {request.blood_group_needed} Blood Needed
            </h3>
            <p className="text-gray-600">{request.units_needed} unit(s) required</p>
          </div>
        </div>
        <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getUrgencyColor(request.urgency)}`}>
          {request.urgency.charAt(0).toUpperCase() + request.urgency.slice(1)}
        </span>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span>{request.hospital_name}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{request.contact_phone}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Needed by: {new Date(request.needed_by_date).toLocaleDateString()}</span>
        </div>
      </div>

      {request.additional_notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-gray-700 text-sm">{request.additional_notes}</p>
        </div>
      )}

      <div className="flex justify-between items-center">
        <span className="text-sm text-gray-500">
          Posted {new Date(request.created_at).toLocaleDateString()}
        </span>
        <button
          onClick={() => onRespond(request)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Respond
        </button>
      </div>
    </div>
  );
};

// Dashboard
const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('requests');
  const [bloodRequests, setBloodRequests] = useState([]);
  const [myRequests, setMyRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterBloodGroup, setFilterBloodGroup] = useState('');
  const [filterUrgency, setFilterUrgency] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateRequest, setShowCreateRequest] = useState(false);
  const { user, token } = useAuth();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = ['low', 'medium', 'high', 'critical'];

  useEffect(() => {
    fetchBloodRequests();
    fetchMyRequests();
  }, []);

  const fetchBloodRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/blood-requests/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        setBloodRequests(data.results || data);
      }
    } catch (error) {
      console.error('Error fetching blood requests:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyRequests = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/blood-requests/', {
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        const data = await response.json();
        const userRequests = (data.results || data).filter(req => req.requester.id === user.id);
        setMyRequests(userRequests);
      }
    } catch (error) {
      console.error('Error fetching my requests:', error);
    }
  };

  const handleRespond = async (request) => {
    try {
      const response = await fetch('http://localhost:8000/api/donation-responses/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          blood_request: request.id,
          message: 'I would like to donate blood for this request.'
        }),
      });
      
      if (response.ok) {
        alert('Response sent successfully!');
      } else {
        alert('Failed to send response. You may have already responded to this request.');
      }
    } catch (error) {
      console.error('Error sending response:', error);
      alert('Failed to send response.');
    }
  };

  const filteredRequests = bloodRequests.filter(request => {
    const matchesSearch = request.hospital_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.contact_person.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesBloodGroup = !filterBloodGroup || request.blood_group_needed === filterBloodGroup;
    const matchesUrgency = !filterUrgency || request.urgency === filterUrgency;
    
    return matchesSearch && matchesBloodGroup && matchesUrgency;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'requests'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Available Requests
              </button>
              <button
                onClick={() => setActiveTab('my-requests')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'my-requests'
                    ? 'border-red-500 text-red-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                My Requests
              </button>
            </nav>
          </div>
        </div>

        {activeTab === 'requests' && (
          <>
            {/* Search and Filter Section */}
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search hospitals, contacts..."
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={filterBloodGroup}
                  onChange={(e) => setFilterBloodGroup(e.target.value)}
                >
                  <option value="">All Blood Groups</option>
                  {bloodGroups.map(group => (
                    <option key={group} value={group}>{group}</option>
                  ))}
                </select>
                
                <select
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  value={filterUrgency}
                  onChange={(e) => setFilterUrgency(e.target.value)}
                >
                  <option value="">All Urgency Levels</option>
                  {urgencyLevels.map(level => (
                    <option key={level} value={level}>
                      {level.charAt(0).toUpperCase() + level.slice(1)}
                    </option>
                  ))}
                </select>
                
                <button
                  onClick={() => {
                    setSearchTerm('');
                    setFilterBloodGroup('');
                    setFilterUrgency('');
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  Clear Filters
                </button>
              </div>
            </div>

            {/* Blood Requests Grid */}
            <div className="grid gap-6">
              {filteredRequests.length > 0 ? (
                filteredRequests.map(request => (
                  <BloodRequestCard
                    key={request.id}
                    request={request}
                    onRespond={handleRespond}
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No blood requests found</h3>
                  <p className="text-gray-500">Try adjusting your search criteria or check back later.</p>
                </div>
              )}
            </div>
          </>
        )}

        {activeTab === 'my-requests' && (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">My Blood Requests</h2>
              <button
                onClick={() => setShowCreateRequest(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Create Request</span>
              </button>
            </div>

            <div className="grid gap-6">
              {myRequests.length > 0 ? (
                myRequests.map(request => (
                  <BloodRequestCard
                    key={request.id}
                    request={request}
                    onRespond={() => {}} // Disable respond for own requests
                  />
                ))
              ) : (
                <div className="text-center py-12">
                  <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No requests created yet</h3>
                  <p className="text-gray-500">Create your first blood request to get started.</p>
                  <button
                    onClick={() => setShowCreateRequest(true)}
                    className="mt-4 bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    Create Request
                  </button>
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Create Request Modal would go here */}
      {showCreateRequest && (
        <CreateRequestModal 
          onClose={() => setShowCreateRequest(false)}
          onSuccess={() => {
            setShowCreateRequest(false);
            fetchMyRequests();
          }}
        />
      )}
    </div>
  );
};

// Create Request Modal Component
const CreateRequestModal = ({ onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    blood_group_needed: '',
    units_needed: 1,
    urgency: 'medium',
    hospital_name: '',
    hospital_address: '',
    contact_person: '',
    contact_phone: '',
    additional_notes: '',
    needed_by_date: ''
  });
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const urgencyLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
    { value: 'critical', label: 'Critical' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/blood-requests/', {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          needed_by_date: new Date(formData.needed_by_date).toISOString()
        }),
      });

      if (response.ok) {
        onSuccess();
      } else {
        alert('Failed to create request');
      }
    } catch (error) {
      console.error('Error creating request:', error);
      alert('Failed to create request');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-800">Create Blood Request</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Group Needed *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.blood_group_needed}
                onChange={(e) => setFormData({...formData, blood_group_needed: e.target.value})}
              >
                <option value="">Select Blood Group</option>
                {bloodGroups.map(group => (
                  <option key={group} value={group}>{group}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Units Needed *
              </label>
              <input
                type="number"
                min="1"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.units_needed}
                onChange={(e) => setFormData({...formData, units_needed: parseInt(e.target.value)})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Urgency Level *
              </label>
              <select
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.urgency}
                onChange={(e) => setFormData({...formData, urgency: e.target.value})}
              >
                {urgencyLevels.map(level => (
                  <option key={level.value} value={level.value}>{level.label}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Needed By Date *
              </label>
              <input
                type="datetime-local"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.needed_by_date}
                onChange={(e) => setFormData({...formData, needed_by_date: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hospital Name *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.hospital_name}
                onChange={(e) => setFormData({...formData, hospital_name: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Person *
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.contact_person}
                onChange={(e) => setFormData({...formData, contact_person: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone *
              </label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                value={formData.contact_phone}
                onChange={(e) => setFormData({...formData, contact_phone: e.target.value})}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Hospital Address *
            </label>
            <textarea
              required
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.hospital_address}
              onChange={(e) => setFormData({...formData, hospital_address: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              rows="3"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              value={formData.additional_notes}
              onChange={(e) => setFormData({...formData, additional_notes: e.target.value})}
              placeholder="Any additional information about the request..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
            >
              {loading ? 'Creating...' : 'Create Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Main App
const App = () => {
  const [showRegister, setShowRegister] = useState(false);

  return (
    <AuthProvider>
      <AuthWrapper 
        showRegister={showRegister}
        setShowRegister={setShowRegister}
      />
    </AuthProvider>
  );
};

const AuthWrapper = ({ showRegister, setShowRegister }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-12 h-12 text-red-500 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return showRegister ? (
      <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
    ) : (
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    );
  }

  return <Dashboard />;
};

export default App;