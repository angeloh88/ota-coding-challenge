import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Platform = 'all' | 'instagram' | 'tiktok';
export type ChartViewType = 'line' | 'area';

interface UiState {
  selectedPlatform: Platform;
  chartViewType: ChartViewType;
  isModalOpen: boolean;
  selectedPostId: string | null;
}

const initialState: UiState = {
  selectedPlatform: 'all',
  chartViewType: 'line',
  isModalOpen: false,
  selectedPostId: null,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setSelectedPlatform: (state, action: PayloadAction<Platform>) => {
      state.selectedPlatform = action.payload;
    },
    setChartViewType: (state, action: PayloadAction<ChartViewType>) => {
      state.chartViewType = action.payload;
    },
    openModal: (state, action: PayloadAction<string>) => {
      state.isModalOpen = true;
      state.selectedPostId = action.payload;
    },
    closeModal: (state) => {
      state.isModalOpen = false;
      state.selectedPostId = null;
    },
  },
});

export const { setSelectedPlatform, setChartViewType, openModal, closeModal } =
  uiSlice.actions;

export default uiSlice.reducer;
