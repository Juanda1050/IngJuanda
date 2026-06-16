export const finderEs = {
  title: "Finder",
  mobileTitle: "Archivos",
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
      size: "344 KB",
      date: "Hoy, 10:45 a.m."
    },
    cvEn: {
      name: "Resume_Juan_Daniel_Gonzalez_EN.pdf",
      size: "340 KB",
      date: "Ayer, 3:20 p.m."
    }
  },
  preview: {
    title: "Vista Previa",
    pages: "páginas",
    zoomIn: "Acercar",
    zoomOut: "Alejar",
    noDocument: "Ningún documento seleccionado",
    instructions: "Haz clic en un archivo PDF en Finder para verlo aquí.",
    openPdf: "Abrir PDF completo",
    downloadPdf: "Descargar PDF",
    mobileInstructions: "Este archivo PDF se abrirá en una nueva pestaña para una mejor visualización en dispositivos iOS/iPadOS."
  }
} as const;
