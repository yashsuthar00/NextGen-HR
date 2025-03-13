// backend/utils/initRoles.js
import Role from '../models/roleModels.js';

export const initializeRoles = async () => {
  try {
    const roles = ['admin', 'hr', 'recruiter', 'employee', 'candidate'];
    for (const roleName of roles) {
      const roleExists = await Role.findOne({ name: roleName });
      if (!roleExists) {
        await Role.create({ name: roleName });
        console.log(`Role '${roleName}' created`);
      }
    }
    console.log('All roles have been initialized');
  } catch (error) {
    console.error('Error initializing roles:', error);
  }
};
