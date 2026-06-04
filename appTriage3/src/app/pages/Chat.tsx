import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Textarea } from '../components/ui/textarea';
import { ChatMessage, TypingIndicator } from '../components/chat-message';
import { Send, Sparkles } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

const mockResponses = [
  'Entiendo tu preocupación. Basándome en lo que me comentas, te recomendaría consultar con un profesional médico para una evaluación completa.',
  'Es importante mantener la calma. Los síntomas que describes podrían tener varias causas. ¿Hace cuánto tiempo experimentas esto?',
  'Recuerda que esta información es orientativa. Para un diagnóstico preciso, siempre es mejor consultar con un médico.',
  'Te sugiero monitorear tus síntomas. Si empeoran o aparecen señales de alarma, busca atención médica inmediata.',
];

const suggestedQuestions = [
  '¿Cuándo debo ir al médico?',
  '¿Qué significa esta señal de alarma?',
  '¿Cómo puedo aliviar los síntomas?',
  '¿Es normal sentir ansiedad?',
];

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: '¡Hola! Soy tu asistente de salud virtual. Puedo ayudarte con preguntas generales sobre salud y bienestar. ¿En qué puedo ayudarte hoy?',
      timestamp: 'Ahora',
    },
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = () => {
    if (!input.trim() || isTyping) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const randomResponse = mockResponses[Math.floor(Math.random() * mockResponses.length)];
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: randomResponse,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsTyping(false);
    }, 1500);
  };

  const handleSuggestedQuestion = (question: string) => {
    setInput(question);
  };

  return (
    <div className="max-w-screen-sm mx-auto h-[calc(100vh-4rem)] flex flex-col">
      {/* Header */}
      <div className="px-4 py-4 border-b bg-card">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold">Chat con IA</h1>
            <p className="text-xs text-muted-foreground">Asistente virtual de salud</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {messages.map((message) => (
          <ChatMessage
            key={message.id}
            role={message.role}
            content={message.content}
            timestamp={message.timestamp}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested questions */}
      {messages.length === 1 && !isTyping && (
        <div className="px-4 py-3 border-t bg-muted/30">
          <p className="text-xs text-muted-foreground mb-2">Preguntas sugeridas:</p>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestedQuestions.map((question, index) => (
              <Button
                key={index}
                variant="secondary"
                size="sm"
                className="whitespace-nowrap text-xs"
                onClick={() => handleSuggestedQuestion(question)}
              >
                {question}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="px-4 py-4 border-t bg-card">
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Escribe tu pregunta..."
            className="min-h-[44px] max-h-32 resize-none"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            rows={1}
          />
          <Button
            onClick={handleSend}
            disabled={!input.trim() || isTyping}
            size="icon"
            className="flex-shrink-0 min-w-[var(--touch-target-min)] min-h-[var(--touch-target-min)]"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
        <p className="text-xs text-muted-foreground mt-2">
          Este chat no reemplaza la atención médica profesional
        </p>
      </div>
    </div>
  );
}
