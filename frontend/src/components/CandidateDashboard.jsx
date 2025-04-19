import { useState } from 'react';
import { 
  Search, 
  Briefcase, 
  Star, 
  MessageSquare, 
  Bell, 
  Settings, 
  ChevronRight, 
  UserCircle,
  Calendar,
  MapPin,
  Clock,
  BookOpen,
  Bookmark,
  Eye
} from 'lucide-react';

export default function JobSeekerDashboard() {
  const [activeTab, setActiveTab] = useState('dashboard');
  
  const jobRecommendations = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Inc.",
      location: "San Francisco, CA",
      salary: "$120,000 - $150,000",
      posted: "2 days ago",
      logo: "/api/placeholder/40/40"
    },
    {
      id: 2,
      title: "Full Stack Engineer",
      company: "InnovateTech",
      location: "Remote",
      salary: "$100,000 - $130,000",
      posted: "1 day ago",
      logo: "/api/placeholder/40/40"
    },
    {
      id: 3,
      title: "UX Designer",
      company: "DesignHub",
      location: "New York, NY",
      salary: "$90,000 - $110,000",
      posted: "3 days ago",
      logo: "/api/placeholder/40/40"
    }
  ];
  
  const appliedJobs = [
    {
      id: 1,
      title: "React Developer",
      company: "WebSolutions Ltd.",
      appliedDate: "April 8, 2025",
      status: "Interview Scheduled",
      logo: "/api/placeholder/40/40"
    },
    {
      id: 2,
      title: "Frontend Engineer",
      company: "CreativeApps",
      appliedDate: "April 5, 2025",
      status: "Application Reviewed",
      logo: "/api/placeholder/40/40"
    }
  ];
  
  const upcomingEvents = [
    {
      id: 1,
      title: "Technical Interview",
      company: "WebSolutions Ltd.",
      date: "April 15, 2025",
      time: "10:00 AM - 11:30 AM"
    },
    {
      id: 2,
      title: "Tech Job Fair",
      company: "City Convention Center",
      date: "April 20, 2025",
      time: "09:00 AM - 04:00 PM"
    }
  ];
  
  const skills = [
    { name: "React", level: 90 },
    { name: "JavaScript", level: 85 },
    { name: "TypeScript", level: 75 },
    { name: "HTML/CSS", level: 95 },
    { name: "Node.js", level: 70 }
  ];
  
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-6">
          <h1 className="text-xl font-bold text-blue-600">JobConnect</h1>
        </div>
        <div className="px-4 py-2 mt-2">
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer bg-blue-50 text-blue-700">
            <Briefcase size={20} />
            <span className="font-medium">Dashboard</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-gray-100">
            <Search size={20} />
            <span className="font-medium">Job Search</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-gray-100">
            <Bookmark size={20} />
            <span className="font-medium">Saved Jobs</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-gray-100">
            <Star size={20} />
            <span className="font-medium">Applications</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-gray-100">
            <MessageSquare size={20} />
            <span className="font-medium">Messages</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-gray-100">
            <BookOpen size={20} />
            <span className="font-medium">Learning</span>
          </div>
          <div className="flex items-center space-x-3 p-3 rounded-lg mb-1 cursor-pointer hover:bg-gray-100">
            <Settings size={20} />
            <span className="font-medium">Settings</span>
          </div>
        </div>
        <div className="mt-auto p-4 border-t">
          <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-100">
            <div className="relative">
              <UserCircle size={36} className="text-gray-500" />
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
            </div>
            <div>
              <p className="font-medium">Alex Johnson</p>
              <p className="text-sm text-gray-500">Software Engineer</p>
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
                placeholder="Search for jobs, companies..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
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
            </div>
          </div>
        </header>

        {/* Dashboard content */}
        <main className="p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Welcome back, Alex!</h1>
            <p className="text-gray-600">Here's what's happening with your job search today.</p>
          </div>

          {/* Stats overview */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Jobs Applied</p>
              <p className="text-2xl font-bold">12</p>
              <div className="text-xs text-green-600 mt-2 flex items-center">
                <span>↑ 3 this week</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Interviews</p>
              <p className="text-2xl font-bold">3</p>
              <div className="text-xs text-green-600 mt-2 flex items-center">
                <span>↑ 1 this week</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Profile Views</p>
              <p className="text-2xl font-bold">48</p>
              <div className="text-xs text-green-600 mt-2 flex items-center">
                <span>↑ 12% from last week</span>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <p className="text-sm text-gray-500 mb-1">Saved Jobs</p>
              <p className="text-2xl font-bold">24</p>
              <div className="text-xs text-blue-600 mt-2 flex items-center">
                <span>5 new matches</span>
              </div>
            </div>
          </div>

          {/* Two column layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left column */}
            <div className="col-span-2 space-y-6">
              {/* Job recommendations */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Recommended for you</h2>
                  <button className="text-sm text-blue-600 flex items-center">
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {jobRecommendations.map(job => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors">
                      <div className="flex items-start">
                        <img src={job.logo} alt={job.company} className="w-10 h-10 mr-3 rounded" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-gray-600 text-sm">{job.company}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <MapPin size={14} className="mr-1" />
                            <span className="mr-3">{job.location}</span>
                            <Clock size={14} className="mr-1" />
                            <span>{job.posted}</span>
                          </div>
                          <p className="text-sm font-medium text-gray-700 mt-2">{job.salary}</p>
                        </div>
                        <div className="flex space-x-2">
                          <button className="p-2 rounded-full text-gray-500 hover:bg-gray-100">
                            <Bookmark size={16} />
                          </button>
                          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Applied jobs */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Your Applications</h2>
                  <button className="text-sm text-blue-600 flex items-center">
                    View all <ChevronRight size={16} />
                  </button>
                </div>
                <div className="space-y-4">
                  {appliedJobs.map(job => (
                    <div key={job.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-start">
                        <img src={job.logo} alt={job.company} className="w-10 h-10 mr-3 rounded" />
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{job.title}</h3>
                          <p className="text-gray-600 text-sm">{job.company}</p>
                          <div className="flex items-center mt-2 text-sm text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            <span>Applied on {job.appliedDate}</span>
                          </div>
                          <div className="mt-2">
                            <span className="inline-block px-2 py-1 text-xs font-medium rounded bg-blue-100 text-blue-800">
                              {job.status}
                            </span>
                          </div>
                        </div>
                        <button className="px-3 py-1 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 text-sm">
                          View
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Profile completion */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Profile Completion</h2>
                <div className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="text-sm text-gray-600">85% complete</span>
                    <span className="text-sm font-medium text-blue-600">34/40</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-blue-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-xs">
                        ✓
                      </div>
                      <span className="text-gray-700">Basic information</span>
                    </div>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-xs">
                        ✓
                      </div>
                      <span className="text-gray-700">Work experience</span>
                    </div>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mr-2 text-xs">
                        ✓
                      </div>
                      <span className="text-gray-700">Education</span>
                    </div>
                    <button className="text-blue-600 hover:underline">Edit</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs">
                        !
                      </div>
                      <span className="text-gray-700">Portfolio</span>
                    </div>
                    <button className="text-blue-600 hover:underline">Add</button>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center">
                      <div className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-2 text-xs">
                        !
                      </div>
                      <span className="text-gray-700">Resume</span>
                    </div>
                    <button className="text-blue-600 hover:underline">Upload</button>
                  </div>
                </div>
              </div>

              {/* Upcoming events */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-800 mb-4">Upcoming Events</h2>
                <div className="space-y-4">
                  {upcomingEvents.map(event => (
                    <div key={event.id} className="border border-gray-200 rounded-lg p-3">
                      <h3 className="font-medium text-gray-900">{event.title}</h3>
                      <p className="text-gray-600 text-sm">{event.company}</p>
                      <div className="flex items-center mt-2 text-sm text-gray-500">
                        <Calendar size={14} className="mr-1" />
                        <span className="mr-3">{event.date}</span>
                      </div>
                      <div className="flex items-center mt-1 text-sm text-gray-500">
                        <Clock size={14} className="mr-1" />
                        <span>{event.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Skills section */}
              <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-bold text-gray-800">Your Skills</h2>
                  <button className="text-sm text-blue-600">Add skill</button>
                </div>
                <div className="space-y-3">
                  {skills.map(skill => (
                    <div key={skill.name}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium text-gray-700">{skill.name}</span>
                        <span className="text-sm text-gray-500">{skill.level}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}