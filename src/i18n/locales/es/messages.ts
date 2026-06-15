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
      response: "Juan Daniel cuenta con más de 4 años de experiencia profesional como Ingeniero de Software Fullstack. Se especializa en React, TypeScript, Next.js y .NET. Actualmente colabora en Axosnet, donde lideró el rediseño integral de Axosmoney y diseñó la librería corporativa Axosnet Components. Anteriormente, en Axsis Tecnología, diseñó e implementó microservicios en .NET aplicando DDD y modernizó sistemas frontend con React y MobX."
    },
    {
      key: "skills",
      label: "⚡ Tecnologías",
      prompt: "¿Cuál es tu stack tecnológico?",
      response: "Su stack principal está enfocado en React, Next.js, TypeScript y TailwindCSS/Figma para UX/UI, combinado con C# (.NET) y SQL en servicios backend. Utiliza MobX, Zustand y Redux en el control de estados. Para arquitectura y herramientas, trabaja con Domain-Driven Design (DDD), microservicios, APIs REST, AWS, Git e integraciones con OpenAI."
    },
    {
      key: "contact",
      label: "✉️ Contacto",
      prompt: "¿Cómo puedo ponerme en contacto contigo?",
      response: "Puedes contactar a Juan Daniel directamente por correo electrónico en danielalejandre1050@gmail.com. También puedes conectar con él en LinkedIn (linkedin.com/in/daniel-alejandre) o ver sus proyectos de código abierto en GitHub (github.com/Juanda1050). ¡Todos estos enlaces están listos también en la app de Safari!"
    }
  ]
} as const;
