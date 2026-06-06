export const messagesEs = {
  title: "Mensajes",
  searchPlaceholder: "Buscar conversaciones...",
  statusOnline: "iMessage • Activo",
  welcome: "¡Hola! Soy el asistente virtual de Juan Daniel. ¡Pregúntame sobre su experiencia laboral, habilidades, información de contacto o haz clic en los botones de abajo!",
  inputPlaceholder: "iMessage",
  fallbackResponse: "¡Excelente pregunta! Soy un asistente básico, pero te recomiendo altamente revisar el Currículum en Finder, explorar el portafolio en vivo en la app de Safari o escribirle directamente a su correo en danielalejandre1050@gmail.com.",
  dialogs: [
    {
      key: "experience",
      label: "💼 Experiencia",
      prompt: "¿Me puedes hablar de tu experiencia laboral?",
      response: "Juan Daniel cuenta con más de 4 años de experiencia profesional como Desarrollador Fullstack. Se especializa en React, TypeScript, Next.js y Zustand. Actualmente colabora en Tech Studio liderando la arquitectura de portales multi-producto y optimizando Core Web Vitals. Anteriormente trabajó en Digital Labs donde dirigió la migración y refactorización completa de portales legacy hacia TypeScript."
    },
    {
      key: "skills",
      label: "⚡ Tecnologías",
      prompt: "¿Cuál es tu stack tecnológico?",
      response: "Su stack principal está enfocado en React, Next.js, TypeScript y TailwindCSS en la UI frontend, con Node.js y Express en servicios backend. Utiliza Zustand y Redux en el control de estados. Para DX y desarrollo cuenta con Vite, ESLint, Git, Docker, y pruebas mediante Vitest/React Testing Library y Cypress."
    },
    {
      key: "contact",
      label: "✉️ Contacto",
      prompt: "¿Cómo puedo ponerme en contacto contigo?",
      response: "Puedes contactar a Juan Daniel directamente por correo electrónico en danielalejandre1050@gmail.com. También puedes conectar con él en LinkedIn (linkedin.com/in/daniel-alejandre) o ver sus proyectos de código abierto en GitHub (github.com/Juanda1050). ¡Todos estos enlaces están listos también en la app de Safari!"
    },
    {
      key: "joke",
      label: "🎈 Chiste de Devs",
      prompt: "¡Cuéntame un chiste de programadores!",
      response: "¿Por qué los programadores prefieren el modo oscuro? ¡Porque la luz atrae a los bichos/bugs! 💻🐛😂"
    }
  ]
} as const;
