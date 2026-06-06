export const finderEs = {
  title: "Finder",
  sidebar: {
    favorites: "Favoritos",
    recents: "Recientes",
    applications: "Aplicaciones",
    desktop: "Escritorio",
    documents: "Documentos",
    downloads: "Descargas",
    locations: "Ubicaciones"
  },
  table: {
    name: "Nombre",
    dateModified: "Fecha de modificación",
    size: "Tamaño",
    kind: "Clase",
    pdfKind: "Documento PDF",
    emptyFolder: "Esta carpeta está vacía"
  },
  files: {
    cvEs: {
      name: "CV_Juan_Daniel_Gonzalez_ES.pdf",
      size: "2.4 MB",
      date: "Hoy, 10:45 a.m."
    },
    cvEn: {
      name: "Resume_Juan_Daniel_Gonzalez_EN.pdf",
      size: "2.2 MB",
      date: "Ayer, 3:20 p.m."
    }
  },
  preview: {
    title: "Vista Previa",
    pages: "páginas",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    noDocument: "Ningún documento seleccionado",
    instructions: "Haz doble clic en un archivo PDF en Finder para verlo aquí."
  }
} as const;
