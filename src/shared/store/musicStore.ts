import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Track {
    id: string;
    name: string;
    artist: string;
    url: string;
    cover: string;
}

interface MusicState {
    playlist: Track[];
    currentIndex: number;
    playing: boolean;
    minimized: boolean;
    volume: number;
    repeat: 'none' | 'all' | 'one';
    shuffle: boolean;

    // Actions
    setPlaylist: (playlist: Track[]) => void;
    addAndPlay: (track: Track) => void;
    setCurrentIndex: (index: number) => void;
    setPlaying: (playing: boolean) => void;
    togglePlay: () => void;
    setMinimized: (minimized: boolean) => void;
    setVolume: (volume: number) => void;
    setRepeat: (repeat: 'none' | 'all' | 'one') => void;
    setShuffle: (shuffle: boolean) => void;
    nextTrack: () => void;
    prevTrack: () => void;
    updateTrackUrl: (id: string, url: string) => void;
}

export const useMusicStore = create<MusicState>()(
    persist(
        (set) => ({
            playlist: [],
            currentIndex: 0,
            playing: false,
            minimized: true,
            volume: 0.7,
            repeat: 'all',
            shuffle: false,

            setPlaylist: (playlist) => set({ playlist, currentIndex: 0 }),

            addAndPlay: (track) => set((state) => {
                const existingIndex = state.playlist.findIndex(t => t.id === track.id);
                if (existingIndex !== -1) {
                    return { currentIndex: existingIndex, playing: true, minimized: false };
                }
                const newPlaylist = [track, ...state.playlist];
                return { playlist: newPlaylist, currentIndex: 0, playing: true, minimized: false };
            }),

            setCurrentIndex: (index) => set({ currentIndex: index }),
            setPlaying: (playing) => set({ playing }),
            togglePlay: () => set((state) => ({ playing: !state.playing })),
            setMinimized: (minimized) => set({ minimized }),
            setVolume: (volume) => set({ volume }),
            setRepeat: (repeat) => set({ repeat }),
            setShuffle: (shuffle) => set({ shuffle }),

            nextTrack: () => set((state) => {
                if (state.playlist.length === 0) return state;
                let nextIndex;
                if (state.shuffle) {
                    nextIndex = Math.floor(Math.random() * state.playlist.length);
                } else {
                    nextIndex = (state.currentIndex + 1) % state.playlist.length;
                }
                return { currentIndex: nextIndex };
            }),

            prevTrack: () => set((state) => {
                if (state.playlist.length === 0) return state;
                let prevIndex;
                if (state.shuffle) {
                    prevIndex = Math.floor(Math.random() * state.playlist.length);
                } else {
                    prevIndex = (state.currentIndex - 1 + state.playlist.length) % state.playlist.length;
                }
                return { currentIndex: prevIndex };
            }),

            updateTrackUrl: (id, url) => set((state) => ({
                playlist: state.playlist.map(t => t.id === id ? { ...t, url } : t)
            }))
        }),
        {
            name: 'sakura-music-storage',
            partialize: (state) => ({
                playlist: state.playlist,
                currentIndex: state.currentIndex,
                volume: state.volume,
                repeat: state.repeat,
                shuffle: state.shuffle,
            }),
        }
    )
);
