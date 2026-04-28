import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import { v4 as uuidv4 } from 'uuid';
import type { CreateOrderFormData, LocalDraft } from '@/entities/order/model/types';
import { DRAFT_INDEX_KEY, getDraftKey, MAX_DRAFT_TABS } from '@/shared/config/constants';

interface DraftsState {
  drafts: LocalDraft[];
  activeTabId: string | null;
}

function loadIndex(): string[] {
  try {
    const raw = localStorage.getItem(DRAFT_INDEX_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveIndex(ids: string[]): void {
  localStorage.setItem(DRAFT_INDEX_KEY, JSON.stringify(ids));
}

function loadDraft(id: string): LocalDraft | null {
  try {
    const raw = localStorage.getItem(getDraftKey(id));
    return raw ? (JSON.parse(raw) as LocalDraft) : null;
  } catch {
    return null;
  }
}

function saveDraft(draft: LocalDraft): void {
  localStorage.setItem(getDraftKey(draft.id), JSON.stringify(draft));
}

function removeDraftFromStorage(id: string): void {
  localStorage.removeItem(getDraftKey(id));
}

function loadDraftsFromStorage(): DraftsState {
  const ids = loadIndex();
  const drafts = ids.map((id) => loadDraft(id)).filter((d): d is LocalDraft => d !== null);
  if (drafts.length !== ids.length) {
    saveIndex(drafts.map((d) => d.id));
  }
  return { drafts, activeTabId: drafts[0]?.id ?? null };
}

const draftsSlice = createSlice({
  name: 'drafts',
  initialState: loadDraftsFromStorage(),
  reducers: {
    createDraft(state) {
      if (state.drafts.length >= MAX_DRAFT_TABS) return;
      const now = new Date().toISOString();
      const draft: LocalDraft = {
        id: uuidv4(),
        title: `Draft ${state.drafts.length + 1}`,
        createdAt: now,
        updatedAt: now,
        formData: {},
      };
      state.drafts.push(draft);
      state.activeTabId = draft.id;
      saveDraft(draft);
      saveIndex(state.drafts.map((d) => d.id));
    },

    updateDraft(
      state,
      action: PayloadAction<{ id: string; formData: Partial<CreateOrderFormData>; title?: string }>,
    ) {
      const draft = state.drafts.find((d) => d.id === action.payload.id);
      if (!draft) return;
      draft.formData = action.payload.formData;
      if (action.payload.title !== undefined) draft.title = action.payload.title;
      draft.updatedAt = new Date().toISOString();
      saveDraft(draft);
    },

    closeDraft(state, action: PayloadAction<string>) {
      const idx = state.drafts.findIndex((d) => d.id === action.payload);
      if (idx === -1) return;
      removeDraftFromStorage(action.payload);
      state.drafts.splice(idx, 1);
      saveIndex(state.drafts.map((d) => d.id));
      if (state.activeTabId === action.payload) {
        state.activeTabId = state.drafts[state.drafts.length - 1]?.id ?? null;
      }
    },

    setActiveTab(state, action: PayloadAction<string>) {
      state.activeTabId = action.payload;
    },

    duplicateOrderAsDraft(state, action: PayloadAction<CreateOrderFormData>) {
      if (state.drafts.length >= MAX_DRAFT_TABS) return;
      const now = new Date().toISOString();
      const draft: LocalDraft = {
        id: uuidv4(),
        title: `Draft ${state.drafts.length + 1}`,
        createdAt: now,
        updatedAt: now,
        formData: action.payload,
      };
      state.drafts.push(draft);
      state.activeTabId = draft.id;
      saveDraft(draft);
      saveIndex(state.drafts.map((d) => d.id));
    },
  },
});

export const { createDraft, updateDraft, closeDraft, setActiveTab, duplicateOrderAsDraft } =
  draftsSlice.actions;

export default draftsSlice.reducer;
