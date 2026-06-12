export const settingsEs = {
  title: "Ajustes",
  sidebar: {
    profile: "Perfil de Juan",
    appearance: "Aspecto",
    desktop: "Fondo de Pantalla",
    displays: "Pantallas",
    sound: "Sonido",
    battery: "Batería",
    wifi: "Wi-Fi",
    about: "Acerca de este Mac"
  },
  profile: {
    title: "Perfil de Usuario",
    subtitle: "Tarjeta de Contacto Profesional",
    downloadEs: "Descargar CV (Español)",
    downloadEn: "Descargar Resume (Inglés)",
    linksTitle: "Enlaces Sociales"
  },
  appearance: {
    title: "Aspecto del Sistema",
    mode: "Modo de color",
    light: "Claro",
    dark: "Oscuro",
    system: "Auto / Sistema",
    finderTitle: "Finder",
    finderClickToOpen: "Abrir archivos con",
    finderClickToOpenDesc: "Elige si deseas abrir archivos con un solo clic o doble clic.",
    singleClick: "Un solo clic",
    doubleClick: "Doble clic"
  },
  desktop: {
    title: "Fondos de Pantalla",
    select: "Selecciona un gradiente premium para el escritorio:",
    options: {
      default: "Aqua Dinámico",
      monterey: "Olas de Monterey",
      sonoma: "Sonoma Horizonte",
      aurora: "Aurora Boreal",
      midnight: "Curvas de Medianoche"
    }
  },
  displays: {
    title: "Ajustes de Pantalla",
    brightness: "Brillo",
    nightShift: "Night Shift",
    nightShiftDesc: "Night Shift cambia los colores de la pantalla a tonos más cálidos tras el anochecer para reducir la fatiga visual.",
    gfxAccel: "Aceleración gráfica",
    gfxAccelDesc: "Desactiva la aceleración gráfica para optimizar el rendimiento en entornos renderizados por CPU (ej. máquinas virtuales o equipos antiguos). Esto desactiva desenfoques de fondo, filtros SVG y animaciones."
  },
  performance: {
    title: "Rendimiento"
  },
  sound: {
    title: "Ajustes de Sonido",
    masterVolume: "Volumen principal",
    mute: "Silenciar audio"
  },
  battery: {
    title: "Condición de la Batería",
    health: "Condición de batería",
    healthDesc: "Normal (Capacidad Máxima 98%)",
    cycles: "Ciclos de carga",
    cyclesDesc: "184 ciclos",
    energySaver: "Modo ahorrar energía",
    energySaverDesc: "Reduce el consumo energético al optimizar recursos de red y animaciones."
  },
  wifi: {
    title: "Estado de Conexión",
    networkName: "Red activa",
    ipAddress: "Dirección IP",
    connectionQuality: "Calidad de red",
    speed: "Velocidad de descarga",
    secProtocol: "Protocolo de seguridad"
  },
  about: {
    title: "Información del Sistema",
    chip: "Chip",
    chipVal: "Juan Daniel M3 Max (Brain Edition)",
    memory: "Memoria",
    memoryVal: "32 GB RAM (Multi-threaded Logic)",
    storage: "Disco de arranque",
    storageVal: "Macintosh HD (512 GB SSD)",
    osVersion: "Versión de macOS",
    osVersionVal: "macOS Juanda (Versión 10.5)",
    serial: "Número de serie",
    serialVal: "JDA1050DANIELMX"
  },
  tutorial: {
    title: "Tutorial de Bienvenida",
    restart: "Volver a ver el tutorial"
  }
} as const;
