export const mailEs = {
  title: "Mail",
  sidebar: {
    inbox: "Bandeja de entrada",
    sent: "Enviados",
    drafts: "Borradores",
    archive: "Archivados",
    junk: "No deseado",
    trash: "Papelera",
    newMsg: "Nuevo mensaje"
  },
  compose: {
    title: "Nuevo mensaje",
    to: "Para:",
    subject: "Asunto:",
    messagePlaceholder: "Escribe tu mensaje aquí...",
    send: "Enviar",
    sending: "Enviando...",
    success: "¡Mensaje enviado con éxito!",
    replyPrefix: "Re:",
    cancel: "Cancelar",
    you: "Tú",
    visitorEmail: "visitor@juanda.dev",
    visitorName: "Visitante",
    draft: "Borrador",
    draftEmail: "draft@juanda.dev",
    noSubject: "(Sin asunto)",
    placeholder: "Enviado desde mi Portafolio",
    editDraft: "Editar borrador",
    ccBcc: "Cc/Cco:",
    errorOnlyRealEmail: "Los correos solo se pueden enviar a la dirección real del propietario (danielalejandre1050@gmail.com).",
    undo: "Deshacer"
  },
  emails: [
    {
      id: "1",
      fromName: "GitHub Notifications",
      fromEmail: "noreply@github.com",
      date: "Hoy, 10:15 AM",
      subject: "[GitHub] Security Alert: dependency vulnerability in package.json (CVE-2026-1234)",
      body: "Hola Juanda,\n\nSe ha identificado una vulnerabilidad de seguridad en una de las dependencias de tu repositorio: next-auth. Recomendamos actualizar a la versión 14.2.1 inmediatamente para resolver este problema.\n\nRepositorio: Juanda1050/IngJuanda\nSeveridad: Alta\nDependencia: next-auth (v14.2.0)\nCorregido en: 14.2.1\n\nPara solucionar automáticamente esta vulnerabilidad, puedes ejecutar:\nnpm update next-auth\n\nPara más detalles, visita la Base de Datos de Asesoramiento de GitHub."
    },
    {
      id: "2",
      fromName: "Vercel Team",
      fromEmail: "reports@vercel.com",
      date: "Ayer, 3:40 PM",
      subject: "Monthly Analytics Report & Invoice - May 2026",
      body: "Hola Juan Daniel,\n\nTu informe mensual de analíticas y factura de uso para tus proyectos de Vercel ya están disponibles.\n\nResumen para el espacio de trabajo de Juanda:\n- Proyectos totales: 12\n- Ancho de banda usado: 45.8 GB (45% de la cuota)\n- Ejecuciones de Serverless Functions: 230k (23% de la cuota)\n- Total a pagar: $0.00 USD (Plan Hobby)\n\nHemos adjuntado la factura en PDF y el desglose completo de métricas a este correo para tus registros.\n\n¡Gracias por elegir Vercel!\nEl equipo de Vercel"
    },
    {
      id: "3",
      fromName: "Sentry Alerts",
      fromEmail: "alerts@sentry.io",
      date: "3 de junio de 2026",
      subject: "[Sentry] New Issue: TypeError: Cannot read properties of undefined (reading 'map') in products.tsx",
      body: "Hola Juanda,\n\nSe ha detectado un nuevo problema no resuelto en tu entorno de producción.\n\nTypeError: Cannot read properties of undefined (reading 'map')\n  at ProductsGrid (src/features/products/components/products-grid.tsx:142:18)\n  at RenderWithHooks (react-dom.development.js:15486)\n\nPrimera vez visto: Hace 5 minutos\nDesencadenado por: Chrome/125.0.0.0 (Windows 11)\nNúmero de ocurrencias: 28 ocurrencias afectando a 14 usuarios.\n\nVer detalles en tu panel de Sentry para inspeccionar el stack trace completo y las migas de pan."
    }
  ],
  summaries: {
    "1": [
      "GitHub alertó a Juanda sobre una vulnerabilidad de seguridad en next-auth (CVE-2026-1234).",
      "La vulnerabilidad tiene una severidad calificada como Alta.",
      "La acción recomendada es ejecutar 'npm update next-auth' para actualizar la dependencia inmediatamente."
    ],
    "2": [
      "Vercel ha enviado el informe de analíticas y factura mensual para mayo de 2026.",
      "Muestra un total de 12 proyectos en el Plan Hobby con un saldo de $0.00 USD.",
      "Se adjunta el PDF del reporte detallando el rendimiento y consumo."
    ],
    "3": [
      "Sentry detectó un nuevo TypeError no resuelto en producción dentro de src/features/products.",
      "Afecta a 14 usuarios con un total de 28 ocurrencias en Chrome/Windows 11.",
      "Se sugiere revisar el panel de Sentry para ver el stack trace completo y las migas de pan."
    ]
  },
  draftPrompt: {
    title: "¿Guardar borrador?",
    description: "¿Qué quieres hacer con este mensaje?",
    save: "Guardar borrador",
    delete: "Eliminar borrador",
    keepEditing: "Seguir editando"
  },
  undoSend: "Deshacer envío",
  messageSent: "Mensaje enviado exitosamente",
  noMail: "Sin correos",
  noMessageSelected: "Sin mensaje seleccionado",
  updatedJustNow: "Actualizado ahora",
  oneMessage: "1 Mensaje",
  summarize: "Resumir"
} as const;
