import { useState, useMemo, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Search, Send, CheckCheck, Smile, MoreHorizontal } from 'lucide-react'
import { cn } from '@/lib/utils'

interface Message {
  id: string
  sender: 'bot' | 'user'
  text: string
  timestamp: string
}

interface DialogOption {
  key: 'experience' | 'skills' | 'contact' | 'joke'
  label: { en: string; es: string }
  prompt: { en: string; es: string }
  response: { en: string; es: string }
}

const DIALOG_OPTIONS: DialogOption[] = [
  {
    key: 'experience',
    label: { en: '💼 Experience', es: '💼 Experiencia' },
    prompt: { en: 'Can you tell me about your experience?', es: '¿Me puedes hablar de tu experiencia laboral?' },
    response: {
      en: 'Juan Daniel has 4+ years of professional experience as a Fullstack Developer. He specializes in React, TypeScript, Next.js, and Zustand. He currently works at Tech Studio, where he led a multi-product architecture, improved performance, and optimized code delivery pipelines. Prior to that, at Digital Labs, he directed legacy code refactoring and migrated multiple SPAs from Javascript to modern TypeScript.',
      es: 'Juan Daniel cuenta con más de 4 años de experiencia profesional como Desarrollador Fullstack. Se especializa en React, TypeScript, Next.js y Zustand. Actualmente colabora en Tech Studio liderando la arquitectura de portales multi-producto y optimizando Core Web Vitals. Anteriormente trabajó en Digital Labs donde dirigió la migración y refactorización completa de portales legacy hacia TypeScript.'
    }
  },
  {
    key: 'skills',
    label: { en: '⚡ Skills & Stack', es: '⚡ Tecnologías' },
    prompt: { en: 'What is your technology stack?', es: '¿Cuál es tu stack tecnológico?' },
    response: {
      en: 'His primary stack focuses on modern React, Next.js, TypeScript, and TailwindCSS for frontend UI, combined with Node.js and Express for backend services. He uses Zustand, Redux, and Context API for state management. For DX and tooling, he uses Vite, ESLint, Vitest, Cypress, Git, Docker, and GitHub Actions for CI/CD pipelines.',
      es: 'Su stack principal está enfocado en React, Next.js, TypeScript y TailwindCSS en la UI frontend, con Node.js y Express en servicios backend. Utiliza Zustand y Redux en el control de estados. Para DX y desarrollo cuenta con Vite, ESLint, Git, Docker, y pruebas mediante Vitest/React Testing Library y Cypress.'
    }
  },
  {
    key: 'contact',
    label: { en: '✉️ Contact Details', es: '✉️ Contacto' },
    prompt: { en: 'How can I contact you?', es: '¿Cómo puedo ponerme en contacto contigo?' },
    response: {
      en: 'You can reach Juan Daniel directly via email at hello@portfolio.dev. You can also view his professional networks on LinkedIn (linkedin.com/in/portfolio) or explore his active open-source projects on GitHub (github.com/portfolio). All of these links are also accessible inside the Safari browser on the desktop!',
      es: 'Puedes contactar a Juan Daniel directamente por correo electrónico en hello@portfolio.dev. También puedes conectar con él en LinkedIn (linkedin.com/in/portfolio) o ver sus proyectos de código abierto en GitHub (github.com/portfolio). ¡Todos estos enlaces están listos también en la app de Safari!'
    }
  },
  {
    key: 'joke',
    label: { en: '🎈 Programmer Joke', es: '🎈 Chiste de Devs' },
    prompt: { en: 'Tell me a developer joke!', es: '¡Cuéntame un chiste de programadores!' },
    response: {
      en: "Why do programmers prefer dark mode? Because light attracts bugs! 💻🐛😂",
      es: "¿Por qué los programadores prefieren el modo oscuro? ¡Porque la luz atrae a los bichos/bugs! 💻🐛😂"
    }
  }
]

export function MessagesWindow() {
  const { i18n } = useTranslation('common')
  const isEn = i18n.language === 'en'

  const [searchQuery, setSearchQuery] = useState('')
  const [typedMessage, setTypedMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [messages, setMessages] = useState<Message[]>(() => [
    {
      id: 'welcome',
      sender: 'bot',
      text: isEn
        ? "Hi there! I'm Juan Daniel's virtual assistant. Ask me anything about his professional experience, skills, contact info, or click a capsule below!"
        : '¡Hola! Soy el asistente virtual de Juan Daniel. ¡Pregúntame sobre su experiencia laboral, habilidades, información de contacto o haz clic en los botones de abajo!',
      timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    }
  ])

  const chatEndRef = useRef<HTMLDivElement>(null)

  // Auto scroll to bottom
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isTyping])

  // Dialog option click trigger
  const handleOptionClick = (option: DialogOption) => {
    if (isTyping) return

    const now = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: isEn ? option.prompt.en : option.prompt.es,
      timestamp: now
    }

    setMessages(prev => [...prev, userMsg])
    setIsTyping(true)

    // Simulate natural typing delay
    setTimeout(() => {
      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: isEn ? option.response.en : option.response.es,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      }
      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1200)
  }

  // Handle typing send
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!typedMessage.trim() || isTyping) return

    const now = new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
    const userText = typedMessage.trim()
    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: userText,
      timestamp: now
    }

    setMessages(prev => [...prev, userMsg])
    setTypedMessage('')
    setIsTyping(true)

    // Analyze keywords to trigger semi-intelligent responses
    setTimeout(() => {
      const lowerText = userText.toLowerCase()
      let responseText = ''

      if (lowerText.includes('experiencia') || lowerText.includes('trabaj') || lowerText.includes('experience') || lowerText.includes('career') || lowerText.includes('job')) {
        responseText = isEn ? DIALOG_OPTIONS[0]!.response.en : DIALOG_OPTIONS[0]!.response.es
      } else if (lowerText.includes('tecnolog') || lowerText.includes('stack') || lowerText.includes('skill') || lowerText.includes('habilidad') || lowerText.includes('herramienta')) {
        responseText = isEn ? DIALOG_OPTIONS[1]!.response.en : DIALOG_OPTIONS[1]!.response.es
      } else if (lowerText.includes('contact') || lowerText.includes('correo') || lowerText.includes('email') || lowerText.includes('linkedin') || lowerText.includes('telefono')) {
        responseText = isEn ? DIALOG_OPTIONS[2]!.response.en : DIALOG_OPTIONS[2]!.response.es
      } else if (lowerText.includes('chiste') || lowerText.includes('joke') || lowerText.includes('funny')) {
        responseText = isEn ? DIALOG_OPTIONS[3]!.response.en : DIALOG_OPTIONS[3]!.response.es
      } else {
        responseText = isEn
          ? "That's a great question! I'm just a simple assistant, but I highly recommend checking out Juan Daniel's PDF files in Finder, inspecting his live portfolio in Safari, or sending him an email at hello@portfolio.dev."
          : '¡Excelente pregunta! Soy un asistente básico, pero te recomiendo altamente revisar el Currículum en Finder, explorar el portafolio en vivo en la app de Safari o escribirle directamente a su correo en hello@portfolio.dev.'
      }

      const botMsg: Message = {
        id: `bot-${Date.now()}`,
        sender: 'bot',
        text: responseText,
        timestamp: new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })
      }

      setMessages(prev => [...prev, botMsg])
      setIsTyping(false)
    }, 1200)
  }

  // Filter sidebar chats (mock)
  const sidebarChats = useMemo(() => {
    return [
      {
        id: 'juanda',
        name: 'Juan Daniel González',
        status: isEn ? 'online' : 'activo',
        avatar: '/profile.jpg',
        latestText: messages[messages.length - 1]?.text || ''
      }
    ].filter(chat => chat.name.toLowerCase().includes(searchQuery.toLowerCase()))
  }, [messages, searchQuery, isEn])

  return (
    <div className="flex h-full w-full bg-background dark:bg-[#1e1e1e] text-foreground font-sans text-sm select-none">
      
      {/* Messages Sidebar */}
      <div className="w-60 shrink-0 border-r border-border/50 bg-[#f6f6f6] dark:bg-[#252526] flex flex-col min-h-0">
        {/* Search */}
        <div className="p-3 border-b border-border/40 shrink-0">
          <div className="relative flex items-center">
            <Search className="absolute left-2.5 size-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={isEn ? "Search conversations..." : "Buscar conversaciones..."}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border border-border/60 bg-background/50 dark:bg-[#1e1e1e] py-1 pl-8 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 text-foreground transition-colors"
            />
          </div>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto p-1.5 space-y-1">
          {sidebarChats.map((chat) => (
            <div
              key={chat.id}
              className="w-full rounded-lg p-2.5 flex items-center gap-3 bg-primary/10 border border-primary/20 text-foreground"
            >
              <img
                src={chat.avatar}
                alt={chat.name}
                className="size-9 rounded-full border border-border/60 object-cover shadow-sm shrink-0"
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <span className="font-bold text-xs truncate leading-none text-foreground/90">{chat.name}</span>
                  <span className="size-2 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
                </div>
                <p className="text-[10px] text-muted-foreground truncate leading-normal">
                  {chat.latestText}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main iMessage Panel */}
      <div className="flex-1 flex flex-col min-w-0 bg-background dark:bg-[#1c1c1e] relative">
        
        {/* Chat Header */}
        <div className="flex h-12 shrink-0 items-center justify-between border-b border-border/40 bg-background/50 dark:bg-[#1c1c1e]/50 px-4 md:px-6 backdrop-blur-md">
          <div className="flex items-center gap-2.5 min-w-0">
            <img
              src="/profile.jpg"
              alt="Juan Daniel"
              className="size-7 rounded-full border object-cover shrink-0"
            />
            <div className="min-w-0">
              <h4 className="font-bold text-xs leading-none truncate">{isEn ? 'Juan Daniel González' : 'Juan Daniel González'}</h4>
              <span className="text-[9px] font-semibold text-emerald-500 uppercase tracking-wider block mt-0.5 select-none">
                {isEn ? 'iMessage • Online' : 'iMessage • Activo'}
              </span>
            </div>
          </div>
          <button className="flex size-7 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground">
            <MoreHorizontal className="size-4" />
          </button>
        </div>

        {/* Message Thread Box */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4">
          {messages.map((msg) => {
            const isBot = msg.sender === 'bot'
            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col max-w-[85%] sm:max-w-[70%]",
                  isBot ? "mr-auto items-start animate-fade-in-left" : "ml-auto items-end animate-fade-in-right"
                )}
              >
                {/* Bubble */}
                <div
                  className={cn(
                    "px-4 py-2.5 text-xs leading-relaxed select-text shadow-sm border border-transparent",
                    isBot
                      ? "rounded-2xl rounded-bl-sm bg-[#e9e9eb] text-black border-[#dbdbdd] dark:bg-[#2c2c2e] dark:text-white dark:border-white/5"
                      : "rounded-2xl rounded-br-sm bg-gradient-to-r from-blue-600 to-indigo-600 text-white border-blue-600"
                  )}
                >
                  {msg.text}
                </div>
                {/* Time Indicator */}
                <span className="text-[9px] text-muted-foreground/60 font-semibold mt-1 px-1 flex items-center gap-1 select-none">
                  <span>{msg.timestamp}</span>
                  {!isBot && <CheckCheck className="size-3 text-blue-500 shrink-0" />}
                </span>
              </div>
            )
          })}

          {/* Typing Animation */}
          {isTyping && (
            <div className="flex flex-col mr-auto max-w-[85%] items-start">
              <div className="flex items-center gap-1 bg-[#e9e9eb] dark:bg-[#2c2c2e] px-4 py-2.5 rounded-2xl rounded-bl-sm border border-[#dbdbdd] dark:border-white/5">
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="size-1.5 rounded-full bg-muted-foreground/50 animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Reply Options Capsules */}
        <div className="px-4 py-2 bg-black/[0.02] dark:bg-white/[0.01] border-t border-border/30 shrink-0">
          <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none pr-4">
            {DIALOG_OPTIONS.map((opt) => (
              <button
                key={opt.key}
                disabled={isTyping}
                onClick={() => handleOptionClick(opt)}
                className="shrink-0 rounded-full border border-border bg-background hover:bg-black/5 dark:hover:bg-white/5 active:scale-95 disabled:opacity-40 disabled:scale-100 transition-all px-3 py-1.5 text-xs font-semibold text-foreground"
              >
                {isEn ? opt.label.en : opt.label.es}
              </button>
            ))}
          </div>
        </div>

        {/* Text Input Footer Form */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 border-t border-border/40 bg-background/50 dark:bg-[#1c1c1e]/50 backdrop-blur-md flex items-center gap-2 shrink-0"
        >
          <button type="button" className="flex size-8 shrink-0 items-center justify-center rounded-full hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground">
            <Smile className="size-4" />
          </button>
          
          <input
            type="text"
            disabled={isTyping}
            value={typedMessage}
            onChange={(e) => setTypedMessage(e.target.value)}
            placeholder={isEn ? "iMessage" : "iMessage"}
            className="flex-1 rounded-full border border-border/80 bg-background/60 dark:bg-[#1a1a1c] px-4 py-1.5 text-xs outline-none placeholder:text-muted-foreground/60 focus:border-primary/50 text-foreground transition-all focus:bg-background"
          />

          <button
            type="submit"
            disabled={!typedMessage.trim() || isTyping}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full transition-all text-white",
              typedMessage.trim() && !isTyping
                ? "bg-blue-600 hover:opacity-90 active:scale-95 cursor-pointer shadow-md"
                : "bg-muted text-muted-foreground/40 cursor-default"
            )}
            aria-label="Send message"
          >
            <Send className="size-3.5" />
          </button>
        </form>

      </div>

    </div>
  )
}
