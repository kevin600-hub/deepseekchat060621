'use client';

import { useState } from 'react';

export default function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: 'user', content: input };
    setMessages([...messages, userMessage]);
    setInput('');
    setLoading(true);

    try {
      // 这里暂时模拟，等后端部署好再替换
      const reply = { 
        role: 'assistant', 
        content: '🎯 后端正在连接中... 等我部署好FastAPI就能真的回答你了！' 
      };
      
      setTimeout(() => {
        setMessages(prev => [...prev, reply]);
        setLoading(false);
      }, 1000);

    } catch (error) {
      console.error('Error:', error);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto p-4">
      {/* 头部 */}
      <div className="border-b border-gray-700 pb-4 mb-4">
        <h1 className="text-2xl font-bold text-white">🤖 DeepSeek 编程助手</h1>
        <p className="text-sm text-gray-400">随时帮你解决编程问题</p>
      </div>

      {/* 消息列表 */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p>💡 输入你的编程问题开始对话</p>
            <p className="text-sm mt-2">支持：代码编写、调试、解释、算法设计等</p>
          </div>
        )}
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`p-3 rounded-lg max-w-[80%] ${
              msg.role === 'user'
                ? 'bg-blue-600 text-white ml-auto'
                : 'bg-gray-700 text-white'
            }`}
          >
            <p className="whitespace-pre-wrap">{msg.content}</p>
          </div>
        ))}
        {loading && (
          <div className="bg-gray-700 text-white p-3 rounded-lg max-w-[80%]">
            <span className="animate-pulse">⏳ 思考中...</span>
          </div>
        )}
      </div>

      {/* 输入框 */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          placeholder="输入你的编程问题..."
          className="flex-1 p-3 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500"
          disabled={loading}
        />
        <button
          onClick={sendMessage}
          disabled={loading}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          发送
        </button>
      </div>
    </div>
  );
}