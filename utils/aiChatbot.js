const OpenAI = require('openai');

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
    apiKey: process.env.OPENAI_API_KEY 
});

// Store conversation history per user (in memory for this session)
const conversationHistory = new Map();

class AIChatbot {
    async generateResponse(message, userMessage) {
        try {
            const userId = message.author.id;
            const username = message.author.username;
            
            // Get or create conversation history for this user
            if (!conversationHistory.has(userId)) {
                conversationHistory.set(userId, [
                    {
                        role: "system",
                        content: `You are Luno, a friendly AI assistant integrated into a Discord bot. You're helpful, engaging, and have a warm personality. Keep responses conversational and under 200 characters when possible. The user's name is ${username}. You can use fun commands like !hug, !kick, !punch, !kiss, !happy, !cry, !laugh, !dance, !twerk and utility commands like !userinfo, !serverinfo, !membercount, !afk. Don't use emojis in your responses.`
                    }
                ]);
            }
            
            const history = conversationHistory.get(userId);
            
            // Add user message to history
            history.push({
                role: "user",
                content: userMessage
            });
            
            // Keep only last 10 messages to avoid token limits
            if (history.length > 11) { // 1 system + 10 messages
                history.splice(1, history.length - 11);
            }
            
            const response = await openai.chat.completions.create({
                model: "gpt-4o",
                messages: history,
                max_tokens: 150,
                temperature: 0.8
            });
            
            const aiResponse = response.choices[0].message.content;
            
            // Add AI response to history
            history.push({
                role: "assistant",
                content: aiResponse
            });
            
            return aiResponse;
            
        } catch (error) {
            console.error('Error generating AI response:', error);
            
            // Fallback responses if AI fails
            const fallbackResponses = [
                `Sorry ${message.author.username}, my AI brain is taking a quick break! Try asking me something else.`,
                `Oops! My neural networks are a bit busy right now. Let me know what else I can help with!`,
                `My AI circuits are processing something else at the moment. Feel free to use my other commands while I reboot!`,
                `I'm having a moment of digital confusion! Try chatting with me again in a second.`
            ];
            
            return fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        }
    }
    
    // Clear conversation history for a user (optional feature)
    clearHistory(userId) {
        conversationHistory.delete(userId);
    }
    
    // Get conversation count (optional feature)
    getActiveConversations() {
        return conversationHistory.size;
    }
}

module.exports = new AIChatbot();