export function formatTime(seconds: number): string {
 if (!seconds || isNaN(seconds))
 return '00:00';
 const min = Math.floor(seconds / 60).toString().padStart(2, '0');
 const sec = Math.floor(seconds % 60).toString().padStart(2, '0');
 return `${min}:${sec}`;
}
export function formatDuration(seconds: number): string {
 if (!seconds || isNaN(seconds))
 return '--:--';
 const hours = Math.floor(seconds / 3600);
 const minutes = Math.floor((seconds % 3600) / 60);
 const secs = Math.floor(seconds % 60);
 if (hours > 0) {
 return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
 }
 return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}
export function parseLyrics(lyrics: string): Array<{
 time: number;
 text: string;
}> {
 const lines = lyrics.split('\n');
 const result: Array<{
 time: number;
 text: string;
 }> = [];
 const regex = /\[(\d{2}):(\d{2})\.(\d{2,3})\]/;
 for (const line of lines) {
 const match = line.match(regex);
 if (match) {
 const minutes = parseInt(match[1], 10);
 const seconds = parseInt(match[2], 10);
 const milliseconds = parseInt(match[3], 10) * (match[3].length === 2 ? 10 : 1);
 const time = minutes * 60 + seconds + milliseconds / 1000;
 const text = line.replace(regex, '').trim();
 if (text) {
 result.push({ time, text });
 }
 }
 }
 return result.sort((a, b) => a.time - b.time);
}
export function getCurrentLyric(lyrics: Array<{
 time: number;
 text: string;
}>, currentTime: number): {
 currentIndex: number;
 currentText: string;
} {
 if (!lyrics || lyrics.length === 0) {
 return { currentIndex: -1, currentText: '' };
 }
 for (let i = lyrics.length - 1; i >= 0; i--) {
 if (currentTime >= lyrics[i].time) {
 return { currentIndex: i, currentText: lyrics[i].text };
 }
 }
 return { currentIndex: -1, currentText: '' };
}
