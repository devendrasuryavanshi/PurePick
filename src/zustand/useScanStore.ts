
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface ScanState {
  isClient: boolean;
  multiStepLoading: boolean;
  status: string;
  statusInfo: { text: string; desc: string };
  checkingAuth: boolean;
  cameraEnabled: boolean;
  torchEnabled: boolean;
  videoConstraints: { width: number; height: number; facingMode: string } | null;
  loading: boolean;
  images: (File | string)[];

  setIsClient: (value: boolean) => void;
  setMultiStepLoading: (value: boolean) => void;
  setStatus: (value: string) => void;
  setStatusInfo: (value: { text: string; desc: string }) => void;
  setCheckingAuth: (value: boolean) => void;
  setCameraEnabled: (value: boolean) => void;
  setTorchEnabled: (value: boolean) => void;
  setVideoConstraints: (value: { width: number; height: number; facingMode: string } | null) => void;
  setLoading: (value: boolean) => void;
  setImages: (value: (File | string)[]) => void;
  reset: () => void;
}

export const useScanStore = create<ScanState>()(
  devtools((set) => ({
    isClient: false,
    multiStepLoading: false,
    status: 'loading',
    statusInfo: { text: '', desc: '' },
    checkingAuth: false,
    cameraEnabled: false,
    torchEnabled: false,
    videoConstraints: null,
    loading: false,
    images: [],

    setIsClient: (value) => set({ isClient: value }),
    setMultiStepLoading: (value) => set({ multiStepLoading: value }),
    setStatus: (value) => set({ status: value }),
    setStatusInfo: (value) => set({ statusInfo: value }),
    setCheckingAuth: (value) => set({ checkingAuth: value }),
    setCameraEnabled: (value) => set({ cameraEnabled: value }),
    setTorchEnabled: (value) => set({ torchEnabled: value }),
    setVideoConstraints: (value) => set({ videoConstraints: value }),
    setLoading: (value) => set({ loading: value }),
    setImages: (value) => set({ images: value }),
    reset: () => set({
      isClient: false,
      multiStepLoading: false,
      status: 'loading',
      statusInfo: { text: '', desc: '' },
      checkingAuth: false,
      cameraEnabled: false,
      torchEnabled: false,
      videoConstraints: null,
      loading: false,
      images: []
    })
  }))
);
