export const emojiToIconMap: Record<string, string> = {
  '🎵': 'music',
  '🎶': 'music',
  '🎨': 'palette',
  '📁': 'folder',
  '📂': 'folder-open',
  '🔊': 'volume',
  '🔇': 'volume-off',
  '🔔': 'bell',
  '🔐': 'shield',
  '🔒': 'lock',
  '⚠️': 'warning',
  '👤': 'user',
  '😊': 'user',
  '😎': 'user',
  '🤓': 'user',
  '🎭': 'user',
  '🎸': 'guitar',
  '🎹': 'piano',
  '🎤': 'mic',
  '🎧': 'headphones',
  '⏱️': 'clock',
  '📊': 'bar-chart',
  '🔍': 'search',
  '💻': 'code',
  '📞': 'phone',
  '🌐': 'globe',
  '📜': 'file',
  '❤️': 'heart',
  '💬': 'message',
  '📦': 'package',
  '✕': 'close',
  '→': 'arrow-right',
  '←': 'arrow-left'
};

export function getIconName(emoji: string): string {
  return emojiToIconMap[emoji] || 'music';
}