// Token storage functions
export const getStoredToken = () => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('token');
    }
    return null;
  };
  
  export const setStoredToken = (token) => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('token', token);
    }
  };
  
  export const removeStoredToken = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
  };
  
  // Role-based permissions
  export const ROLES = {
    ADMIN: 'admin',
    RECRUITER: 'recruiter',
    CANDIDATE: 'candidate'
  };
  
  export const PERMISSIONS = {
    // Admin permissions
    MANAGE_USERS: 'manage_users',
    
    // Recruiter permissions
    VIEW_INTERVIEWS: 'view_interviews',
    CREATE_INTERVIEWS: 'create_interviews',
    REVIEW_INTERVIEWS: 'review_interviews',
    
    // Candidate permissions
    VIEW_OWN_INTERVIEWS: 'view_own_interviews',
    TAKE_INTERVIEWS: 'take_interviews'
  };
  
  export const ROLE_PERMISSIONS = {
    [ROLES.ADMIN]: Object.values(PERMISSIONS),
    [ROLES.RECRUITER]: [
      PERMISSIONS.VIEW_INTERVIEWS,
      PERMISSIONS.CREATE_INTERVIEWS,
      PERMISSIONS.REVIEW_INTERVIEWS
    ],
    [ROLES.CANDIDATE]: [
      PERMISSIONS.VIEW_OWN_INTERVIEWS,
      PERMISSIONS.TAKE_INTERVIEWS
    ]
  };