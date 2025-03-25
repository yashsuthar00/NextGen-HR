import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { 
  Briefcase, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Calendar, 
  MapPin, 
  Clock, 
  ChevronRight, 
  Star, 
  MessageSquare, 
  FileText, 
  Award,
  AlertCircle,
  Check,
  Clock3
} from 'lucide-react';

// Styled Components
const DashboardContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: #f8f9fa;
  font-family: 'Inter', sans-serif;
`;

const Sidebar = styled.div`
  width: 250px;
  background: #1a2b4e;
  color: #ffffff;
  padding: 20px 0;
  transition: all 0.3s ease;

  @media (max-width: 768px) {
    width: 70px;
  }
`;

const Logo = styled.div`
  font-size: 22px;
  font-weight: 700;
  padding: 0 20px 20px 20px;
  margin-bottom: 20px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  display: flex;
  align-items: center;
  gap: 10px;

  @media (max-width: 768px) {
    justify-content: center;
    padding: 0 10px 20px 10px;
  }
`;

const LogoHighlight = styled.span`
  color: #4d8bf9;

  @media (max-width: 768px) {
    display: none;
  }
`;

const LogoText = styled.span`
  @media (max-width: 768px) {
    display: none;
  }
`;

const MenuSection = styled.div`
  margin-bottom: 20px;
`;

const MenuTitle = styled.div`
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 1px;
  padding: 0 20px;
  margin-bottom: 10px;
  color: rgba(255, 255, 255, 0.5);

  @media (max-width: 768px) {
    text-align: center;
    padding: 0 5px;
  }
`;

const MenuItem = styled.div`
  display: flex;
  align-items: center;
  padding: 12px 20px;
  cursor: pointer;
  transition: all 0.2s;
  color: ${props => props.active ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'};
  background: ${props => props.active ? 'rgba(77, 139, 249, 0.15)' : 'transparent'};
  border-left: 4px solid ${props => props.active ? '#4d8bf9' : 'transparent'};

  &:hover {
    background: rgba(77, 139, 249, 0.1);
    color: #ffffff;
  }

  @media (max-width: 768px) {
    justify-content: center;
    padding: 12px 0;
    border-left: none;
    border-right: 4px solid ${props => props.active ? '#4d8bf9' : 'transparent'};
  }
`;

const MenuText = styled.span`
  margin-left: 10px;

  @media (max-width: 768px) {
    display: none;
  }
`;

const MainContent = styled.div`
  flex: 1;
  padding: 20px;
  overflow-y: auto;
`;

const TopBar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #eaeaea;
`;

const SearchBar = styled.div`
  display: flex;
  align-items: center;
  background: white;
  border-radius: 8px;
  padding: 0 15px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
  width: 300px;
  
  @media (max-width: 768px) {
    width: 200px;
  }
`;

const SearchInput = styled.input`
  border: none;
  padding: 12px 10px;
  flex: 1;
  outline: none;
  font-size: 14px;
  &::placeholder {
    color: #b0b0b0;
  }
`;

const UserActions = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
`;

const NotificationIcon = styled.div`
  position: relative;
  cursor: pointer;
`;

const NotificationBadge = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: #ff5f57;
  color: white;
  border-radius: 50%;
  width: 18px;
  height: 18px;
  font-size: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: #4d8bf9;
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`;

const PageHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 20px;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  color: #1a2b4e;
`;

const CompletionCard = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  margin-bottom: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const ProfileCompletion = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const CompletionText = styled.div`
  font-size: 14px;
  font-weight: 500;
`;

const CompletionValue = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #4d8bf9;
`;

const ProfileCompletionBar = styled.div`
  height: 8px;
  background: #f1f5f9;
  border-radius: 4px;
  margin-top: 10px;
  overflow: hidden;
`;

const CompletionProgress = styled.div`
  height: 100%;
  width: ${props => props.value}%;
  background: #4d8bf9;
  border-radius: 4px;
`;

const TasksContainer = styled.div`
  margin-top: 15px;
`;

const TaskItem = styled.div`
  display: flex;
  align-items: center;
  padding: 10px 0;
  color: ${props => props.completed ? '#94a3b8' : '#1e293b'};

  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`;

const TaskIcon = styled.div`
  width: 24px;
  height: 24px;
  border-radius: 50%;
  background: ${props => props.completed ? '#10b981' : '#f1f5f9'};
  color: ${props => props.completed ? 'white' : '#94a3b8'};
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 10px;
`;

const TaskText = styled.div`
  font-size: 14px;
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
  flex: 1;
`;

const TaskAction = styled.div`
  font-size: 13px;
  color: #4d8bf9;
  cursor: pointer;
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const ApplicationsContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid #f1f5f9;
  margin-bottom: 20px;
`;

const Tab = styled.div`
  padding: 10px 20px;
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.active ? '#4d8bf9' : '#64748b'};
  border-bottom: 2px solid ${props => props.active ? '#4d8bf9' : 'transparent'};
  cursor: pointer;
  margin-right: 10px;
`;

const ApplicationList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const ApplicationCard = styled.div`
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fc;
  transition: all 0.2s;
  cursor: pointer;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
`;

const ApplicationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 10px;
`;

const ApplicationTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a2b4e;
`;

const ApplicationStatus = styled.div`
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch(props.status) {
      case 'Applied': return '#e0f2fe';
      case 'Under Review': return '#fef3c7';
      case 'Interview': return '#ede9fe';
      case 'Offered': return '#dcfce7';
      case 'Rejected': return '#fee2e2';
      default: return '#e0f2fe';
    }
  }};
  color: ${props => {
    switch(props.status) {
      case 'Applied': return '#0284c7';
      case 'Under Review': return '#ca8a04';
      case 'Interview': return '#7c3aed';
      case 'Offered': return '#15803d';
      case 'Rejected': return '#b91c1c';
      default: return '#0284c7';
    }
  }};
`;

const ApplicationCompany = styled.div`
  font-size: 14px;
  color: #64748b;
  margin-bottom: 10px;
`;

const ApplicationMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 10px;
`;

const ApplicationDetail = styled.div`
  display: flex;
  align-items: center;
  font-size: 13px;
  color: #64748b;
`;

const DetailIcon = styled.div`
  margin-right: 5px;
  display: flex;
  align-items: center;
`;

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SideWidget = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const WidgetTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a2b4e;
  margin-bottom: 15px;
`;

const RecommendedList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 15px;
`;

const RecommendedJob = styled.div`
  padding: 15px;
  border-radius: 8px;
  background: #f8f9fc;
  cursor: pointer;
  transition: all 0.2s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  }
`;

const JobTitle = styled.div`
  font-size: 14px;
  font-weight: 600;
  color: #1a2b4e;
  margin-bottom: 5px;
`;

const JobCompany = styled.div`
  font-size: 13px;
  color: #64748b;
  margin-bottom: 8px;
`;

const JobMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
`;

const JobDetail = styled.div`
  display: flex;
  align-items: center;
  font-size: 12px;
  color: #64748b;
`;

const EventList = styled.div`
  display: flex;
  flex-direction: column;
`;

const EventItem = styled.div`
  padding: 12px 0;
  display: flex;
  align-items: flex-start;
  gap: 10px;
  
  &:not(:last-child) {
    border-bottom: 1px solid #f1f5f9;
  }
`;

const EventDate = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 5px 10px;
  background: ${props => props.upcoming ? '#4d8bf9' : '#f1f5f9'};
  border-radius: 6px;
  color: ${props => props.upcoming ? 'white' : '#64748b'};
  font-weight: 500;
  min-width: 45px;
`;

const EventDay = styled.div`
  font-size: 16px;
  font-weight: 600;
`;

const EventMonth = styled.div`
  font-size: 12px;
`;

const EventContent = styled.div`
  flex: 1;
`;

const EventTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: #1a2b4e;
  margin-bottom: 5px;
`;

const EventInfo = styled.div`
  font-size: 13px;
  color: #64748b;
`;

const ActionButton = styled.button`
  font-size: 14px;
  padding: 8px 16px;
  border-radius: 6px;
  background: #4d8bf9;
  color: white;
  border: none;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background: #3b7ffa;
  }
`;

// Main App Component
const CandidateDashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [activeTab, setActiveTab] = useState('all');

  // Sample applications data
  const applications = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "Tech Innovations Inc.",
      status: "Interview",
      location: "San Francisco, CA",
      type: "Full-time",
      appliedDate: "Mar 15, 2025",
      upcoming: "Technical Interview - Mar 26, 2025"
    },
    {
      id: 2,
      title: "UX/UI Designer",
      company: "Creative Solutions",
      status: "Under Review",
      location: "Remote",
      type: "Full-time",
      appliedDate: "Mar 18, 2025"
    },
    {
      id: 3,
      title: "Product Manager",
      company: "Innovative Products Ltd",
      status: "Applied",
      location: "New York, NY",
      type: "Full-time",
      appliedDate: "Mar 20, 2025"
    },
    {
      id: 4,
      title: "React Developer",
      company: "WebTech Solutions",
      status: "Rejected",
      location: "Chicago, IL",
      type: "Contract",
      appliedDate: "Mar 5, 2025"
    }
  ];

  // Sample recommended jobs
  const recommendedJobs = [
    {
      id: 1,
      title: "Frontend Engineer",
      company: "Digital Solutions Inc.",
      location: "Austin, TX",
      type: "Full-time",
      salary: "$110k - $130k"
    },
    {
      id: 2,
      title: "UI Developer",
      company: "User Interface Labs",
      location: "Remote",
      type: "Full-time",
      salary: "$95k - $115k"
    },
    {
      id: 3,
      title: "Senior React Developer",
      company: "Application Systems Ltd",
      location: "San Diego, CA",
      type: "Full-time",
      salary: "$120k - $140k"
    }
  ];

  // Sample upcoming events
  const upcomingEvents = [
    {
      id: 1,
      title: "Technical Interview",
      info: "Tech Innovations Inc. - 2:00 PM",
      date: { day: "26", month: "Mar", upcoming: true }
    },
    {
      id: 2,
      title: "Culture Fit Meeting",
      info: "Tech Innovations Inc. - 10:30 AM",
      date: { day: "28", month: "Mar", upcoming: true }
    },
    {
      id: 3,
      title: "Phone Screening",
      info: "Digital Solutions Inc. - 1:00 PM",
      date: { day: "30", month: "Mar", upcoming: true }
    }
  ];

  // Filter applications based on active tab
  const filteredApplications = activeTab === 'all' 
    ? applications 
    : applications.filter(app => app.status.toLowerCase() === activeTab);


    const handleLogout = () => {
        localStorage.removeItem('authToken');
        navigate('/login');
      };
    
      const navigate = useNavigate();

  return (
    <DashboardContainer>
      <Sidebar>
        <Logo>
          <Briefcase size={24} />
          <LogoText>NextGen</LogoText><LogoHighlight>HR</LogoHighlight>
        </Logo>
        
        <MenuSection>
          <MenuTitle>Main Menu</MenuTitle>
          <MenuItem active={activeMenuItem === 'dashboard'} onClick={() => setActiveMenuItem('dashboard')}>
            <User size={18} />
            <MenuText>Dashboard</MenuText>
          </MenuItem>
          <MenuItem active={activeMenuItem === 'jobs'} onClick={() => {setActiveMenuItem('jobs');
            navigate('/jobs');
          }}>
            <Briefcase size={18} />
            <MenuText>Browse Jobs</MenuText>
          </MenuItem>
          <MenuItem active={activeMenuItem === 'applications'} onClick={() => setActiveMenuItem('applications')}>
            <FileText size={18} />
            <MenuText>Applications</MenuText>
          </MenuItem>
          <MenuItem active={activeMenuItem === 'interviews'} onClick={() => {setActiveMenuItem('interviews'); 
            navigate('/interview')
          }}>
            <Calendar size={18} />
            <MenuText>Interviews</MenuText>
          </MenuItem>
          <MenuItem active={activeMenuItem === 'messages'} onClick={() => setActiveMenuItem('messages')}>
            <MessageSquare size={18} />
            <MenuText>Messages</MenuText>
          </MenuItem>
        </MenuSection>
        
        <MenuSection>
          <MenuTitle>Account</MenuTitle>
          <MenuItem active={activeMenuItem === 'profile'} onClick={() => setActiveMenuItem('profile')}>
            <User size={18} />
            <MenuText>Profile</MenuText>
          </MenuItem>
          <MenuItem active={activeMenuItem === 'logout'} onClick={() => {setActiveMenuItem('logout'); 
            navigate("/logout");
            handleLogout();
          }}>
            <LogOut size={18} />
            <MenuText>Logout</MenuText>
          </MenuItem>
        </MenuSection>
      </Sidebar>
      
      <MainContent>
        <TopBar>
          <SearchBar>
            <Search size={18} color="#b0b0b0" />
            <SearchInput placeholder="Search for jobs..." />
          </SearchBar>
          
          <UserActions>
            <NotificationIcon>
              <Bell size={20} />
              <NotificationBadge>2</NotificationBadge>
            </NotificationIcon>
            <UserAvatar>
              <User size={20} />
            </UserAvatar>
          </UserActions>
        </TopBar>
        
        <PageHeader>
          <Title>Candidate Dashboard</Title>
          <ActionButton>Find Jobs</ActionButton>
        </PageHeader>
        
        <CompletionCard>
          <ProfileCompletion>
            <CompletionText>Profile Completion</CompletionText>
            <CompletionValue>75%</CompletionValue>
          </ProfileCompletion>
          
          <ProfileCompletionBar>
            <CompletionProgress value={75} />
          </ProfileCompletionBar>
          
          <TasksContainer>
            <TaskItem completed={true}>
              <TaskIcon completed={true}>
                <Check size={14} />
              </TaskIcon>
              <TaskText completed={true}>Basic Information</TaskText>
            </TaskItem>
            
            <TaskItem completed={true}>
              <TaskIcon completed={true}>
                <Check size={14} />
              </TaskIcon>
              <TaskText completed={true}>Professional Experience</TaskText>
            </TaskItem>
            
            <TaskItem completed={true}>
              <TaskIcon completed={true}>
                <Check size={14} />
              </TaskIcon>
              <TaskText completed={true}>Education</TaskText>
            </TaskItem>
            
            <TaskItem completed={false}>
              <TaskIcon completed={false}>
                <AlertCircle size={14} />
              </TaskIcon>
              <TaskText completed={false}>Skills Assessment</TaskText>
              <TaskAction>Complete</TaskAction>
            </TaskItem>
            
            <TaskItem completed={false}>
              <TaskIcon completed={false}>
                <AlertCircle size={14} />
              </TaskIcon>
              <TaskText completed={false}>Portfolio/Work Samples</TaskText>
              <TaskAction>Add</TaskAction>
            </TaskItem>
          </TasksContainer>
        </CompletionCard>
        
        <Grid>
          <ApplicationsContainer>
            <WidgetTitle>My Applications</WidgetTitle>
            
            <TabsContainer>
              <Tab active={activeTab === 'all'} onClick={() => setActiveTab('all')}>
                All
              </Tab>
              <Tab active={activeTab === 'applied'} onClick={() => setActiveTab('applied')}>
                Applied
              </Tab>
              <Tab active={activeTab === 'under review'} onClick={() => setActiveTab('under review')}>
                Under Review
              </Tab>
              <Tab active={activeTab === 'interview'} onClick={() => {setActiveTab('interview'); 
                navigate('/interview');
              }}>
                Interview
              </Tab>
            </TabsContainer>
            
            <ApplicationList>
              {filteredApplications.map(app => (
                <ApplicationCard key={app.id}>
                  <ApplicationHeader>
                    <ApplicationTitle>{app.title}</ApplicationTitle>
                    <ApplicationStatus status={app.status}>{app.status}</ApplicationStatus>
                  </ApplicationHeader>
                  
                  <ApplicationCompany>{app.company}</ApplicationCompany>
                  
                  <ApplicationMeta>
                    <ApplicationDetail>
                      <DetailIcon><MapPin size={14} /></DetailIcon>
                      {app.location}
                    </ApplicationDetail>
                    
                    <ApplicationDetail>
                      <DetailIcon><Briefcase size={14} /></DetailIcon>
                      {app.type}
                    </ApplicationDetail>
                    
                    <ApplicationDetail>
                      <DetailIcon><Calendar size={14} /></DetailIcon>
                      Applied: {app.appliedDate}
                    </ApplicationDetail>
                    
                    {app.upcoming && (
                      <ApplicationDetail>
                        <DetailIcon><Clock size={14} /></DetailIcon>
                        {app.upcoming}
                      </ApplicationDetail>
                    )}
                  </ApplicationMeta>
                </ApplicationCard>
              ))}
            </ApplicationList>
          </ApplicationsContainer>
          
          <SidebarContainer>
            <SideWidget>
              <WidgetTitle>Upcoming Events</WidgetTitle>
              
              <EventList>
                {upcomingEvents.map(event => (
                  <EventItem key={event.id}>
                    <EventDate upcoming={event.date.upcoming}>
                      <EventDay>{event.date.day}</EventDay>
                      <EventMonth>{event.date.month}</EventMonth>
                    </EventDate>
                    
                    <EventContent>
                      <EventTitle>{event.title}</EventTitle>
                      <EventInfo>{event.info}</EventInfo>
                    </EventContent>
                  </EventItem>
                ))}
              </EventList>
            </SideWidget>
            
            <SideWidget>
              <WidgetTitle>Recommended Jobs</WidgetTitle>
              
              <RecommendedList>
                {recommendedJobs.map(job => (
                  <RecommendedJob key={job.id}>
                    <JobTitle>{job.title}</JobTitle>
                    <JobCompany>{job.company}</JobCompany>
                    
                    <JobMeta>
                      <JobDetail>
                        <DetailIcon><MapPin size={12} /></DetailIcon>
                        {job.location}
                      </JobDetail>
                      
                      <JobDetail>
                        <DetailIcon><Briefcase size={12} /></DetailIcon>
                        {job.type}
                      </JobDetail>
                      
                      <JobDetail>
                        <DetailIcon><Award size={12} /></DetailIcon>
                        {job.salary}
                      </JobDetail>
                    </JobMeta>
                  </RecommendedJob>
                ))}
              </RecommendedList>
            </SideWidget>
          </SidebarContainer>
        </Grid>
      </MainContent>
    </DashboardContainer>
  );
};

export default CandidateDashboard;