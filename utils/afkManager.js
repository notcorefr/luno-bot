// In-memory storage for AFK users
// In production, you might want to use a database
const afkUsers = new Map();

class AFKManager {
    setAFK(userId, guildId, reason, member) {
        const key = `${guildId}-${userId}`;
        const currentNick = member.displayName;
        
        // Store original nickname
        afkUsers.set(key, {
            reason: reason,
            timestamp: Date.now(),
            originalNickname: currentNick
        });

        // Change nickname to show AFK status (if bot has permission)
        if (member.manageable) {
            return member.setNickname(`[AFK] ${currentNick}`).catch(err => {
                console.error('Failed to set AFK nickname:', err);
            });
        }
        
        return Promise.resolve();
    }

    removeAFK(userId, guildId, member) {
        const key = `${guildId}-${userId}`;
        const afkData = afkUsers.get(key);
        
        if (afkData) {
            afkUsers.delete(key);
            
            // Restore original nickname (if bot has permission)
            if (member.manageable && afkData.originalNickname) {
                // Remove [AFK] prefix if it exists
                let originalName = afkData.originalNickname;
                if (originalName.startsWith('[AFK] ')) {
                    originalName = originalName.substring(6);
                }
                
                return member.setNickname(originalName).catch(err => {
                    console.error('Failed to restore nickname:', err);
                });
            }
        }
        
        return Promise.resolve();
    }

    isAFK(userId, guildId) {
        const key = `${guildId}-${userId}`;
        return afkUsers.has(key);
    }

    getAFK(userId, guildId) {
        const key = `${guildId}-${userId}`;
        return afkUsers.get(key);
    }

    // Clean up old AFK entries (optional, for memory management)
    cleanupOldEntries() {
        const now = Date.now();
        const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days

        for (const [key, data] of afkUsers.entries()) {
            if (now - data.timestamp > maxAge) {
                afkUsers.delete(key);
            }
        }
    }
}

module.exports = new AFKManager();