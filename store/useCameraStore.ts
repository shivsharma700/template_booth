import {create} from 'zustand';

type CameraStore = {
  frontCamera: boolean;
  mirrored: boolean;
  remainingTime : number;
  capturedImageData: { src: string | null; width: number; height: number; mirrored: boolean } | null;
  setFrontCamera: (value: boolean) => void;
  setMirrored: (value: boolean) => void;
  setCapturedImageData: (data: { src: string | null; width: number; height: number; mirrored: boolean } | null) => void;
  setRemainingTime: (data : number) => void;
  zoom: number;
  setZoom: (zoom: number) => void;
};

export const useCameraStore = create<CameraStore>((set) => ({
  frontCamera: true,
  mirrored: false,
  remainingTime : 0,
  capturedImageData: null,
  setFrontCamera: (value) => set({ frontCamera: value }),
  setMirrored: (value) => set({ mirrored: value }), // Setter for mirror state
  setCapturedImageData: (data) => set({ capturedImageData: data }),
  setRemainingTime: (data) => set({ remainingTime: data}),
  zoom: 1, // Default zoom level
  setZoom: (zoom: number) => set(() => ({ zoom })),
}));