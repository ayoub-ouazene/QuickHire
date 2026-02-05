require('dotenv').config();

// ==================== FALLBACK RESPONSES ====================

const FALLBACK_RESPONSES = {
    greetings: {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon', 'good evening'],
        response:
            "Hello! 👋 Welcome to QuickHire's Job Posting Assistant.\n\n" +
            "I can help you with:\n" +
            "• Creating job postings\n" +
            "• Writing job descriptions\n" +
            "• Choosing skills & requirements\n" +
            "• Understanding the platform\n\n" +
            "How can I help you today?"
    },

    jobDescription: {
        keywords: ['job description', 'write description', 'good description', 'create job post'],
        response:
            "📝 **Tips for a Great Job Description:**\n\n" +
            "1. **Clear Job Title** (e.g., 'Senior React Developer')\n" +
            "2. **Brief Company Intro** (1-2 sentences)\n" +
            "3. **Key Responsibilities** (bullet points)\n" +
            "4. **Must-Have Skills** (be specific)\n" +
            "5. **Nice-to-Have Skills**\n" +
            "6. **Salary Range & Benefits**\n" +
            "7. **How to Apply**\n\n" +
            "Want me to generate one for a specific role?"
    },

    skills: {
        keywords: ['skill', 'requirement', 'qualification', 'experience'],
        response:
            "🎯 **Essential Skills by Role:**\n\n" +
            "**Developer:** JavaScript, React/Node.js, Git, APIs, Problem-solving\n" +
            "**Designer:** Figma, UI/UX, Adobe Suite, Prototyping, Creativity\n" +
            "**Manager:** Leadership, Communication, Project Management, Agile\n\n" +
            "Tell me the role and I'll give detailed requirements!"
    },

    help: {
        keywords: ['help', 'support', 'assist', 'how to', 'what is'],
        response:
            "🤝 **I can help with:**\n\n" +
            "• Writing job descriptions\n" +
            "• Defining skills & requirements\n" +
            "• Salary benchmarks\n" +
            "• Interview questions\n" +
            "• Hiring best practices\n\n" +
            "What specific help do you need?"
    }
};

const DEFAULT_RESPONSE =
    "I'd be happy to help with your hiring needs! 😊\n\n" +
    "**You can ask me about:**\n" +
    "📋 Creating job posts\n" +
    "✏️ Writing job descriptions\n" +
    "🎯 Required skills\n" +
    "💰 Salary ranges\n" +
    "👥 Interview questions\n\n" +
    "Try asking: *'Help me write a job description for a web developer'*";

// ==================== FALLBACK MATCHER ====================

function findBestResponse(message) {
    const text = message.toLowerCase();

    for (const category of Object.values(FALLBACK_RESPONSES)) {
        for (const keyword of category.keywords) {
            if (text.includes(keyword)) {
                return category.response;
            }
        }
    }
    return DEFAULT_RESPONSE;
}

// ==================== GROQ AI HANDLER (100% FREE) ====================

async function getAIResponse(message, conversationHistory) {
    // If no API key, use fallback immediately
    if (!process.env.GROQ_API_KEY) {
        console.log('⚠️ Groq API key missing → using enhanced fallback');
        return { 
            response: getEnhancedFallback(message, conversationHistory), 
            isFallback: true 
        };
    }

    try {
        const SYSTEM_PROMPT = `You are "QuickHire Assistant", a professional job posting and hiring expert.
        
        Your role:
        1. Help users create effective job postings
        2. Write compelling job descriptions
        3. Define appropriate skills and requirements
        4. Provide hiring best practices
        5. Be concise, practical, and business-focused
        
        Response style:
        - Use emojis sparingly for readability
        - Use bullet points for lists
        - Keep responses under 300 words
        - Be encouraging and helpful
        - Focus on actionable advice
        
        Never say "I'm an AI" or mention your limitations.`;

        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.slice(-8).map(m => ({
                role: m.isBot ? 'assistant' : 'user',
                content: m.text
            })),
            { role: 'user', content: message }
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
                'Content-Type': 'application/json',
                'User-Agent': 'QuickHire-App/1.0'
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // Fast and free model
                messages: messages,
                max_tokens: 600,
                temperature: 0.7,
                top_p: 0.9,
                stream: false
            }),
            timeout: 10000 // 10 second timeout
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error(`Groq API Error ${response.status}:`, errorText);
            
            // Rate limit or quota exceeded - use enhanced fallback
            if (response.status === 429 || response.status === 402) {
                console.log('⚠️ Groq quota/rate limit → using enhanced fallback');
                return { 
                    response: getEnhancedFallback(message, conversationHistory), 
                    isFallback: true 
                };
            }
            
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();
        
        if (!data.choices || !data.choices[0]?.message?.content) {
            throw new Error('Invalid response format from Groq');
        }

        return {
            response: data.choices[0].message.content.trim(),
            isFallback: false
        };

    } catch (error) {
        console.error('❌ Groq API failed → using enhanced fallback:', error.message);
        return { 
            response: getEnhancedFallback(message, conversationHistory), 
            isFallback: true 
        };
    }
}

// Enhanced fallback with context awareness
function getEnhancedFallback(message, conversationHistory) {
    const text = message.toLowerCase();
    const lastBotMessage = conversationHistory
        .filter(m => m.isBot)
        .slice(-1)[0]?.text || '';
    
    // Check if we're in a specific conversation flow
    if (lastBotMessage.includes('job description') && text.includes('yes')) {
        return "Great! What's the job title? (e.g., 'Frontend Developer', 'Marketing Manager')";
    }
    
    if (lastBotMessage.includes('job title') && text.length > 3) {
        const jobTitle = text;
        return `Perfect! Let me create a job description for **${jobTitle}**:

**Job Title:** ${jobTitle}
**Location:** [Specify: Remote/On-site/Hybrid]
**Type:** [Full-time/Part-time/Contract]

**About the Role:**
We're looking for a skilled ${jobTitle} to join our team. You'll be responsible for [key responsibility 1], [key responsibility 2], and [key responsibility 3].

**Responsibilities:**
• [Main duty 1]
• [Main duty 2] 
• [Main duty 3]
• [Collaboration duty]

**Requirements:**
• [Essential skill 1]
• [Essential skill 2]
• [Required experience level]
• [Educational qualification if needed]

**Nice to Have:**
• [Bonus skill 1]
• [Bonus skill 2]

**Benefits:**
• [Benefit 1]
• [Benefit 2]
• [Growth opportunity]

**How to Apply:**
[Application instructions]

Need me to customize any section?`;
    }
    
    // Return regular fallback response
    return findBestResponse(message);
}

// ==================== API CONTROLLERS ====================

exports.sendMessage = async (req, res) => {
    try {
        const { message, conversationHistory = [] } = req.body;

        if (!message || typeof message !== 'string' || message.trim().length === 0) {
            return res.status(400).json({
                success: false,
                error: 'Message must be a non-empty string'
            });
        }

        const result = await getAIResponse(message.trim(), conversationHistory);

        res.status(200).json({
            success: true,
            data: { 
                message: result.response,
                isFallback: result.isFallback 
            }
        });

    } catch (error) {
        console.error('Chatbot Controller Error:', error);

        res.status(200).json({
            success: true,
            data: { 
                message: DEFAULT_RESPONSE,
                isFallback: true 
            }
        });
    }
};

exports.getSuggestions = async (req, res) => {
    res.status(200).json({
        success: true,
        data: [
            "How do I write a compelling job description?",
            "What skills should I require for a software developer?",
            "How can I make my job post stand out?",
            "What's a competitive salary for this role?",
            "What interview questions should I ask?",
            "How do I attract more applicants?"
        ]
    });
};