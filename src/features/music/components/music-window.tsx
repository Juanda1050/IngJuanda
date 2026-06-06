import { useState, useEffect, useRef, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { 
  Play, Pause, SkipForward, SkipBack, Volume2, VolumeX, 
  Search, Music, Radio, Disc, Sparkles, Heart, Clock, ListMusic
} from 'lucide-react'
import { useUiStore } from '@/store/ui-store'
import { cn } from '@/lib/utils'
import { formatWithAppleEmojis } from '@/components/apple-emoji'
import SPOTIFY_CACHE from '../data/spotify-cache.json'

interface Track {
  id: string
  title: string
  artist: string
  album: string
  duration: number // in seconds
  audioUrl: string
  coverGradient: string // CSS gradient class
  coverUrl?: string
}

interface Playlist {
  id: string
  name: string | { en: string; es: string }
  tracks: Track[]
  coverUrl?: string | undefined
  description?: string | undefined
}

const PREMIUM_GRADIENTS = [
  'from-zinc-950 via-zinc-800 to-zinc-900',
  'from-blue-950 via-indigo-900 to-zinc-900',
  'from-rose-950 via-pink-900 to-zinc-900',
  'from-amber-500 via-orange-600 to-red-700',
  'from-amber-400 via-yellow-500 to-orange-600',
  'from-neutral-900 via-stone-800 to-neutral-950',
  'from-red-950 via-neutral-900 to-black',
  'from-pink-400 via-rose-500 to-pink-600',
  'from-amber-400 via-emerald-600 to-sky-700',
  'from-purple-950 via-violet-900 to-zinc-900',
  'from-emerald-950 via-teal-900 to-zinc-900',
  'from-cyan-950 via-sky-900 to-zinc-900',
  'from-fuchsia-950 via-purple-900 to-zinc-900'
]

function getDeterministicGradient(id: string) {
  let hash = 0
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash)
  }
  const index = Math.abs(hash) % PREMIUM_GRADIENTS.length
  return PREMIUM_GRADIENTS[index]
}

function extractPlaylistId(input: string): string | null {
  const trimmed = input.trim()
  if (trimmed.length === 22 && /^[a-zA-Z0-9]+$/.test(trimmed)) {
    return trimmed
  }
  const match = trimmed.match(/\/playlist\/([a-zA-Z0-9]{22})/)
  if (match && match[1]) {
    return match[1]
  }
  return null
}

function SpotifyIcon({ className }: { className?: string }) {
  return (
    <svg 
      viewBox="0 0 24 24" 
      className={className} 
      fill="currentColor"
    >
      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.565.387-.86.207-2.377-1.454-5.37-1.783-8.893-.982-.336.076-.67-.135-.746-.47-.077-.337.135-.67.472-.747 3.856-.88 7.15-.506 9.82 1.13.295.18.387.563.207.862zm1.226-2.724c-.226.367-.707.487-1.074.26-2.72-1.672-6.87-2.157-10.08-1.182-.413.125-.847-.107-.972-.52-.125-.413.108-.847.52-.972 3.67-1.114 8.243-.574 11.345 1.336.368.227.49.707.26 1.078zm.105-2.832C14.502 8.84 8.88 8.653 5.623 9.642a1.002 1.002 0 01-1.22-.716 1.002 1.002 0 01.717-1.22c3.743-1.136 9.936-.923 13.884 1.42.396.236.527.75.292 1.147-.235.397-.75.528-1.147.295z"/>
    </svg>
  )
}

async function fetchSpotifyPlaylist(playlistId: string): Promise<Playlist> {
  const embedUrl = `https://open.spotify.com/embed/playlist/${playlistId}`
  const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(embedUrl)}`
  
  const res = await fetch(proxyUrl)
  if (!res.ok) {
    throw new Error(`Proxy request failed: ${res.status}`)
  }
  const html = await res.text()
  
  let match = html.match(/<script id="resource" type="application\/json">([^<]+)<\/script>/)
  if (!match) {
    match = html.match(/<script id="initial-state" type="application\/json">([^<]+)<\/script>/)
  }
  if (!match) {
    match = html.match(/<script id="__NEXT_DATA__" type="application\/json">([^<]+)<\/script>/)
  }
  
  if (!match || !match[1]) {
    throw new Error("Could not parse Spotify playlist HTML")
  }
  
  const data = JSON.parse(match[1])
  const state = data.props ? data.props.pageProps.state : data
  const entity = state.data ? state.data.entity : state.entity
  
  if (!entity) {
    throw new Error("Could not find playlist data")
  }
  
  let coverUrl = ''
  if (entity.coverArt && entity.coverArt.sources && entity.coverArt.sources.length > 0) {
    coverUrl = entity.coverArt.sources[0].url
  }
  
  const tracks = (entity.trackList || []).map((t: any) => ({
    id: t.uri,
    title: t.title,
    artist: t.subtitle || 'Unknown Artist',
    album: entity.name || '',
    duration: Math.round(t.duration / 1000),
    audioUrl: t.audioPreview ? t.audioPreview.url : '',
    coverGradient: getDeterministicGradient(t.uri),
    coverUrl: coverUrl
  }))
  
  return {
    id: playlistId,
    name: entity.name,
    description: entity.subtitle || '',
    coverUrl: coverUrl,
    tracks: tracks
  }
}

export function MusicWindow() {
  const { t, i18n } = useTranslation('common')
  const isEn = i18n.language === 'en'

  // Global window state listener to pause audio if music app minimized/closed
  const musicAppState = useUiStore((state) => state.apps.music.state)

  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPlaylistId, setSelectedPlaylistId] = useState('0ccS7amNmG3WVrhPuNSUXv')

  // Custom Playlists (persistent via localStorage)
  const [customPlaylists, setCustomPlaylists] = useState<Playlist[]>(() => {
    try {
      const saved = localStorage.getItem('ing_juanda_custom_playlists')
      return saved ? JSON.parse(saved) : []
    } catch {
      return []
    }
  })

  // Live session fetched playlists data to refresh cache or custom playlists at runtime
  const [livePlaylistsData, setLivePlaylistsData] = useState<Record<string, Playlist>>({})
  const [isLoadingLive, setIsLoadingLive] = useState(false)

  // Importer states
  const [importUrl, setImportUrl] = useState('')
  const [importLoading, setImportLoading] = useState(false)
  const [importError, setImportError] = useState<string | null>(null)

  // Premium Warning/Success overlays
  const [warningMessage, setWarningMessage] = useState<string | null>(null)

  // Audio Playback States
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const volumeRaw = useUiStore((state) => state.volume)
  const setVolumeRaw = useUiStore((state) => state.setVolume)
  const isMuted = useUiStore((state) => state.muted)
  const setIsMuted = useUiStore((state) => state.setMuted)
  const volume = volumeRaw / 100
  const setVolume = (val: number) => setVolumeRaw(val * 100)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const progressBarRef = useRef<HTMLInputElement>(null)

  // Compile full playlists list
  const playlists: Playlist[] = useMemo(() => {
    const cached: Playlist[] = (SPOTIFY_CACHE as any[]).map(pl => ({
      id: pl.id,
      name: pl.name,
      coverUrl: pl.coverUrl,
      description: pl.description,
      tracks: pl.tracks.map((t: any) => ({
        id: t.id,
        title: t.title,
        artist: t.artist,
        album: t.album,
        duration: t.duration,
        audioUrl: t.audioUrl,
        coverGradient: getDeterministicGradient(t.id),
        coverUrl: pl.coverUrl
      }))
    }))

    const custom: Playlist[] = customPlaylists.map(pl => ({
      id: pl.id,
      name: pl.name,
      coverUrl: pl.coverUrl,
      description: pl.description,
      tracks: pl.tracks.map((t: any) => ({
        ...t,
        coverUrl: pl.coverUrl
      }))
    }))

    return [...custom, ...cached]
  }, [customPlaylists])

  const getPlaylistName = (playlist: Playlist | null, isEnglish: boolean) => {
    if (!playlist) return ''
    if (typeof playlist.name === 'string') {
      return playlist.name
    }
    return isEnglish ? playlist.name.en : playlist.name.es
  }

  // Memoized active playlist selection (priority to Live API data)
  const activePlaylist = useMemo(() => {
    if (livePlaylistsData[selectedPlaylistId]) {
      return livePlaylistsData[selectedPlaylistId]
    }
    return playlists.find(pl => pl.id === selectedPlaylistId) || playlists[0]!
  }, [playlists, selectedPlaylistId, livePlaylistsData])

  const filteredTracks = useMemo(() => {
    const search = searchQuery.toLowerCase()
    if (!activePlaylist || !activePlaylist.tracks) return []
    return activePlaylist.tracks.filter(
      track => track.title.toLowerCase().includes(search) || track.artist.toLowerCase().includes(search)
    )
  }, [activePlaylist, searchQuery])

  // Live playlist background updater effect
  useEffect(() => {
    const isSpotifyId = selectedPlaylistId.length === 22 && /^[a-zA-Z0-9]+$/.test(selectedPlaylistId)
    if (!isSpotifyId) return
    if (livePlaylistsData[selectedPlaylistId]) return

    let active = true
    const fetchLatest = async () => {
      setIsLoadingLive(true)
      try {
        const data = await fetchSpotifyPlaylist(selectedPlaylistId)
        if (active) {
          setLivePlaylistsData(prev => ({
            ...prev,
            [selectedPlaylistId]: data
          }))
        }
      } catch (err) {
        console.warn("Failed to fetch live playlist data, using cache:", err)
      } finally {
        if (active) {
          setIsLoadingLive(false)
        }
      }
    }

    fetchLatest()
    return () => {
      active = false
    }
  }, [selectedPlaylistId, livePlaylistsData])

  // Initialize audio object
  useEffect(() => {
    audioRef.current = new Audio()
    
    const handleTimeUpdate = () => {
      if (audioRef.current) {
        setCurrentTime(audioRef.current.currentTime)
      }
    }

    const handleEnded = () => {
      handleNextTrackRef.current()
    }

    audioRef.current.addEventListener('timeupdate', handleTimeUpdate)
    audioRef.current.addEventListener('ended', handleEnded)

    return () => {
      if (audioRef.current) {
        audioRef.current.removeEventListener('timeupdate', handleTimeUpdate)
        audioRef.current.removeEventListener('ended', handleEnded)
        audioRef.current.pause()
      }
    }
  }, []) // Mount-only initialization!

  // Sync volume state to audio element
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Sync track URL and play state
  useEffect(() => {
    if (audioRef.current && currentTrack) {
      const isSameTrack = audioRef.current.src === currentTrack.audioUrl
      
      if (!isSameTrack && currentTrack.audioUrl) {
        audioRef.current.src = currentTrack.audioUrl
        audioRef.current.load()
      }

      if (isPlaying && currentTrack.audioUrl) {
        audioRef.current.play().catch(() => {
          setIsPlaying(false)
        })
      } else {
        audioRef.current.pause()
      }
    }
  }, [currentTrack, isPlaying])

  // Automatically pause if Music app window is minimized or closed
  useEffect(() => {
    if (musicAppState !== 'open' && isPlaying) {
      setIsPlaying(false)
      audioRef.current?.pause()
    }
  }, [musicAppState])

  // Clear warning toast timer
  useEffect(() => {
    if (warningMessage) {
      const timer = setTimeout(() => setWarningMessage(null), 4000)
      return () => clearTimeout(timer)
    }
  }, [warningMessage])

  // Importer handler
  const handleImportPlaylist = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!importUrl) return
    
    setImportLoading(true)
    setImportError(null)
    
    const id = extractPlaylistId(importUrl)
    if (!id) {
      setImportError(isEn ? 'Invalid Spotify playlist URL' : 'URL de playlist inválida')
      setImportLoading(false)
      return
    }
    
    try {
      const playlist = await fetchSpotifyPlaylist(id)
      
      // Update custom list state & persist
      setCustomPlaylists(prev => {
        const filtered = prev.filter(p => p.id !== playlist.id)
        const updated = [playlist, ...filtered]
        try {
          localStorage.setItem('ing_juanda_custom_playlists', JSON.stringify(updated))
        } catch (err) {
          console.warn("Could not save custom playlists to localStorage:", err)
        }
        return updated
      })

      // Add to session cache to avoid redundant network hits
      setLivePlaylistsData(prev => ({
        ...prev,
        [playlist.id]: playlist
      }))
      
      setSelectedPlaylistId(playlist.id)
      setImportUrl('')
      setWarningMessage(t('music.sidebar.loadSuccess'))
    } catch (err: any) {
      console.error("Importer failed:", err)
      setImportError(t('music.sidebar.invalidUrl'))
    } finally {
      setImportLoading(false)
    }
  };

  // Playback handlers
  const handlePlayPause = () => {
    if (!currentTrack) {
      // Pick first playable track if none playing
      const firstPlayable = activePlaylist?.tracks.find(t => t.audioUrl)
      if (firstPlayable) {
        setCurrentTrack(firstPlayable)
        setIsPlaying(true)
      } else {
        setWarningMessage(t('music.player.noPlayable', isEn ? "No playable audio previews found in this playlist." : "No se encontraron adelantos de audio reproducibles en esta lista."))
      }
    } else {
      setIsPlaying(prev => !prev)
    }
  }

  const handleTrackSelect = (track: Track) => {
    if (!track.audioUrl) {
      setWarningMessage(t('music.player.noPreview', isEn ? "Spotify does not provide a 30-second audio preview for this track." : "Spotify no proporciona un adelanto de audio de 30 segundos para esta canción."))
      return
    }

    if (currentTrack?.id === track.id) {
      setIsPlaying(prev => !prev)
    } else {
      setCurrentTrack(track)
      setCurrentTime(0)
      setIsPlaying(true)
    }
  }

  const handleNextTrack = () => {
    const currentList = activePlaylist?.tracks || []
    if (!currentTrack || currentList.length === 0) return

    const currentIndex = currentList.findIndex(t => t.id === currentTrack.id)
    // Find next track with audio preview (looping once)
    let nextIndex = (currentIndex + 1) % currentList.length
    let attempts = 0
    
    while (attempts < currentList.length) {
      const nextTrack = currentList[nextIndex]
      if (nextTrack && nextTrack.audioUrl) {
        setCurrentTrack(nextTrack)
        setCurrentTime(0)
        setIsPlaying(true)
        return
      }
      nextIndex = (nextIndex + 1) % currentList.length
      attempts++
    }
  }

  const handlePrevTrack = () => {
    const currentList = activePlaylist?.tracks || []
    if (!currentTrack || currentList.length === 0) return

    const currentIndex = currentList.findIndex(t => t.id === currentTrack.id)
    // Find previous track with audio preview
    let prevIndex = currentIndex - 1
    if (prevIndex < 0) prevIndex = currentList.length - 1
    let attempts = 0

    while (attempts < currentList.length) {
      const prevTrack = currentList[prevIndex]
      if (prevTrack && prevTrack.audioUrl) {
        setCurrentTrack(prevTrack)
        setCurrentTime(0)
        setIsPlaying(true)
        return
      }
      prevIndex = prevIndex - 1
      if (prevIndex < 0) prevIndex = currentList.length - 1
      attempts++
    }
  }

  const handleNextTrackRef = useRef(handleNextTrack)
  useEffect(() => {
    handleNextTrackRef.current = handleNextTrack
  }, [handleNextTrack])

  const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value)
    setCurrentTime(val)
    if (audioRef.current) {
      audioRef.current.currentTime = val
    }
  }

  // Formatting helpers
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60)
    const s = Math.floor(secs % 60)
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  // Equalizer visual animation helper
  function EqualizerAnimation({ active }: { active: boolean }) {
    const barsCount = 4
    const [heights, setHeights] = useState<number[]>([12, 12, 12, 12])

    useEffect(() => {
      if (!active) {
        setHeights([12, 12, 12, 12])
        return
      }

      const interval = setInterval(() => {
        setHeights(
          Array.from({ length: barsCount }).map(() => Math.floor(Math.random() * 14) + 4)
        )
      }, 100)

      return () => clearInterval(interval)
    }, [active])

    return (
      <div className="flex items-end gap-0.5 size-4 h-3.5 shrink-0 justify-center">
        {heights.map((h, i) => (
          <span
            key={i}
            className="w-[2.5px] bg-red-500 rounded-sm transition-all duration-100 ease-out"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>
    )
  }

  return (
    <div className="flex h-full w-full bg-[#f4f3f4] dark:bg-[#1f1e1f] text-foreground font-sans text-sm select-none relative">
      
      {/* Warnings & Success Notification overlay */}
      {warningMessage && (
        <div className="absolute bottom-4 right-4 z-50 bg-[#1db954] text-white border border-[#1db954]/20 rounded-lg px-4 py-2.5 text-xs font-semibold shadow-xl backdrop-blur flex items-center gap-2 animate-in fade-in slide-in-from-bottom-2 duration-300">
          <Music className="size-4 shrink-0 animate-pulse" />
          <span>{formatWithAppleEmojis(warningMessage)}</span>
        </div>
      )}

      {/* Sidebar navigation */}
      <div className="w-52 shrink-0 border-r border-border/50 bg-[#e7e6e7] dark:bg-[#2c2b2c] p-3 flex flex-col justify-between min-h-0">
        
        {/* Scrollable Categories List */}
        <div className="space-y-5 flex-1 overflow-y-auto pr-1">
          {/* Mock Search */}
          <div className="relative flex items-center">
            <Search className="absolute left-2 size-3.5 text-muted-foreground/60" />
            <input
              type="text"
              placeholder={t('music.sidebar.search', isEn ? "Search..." : "Buscar...")}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-md border-0 bg-background/50 dark:bg-black/20 py-1 pl-7 pr-3 text-xs outline-none placeholder:text-muted-foreground/60 focus:bg-background/80 text-foreground transition-all"
            />
          </div>

          {/* Apple Music Navigation Categories */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider px-2">Apple Music</h4>
            {[
              { id: 'listen', label: t('music.sidebar.listenNow', isEn ? 'Listen Now' : 'Escuchar'), icon: <Disc className="size-4 text-red-500" /> },
              { id: 'browse', label: t('music.sidebar.browse', isEn ? 'Browse' : 'Explorar'), icon: <Sparkles className="size-4 text-red-500" /> },
              { id: 'radio', label: t('music.sidebar.radio', isEn ? 'Radio' : 'Radio'), icon: <Radio className="size-4 text-red-500" /> }
            ].map(item => (
              <button
                key={item.id}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-xs font-semibold text-muted-foreground/90 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Library Category */}
          <div className="space-y-1">
            <h4 className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider px-2">{t('music.sidebar.library')}</h4>
            {[
              { id: 'recent', label: t('music.sidebar.recentlyAdded'), icon: <Clock className="size-4 text-red-500" /> },
              { id: 'artists', label: t('music.sidebar.artists'), icon: <Heart className="size-4 text-red-500" /> },
              { id: 'albums', label: t('music.sidebar.albums'), icon: <Disc className="size-4 text-red-500" /> }
            ].map(item => (
              <button
                key={item.id}
                className="flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-xs font-semibold text-muted-foreground/90 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 transition-colors text-left"
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Playlists Category */}
          <div className="space-y-1">
            <div className="flex items-center justify-between px-2">
              <h4 className="text-[10px] font-bold text-muted-foreground/75 uppercase tracking-wider">{t('music.sidebar.playlists')}</h4>
              {isLoadingLive && (
                <span className="size-2 bg-green-500 rounded-full animate-ping" title="Syncing Spotify..." />
              )}
            </div>
            {playlists.map(pl => (
              <button
                key={pl.id}
                onClick={() => {
                  setSelectedPlaylistId(pl.id)
                  setSearchQuery('')
                }}
                className={cn(
                  "flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-xs font-semibold text-left transition-colors truncate",
                  selectedPlaylistId === pl.id
                    ? "bg-[#d8d6d8] dark:bg-[#3d3c3d] text-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5"
                )}
              >
                <ListMusic className="size-4 text-red-500 shrink-0" />
                <span className="truncate">{getPlaylistName(pl, isEn)}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Fixed Footer Area (Importer & Spotify Profile Card) */}
        <div className="mt-4 pt-3 border-t border-border/30 dark:border-white/10 shrink-0 space-y-3">
          
          {/* Import Playlist Form */}
          <form onSubmit={handleImportPlaylist} className="space-y-1">
            <span className="text-[9px] font-bold text-muted-foreground/75 uppercase tracking-wider px-1">
              {t('music.sidebar.importPlaylist')}
            </span>
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder={t('music.sidebar.inputPlaceholder')}
                value={importUrl}
                onChange={(e) => {
                  setImportUrl(e.target.value)
                  setImportError(null)
                }}
                disabled={importLoading}
                className="w-full rounded-md border-0 bg-background/50 dark:bg-black/20 py-1.5 px-2.5 pr-7 text-[11px] outline-none placeholder:text-muted-foreground/60 focus:bg-background/80 text-foreground transition-all border border-transparent focus:border-red-500/30"
              />
              <button
                type="submit"
                disabled={importLoading}
                className="absolute right-1.5 size-5 flex items-center justify-center rounded-md hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground transition-colors"
              >
                {importLoading ? (
                  <span className="size-2.5 border-2 border-muted-foreground border-t-transparent rounded-full animate-spin" />
                ) : (
                  <span className="text-xs font-bold leading-none">+</span>
                )}
              </button>
            </div>
            {importError && (
              <p className="text-[9px] text-red-500 font-semibold px-1 truncate">{importError}</p>
            )}
          </form>

          {/* Profile Card */}
          <a
            href="https://open.spotify.com/user/ter2fe0yczy0loix9utqtbgwa?si=3ae0dec0bd68416e"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2.5 p-2 rounded-lg bg-black/5 dark:bg-black/20 border border-border/30 dark:border-white/5 hover:bg-black/10 dark:hover:bg-white/5 transition-all group cursor-pointer"
          >
            <div className="size-8 rounded-full bg-[#1db954] text-white flex items-center justify-center shrink-0 shadow-sm group-hover:scale-105 transition-transform">
              <SpotifyIcon className="size-4.5" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-foreground/90 truncate leading-tight group-hover:text-[#1db954] transition-colors">Juanda</p>
              <p className="text-[9px] text-muted-foreground/80 font-bold truncate mt-0.5">{t('music.sidebar.spotifyProfile')}</p>
            </div>
          </a>

        </div>

      </div>

      {/* Right / Content Side */}
      <div className="flex-1 flex flex-col min-w-0 bg-background dark:bg-[#1a191a] relative">
        
        {/* Apple Music Header Dashboard (Unified Now Playing & System controls) */}
        <div className="h-16 shrink-0 border-b border-border/40 bg-[#f4f3f4]/80 dark:bg-[#1f1e1f]/80 backdrop-blur-md px-4 flex items-center justify-between gap-4 z-10 select-none">
          {/* Prev/Play/Next Buttons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={handlePrevTrack}
              disabled={!currentTrack}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              aria-label="Previous track"
            >
              <SkipBack className="size-4.5 fill-current" />
            </button>
            <button
              onClick={handlePlayPause}
              className="flex size-9 items-center justify-center rounded-lg bg-black/5 dark:bg-white/5 text-foreground hover:scale-105 active:scale-95 transition-all shadow-sm"
              aria-label={isPlaying ? 'Pause' : 'Play'}
            >
              {isPlaying ? <Pause className="size-5 fill-current" /> : <Play className="size-5 fill-current ml-0.5" />}
            </button>
            <button
              onClick={handleNextTrack}
              disabled={!currentTrack}
              className="flex size-8 items-center justify-center rounded-lg text-muted-foreground/80 hover:text-foreground hover:bg-black/5 dark:hover:bg-white/5 disabled:opacity-30 disabled:hover:bg-transparent transition-all"
              aria-label="Next track"
            >
              <SkipForward className="size-4.5 fill-current" />
            </button>
          </div>

          {/* Now Playing visual hub */}
          <div className="flex-1 max-w-lg bg-background dark:bg-black/25 border border-border/50 rounded-lg p-1.5 flex items-center gap-3 relative shadow-inner overflow-hidden select-none min-w-0">
            {currentTrack ? (
              <>
                {/* Small rotating Cover */}
                <div className={cn(
                  "size-10 rounded-md bg-gradient-to-br shrink-0 shadow flex items-center justify-center transition-transform border border-white/10 overflow-hidden relative",
                  !currentTrack.coverUrl && currentTrack.coverGradient,
                  isPlaying ? "animate-spin" : ""
                )}
                style={{ animationDuration: '24s' }}
                >
                  {currentTrack.coverUrl ? (
                    <img 
                      src={currentTrack.coverUrl} 
                      alt={currentTrack.title}
                      className="absolute inset-0 size-full object-cover"
                    />
                  ) : (
                    <Music className="size-5 text-white/50" />
                  )}
                </div>
                
                {/* Title & Artist & Time slider */}
                <div className="flex-1 min-w-0 flex flex-col justify-between h-10 select-none">
                  <div className="flex items-baseline justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold truncate text-foreground/90">{currentTrack.title}</p>
                      <p className="text-[9px] text-muted-foreground truncate font-semibold">{currentTrack.artist} — {currentTrack.album}</p>
                    </div>
                    {/* Time ticks */}
                    <span className="text-[9px] font-bold text-muted-foreground/70 shrink-0">
                      -{formatTime(currentTrack.duration - currentTime)}
                    </span>
                  </div>
                  
                  {/* Timeline progress line */}
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] font-bold text-muted-foreground/60 shrink-0">
                      {formatTime(currentTime)}
                    </span>
                    <input
                      ref={progressBarRef}
                      type="range"
                      min={0}
                      max={currentTrack.duration}
                      value={currentTime}
                      onChange={handleProgressChange}
                      className="flex-1 h-1 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none"
                    />
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-2 text-xs text-muted-foreground font-semibold italic py-2">
                <Music className="size-4 text-muted-foreground/45 animate-pulse" />
                <span>{isEn ? 'Not Playing' : 'Sin Reproducir'}</span>
              </div>
            )}
          </div>

          {/* Volume controls */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="flex size-7 items-center justify-center rounded hover:bg-black/5 dark:hover:bg-white/5 text-muted-foreground hover:text-foreground"
              aria-label="Mute toggle"
            >
              {isMuted || volume === 0 ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
            </button>
            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={volume}
              onChange={(e) => {
                setVolume(parseFloat(e.target.value))
                setIsMuted(false)
              }}
              className="w-16 h-1 bg-muted-foreground/20 rounded-lg appearance-none cursor-pointer accent-red-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Tracks view area */}
        <div className="flex-1 p-6 overflow-y-auto select-none bg-background dark:bg-[#1a191a]">
          
          {/* Playlist Intro Banner */}
          <div className="flex items-end gap-6 mb-6">
            <div className={cn(
              "size-24 md:size-28 rounded-xl shadow-lg bg-gradient-to-br flex items-center justify-center border border-white/10 select-none shrink-0 relative overflow-hidden",
              !activePlaylist?.coverUrl && (activePlaylist?.tracks[0]?.coverGradient || 'from-red-500 to-rose-600')
            )}>
              {activePlaylist?.coverUrl ? (
                <img 
                  src={activePlaylist.coverUrl} 
                  alt={getPlaylistName(activePlaylist, isEn)}
                  className="absolute inset-0 size-full object-cover z-0" 
                />
              ) : (
                <>
                  <div className="absolute inset-0 bg-black/10 backdrop-blur-[1px]" />
                  <ListMusic className="size-12 text-white/80 z-10" />
                </>
              )}
            </div>
            
            <div className="space-y-1 md:space-y-2 select-none min-w-0">
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-red-500">{t('music.sidebar.playlists').slice(0, -1)}</span>
              <h2 className="text-xl md:text-2xl font-extrabold tracking-tight text-foreground/90 truncate leading-none">
                {getPlaylistName(activePlaylist, isEn)}
              </h2>
              <p className="text-xs text-muted-foreground font-semibold">
                {activePlaylist?.description || (isEn ? 'Featuring tracks from Bad Bunny, Drake, Kendrick, and Tyler.' : 'Incluye pistas de Bad Bunny, Drake, Kendrick y Tyler.')}
              </p>
              <p className="text-[10px] text-muted-foreground/60 font-bold">
                {filteredTracks.length} {t('music.sidebar.songs').toLowerCase()} • {formatTime(filteredTracks.reduce((acc, t) => acc + t.duration, 0))}
              </p>
            </div>
          </div>

          {/* Audio Sound warning reminder label */}
          <div className="mb-4 bg-red-500/10 dark:bg-red-500/5 text-red-500 border border-red-500/20 rounded-lg px-3 py-2 text-xs font-semibold select-none flex items-center gap-2">
            <Music className="size-3.5 shrink-0" />
            <span>
              {isEn 
                ? 'Click play on any song with an audio preview. Double-click to listen.' 
                : 'Haz clic en reproducir en cualquier canción con adelanto de audio. Doble clic para escuchar.'}
            </span>
          </div>

          {/* Tracks list table grid */}
          <div className="space-y-0.5 border-t border-border/20 pt-2">
            
            {/* Header row labels */}
            <div className="grid grid-cols-[30px_1fr_1fr_50px] gap-2 px-3 py-1 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-wider select-none">
              <span>#</span>
              <span>{t('music.headers.title')}</span>
              <span>{t('music.headers.album')}</span>
              <span className="flex justify-end"><Clock className="size-3.5" /></span>
            </div>

            {/* List items */}
            {filteredTracks.length === 0 ? (
              <div className="py-12 text-center text-xs text-muted-foreground italic">
                {isEn ? 'No songs found in this playlist' : 'No se encontraron canciones en esta lista'}
              </div>
            ) : (
              filteredTracks.map((track, index) => {
                const isCurrent = currentTrack?.id === track.id
                const isPlayingThis = isCurrent && isPlaying
                const hasPreview = !!track.audioUrl

                return (
                  <button
                    key={track.id ? track.id : `track-${index}`}
                    onDoubleClick={() => handleTrackSelect(track)}
                    onClick={() => handleTrackSelect(track)}
                    className={cn(
                      "w-full grid grid-cols-[30px_1fr_1fr_50px] gap-2 items-center px-3 py-2 text-xs text-left rounded-lg transition-all border border-transparent select-none",
                      isCurrent
                        ? "bg-red-500/10 dark:bg-red-500/5 text-red-500 border-red-500/25"
                        : "hover:bg-black/5 dark:hover:bg-white/5 text-foreground/80 hover:text-foreground",
                      !hasPreview && "opacity-50 hover:opacity-70 cursor-not-allowed"
                    )}
                  >
                    {/* Index or active playing indicator waves */}
                    <span className="font-semibold text-muted-foreground/60 pl-1 shrink-0 flex items-center justify-start">
                      {isCurrent ? (
                        <EqualizerAnimation active={isPlayingThis} />
                      ) : (
                        index + 1
                      )}
                    </span>

                    {/* Artwork cover & Title details */}
                    <div className="flex items-center gap-2.5 min-w-0 select-none">
                      <div className={cn(
                        "size-7 rounded bg-gradient-to-br shrink-0 flex items-center justify-center font-bold text-[8px] text-white/50 border border-white/5 overflow-hidden relative",
                        !activePlaylist?.coverUrl && track.coverGradient
                      )}>
                        {activePlaylist?.coverUrl ? (
                          <img 
                            src={activePlaylist.coverUrl} 
                            alt={track.title}
                            className="absolute inset-0 size-full object-cover"
                          />
                        ) : (
                          <span>{track.title[0]}</span>
                        )}
                      </div>
                      <div className="min-w-0">
                        <p className={cn("font-bold truncate text-[12px]", isCurrent ? "text-red-500" : "text-foreground/90")}>
                          {track.title}
                        </p>
                        <p className="text-[10px] text-muted-foreground truncate font-semibold mt-0.5">{track.artist}</p>
                      </div>
                    </div>

                    {/* Album */}
                    <span className="text-muted-foreground truncate select-none">{track.album}</span>

                    {/* Duration */}
                    <span className="text-muted-foreground font-semibold flex justify-end pr-1 select-none">
                      {formatTime(track.duration)}
                    </span>
                  </button>
                )
              })
            )}
          </div>

        </div>

      </div>

    </div>
  )
}
