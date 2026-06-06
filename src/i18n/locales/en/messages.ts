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
      response: "Juan Daniel has 4+ years of professional experience as a Fullstack Developer. He specializes in React, TypeScript, Next.js, and Zustand. He currently works at Tech Studio, where he led a multi-product architecture, improved performance, and optimized code delivery pipelines. Prior to that, at Digital Labs, he directed legacy code refactoring and migrated multiple SPAs from Javascript to modern TypeScript."
    },
    {
      key: "skills",
      label: "⚡ Skills & Stack",
      prompt: "What is your technology stack?",
      response: "His primary stack focuses on modern React, Next.js, TypeScript, and TailwindCSS for frontend UI, combined with Node.js and Express for backend services. He uses Zustand, Redux, and Context API for state management. For DX and tooling, he uses Vite, ESLint, Vitest, Cypress, Git, Docker, and GitHub Actions for CI/CD pipelines."
    },
    {
      key: "contact",
      label: "✉️ Contact Details",
      prompt: "How can I contact you?",
      response: "You can reach Juan Daniel directly via email at danielalejandre1050@gmail.com. You can also view his professional networks on LinkedIn (linkedin.com/in/daniel-alejandre) or explore his active open-source projects on GitHub (github.com/Juanda1050). All of these links are also accessible inside the Safari browser on the desktop!"
    },
    {
      key: "joke",
      label: "🎈 Programmer Joke",
      prompt: "Tell me a developer joke!",
      response: "Why do programmers prefer dark mode? Because light attracts bugs! 💻🐛😂"
    }
  ]
} as const;
