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
    replyPrefix: "Re:"
  },
  emails: [
    {
      id: "1",
      fromName: "Recruitment Global",
      fromEmail: "hr@techglobal.io",
      date: "Hoy, 10:15 AM",
      subject: "Invitación a Entrevista - Senior Frontend Developer",
      body: "Hola Juan Daniel,\n\nRevisamos tu portafolio y nos encantó tu simulación de escritorio macOS en la web. Es un excelente ejemplo de frontend modular, stack dinámico y atención al detalle.\n\nQueremos agendar una entrevista técnica contigo para el rol de Senior Frontend Developer. ¿Tienes disponibilidad esta semana?\n\nSaludos,\nRecruitment Global Team"
    },
    {
      id: "2",
      fromName: "Sarah Creative Studios",
      fromEmail: "sarah@creative-studios.co",
      date: "Ayer, 3:40 PM",
      subject: "Consulta de Proyecto - Colaboración Freelance",
      body: "Hola Juanda,\n\nEspero que estés muy bien. Tu portafolio interactivo es increíble 🚀. La sincronización entre el Control Center y el reproductor de música, así como el renderizado de los emojis oficiales de Apple, son detalles increíbles.\n\nTenemos un proyecto para un cliente internacional que requiere un desarrollo de componentes a medida y nos encantaría contar contigo como Freelance. ¿Podríamos charlar por videollamada?\n\nSarah Miller\nDirectora Creativa"
    },
    {
      id: "3",
      fromName: "Dev Relations OS Labs",
      fromEmail: "dev-relations@os-labs.org",
      date: "3 de junio de 2026",
      subject: "Propuesta de Colaboración - Sistema de Diseño Open Source",
      body: "Estimado Juan Daniel,\n\nSeguimos de cerca tu trabajo con Storybook y TailwindCSS para crear sistemas de diseño empresariales. Nos gustaría invitarte a participar como colaborador principal en nuestra próxima librería UI open-source enfocada en accesibilidad y layouts adaptativos.\n\nAvísanos si te interesa para agendar una llamada y darte más detalles.\n\nAtentamente,\nOS Labs Team"
    }
  ],
  summaries: {
    "1": [
      "Recruitment Global ha invitado a Juan Daniel a una entrevista para Senior Frontend Developer.",
      "Destacaron que su simulador de escritorio macOS es un gran ejemplo de modularidad técnica.",
      "Solicitaron respuesta sobre su disponibilidad para una videollamada."
    ],
    "2": [
      "Sarah Miller de Creative Studios propuso una colaboración freelance.",
      "Elogió detalles como la sincronización de volumen y los componentes tipo nativo.",
      "Adjunta un brief de proyecto con los requerimientos de diseño interactivo del cliente."
    ],
    "3": [
      "Dev Relations de OS Labs invitó a Juanda a ser colaborador principal de una biblioteca de diseño UI open-source.",
      "Mencionaron que siguen su trabajo con Storybook y Tailwind CSS.",
      "Sugirieron agendar una llamada rápida para revisar los materiales de onboarding."
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
