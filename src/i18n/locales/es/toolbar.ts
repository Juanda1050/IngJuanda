export const toolbarEs = {
  menus: {
    finder: {
      title: "Finder",
      about: "Acerca de esta Mac",
      settings: "Ajustes del Sistema...",
      forceQuit: "Forzar salida...",
      sleep: "Reposo",
      restart: "Reiniciar...",
      shutDown: "Apagar equipo...",
      lockScreen: "Bloquear pantalla",
      logOut: "Cerrar sesión de Juan Gonzalez..."
    },
    file: {
      title: "Archivo",
      newWindow: "Nueva ventana",
      closeWindow: "Cerrar ventana"
    },
    edit: {
      title: "Edición",
      undo: "Deshacer",
      redo: "Rehacer",
      cut: "Cortar",
      copy: "Copiar",
      paste: "Pegar"
    },
    view: {
      title: "Visualización",
      enterFullScreen: "Entrar a pantalla completa",
      showFinder: "Mostrar Finder"
    },
    window: {
      title: "Ventana",
      minimize: "Minimizar",
      zoom: "Zoom/Maximizar",
      front: "Traer todo al frente"
    },
    help: {
      title: "Ayuda",
      macHelp: "Ayuda de macOS",
      portfolioHelp: "Ayuda de Portafolio"
    }
  },
  battery: {
    title: "Batería",
    charging: "Cargando",
    discharging: "Usando batería",
    level: "Nivel",
    notSupported: "Batería no detectada"
  },
  wifi: {
    title: "Wi-Fi",
    connected: "Conectado",
    disconnected: "Desconectado",
    type: "Tipo de conexión",
    speed: "Velocidad de descarga",
    notSupported: "Red no detectada"
  },
  profile: {
    title: "Perfil de Usuario",
    name: "Juan Gonzalez",
    email: "danielalejandre1050@gmail.com",
    sendMessage: "Enviar mensaje",
    scheduleMeeting: "Agendar reunión",
    viewResume: "Ver Currículum / CV"
  },
  controlCenter: {
    title: "Centro de Control",
    appearance: "Aspecto",
    language: "Idioma",
    volume: "Volumen",
    shortcuts: {
      music: "Música",
      calendar: "Calendario",
      settings: "Ajustes"
    }
  }
} as const;
