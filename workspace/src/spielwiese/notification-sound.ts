let audioContext: AudioContext | null = null;

/** Kurzer Piepton über die Web Audio API */
export function playNotificationSound() {
  audioContext ??= new AudioContext();

  // Browser starten Audio erst nach einer Benutzer-Interaktion
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();

  oscillator.frequency.value = 880;
  gain.gain.setValueAtTime(0.15, audioContext.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.2);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);

  oscillator.start();
  oscillator.stop(audioContext.currentTime + 0.2);
}
