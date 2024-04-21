import { config } from '../config.js';
import { consoleLog, consoleWarn, consoleError } from '../../Struct/logger.js';
const autoRoles = config.AutoRoles;

export default {
    run: async (client, member) => {
        try {
            for (const roleId of autoRoles) {
              const role = member.guild.roles.cache.get(roleId);
              if (role) {
                await member.roles.add(role);
                consoleLog(`Auto role "${role.name}" assigned to ${member.user.tag}.`);
              } else {
                consoleLog(`Role with ID ${roleId} not found. Skipping.`);
              }
            }
        } catch (error) {
          consoleWarn('Error assigning auto roles: ' + error);
        }
    }
}