import React, { useState } from 'react';
import styled from 'styled-components';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { logout } from '../store/slices/authSlice';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Briefcase, 
  FileText, 
  BarChart2, 
  Settings, 
  Bell, 
  Search, 
  User, 
  LogOut, 
  Calendar, 
  CheckSquare
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
`;

const LogoHighlight = styled.span`
  color: #4d8bf9;
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
`;

const MenuIcon = styled.div`
  margin-right: 10px;
  display: flex;
  align-items: center;
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

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #1a2b4e;
`;

const WidgetGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 20px;
`;

const Widget = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  }
`;

const WidgetTitle = styled.div`
  font-size: 14px;
  color: #6b7280;
  margin-bottom: 10px;
`;

const WidgetValue = styled.div`
  font-size: 24px;
  font-weight: 600;
  color: #1a2b4e;
`;

const WidgetFooter = styled.div`
  display: flex;
  align-items: center;
  margin-top: 10px;
  font-size: 12px;
`;

const Trend = styled.div`
  display: flex;
  align-items: center;
  color: ${props => props.positive ? '#10b981' : '#ef4444'};
  margin-right: 5px;
`;

const Period = styled.div`
  color: #6b7280;
`;

const ChartContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  margin-bottom: 20px;
`;

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const ChartTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a2b4e;
`;

const ChartControls = styled.div`
  display: flex;
  gap: 10px;
`;

const ChartControl = styled.div`
  padding: 6px 12px;
  border-radius: 6px;
  background: ${props => props.active ? '#4d8bf9' : '#f1f5f9'};
  color: ${props => props.active ? 'white' : '#6b7280'};
  font-size: 12px;
  cursor: pointer;
`;

const ChartPlaceholder = styled.div`
  height: 250px;
  background: #f8f9fc;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #a0aec0;
`;

const TableContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TableHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TableTitle = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: #1a2b4e;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHead = styled.thead`
  text-align: left;
`;

const TableBody = styled.tbody`
  border-top: 1px solid #edf2f7;
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #edf2f7;
  &:hover {
    background: #f8f9fc;
  }
`;

const TableCell = styled.td`
  padding: 12px 8px;
  font-size: 14px;
  color: #4a5568;
`;

const TableHeadCell = styled.th`
  padding: 12px 8px;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  font-weight: 600;
  color: #718096;
`;

const Status = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  font-weight: 500;
  background: ${props => {
    switch (props.status) {
      case 'Active': return '#dcfce7';
      case 'Inactive': return '#fee2e2';
      case 'Onboarding': return '#ede9fe';
      default: return '#e0f2fe';
    }
  }};
  color: ${props => {
    switch (props.status) {
      case 'Active': return '#15803d';
      case 'Inactive': return '#b91c1c';
      case 'Onboarding': return '#7c3aed';
      default: return '#0284c7';
    }
  }};
`;

const TaskContainer = styled.div`
  background: white;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
`;

const TaskHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const TaskList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const Task = styled.div`
  display: flex;
  align-items: center;
  padding: 12px;
  border-radius: 8px;
  background: #f8f9fc;
  cursor: pointer;
  
  &:hover {
    background: #edf2f7;
  }
`;

const TaskCheckbox = styled.div`
  width: 20px;
  height: 20px;
  border-radius: 4px;
  border: 2px solid ${props => props.completed ? '#10b981' : '#cbd5e1'};
  background: ${props => props.completed ? '#10b981' : 'transparent'};
  margin-right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const TaskContent = styled.div`
  flex: 1;
`;

const TaskTitle = styled.div`
  font-size: 14px;
  font-weight: 500;
  color: ${props => props.completed ? '#94a3b8' : '#1e293b'};
  text-decoration: ${props => props.completed ? 'line-through' : 'none'};
`;

const TaskMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 12px;
  color: #64748b;
  margin-top: 5px;
`;

const TaskDate = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const ResponsiveGrid = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  gap: 20px;
  
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;



// Main App Component
const AdminDashboard = () => {
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [activeChartControl, setActiveChartControl] = useState('weekly');
  const dispatch = useDispatch();

  

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    dispatch(logout());
    navigate('/login');
  };

  const navigate = useNavigate();

  return (
    <DashboardContainer>
      <Sidebar>
        <Logo>
          <Briefcase size={24} />
          NextGen<LogoHighlight>HR</LogoHighlight>
        </Logo>
        
        <MenuSection>
          <MenuTitle>Main Menu</MenuTitle>
          <MenuItem active={activeMenuItem === 'dashboard'} onClick={() => setActiveMenuItem('dashboard')}>
            <MenuIcon><BarChart2 size={18} /></MenuIcon>
            Dashboard
          </MenuItem>
          <MenuItem active={activeMenuItem === 'employees'} onClick={() => setActiveMenuItem('employees')}>
            <MenuIcon><Users size={18} /></MenuIcon>
            Employees
          </MenuItem>
          <MenuItem active={activeMenuItem === 'jobs'} onClick={() => { 
            setActiveMenuItem('jobs'); 
            navigate('/jobs'); 
          }}>
            <MenuIcon><Briefcase size={18} /></MenuIcon>
            Jobs
          </MenuItem>
          <MenuItem active={activeMenuItem === 'candidates'} onClick={() => {setActiveMenuItem('candidates')
            navigate('/users');
          }}>
            <MenuIcon><User size={18} /></MenuIcon>
            Candidates
          </MenuItem>
          <MenuItem active={activeMenuItem === 'reports'} onClick={() => setActiveMenuItem('reports')}>
            <MenuIcon><FileText size={18} /></MenuIcon>
            Reports
          </MenuItem>
        </MenuSection>
        
        <MenuSection>
          <MenuTitle>Settings</MenuTitle>
          <MenuItem active={activeMenuItem === 'settings'} onClick={() => setActiveMenuItem('settings')}>
            <MenuIcon><Settings size={18} /></MenuIcon>
            Settings
          </MenuItem>
          <MenuItem active={activeMenuItem === 'logout'} onClick={() => {setActiveMenuItem('logout');
            handleLogout();}
          }>
            <MenuIcon><LogOut size={18} /></MenuIcon>
            Logout
          </MenuItem>
        </MenuSection>
      </Sidebar>
      
      <MainContent>
        <TopBar>
          <SearchBar>
            <Search size={18} color="#b0b0b0" />
            <SearchInput placeholder="Search..." />
          </SearchBar>
          
          <UserActions>
            <NotificationIcon>
              <Bell size={20} />
              <NotificationBadge>3</NotificationBadge>
            </NotificationIcon>
            <UserAvatar>
              <User size={20} />
            </UserAvatar>
          </UserActions>
        </TopBar>
        
        <Title>Admin Dashboard</Title>
        
        <WidgetGrid>
          <Widget>
            <WidgetTitle>Total Employees</WidgetTitle>
            <WidgetValue>142</WidgetValue>
            <WidgetFooter>
              <Trend positive>+8%</Trend>
              <Period>vs last month</Period>
            </WidgetFooter>
          </Widget>
          
          <Widget>
            <WidgetTitle>Open Positions</WidgetTitle>
            <WidgetValue>24</WidgetValue>
            <WidgetFooter>
              <Trend positive>+12%</Trend>
              <Period>vs last month</Period>
            </WidgetFooter>
          </Widget>
          
          <Widget>
            <WidgetTitle>New Applications</WidgetTitle>
            <WidgetValue>68</WidgetValue>
            <WidgetFooter>
              <Trend positive>+5%</Trend>
              <Period>vs last month</Period>
            </WidgetFooter>
          </Widget>
          
          <Widget>
            <WidgetTitle>Time to Hire (avg)</WidgetTitle>
            <WidgetValue>18 days</WidgetValue>
            <WidgetFooter>
              <Trend negative>+2 days</Trend>
              <Period>vs last month</Period>
            </WidgetFooter>
          </Widget>
        </WidgetGrid>
        
        <ResponsiveGrid>
          <div>
            <ChartContainer>
              <ChartHeader>
                <ChartTitle>Recruitment Analytics</ChartTitle>
                <ChartControls>
                  <ChartControl 
                    active={activeChartControl === 'weekly'} 
                    onClick={() => setActiveChartControl('weekly')}
                  >
                    Weekly
                  </ChartControl>
                  <ChartControl 
                    active={activeChartControl === 'monthly'} 
                    onClick={() => setActiveChartControl('monthly')}
                  >
                    Monthly
                  </ChartControl>
                  <ChartControl 
                    active={activeChartControl === 'yearly'} 
                    onClick={() => setActiveChartControl('yearly')}
                  >
                    Yearly
                  </ChartControl>
                </ChartControls>
              </ChartHeader>
              <ChartPlaceholder>
                Recruitment Analytics Chart
              </ChartPlaceholder>
            </ChartContainer>
            
            <TableContainer>
              <TableHeader>
                <TableTitle>Recent Hires</TableTitle>
              </TableHeader>
              
              <Table>
                <TableHead>
                  <TableRow>
                    <TableHeadCell>Name</TableHeadCell>
                    <TableHeadCell>Position</TableHeadCell>
                    <TableHeadCell>Department</TableHeadCell>
                    <TableHeadCell>Start Date</TableHeadCell>
                    <TableHeadCell>Status</TableHeadCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  <TableRow>
                    <TableCell>Sarah Johnson</TableCell>
                    <TableCell>UI/UX Designer</TableCell>
                    <TableCell>Design</TableCell>
                    <TableCell>Mar 15, 2025</TableCell>
                    <TableCell><Status status="Onboarding">Onboarding</Status></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Michael Chen</TableCell>
                    <TableCell>Full Stack Developer</TableCell>
                    <TableCell>Engineering</TableCell>
                    <TableCell>Mar 10, 2025</TableCell>
                    <TableCell><Status status="Active">Active</Status></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Priya Patel</TableCell>
                    <TableCell>HR Specialist</TableCell>
                    <TableCell>Human Resources</TableCell>
                    <TableCell>Mar 8, 2025</TableCell>
                    <TableCell><Status status="Active">Active</Status></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>David Wilson</TableCell>
                    <TableCell>Sales Manager</TableCell>
                    <TableCell>Sales</TableCell>
                    <TableCell>Mar 5, 2025</TableCell>
                    <TableCell><Status status="Active">Active</Status></TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell>Jessica Rodriguez</TableCell>
                    <TableCell>Content Writer</TableCell>
                    <TableCell>Marketing</TableCell>
                    <TableCell>Mar 1, 2025</TableCell>
                    <TableCell><Status status="Active">Active</Status></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
          </div>
          
          <div>
            <TaskContainer>
              <TaskHeader>
                <ChartTitle>Admin Tasks</ChartTitle>
              </TaskHeader>
              
              <TaskList>
                <Task>
                  <TaskCheckbox completed={true}>
                    <CheckSquare size={12} />
                  </TaskCheckbox>
                  <TaskContent>
                    <TaskTitle completed={true}>Review new job descriptions</TaskTitle>
                    <TaskMeta>
                      <TaskDate>
                        <Calendar size={12} />
                        Mar 20, 2025
                      </TaskDate>
                    </TaskMeta>
                  </TaskContent>
                </Task>
                
                <Task>
                  <TaskCheckbox completed={false} />
                  <TaskContent>
                    <TaskTitle completed={false}>Approve budget requests</TaskTitle>
                    <TaskMeta>
                      <TaskDate>
                        <Calendar size={12} />
                        Mar 24, 2025
                      </TaskDate>
                    </TaskMeta>
                  </TaskContent>
                </Task>
                
                <Task>
                  <TaskCheckbox completed={false} />
                  <TaskContent>
                    <TaskTitle completed={false}>Schedule department meetings</TaskTitle>
                    <TaskMeta>
                      <TaskDate>
                        <Calendar size={12} />
                        Mar 25, 2025
                      </TaskDate>
                    </TaskMeta>
                  </TaskContent>
                </Task>
                
                <Task>
                  <TaskCheckbox completed={false} />
                  <TaskContent>
                    <TaskTitle completed={false}>Review performance reports</TaskTitle>
                    <TaskMeta>
                      <TaskDate>
                        <Calendar size={12} />
                        Mar 28, 2025
                      </TaskDate>
                    </TaskMeta>
                  </TaskContent>
                </Task>
                
                <Task>
                  <TaskCheckbox completed={false} />
                  <TaskContent>
                    <TaskTitle completed={false}>Finalize Q2 hiring plan</TaskTitle>
                    <TaskMeta>
                      <TaskDate>
                        <Calendar size={12} />
                        Mar 30, 2025
                      </TaskDate>
                    </TaskMeta>
                  </TaskContent>
                </Task>
              </TaskList>
            </TaskContainer>
          </div>
        </ResponsiveGrid>
      </MainContent>
    </DashboardContainer>
  );
};

export default AdminDashboard;