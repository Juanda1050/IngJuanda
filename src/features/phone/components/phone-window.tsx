import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { Phone, PhoneOff, User, Grid, Mail } from 'lucide-react'
import { FaGithub, FaLinkedin } from 'react-icons/fa'
import { cn } from '@/lib/utils'

export function PhoneWindow() {
  const { t } = useTranslation('common')
  const [activeTab, setActiveTab] = useState<'keypad' | 'contacts'>('keypad')
  const [dialedNumber, setDialedNumber] = useState('')
  const [callState, setCallState] = useState<'idle' | 'calling' | 'connected'>('idle')
  const [callSeconds, setCallSeconds] = useState(0)

  // Timer for active call
  useEffect(() => {
    let timer: any
    if (callState === 'connected') {
      timer = setInterval(() => {
        setCallSeconds((prev) => prev + 1)
      }, 1000)
    } else {
      setCallSeconds(0)
    }
    return () => clearInterval(timer)
  }, [callState])

  const formatTime = (totalSeconds: number) => {
    const mins = Math.floor(totalSeconds / 60)
    const secs = totalSeconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
  }

  const handleKeyPress = (char: string) => {
    if (dialedNumber.length < 15) {
      setDialedNumber((prev) => prev + char)
    }
  }

  const handleBackspace = () => {
    setDialedNumber((prev) => prev.slice(0, -1))
  }

  const startCall = (numberToCall: string) => {
    if (!numberToCall.trim()) return
    setCallState('calling')
    // Simulate connection after 1.5 seconds
    setTimeout(() => {
      setCallState('connected')
    }, 1500)
  }

  const endCall = () => {
    setCallState('idle')
  }

  const keypadButtons = [
    { num: '1', letters: ' ' },
    { num: '2', letters: 'A B C' },
    { num: '3', letters: 'D E F' },
    { num: '4', letters: 'G H I' },
    { num: '5', letters: 'J K L' },
    { num: '6', letters: 'M N O' },
    { num: '7', letters: 'P Q R S' },
    { num: '8', letters: 'T U V' },
    { num: '9', letters: 'W X Y Z' },
    { num: '*', letters: '' },
    { num: '0', letters: '+' },
    { num: '#', letters: '' },
  ]

  // Render Call Screen Overlay
  if (callState !== 'idle') {
    return (
      <div className="absolute inset-0 bg-[#1c1c1e] text-white flex flex-col items-center justify-between py-16 px-6 z-50 animate-fade-in">
        {/* Contact Info */}
        <div className="text-center space-y-2 mt-8">
          <div className="w-24 h-24 rounded-full bg-gray-600 flex items-center justify-center mx-auto text-4xl font-bold shadow-lg border border-white/10">
            {dialedNumber.includes('1050') || dialedNumber === 'Juan Daniel' ? (
              <img src="/profile.jpg" alt="Contact" className="w-full h-full rounded-full object-cover" />
            ) : (
              <User size={40} className="text-gray-300" />
            )}
          </div>
          <h2 className="text-2xl font-semibold tracking-tight mt-4">
            {dialedNumber === 'Juan Daniel' ? 'Juan Daniel Gonzalez' : dialedNumber}
          </h2>
          <p className="text-gray-400 text-sm font-medium">
            {callState === 'calling' ? t('phone.calling', 'calling...') : formatTime(callSeconds)}
          </p>
        </div>

        {/* Call Controls Grid */}
        <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
          {[
            { label: 'mute', icon: '🎤', active: false },
            { label: 'keypad', icon: '🔢', active: false },
            { label: 'speaker', icon: '🔊', active: true },
            { label: 'add call', icon: '➕', active: false },
            { label: 'FaceTime', icon: '📹', active: false },
            { label: 'contacts', icon: '👤', active: false },
          ].map((btn, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1.5">
              <button
                className={cn(
                  "w-14 h-14 rounded-full flex items-center justify-center text-xl transition-all active:scale-90",
                  btn.active ? "bg-white text-black" : "bg-white/10 text-white hover:bg-white/20"
                )}
                disabled
              >
                <span>{btn.icon}</span>
              </button>
              <span className="text-[10px] text-gray-400 font-medium capitalize">{btn.label}</span>
            </div>
          ))}
        </div>

        {/* Decline Button */}
        <button
          onClick={endCall}
          className="w-16 h-16 rounded-full bg-red-500 flex items-center justify-center active:scale-95 shadow-lg shadow-red-500/20 transition-all"
        >
          <PhoneOff size={28} className="text-white" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full bg-white dark:bg-black text-black dark:text-white select-none">
      
      {/* Content Area */}
      <div className="flex-1 overflow-y-auto px-6 py-4 flex flex-col justify-between min-h-0">
        {activeTab === 'keypad' ? (
          <div className="flex-1 flex flex-col justify-between py-4">
            {/* Number Display */}
            <div className="h-16 flex items-center justify-center relative px-4">
              <span className="text-3xl font-normal tracking-tight text-center truncate max-w-full font-mono">
                {dialedNumber}
              </span>
              {dialedNumber && (
                <button
                  onClick={handleBackspace}
                  className="absolute right-4 text-gray-400 hover:text-gray-600 active:scale-90 text-sm font-semibold p-1"
                >
                  ⌫
                </button>
              )}
            </div>

            {/* Dialer Keypad Grid */}
            <div className="grid grid-cols-3 gap-y-4 gap-x-6 mx-auto w-full max-w-[270px]">
              {keypadButtons.map((btn) => (
                <button
                  key={btn.num}
                  onClick={() => handleKeyPress(btn.num)}
                  className="w-16 h-16 rounded-full bg-gray-100 dark:bg-zinc-800/80 flex flex-col items-center justify-center active:bg-gray-200 dark:active:bg-zinc-700/80 transition-colors cursor-pointer"
                >
                  <span className="text-2xl font-normal leading-none">{btn.num}</span>
                  <span className="text-[8px] font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mt-0.5">
                    {btn.letters}
                  </span>
                </button>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-center items-center mt-6">
              <button
                onClick={() => startCall(dialedNumber)}
                disabled={!dialedNumber}
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center shadow-md transition-all active:scale-95",
                  dialedNumber
                    ? "bg-[#34c759] hover:bg-[#30b551] cursor-pointer"
                    : "bg-gray-200 dark:bg-zinc-800 text-gray-400 dark:text-zinc-600 cursor-default"
                )}
              >
                <Phone size={26} className="text-white fill-current" />
              </button>
            </div>
          </div>
        ) : (
          /* Contacts View */
          <div className="flex-1 flex flex-col pt-2">
            <h2 className="text-2xl font-bold mb-4 tracking-tight px-1">{t('phone.contacts', 'Contacts')}</h2>
            
            {/* Contact Card */}
            <div className="bg-gray-50 dark:bg-zinc-900 rounded-2xl p-4 border border-gray-100 dark:border-zinc-800/50 space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src="/profile.jpg"
                  alt="Juan Daniel"
                  className="w-14 h-14 rounded-full object-cover border border-gray-200 dark:border-zinc-700 shadow-sm"
                />
                <div>
                  <h3 className="font-bold text-base text-black dark:text-white leading-tight">Juan Daniel Gonzalez</h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Senior Fullstack Developer</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-gray-200/50 dark:border-zinc-800/50">
                <button
                  onClick={() => {
                    setDialedNumber('Juan Daniel')
                    startCall('Juan Daniel')
                  }}
                  className="flex items-center justify-center gap-2 rounded-xl bg-[#34c759] text-white py-2.5 text-xs font-semibold hover:bg-[#30b551] transition-all active:scale-95 cursor-pointer"
                >
                  <Phone size={14} className="fill-current" />
                  <span>{t('phone.call', 'Call')}</span>
                </button>
                <a
                  href="mailto:danielalejandre1050@gmail.com"
                  className="flex items-center justify-center gap-2 rounded-xl bg-blue-500 text-white py-2.5 text-xs font-semibold hover:bg-blue-600 transition-all active:scale-95"
                >
                  <Mail size={14} />
                  <span>{t('phone.email', 'Email')}</span>
                </a>
              </div>

              {/* Professional Links */}
              <div className="space-y-2 pt-2 border-t border-gray-200/50 dark:border-zinc-800/50">
                <a
                  href="https://github.com/Juanda1050"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-xs border border-gray-100 dark:border-zinc-900"
                >
                  <span className="font-medium flex items-center gap-2">
                    <FaGithub size={14} /> GitHub
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">Juanda1050</span>
                </a>
                <a
                  href="https://linkedin.com/in/daniel-alejandre"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl bg-white dark:bg-black hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors text-xs border border-gray-100 dark:border-zinc-900"
                >
                  <span className="font-medium flex items-center gap-2">
                    <FaLinkedin size={14} /> LinkedIn
                  </span>
                  <span className="text-gray-400 font-mono text-[10px]">daniel-alejandre</span>
                </a>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* iOS App Navigation Tab Bar */}
      <div className="h-16 shrink-0 border-t border-gray-200/70 dark:border-zinc-800/70 bg-gray-50/90 dark:bg-zinc-900/90 backdrop-blur-md flex items-center justify-around pb-2 z-10">
        <button
          onClick={() => setActiveTab('keypad')}
          className={cn(
            "flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer",
            activeTab === 'keypad' ? "text-[#34c759]" : "text-gray-400 dark:text-gray-500"
          )}
        >
          <Grid size={20} />
          <span>{t('phone.keypadTab', 'Keypad')}</span>
        </button>
        <button
          onClick={() => setActiveTab('contacts')}
          className={cn(
            "flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors cursor-pointer",
            activeTab === 'contacts' ? "text-[#34c759]" : "text-gray-400 dark:text-gray-500"
          )}
        >
          <User size={20} />
          <span>{t('phone.contactsTab', 'Contacts')}</span>
        </button>
      </div>

    </div>
  )
}
