export const finderEn = {
  title: "Finder",
  sidebar: {
    favorites: "Favorites",
    recents: "Recents",
    applications: "Applications",
    desktop: "Desktop",
    documents: "Documents",
    downloads: "Downloads",
    locations: "Locations"
  },
  table: {
    name: "Name",
    dateModified: "Date Modified",
    size: "Size",
    kind: "Kind",
    pdfKind: "PDF Document",
    emptyFolder: "This folder is empty"
  },
  files: {
    cvEs: {
      name: "CV_Juan_Daniel_Gonzalez_ES.pdf",
      size: "2.2 MB",
      date: "Today, 10:45 AM"
    },
    cvEn: {
      name: "Resume_Juan_Daniel_Gonzalez_EN.pdf",
      size: "2.2 MB",
      date: "Yesterday, 3:20 PM"
    }
  },
  preview: {
    title: "Preview",
    pages: "pages",
    zoomIn: "Zoom In",
    zoomOut: "Zoom Out",
    noDocument: "No document selected",
    instructions: "Double click a PDF file in Finder to view it here."
  }
} as const;
