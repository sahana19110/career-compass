import React, { useState } from 'react';
import { Bot, Send, User, Sparkles, Globe, Mic, Volume2 } from 'lucide-react';
import axios from 'axios';

const AIChatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Hello! I am Ascentia AI, your Smart Skilling & Career Counseling Assistant. Ask me anything about career options after 10th/12th, college cutoffs, NSQF levels, or scholarships!'
    }
  ]);
  const [input, setInput] = useState('');
  const [language, setLanguage] = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const [isVoiceActive, setIsVoiceActive] = useState(false);

  const quickPrompts = [
    "What options do I have after 10th Grade?",
    "What are top career options after 12th PCM?",
    "How is TNEA engineering cutoff calculated?",
    "What NSQF level is Full Stack & AI?",
    "Show top scholarships in Tamil Nadu"
  ];

  const handleSend = async (textToSend) => {
    const query = textToSend || input;
    if (!query.trim()) return;

    // Add user message
    const userMsg = { sender: 'user', text: query };
    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setIsTyping(true);

    try {
      const res = await axios.post('/api/chat', {
        message: query,
        language: language
      });

      const botMsg = { sender: 'bot', text: res.data.reply };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Chat error:', err);
      // Fallback response
      const fallbackReply = language === 'ta'
        ? "Ascentia AI: 10-ஆம் வகுப்பு மற்றும் 12-ஆம் வகுப்பிற்குப் பிறகு B.E/B.Tech, Polytechnic, மற்றும் NSQF தொழில் நுட்ப பயிற்சி சான்றிதழ் படிப்புகள் உள்ளன."
        : "Ascentia AI Recommendation: After 10th/12th, you can pursue 3-Year Polytechnic Diplomas, Higher Secondary, or NSQF Level 4-6 Skilling Certifications in AI, Full Stack Web Dev, and EV Engineering.";
      
      setMessages((prev) => [...prev, { sender: 'bot', text: fallbackReply }]);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoiceSimulation = () => {
    setIsVoiceActive(!isVoiceActive);
    if (!isVoiceActive) {
      const voiceText = language === 'ta' ? "தமிழ் குரல் வழிகாட்டி இயங்குகிறது..." : "Voice input activated. Speak your query...";
      setInput(voiceText);
    } else {
      setInput('');
    }
  };

  return (
    <div className="bg-slate-800/60 border border-slate-700/60 rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[640px]">
      
      {/* Header */}
      <div className="bg-slate-900 px-6 py-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h3 className="font-bold text-white text-base flex items-center space-x-2">
              <span>Ascentia AI Guidance Bot</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            </h3>
            <p className="text-xs text-slate-400">Multilingual Career Counselor & NSQF Advisor</p>
          </div>
        </div>

        {/* Language Selector */}
        <div className="flex items-center space-x-2 bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-xl">
          <Globe className="w-3.5 h-3.5 text-cyan-400" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="bg-transparent text-xs text-slate-200 focus:outline-none font-medium cursor-pointer"
          >
            <option value="en" className="bg-slate-900 text-white">English</option>
            <option value="ta" className="bg-slate-900 text-white">தமிழ் (Tamil)</option>
            <option value="hi" className="bg-slate-900 text-white">हिंदी (Hindi)</option>
          </select>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-slate-950/40">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex items-start space-x-3 ${msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}
          >
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white'
                  : 'bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white shadow-md'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
            </div>

            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs md:text-sm leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-tr-none'
                  : 'bg-slate-800 text-slate-200 border border-slate-700/80 rounded-tl-none shadow-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {isTyping && (
          <div className="flex items-center space-x-2 text-slate-400 text-xs italic pl-11">
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></div>
            <div className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></div>
            <span>Ascentia AI is thinking...</span>
          </div>
        )}
      </div>

      {/* Quick Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/90 border-t border-slate-800 overflow-x-auto flex space-x-2 no-scrollbar">
        {quickPrompts.map((prompt, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(prompt)}
            className="text-[11px] px-3 py-1 bg-slate-800 hover:bg-slate-700 text-cyan-300 border border-slate-700/80 rounded-full whitespace-nowrap transition-colors"
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <div className="p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center space-x-2"
        >
          <button
            type="button"
            onClick={toggleVoiceSimulation}
            className={`p-3 rounded-xl border transition-colors ${
              isVoiceActive
                ? 'bg-rose-500/20 text-rose-400 border-rose-500/40 animate-pulse'
                : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-slate-200'
            }`}
            title="Toggle Voice Input Simulation"
          >
            <Mic className="w-4 h-4" />
          </button>

          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              language === 'ta'
                ? "உங்கள் கேள்வியை இங்கே தட்டச்சு செய்க..."
                : "Ask Ascentia AI about education, cutoffs, NSQF levels..."
            }
            className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-xs md:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500"
          />

          <button
            type="submit"
            disabled={!input.trim()}
            className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white disabled:opacity-50 transition-all shadow-md shadow-cyan-500/20"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>
      </div>

    </div>
  );
};

export default AIChatbot;
