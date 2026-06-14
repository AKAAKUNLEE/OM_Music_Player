import { ref, computed, watch } from 'vue';
export interface Song {
 id: string;
 name: string;
 artist: string;
 album: string;
 duration: number;
 url: string;
 cover?: string;
 lyrics?: string;
}
const playlist = ref<Song[]>([]);
const currentIndex = ref(-1);
const isPlaying = ref(false);
const currentTime = ref(0);
const duration = ref(0);
const volume = ref(0.7);
const isMuted = ref(false);
const repeatMode = ref<'list' | 'single' | 'random'>('list');
const isDarkMode = ref(false);
const showLyrics = ref(false);
const currentSong = computed(() => {
 return playlist.value[currentIndex.value] || null;
});
function addSongs(songs: Song[]) {
 playlist.value.push(...songs);
 if (currentIndex.value === -1 && songs.length > 0) {
 currentIndex.value = playlist.value.length - songs.length;
 }
}
function removeSong(index: number) {
 if (index < 0 || index >= playlist.value.length)
 return;
 playlist.value.splice(index, 1);
 if (currentIndex.value >= playlist.value.length) {
 currentIndex.value = Math.max(0, playlist.value.length - 1);
 }
}
function clearPlaylist() {
 playlist.value = [];
 currentIndex.value = -1;
 isPlaying.value = false;
}
function playSong(index: number) {
 if (index < 0 || index >= playlist.value.length)
 return;
 currentIndex.value = index;
}
function togglePlay() {
 isPlaying.value = !isPlaying.value;
}
function playPrev() {
 if (repeatMode.value === 'random') {
 const randomIndex = Math.floor(Math.random() * playlist.value.length);
 playSong(randomIndex);
 }
 else {
 let newIndex = currentIndex.value - 1;
 if (newIndex < 0) {
 newIndex = playlist.value.length - 1;
 }
 playSong(newIndex);
 }
}
function playNext() {
 if (repeatMode.value === 'random') {
 const randomIndex = Math.floor(Math.random() * playlist.value.length);
 playSong(randomIndex);
 }
 else if (repeatMode.value === 'single') {
 playSong(currentIndex.value);
 }
 else {
 let newIndex = currentIndex.value + 1;
 if (newIndex >= playlist.value.length) {
 newIndex = 0;
 }
 playSong(newIndex);
 }
}
function toggleRepeat() {
 const modes: ('list' | 'single' | 'random')[] = ['list', 'single', 'random'];
 const currentModeIndex = modes.indexOf(repeatMode.value);
 repeatMode.value = modes[(currentModeIndex + 1) % modes.length];
}
function toggleMute() {
 isMuted.value = !isMuted.value;
}
function toggleDarkMode() {
 isDarkMode.value = !isDarkMode.value;
}
function toggleLyrics() {
 showLyrics.value = !showLyrics.value;
}
watch(isDarkMode, (val) => {
 if (val) {
 document.documentElement.classList.add('dark');
 }
 else {
 document.documentElement.classList.remove('dark');
 }
});
export function useMusicStore() {
 return {
 playlist,
 currentIndex,
 isPlaying,
 currentTime,
 duration,
 volume,
 isMuted,
 repeatMode,
 isDarkMode,
 showLyrics,
 currentSong,
 addSongs,
 removeSong,
 clearPlaylist,
 playSong,
 togglePlay,
 playPrev,
 playNext,
 toggleRepeat,
 toggleMute,
 toggleDarkMode,
 toggleLyrics,
 };
}
