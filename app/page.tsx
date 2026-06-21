'use client';

import { useState, useRef, useEffect } from 'react';

const API_URL = 'https://deepseekchat-backend260621.onrender.com/chat';

type Message = {
  role: string;
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const sendMessage = async () => {
    const text = input.trim();
    if (!text || loading) return;

    const userMessage: Message = { role: 'user', content: text };
    const newMessages = [...messages, userMessage];

    setInput('');
    setMessages([...newMessages, { role: 'assistant', content: '' }]);
    setLoading(true);

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: newMessages,
        }),
      });

      if (!res.ok || !res.body) {
        const errorText = await res.text();
        throw new Error(errorText || '请求失败');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder('utf-8');

      let aiText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value, { stream: true });
        aiText += chunk;

        setMessages((prev) => {
          const updated = [...prev];
          updated[updated.length - 1] = {
            role: 'assistant',
            content: aiText,
          };
          return updated;
        });
      }
    } catch (err: any) {
      setMessages((prev) => {
        const updated = [...prev];

        updated[updated.length - 1] = {
          role: 'assistant',
          content: `❌ 请求失败：${err.message}`,
        };

        return updated;
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        background: '#0d1117',
        color: '#e6edf3',
        fontFamily: "'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          background: '#161b22',
          padding: '16px 24px',
          borderBottom: '1px solid #30363d',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <h1 style={{ fontSize: '18px', margin: 0 }}>🤖 DeepSeek 编程助手</h1>
          <span
            style={{
              background: '#4d6bfe',
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '11px',
            }}
          >
            🚀 DeepSeek
          </span>
        </div>

        <span
          style={{
            fontSize: '12px',
            color: '#8b949e',
            background: '#21262d',
            padding: '4px 12px',
            borderRadius: '20px',
          }}
        >
          deepseek-chat
        </span>
      </div>

      <div
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '24px',
        }}
      >
        <div
          style={{
            color: '#8b949e',
            fontStyle: 'italic',
            padding: '8px',
            borderBottom: '1px solid #30363d',
            marginBottom: '8px',
          }}
        >
          💡 输入你的编程问题，DeepSeek 会帮你解答
        </div>

        <div
          style={{
            color: '#8b949e',
            fontStyle: 'italic',
            padding: '8px',
            borderBottom: '1px solid #30363d',
            marginBottom: '16px',
          }}
        >
          📌 支持: 代码编写、调试、解释、算法设计、系统重构等
        </div>

        {messages.map((msg, idx) => (
          <div
            key={idx}
            style={{
              maxWidth: '80%',
              marginBottom: '16px',
              padding: '12px 16px',
              borderRadius: '12px',
              whiteSpace: 'pre-wrap',
              wordWrap: 'break-word',
              lineHeight: '1.6',
              ...(msg.role === 'user'
                ? {
                    background: '#1f6feb',
                    color: 'white',
                    marginLeft: 'auto',
                  }
                : {
                    background: '#21262d',
                    color: msg.content ? '#e6edf3' : '#8b949e',
                    border: '1px solid #30363d',
                    fontStyle: msg.content ? 'normal' : 'italic',
                  }),
            }}
          >
            {msg.content || '⏳ 思考中...'}
          </div>
        ))}

        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          padding: '16px 24px',
          borderTop: '1px solid #30363d',
          display: 'flex',
          gap: '12px',
          background: '#0d1117',
          flexShrink: 0,
        }}
      >
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              sendMessage();
            }
          }}
          placeholder="输入你的编程问题..."
          rows={2}
          style={{
            flex: 1,
            padding: '12px',
            borderRadius: '8px',
            border: '1px solid #30363d',
            background: '#161b22',
            color: '#e6edf3',
            resize: 'none',
            fontSize: '14px',
            outline: 'none',
            fontFamily: 'inherit',
          }}
          disabled={loading}
        />

        <button
          onClick={sendMessage}
          disabled={loading}
          style={{
            padding: '12px 32px',
            background: '#4d6bfe',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: 600,
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '14px',
            opacity: loading ? 0.5 : 1,
          }}
        >
          {loading ? '生成中...' : '发送'}
        </button>
      </div>
    </div>
  );
}
