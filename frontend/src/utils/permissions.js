/**
 * Role-based permissions configuration
 */
const PERMISSIONS = {
    // Admin has access to all features
    'admin': [
      'VIEW_DASHBOARD',
      'VIEW_USERS',
      'CREATE_USER',
      'EDIT_USER',
      'DELETE_USER',
      'VIEW_INTERVIEWS',
      'CREATE_INTERVIEW',
      'EDIT_INTERVIEW',
      'DELETE_INTERVIEW',
      'VIEW_REPORTS',
      'MANAGE_ROLES',
      'SYSTEM_SETTINGS'
    ],
    
    // Recruiter permissions
    'recruiter': [
      'VIEW_DASHBOARD',
      'VIEW_INTERVIEWS',
      'CREATE_INTERVIEW',
      'EDIT_INTERVIEW',
      'VIEW_CANDIDATES',
      'VIEW_REPORTS'
    ],
    
    // Candidate permissions
    'candidate': [
      'VIEW_DASHBOARD',
      'VIEW_OWN_INTERVIEWS',
      'EDIT_PROFILE'
    ]
  };
  
  /**
   * Checks if a user has a specific permission
   * @param {Object} user - The user object containing role
   * @param {String} permission - The permission to check
   * @returns {Boolean} - Whether the user has the permission
   */
  export const hasPermission = (user, permission) => {
    if (!user) return false;
    
    // If permission is not specified, default to false
    if (!permission) return false;
    
    // Admin role has all permissions
    if (user.role === 'admin') return true;
    
    // Check if the user's role has the specific permission
    const rolePermissions = PERMISSIONS[user.role] || [];
    return rolePermissions.includes(permission);
  };
  
  /**
   * Checks if a user has access to a specific resource
   * @param {Object} user - The user object
   * @param {String} resourceType - Type of resource (e.g., 'interview', 'user')
   * @param {Object} resource - The resource object
   * @returns {Boolean} - Whether the user has access to the resource
   */
  export const hasResourceAccess = (user, resourceType, resource) => {
    if (!user || !resource) return false;
    
    // Admin has access to all resources
    if (user.role === 'admin') return true;
    
    switch (resourceType) {
      case 'interview':
        // Recruiters can access interviews they created
        if (user.role === 'recruiter') {
          return resource.createdBy === user.id || resource.recruiterId === user.id;
        }
        // Candidates can only access interviews they are part of
        if (user.role === 'candidate') {
          return resource.candidateId === user.id;
        }
        break;
        
      case 'user':
        // Users can access their own profiles
        return resource.id === user.id;
        
      default:
        return false;
    }
    
    return false;
  };
  
  /**
   * Get a list of permissions for a specific role
   * @param {String} role - The role to get permissions for
   * @returns {Array} - List of permissions
   */
  export const getRolePermissions = (role) => {
    return PERMISSIONS[role] || [];
  };
  
  /**
   * Check if a user can perform an action on a specific route
   * @param {Object} user - The user object
   * @param {String} route - The route path
   * @returns {Boolean} - Whether the user has access to the route
   */
  export const canAccessRoute = (user, route) => {
    if (!user) return false;
    
    // Public routes that don't require authentication
    const publicRoutes = ['/login', '/register', '/forgot-password', '/reset-password'];
    if (publicRoutes.includes(route)) return true;
    
    // Admin can access all routes
    if (user.role === 'admin') return true;
    
    // Route-specific permissions
    const routePermissionsMap = {
      '/dashboard': ['VIEW_DASHBOARD'],
      '/interviews': ['VIEW_INTERVIEWS', 'VIEW_OWN_INTERVIEWS'],
      '/interviews/new': ['CREATE_INTERVIEW'],
      '/users': ['VIEW_USERS'],
      '/reports': ['VIEW_REPORTS'],
      '/settings': ['SYSTEM_SETTINGS']
    };
    
    // Check if the route starts with any of the keys in routePermissionsMap
    for (const [routePrefix, requiredPermissions] of Object.entries(routePermissionsMap)) {
      if (route.startsWith(routePrefix)) {
        // Check if user has any of the required permissions
        return requiredPermissions.some(permission => hasPermission(user, permission));
      }
    }
    
    // Default to false for unknown routes
    return false;
  };
  
  export default {
    hasPermission,
    hasResourceAccess,
    getRolePermissions,
    canAccessRoute
  };