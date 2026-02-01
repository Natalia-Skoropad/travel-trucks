import { create } from 'zustand';
import { persist } from 'zustand/middleware';

//===============================================================

export type BookingToast = {
  type: 'success' | 'error';
  message: string;
};

export type BookingDraft = {
  name: string;
  email: string;
  bookingDate: string | null;
  comment: string;
};

type BookingFormStore = {
  toast: BookingToast | null;
  draft: BookingDraft;

  showToast: (toast: BookingToast) => void;
  hideToast: () => void;

  setDraft: (patch: Partial<BookingDraft>) => void;
  resetDraft: () => void;
};

//===============================================================

const initialDraft: BookingDraft = {
  name: '',
  email: '',
  bookingDate: null,
  comment: '',
};

//===============================================================

export const useBookingFormStore = create<BookingFormStore>()(
  persist(
    (set) => ({
      toast: null,
      draft: initialDraft,

      showToast: (toast) => set({ toast }),
      hideToast: () => set({ toast: null }),

      setDraft: (patch) =>
        set((state) => ({ draft: { ...state.draft, ...patch } })),

      resetDraft: () => set({ draft: initialDraft }),
    }),
    {
      name: 'booking-form-store',
      partialize: (state) => ({ draft: state.draft }),
    }
  )
);
