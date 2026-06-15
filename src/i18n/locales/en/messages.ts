export const messagesEn = {
  title: "Messages",
  searchPlaceholder: "Search conversations...",
  statusOnline: "iMessage • Online",
  welcome: "Hi there! I'm Juan Daniel's virtual assistant. Ask me anything about his professional experience, skills, contact info, or click a capsule below!",
  inputPlaceholder: "iMessage",
  fallbackResponse: "That's a great question! I'm just a simple assistant, but I highly recommend checking out Juan Daniel's PDF files in Finder, inspecting his live portfolio in Safari, or sending him an email at danielalejandre1050@gmail.com.",
  dialogs: [
    {
      key: "experience",
      label: "💼 Experience",
      prompt: "Can you tell me about your experience?",
      response: "Juan Daniel has 4+ years of professional experience as a Fullstack Software Engineer. He specializes in React, TypeScript, Next.js, and .NET. He currently works at Axosnet, where he led the redesign of Axosmoney and designed the corporate component library Axosnet Components. Previously, at Axsis Tecnología, he designed and implemented .NET microservices following DDD and modernized frontend systems using React and MobX."
    },
    {
      key: "skills",
      label: "⚡ Skills & Stack",
      prompt: "What is your technology stack?",
      response: "His primary stack focuses on React, Next.js, TypeScript, and TailwindCSS/Figma for UX/UI, combined with C# (.NET) and SQL for backend services. He uses MobX, Zustand, and Redux for state management. For architecture and tools, he works with Domain-Driven Design (DDD), microservices, REST APIs, AWS, Git, and OpenAI integrations."
    },
    {
      key: "contact",
      label: "✉️ Contact Details",
      prompt: "How can I contact you?",
      response: "You can reach Juan Daniel directly via email at danielalejandre1050@gmail.com. You can also view his professional networks on LinkedIn (linkedin.com/in/daniel-alejandre) or explore his active open-source projects on GitHub (github.com/Juanda1050). All of these links are also accessible inside the Safari browser on the desktop!"
    }
  ]
} as const;
