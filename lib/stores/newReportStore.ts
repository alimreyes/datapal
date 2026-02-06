import { create } from 'zustand';
import { ReportObjective, Platform, CSVCategory } from '@/lib/types';

interface UploadedCSV {
  file: File;
  category: CSVCategory;
}

interface GAConnectionState {
  connected: boolean;
  propertyId: string | null;
  propertyName: string | null;
  dateRange: { start: string; end: string } | null;
  accessToken: string | null;
  refreshToken: string | null;
}

interface NewReportState {
  // Step 1: Objective
  objective: ReportObjective | null;

  // Step 2: Platforms
  platforms: Platform[];

  // Step 3-4+: Uploaded files for each platform
  instagramFiles: Record<CSVCategory, File | null>;
  facebookFiles: Record<CSVCategory, File | null>;
  linkedinXLSFile: File | null; // Single XLS file for LinkedIn
  tiktokFiles: Record<CSVCategory, File | null>;

  // Google Analytics connection state
  gaConnection: GAConnectionState;

  // Actions
  setObjective: (objective: ReportObjective) => void;
  setPlatforms: (platforms: Platform[]) => void;
  setInstagramFile: (category: CSVCategory, file: File | null) => void;
  setFacebookFile: (category: CSVCategory, file: File | null) => void;
  setLinkedInXLSFile: (file: File | null) => void;
  setTikTokFile: (category: CSVCategory, file: File | null) => void;
  setGAConnection: (connection: Partial<GAConnectionState>) => void;
  clearGAConnection: () => void;
  reset: () => void;

  // Validation helpers
  isStep1Valid: () => boolean;
  isStep2Valid: () => boolean;
  isStep3Valid: () => boolean; // Instagram
  isStep4Valid: () => boolean; // Facebook
  isLinkedInStepValid: () => boolean;
  isTikTokStepValid: () => boolean;
  isGAStepValid: () => boolean;

  // Navigation helpers
  getNextStep: (currentPlatform: Platform | null) => string;
  getPreviousStep: (currentPlatform: Platform | null) => string;
  getSelectedPlatformsInOrder: () => Platform[];
}

// Function to create a fresh file state (prevents reference sharing)
const getInitialFileState = (): Record<CSVCategory, File | null> => ({
  reach: null,
  impressions: null,
  interactions: null,
  followers: null,
  content: null,
  visits: null,
});

const getInitialGAConnection = (): GAConnectionState => ({
  connected: false,
  propertyId: null,
  propertyName: null,
  dateRange: null,
  accessToken: null,
  refreshToken: null,
});

// Define platform order for navigation
const PLATFORM_ORDER: Platform[] = ['instagram', 'facebook', 'linkedin', 'tiktok', 'google_analytics'];

export const useNewReportStore = create<NewReportState>((set, get) => ({
  objective: null,
  platforms: [],
  instagramFiles: getInitialFileState(),
  facebookFiles: getInitialFileState(),
  linkedinXLSFile: null,
  tiktokFiles: getInitialFileState(),
  gaConnection: getInitialGAConnection(),

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

  setLinkedInXLSFile: (file) => set({ linkedinXLSFile: file }),

  setTikTokFile: (category, file) =>
    set((state) => ({
      tiktokFiles: {
        ...state.tiktokFiles,
        [category]: file,
      },
    })),

  setGAConnection: (connection) =>
    set((state) => ({
      gaConnection: {
        ...state.gaConnection,
        ...connection,
      },
    })),

  clearGAConnection: () =>
    set({ gaConnection: getInitialGAConnection() }),

  reset: () =>
    set({
      objective: null,
      platforms: [],
      instagramFiles: getInitialFileState(),
      facebookFiles: getInitialFileState(),
      linkedinXLSFile: null,
      tiktokFiles: getInitialFileState(),
      gaConnection: getInitialGAConnection(),
    }),

  // Validations
  isStep1Valid: () => get().objective !== null,

  isStep2Valid: () => get().platforms.length > 0,

  isStep3Valid: () => {
    const state = get();
    if (!state.platforms.includes('instagram')) return true;
    const files = Object.values(state.instagramFiles);
    return files.some((file) => file !== null);
  },

  isStep4Valid: () => {
    const state = get();
    if (!state.platforms.includes('facebook')) return true;
    const files = Object.values(state.facebookFiles);
    return files.some((file) => file !== null);
  },

  isLinkedInStepValid: () => {
    const state = get();
    if (!state.platforms.includes('linkedin')) return true;
    return state.linkedinXLSFile !== null;
  },

  isTikTokStepValid: () => {
    const state = get();
    if (!state.platforms.includes('tiktok')) return true;
    const files = Object.values(state.tiktokFiles);
    return files.some((file) => file !== null);
  },

  isGAStepValid: () => {
    const state = get();
    if (!state.platforms.includes('google_analytics')) return true;
    return state.gaConnection.connected && state.gaConnection.propertyId !== null;
  },

  // Get platforms in the correct navigation order
  getSelectedPlatformsInOrder: () => {
    const state = get();
    return PLATFORM_ORDER.filter(p => state.platforms.includes(p));
  },

  // Navigation helpers
  getNextStep: (currentPlatform) => {
    const state = get();
    const selectedPlatforms = state.getSelectedPlatformsInOrder();

    if (currentPlatform === null) {
      // Coming from step 2, go to first platform
      const firstPlatform = selectedPlatforms[0];
      return getPlatformStepPath(firstPlatform);
    }

    const currentIndex = selectedPlatforms.indexOf(currentPlatform);

    if (currentIndex === -1 || currentIndex === selectedPlatforms.length - 1) {
      // Last platform or not found, go to confirmation
      return '/new-report/step-5';
    }

    const nextPlatform = selectedPlatforms[currentIndex + 1];
    return getPlatformStepPath(nextPlatform);
  },

  getPreviousStep: (currentPlatform) => {
    const state = get();
    const selectedPlatforms = state.getSelectedPlatformsInOrder();

    if (currentPlatform === null) {
      return '/new-report/step-2';
    }

    const currentIndex = selectedPlatforms.indexOf(currentPlatform);

    if (currentIndex <= 0) {
      // First platform, go back to step 2
      return '/new-report/step-2';
    }

    const previousPlatform = selectedPlatforms[currentIndex - 1];
    return getPlatformStepPath(previousPlatform);
  },
}));

// Helper function to get step path for a platform
function getPlatformStepPath(platform: Platform): string {
  switch (platform) {
    case 'instagram':
      return '/new-report/step-3';
    case 'facebook':
      return '/new-report/step-4';
    case 'linkedin':
      return '/new-report/step-linkedin';
    case 'tiktok':
      return '/new-report/step-tiktok';
    case 'google_analytics':
      return '/new-report/step-ga';
    default:
      return '/new-report/step-5';
  }
}
