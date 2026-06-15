export const notesEn = {
  title: "Notes",
  searchPlaceholder: "Search notes...",
  noNotes: "No notes found",
  syncText: "iCloud Sync Enabled",
  wordsCount: "{{count}} words",
  notesData: [
    {
      id: "about_me",
      title: "About Juan Daniel",
      date: "Today, 12:00 PM",
      category: "Profile",
      content: `🎵 I have my headphones on pretty much all day. I mostly listen to Tyler, The Creator, Drake, Bad Bunny, Joan, Camilo Séptimo, and Luis Miguel.
🐶 My dog is named Tyler after Tyler, The Creator.
🎮 I play American Truck Simulator, FIFA, or Fortnite when I have some free time.
📚 I read mystery novels—my favorite series is Arsène Lupin. I also write from time to time.
🏋️‍♂️ I go to the gym.
🍕 I like Hawaiian pizza.`,
    },
    {
      id: "career_path",
      title: "Professional Background",
      date: "Yesterday, 4:30 PM",
      category: "Experience",
      content: `As a developer, I focus on more than just writing code. I care about building products that are genuinely useful, feel great to use, and solve problems simply. I'm always learning new things to improve what I build.

My most recent experience has been at Axosnet, where I've learned a lot about leading a complete redesign from scratch, from mapping out the UX/UI in Figma to coordinating the development of Axosmoney. I also grew to love building reusable component libraries to help other teams code faster and more consistently.

Before that, I was at Axsis Tecnología, which was the foundation of my career since that's where I started as a professional. I dove deep into building .NET microservices with DDD, and learned the value of clean code through refactoring heavy modules and automating complex data and reporting pipelines.`,
    },
    {
      id: "tech_stack",
      title: "Tech Stack & Setup",
      date: "June 3, 2026",
      category: "Technical",
      content: `If I had to talk about what I use day-to-day, my favorite stack is definitely React or Next.js for the frontend, along with Node.js or NestJS for the backend (which is what I'm currently learning and using a lot right now). I also use TypeScript to keep things structured and save myself from type-related headaches.

For a database and quick backend, I like using Supabase, but for more traditional or enterprise projects, C# with .NET is my go-to for building solid architectures like microservices or DDD. I usually do the design work in Figma and then move to TailwindCSS to code it up quickly.

I'm always working on side projects to keep learning new things, and lately I've also been focusing on how to become a better team leader.`,
    },
  ],
} as const;
