/**
 * Role definitions and permissions for the application
 */

// Define all possible permissions in the system
export const PERMISSIONS = {
    // Interview permissions
    CREATE_INTERVIEW: 'create:interview',
    VIEW_INTERVIEW: 'view:interview',
    UPDATE_INTERVIEW: 'update:interview',
    DELETE_INTERVIEW: 'delete:interview',
    
    // Video response permissions
    START_INTERVIEW_SESSION: 'start:interview-session',
    UPLOAD_VIDEO: 'upload:video',
    COMPLETE_INTERVIEW: 'complete:interview',
    VIEW_INTERVIEW_STATUS: 'view:interview-status',
    VIEW_ALL_RESPONSES: 'view:all-responses',
    
    // User management permissions
    VIEW_USERS: 'view:users',
    UPDATE_USERS: 'update:users',
    DELETE_USERS: 'delete:users',
    UPDATE_USER_ROLES: 'update:user-roles',
  };
  
  // Define role-based permissions
  export const ROLES = {
    admin: [
      ...Object.values(PERMISSIONS), // Admin has all permissions
    ],
    
    recruiter: [
      // Interview management
      PERMISSIONS.CREATE_INTERVIEW,
      PERMISSIONS.VIEW_INTERVIEW,
      PERMISSIONS.UPDATE_INTERVIEW,
      PERMISSIONS.DELETE_INTERVIEW,
      
      // Response viewing
      PERMISSIONS.VIEW_INTERVIEW_STATUS,
      PERMISSIONS.VIEW_ALL_RESPONSES,
    ],
    
    candidate: [
      // Candidate permissions
      PERMISSIONS.VIEW_INTERVIEW,
      PERMISSIONS.START_INTERVIEW_SESSION,
      PERMISSIONS.UPLOAD_VIDEO,
      PERMISSIONS.COMPLETE_INTERVIEW,
      PERMISSIONS.VIEW_INTERVIEW_STATUS,
    ],
  };
  
  /**
   * Check if a role has a specific permission
   * @param {string} role - User role
   * @param {string} permission - Permission to check
   * @returns {boolean} - Whether the role has the permission
   */
  export const hasPermission = (role, permission) => {
    if (!ROLES[role]) {
      return false;
    }
    
    return ROLES[role].includes(permission);
  };
  
  /**
   * Get all permissions for a role
   * @param {string} role - User role
   * @returns {Array} - Array of permissions
   */
  export const getRolePermissions = (role) => {
    return ROLES[role] || [];
  };
  
  /**
   * Check if a user has permission based on their role
   * @param {Object} user - User object with role property
   * @param {string} permission - Permission to check
   * @returns {boolean} - Whether the user has the permission
   */
  export const userHasPermission = (user, permission) => {
    if (!user || !user.role) {
      return false;
    }
    
    return hasPermission(user.role, permission);
  };