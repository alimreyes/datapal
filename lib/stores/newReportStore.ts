import { create } from 'zustand';
import { ReportObjective, Platform, CSVCategory } from '@/lib/types';

interface UploadedCSV {
  file: File;
  category: CSVCategory;
}

interface NewReportState {
  // Step 1: Objective
  objective: ReportObjective | null;
  
  // Step 2: Platforms
  platforms: Platform[];
  
  // Step 3-4: Uploaded files
  instagramFiles: Record<CSVCategory, File | null>;
  facebookFiles: Record<CSVCategory, File | null>;
  
  // Actions
  setObjective: (objective: ReportObjective) => void;
  setPlatforms: (platforms: Platform[]) => void;
  setInstagramFile: (category: CSVCategory, file: File | null) => void;
  setFacebookFile: (category: CSVCategory, file: File | null) => void;
  reset: () => void;
  
  // Validation helpers
  isStep1Valid: () => boolean;
  isStep2Valid: () => boolean;
  isStep3Valid: () => boolean;
  isStep4Valid: () => boolean;
}

const initialFileState = {
  reach: null,
  impressions: null,
  interactions: null,
  followers: null,
  content: null,
  linkClicks: null,
  visits: null,
};

export const useNewReportStore = create<NewReportState>((set, get) => ({
  objective: null,
  platforms: [],
  instagramFiles: { ...initialFileState },
  facebookFiles: { ...initialFileState },

  setObjective: (objective) => set({ objective }),
  
  setPlatforms: (platforms) => set({ platforms }),
  
  setInstagramFile: (category, file) =>
    set((state) => ({
      instagramFiles: {
        ...state.instagramFiles,
        [category]: file,
      },
    })),
  
  setFacebookFile: (category, file) =>
    set((state) => ({
      facebookFiles: {
        ...state.facebookFiles,
        [category]: file,
      },
    })),
  
  reset: () =>
    set({
      objective: null,
      platforms: [],
      instagramFiles: { ...initialFileState },
      facebookFiles: { ...initialFileState },
    }),
  
  // Validations
  isStep1Valid: () => get().objective !== null,
  
  isStep2Valid: () => get().platforms.length > 0,
  
  isStep3Valid: () => {
    const state = get();
    if (!state.platforms.includes('instagram')) return true;
    
    // Check if at least one Instagram file is uploaded
    const files = Object.values(state.instagramFiles);
    return files.some((file) => file !== null);
  },
  
  isStep4Valid: () => {
    const state = get();
    if (!state.platforms.includes('facebook')) return true;
    
    // Check if at least one Facebook file is uploaded
    const files = Object.values(state.facebookFiles);
    return files.some((file) => file !== null);
  },
}));