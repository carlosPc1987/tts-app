import { useEffect, useRef } from 'react'

const BackgroundMusic = ({ enabled = true }) => {
  const audioContextRef = useRef(null)
  const timeoutRef = useRef(null)
  const melodyIndexRef = useRef(0)

  useEffect(() => {
    if (!enabled) {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
      return
    }

    try {
      const audioContext = new (window.AudioContext || window.webkitAudioContext)()
      audioContextRef.current = audioContext

      const masterGain = audioContext.createGain()
      masterGain.gain.setValueAtTime(0.15, audioContext.currentTime) // Volumen bajo (15%)
      masterGain.connect(audioContext.destination)

      // Melodía clásica con piano (notas suaves tipo Chopin/Beethoven)
      const melodies = [
        // Melodía 1: Clásica suave (escala mayor)
        [
          { freq: 261.63, duration: 0.8 }, // C4
          { freq: 293.66, duration: 0.6 }, // D4
          { freq: 329.63, duration: 0.8 }, // E4
          { freq: 349.23, duration: 0.6 }, // F4
          { freq: 392.00, duration: 1.0 }, // G4
          { freq: 349.23, duration: 0.8 }, // F4
          { freq: 329.63, duration: 0.6 }, // E4
          { freq: 293.66, duration: 1.2 }, // D4
          { freq: 261.63, duration: 1.5 }, // C4
        ],
        // Melodía 2: Variación clásica (arpegio)
        [
          { freq: 196.00, duration: 0.7 }, // G3
          { freq: 220.00, duration: 0.7 }, // A3
          { freq: 246.94, duration: 0.7 }, // B3
          { freq: 261.63, duration: 0.9 }, // C4
          { freq: 293.66, duration: 0.9 }, // D4
          { freq: 329.63, duration: 1.1 }, // E4
          { freq: 293.66, duration: 0.8 }, // D4
          { freq: 261.63, duration: 0.8 }, // C4
          { freq: 246.94, duration: 0.7 }, // B3
          { freq: 220.00, duration: 1.0 }, // A3
          { freq: 196.00, duration: 1.3 }, // G3
        ],
        // Melodía 3: Suave y melódica
        [
          { freq: 220.00, duration: 0.8 }, // A3
          { freq: 246.94, duration: 0.6 }, // B3
          { freq: 261.63, duration: 0.8 }, // C4
          { freq: 293.66, duration: 0.7 }, // D4
          { freq: 329.63, duration: 0.9 }, // E4
          { freq: 349.23, duration: 0.8 }, // F4
          { freq: 392.00, duration: 1.0 }, // G4
          { freq: 349.23, duration: 0.7 }, // F4
          { freq: 329.63, duration: 0.7 }, // E4
          { freq: 293.66, duration: 0.9 }, // D4
          { freq: 261.63, duration: 1.1 }, // C4
        ],
        // Melodía 4: Clásica tranquila
        [
          { freq: 174.61, duration: 0.9 }, // F3
          { freq: 196.00, duration: 0.7 }, // G3
          { freq: 220.00, duration: 0.8 }, // A3
          { freq: 246.94, duration: 0.7 }, // B3
          { freq: 261.63, duration: 0.9 }, // C4
          { freq: 293.66, duration: 1.0 }, // D4
          { freq: 261.63, duration: 0.8 }, // C4
          { freq: 246.94, duration: 0.7 }, // B3
          { freq: 220.00, duration: 0.8 }, // A3
          { freq: 196.00, duration: 1.0 }, // G3
          { freq: 174.61, duration: 1.2 }, // F3
        ],
      ]

      const playNote = (note, startTime) => {
        const oscillator = audioContext.createOscillator()
        const gainNode = audioContext.createGain()

        // Usar onda más suave para sonido tipo piano
        oscillator.type = 'sine'
        oscillator.frequency.setValueAtTime(note.freq, startTime)

        // Envolvente suave tipo piano
        gainNode.gain.setValueAtTime(0, startTime)
        gainNode.gain.linearRampToValueAtTime(0.4, startTime + 0.1) // Ataque rápido
        gainNode.gain.linearRampToValueAtTime(0.3, startTime + note.duration * 0.3) // Decaimiento
        gainNode.gain.linearRampToValueAtTime(0.2, startTime + note.duration - 0.2) // Sostenido
        gainNode.gain.linearRampToValueAtTime(0, startTime + note.duration) // Liberación

        oscillator.connect(gainNode)
        gainNode.connect(masterGain)

        oscillator.start(startTime)
        oscillator.stop(startTime + note.duration)
      }

      const playMelody = () => {
        if (!enabled || !audioContextRef.current) return

        const audioContext = audioContextRef.current
        const melody = melodies[melodyIndexRef.current % melodies.length]
        const startTime = audioContext.currentTime
        let currentTime = startTime

        melody.forEach((note) => {
          playNote(note, currentTime)
          currentTime += note.duration + 0.1 // Pausa corta entre notas
        })

        const totalDuration = currentTime - startTime
        timeoutRef.current = setTimeout(() => {
          melodyIndexRef.current = (melodyIndexRef.current + 1) % melodies.length
          playMelody()
        }, (totalDuration + 2) * 1000) // Pausa de 2 segundos entre melodías
      }

      playMelody()

    } catch (error) {
      console.log('Audio de fondo no disponible:', error)
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {})
        audioContextRef.current = null
      }
    }
  }, [enabled])

  return null
}

export default BackgroundMusic
