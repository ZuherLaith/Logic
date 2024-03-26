import { config } from '../config.js';
const autoRoles = config.AutoRoles;

export default {
    run: async (client, member) => {
        try {
            for (const roleId of autoRoles) {
              const role = member.guild.roles.cache.get(roleId);
              if (role) {
                await member.roles.add(role);
                console.log(`Auto role "${role.name}" assigned to ${member.user.tag}.`);
              } else {
                console.log(`Role with ID ${roleId} not found. Skipping.`);
              }
            }
        } catch (error) {
            console.error('Error assigning auto roles:', error);
        }
    }
}