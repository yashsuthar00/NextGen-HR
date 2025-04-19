// import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Users, 
  FileText, 
  MessageSquare, 
  Bell, 
  Settings, 
  ChevronRight, 
  UserCircle,
  Calendar,
  MapPin,
  Clock,
  Plus,
  Filter,
  MoreVertical,
  CheckCircle,
  XCircle,
  PieChart,
  BarChart,
  TrendingUp,
  Star
} from 'lucide-react';

export default function RecruiterDashboard() {
  // const [activeTab, setActiveTab] = useState('dashboard');
  const navigate = useNavigate();
  
  const jobPostings = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      department: "Engineering",
      location: "San Francisco, CA",
      posted: "April 10, 2025",
      applicants: 24,
      status: "Active"
    },
    {
      id: 2,
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      posted: "April 8, 2025",
      applicants: 18,
      status: "Active"
    },
    {
      id: 3,
      title: "Product Manager",
      department: "Product",
      location: "New York, NY",
      posted: "April 5, 2025",
      applicants: 32,
      status: "Active"
    }
  ];
  
  const topCandidates = [
    {
      id: 1,
      name: "Emily Chen",
      position: "Senior Frontend Developer",
      experience: "8 years",
      match: 95,
      status: "To be contacted",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      position: "UX Designer",
      experience: "6 years",
      match: 90,
      status: "Interview scheduled",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 3,
      name: "Sarah Johnson",
      position: "Product Manager",
      experience: "7 years",
      match: 88,
      status: "Assessment sent",
      avatar: "/api/placeholder/40/40"
    }
  ];
  
  const upcomingInterviews = [
    {
      id: 1,
      candidate: "Michael Rodriguez",
      position: "UX Designer",
      date: "April 15, 2025",
      time: "10:00 AM - 11:00 AM",
      type: "Technical Interview",
      avatar: "/api/placeholder/40/40"
    },
    {
      id: 2,
      candidate: "Jennifer Williams",
      position: "Frontend Developer",
      date: "April 16, 2025",
      time: "2:00 PM - 3:00 PM",
      type: "First Interview",
      avatar: "/api/placeholder/40/40"
    }
  ];

  const metrics = [
    { name: "Open Positions", value: "12", change: "+2", color: "blue" },
    { name: "Active Candidates", value: "143", change: "+15%", color: "green" },
    { name: "Time to Hire", value: "18 days", change: "-3 days", color: "green" },
    { name: "Conversion Rate", value: "24%", change: "+5%", color: "green" }
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-indigo-900 text-white">
        <div className="p-6">
          <h1 className="text-xl font-bold text-white">JobConnect</h1>
          <p className="text-indigo-200 text-sm">Recruiter Portal</p>
        </div>
        <div className="px-4 py-2 mt-2">
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer bg-indigo-800 text-white">
            <PieChart size={20} />
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-indigo-800 text-indigo-100">
            <FileText size={20} />
            <span className="font-medium">Job Postings</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-indigo-800 text-indigo-100">
            <Users size={20} />
            <span className="font-medium">Candidates</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-indigo-800 text-indigo-100">
            <MessageSquare size={20} />
            <span className="font-medium">Messages</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-indigo-800 text-indigo-100">
            <Calendar size={20} />
            <span className="font-medium">Interviews</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-indigo-800 text-indigo-100">
            <BarChart size={20} />
            <span className="font-medium">Analytics</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-indigo-800 text-indigo-100">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </div>
        </div>
        <div className="mt-auto p-4 border-t border-indigo-800">
          <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-indigo-800">
            <div className="relative">
              <UserCircle size={36} className="text-white" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-indigo-900"></div>
            </div>
            <div>
              <p className="font-medium">Jessica Taylor</p>
              <p className="text-sm text-indigo-200">Senior Recruiter</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 p-4 sticky top-0 z-10">
          <div className="flex justify-between items-center">
            <div className="relative w-96">
              <input
                type="text"
                placeholder="Search candidates, jobs..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            </div>
            <div className="flex items-center space-x-4">
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 relative">
                <Bell size={20} />
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
              <button className="p-2 rounded-lg text-gray-500 hover:bg-gray-100">
                <MessageSquare size={20} />
              </button>
              <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center">
                <Plus size={16} className="mr-1" />
                <span>Post Job</span>
              </button>
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Recruiter Dashboard</h1>
            <p className="text-gray-600">Welcome back, Jessica! Here's what's happening today.</p>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {metrics.map((metric, index) => (
              <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                <p className="text-sm text-gray-500 mb-1">{metric.name}</p>
                <p className="text-2xl font-bold">{metric.value}</p>
                <div className={`text-xs text-${metric.color}-600 mt-2 flex items-center`}>
                  <span>{metric.change} from last month</span>
                </div>
              </div>
            ))}
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left column */}
            <div className="col-span-2 space-y-6">
              {/* Active job postings */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Active Job Postings</h2>
                  <div className="flex space-x-2">
                    <button className="p-2 rounded text-gray-500 hover:bg-gray-100">
                      <Filter size={16} />
                    </button>
                    <button className="text-sm text-indigo-600 flex items-center">
                      View all <ChevronRight size={16} />
                    </button>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full">
                    <thead>
                      <tr className="text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <th className="px-4 py-3">Position</th>
                        <th className="px-4 py-3">Department</th>
                        <th className="px-4 py-3">Location</th>
                        <th className="px-4 py-3">Posted</th>
                        <th className="px-4 py-3">Applicants</th>
                        <th className="px-4 py-3">Status</th>
                        <th className="px-4 py-3"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {jobPostings.map(job => (
                        <tr key={job.id} className="hover:bg-gray-50">
                          <td className="px-4 py-3">
                            <div className="font-medium text-gray-900">{job.title}</div>
                          </td>
                          <td className="px-4 py-3 text-gray-600">{job.department}</td>
                          <td className="px-4 py-3 text-gray-600">{job.location}</td>
                          <td className="px-4 py-3 text-gray-600">{job.posted}</td>
                          <td className="px-4 py-3 text-gray-600">{job.applicants}</td>
                          <td className="px-4 py-3">
                            <span className="px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {job.status}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <button className="p-1 text-gray-500 hover:text-gray-700">
                              <MoreVertical size={16} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Top candidates */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Top Candidates</h2>
                  <button className="text-sm text-indigo-600 flex items-center">
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {topCandidates.map(candidate => (
                    <div key={candidate.id} className="border border-gray-200 rounded-lg p-4 hover:border-indigo-300 transition-colors">
                      <div className="flex items-start">
                        <img src={candidate.avatar} alt={candidate.name} className="w-10 h-10 mr-3 rounded-full" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{candidate.name}</h3>
                          <p className="text-gray-600 text-sm">{candidate.position}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <span className="mr-3">Experience: {candidate.experience}</span>
                          </div>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-indigo-100 text-indigo-800">
                              {candidate.status}
                            </span>
                          </div>
                        </div>
                        <div>
                          <div className="text-right mb-2">
                            <span className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800">
                              {candidate.match}% match
                            </span>
                          </div>
                          <div className="flex space-x-2">
                            <button className="p-2 rounded text-gray-500 hover:bg-gray-100">
                              <Star size={16} />
                            </button>
                            <button className="px-3 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm">
                              Contact
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Hiring funnel */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Hiring Funnel</h2>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Applications received</span>
                      <span className="text-sm font-medium">187</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Resume screened</span>
                      <span className="text-sm font-medium">124</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '66%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Phone interviews</span>
                      <span className="text-sm font-medium">56</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '30%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">In-person interviews</span>
                      <span className="text-sm font-medium">28</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '15%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Offers extended</span>
                      <span className="text-sm font-medium">12</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '6%' }}></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm text-gray-600">Hired</span>
                      <span className="text-sm font-medium">8</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-indigo-600 h-2 rounded-full" style={{ width: '4%' }}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Upcoming interviews */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Upcoming Interviews</h2>
                  <button className="text-sm text-indigo-600 flex items-center">
                    View calendar <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {upcomingInterviews.map(interview => (
                    <div key={interview.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <img src={interview.avatar} alt={interview.candidate} className="w-10 h-10 mr-3 rounded-full" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{interview.candidate}</h3>
                          <p className="text-gray-600 text-sm">{interview.position}</p>
                          <p className="text-indigo-600 text-sm mt-1">{interview.type}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            <span className="mr-3">{interview.date}</span>
                          </div>
                          <div className="flex items-center mt-1 text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            <span>{interview.time}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded text-red-500 hover:bg-red-50">
                            <XCircle size={16} />
                          </button>
                          <button className="p-2 rounded text-green-500 hover:bg-green-50">
                            <CheckCircle size={16} />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center"
                    onClick={() => navigate('/jobs')}
                  >
                    <Plus size={24} className="text-indigo-600 mb-2" />
                    <span className="text-sm font-medium">Post Job</span>
                  </button>
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                    <Users size={24} className="text-indigo-600 mb-2" />
                    <span className="text-sm font-medium">Source Candidates</span>
                  </button>
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                    <Calendar size={24} className="text-indigo-600 mb-2" />
                    <span className="text-sm font-medium">Schedule Interview</span>
                  </button>
                  <button className="p-3 border border-gray-200 rounded-lg hover:bg-gray-50 flex flex-col items-center justify-center">
                    <BarChart size={24} className="text-indigo-600 mb-2" />
                    <span className="text-sm font-medium">View Reports</span>
                  </button>
                </div>
              </div>
              {/* Hiring timeline */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Recent Activity</h2>
                <div className="space-y-4">
                  <div className="relative pl-6 pb-4 border-l-2 border-indigo-200">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <p className="text-sm font-medium text-gray-800">New application for UX Designer</p>
                    <p className="text-xs text-gray-500">Today, 9:42 AM</p>
                  </div>
                  <div className="relative pl-6 pb-4 border-l-2 border-indigo-200">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <p className="text-sm font-medium text-gray-800">Interview scheduled with Michael Rodriguez</p>
                    <p className="text-xs text-gray-500">Today, 8:15 AM</p>
                  </div>
                  <div className="relative pl-6 pb-4 border-l-2 border-indigo-200">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 bg-indigo-600 rounded-full"></div>
                    <p className="text-sm font-medium text-gray-800">Assessment sent to Sarah Johnson</p>
                    <p className="text-xs text-gray-500">Yesterday, 4:30 PM</p>
                  </div>
                  <div className="relative pl-6 pb-4 border-l-2 border-gray-200">
                    <div className="absolute -left-1.5 top-0 w-3 h-3 bg-gray-400 rounded-full"></div>
                    <p className="text-sm font-medium text-gray-800">New job posting: Product Manager</p>
                    <p className="text-xs text-gray-500">April 5, 2025</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}