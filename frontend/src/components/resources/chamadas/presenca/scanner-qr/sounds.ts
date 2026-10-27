import errorSound from '@/assets/sounds/alert_error-03.wav'
import successSound from '@/assets/sounds/hero_simple-celebration-01.wav'
import loadingSound from '@/assets/sounds/ui_loading.wav'

export const loadingAudio = new Audio(loadingSound)
export const errorAudio = new Audio(errorSound)
export const successAudio = new Audio(successSound)

loadingAudio.load()
errorAudio.load()
successAudio.load()

const audios = [loadingAudio, errorAudio, successAudio]

export function playSound(audio: HTMLAudioElement) {
  for (const aud of audios) {
    aud.pause()
    aud.currentTime = 0
  }

  void audio.play()
}
