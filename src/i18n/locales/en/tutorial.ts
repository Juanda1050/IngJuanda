export const tutorialEn = {
  skip: "Skip Tour",
  next: "Next",
  back: "Back",
  finish: "Finish",
  start: "Start Onboarding Tour",
  steps: {
    welcome: {
      title: "Welcome to my Portfolio! 👋",
      description: "I designed this portfolio to look like an Apple computer desktop. Let's take a quick 1-minute tour to see how easy it is to explore my work!"
    },
    sidebar: {
      title: "Sections Menu 📁",
      description: "Here is a list of sections. Click on any file (like 'About' or 'Projects') to open and read its content in the center of the screen."
    },
    livePreview: {
      title: "See Projects in Action 🌐",
      description: "Click the green 'Live Preview' play button to see my projects come to life inside a simulated web browser window."
    },
    dock: {
      title: "App Dock 🖥️",
      description: "Use this bottom dock to open different applications. You can check my calendar, read notes, change settings, or send me a chat message!"
    },
    profile: {
      title: "Contact & Resume 📇",
      description: "Click on my profile picture at the top right to download my PDF resume (in English or Spanish), schedule a meeting with me, or send me an email."
    },
    spotlight: {
      title: "Spotlight Search 🔍",
      description: "Click on the top menu bar search icon or press Ctrl+Space to open Spotlight. Use it to search and open apps, change wallpaper, toggle dark mode, switch language, or read my PDF resume."
    },
    commandPalette: {
      title: "Command Palette ⌨️",
      description: "Click 'Open command palette' or press Ctrl+K to run editor scripts. Toggle the terminal console, stop the local dev server, clear console logs, or reset desktop settings."
    },
    searchSidebar: {
      title: "Search in Files 🔎",
      description: "Click on the search magnifying glass in the VS Code sidebar to search for any keyword or text snippet inside the portfolio code files. Click a result to jump to that line!"
    },
    finish: {
      title: "You're All Set! 🎉",
      description: "You are now ready to explore! Have fun clicking around the windows. If you ever need this guide again, click 'Help' in the top menu bar."
    }
  },
  mobile: {
    next: "Next",
    finish: "Got it",
    skip: "Skip",
    back: "Back",
    step1: {
      title: "Welcome to iPhone UI 📱",
      desc: "This is a mobile-optimized view of the portfolio. Let's do a quick tour!"
    },
    statusbar: {
      title: "Status Bar 🔋",
      desc: "Shows the current time, Wi-Fi status, and battery percentage."
    },
    apps: {
      title: "Applications Grid 📁",
      desc: "Tap any icon here to open apps like Notes or Calendar."
    },
    step2: {
      title: "Settings App ⚙️",
      desc: "Open Settings to change the language or toggle dark/light themes."
    },
    dock: {
      title: "App Dock 📥",
      desc: "Quick access to Phone, Safari, Messages, and Mail."
    },
    home: {
      title: "Home Indicator 🏠",
      desc: "When inside any app, tap this bottom bar to return to the home screen."
    },
    finishStep: {
      title: "All Set! 🎉",
      desc: "You are ready to explore. Have fun clicking around the iOS interface!"
    }
  }
} as const;
