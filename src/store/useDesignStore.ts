import { create } from "zustand";

export interface DesignState {
  currentCategory:
    | "VISITING_CARD"
    | "STICKER"
    | "BOOK_COVER"
    | "WEDDING_CARD"
    | "ENVELOPE"
    | "CUSTOM_BOX"
    | "NAME_PLATE"
    | "CERTIFICATE";
  dimensionsMm: {
    width: number;
    height: number;
    depth?: number;
    bleed: number;
  };
  designTitle: string;
  canvasJson: any | null;
  previewDataUrl: string | null;
  boxTextureUrl: string | null;
  wrapperTextureUrl: string | null;
  boxColor: string;
  history: any[];
  historyIndex: number;

  setCategory: (
    category:
      | "VISITING_CARD"
      | "STICKER"
      | "BOOK_COVER"
      | "WEDDING_CARD"
      | "ENVELOPE"
      | "CUSTOM_BOX"
      | "NAME_PLATE"
      | "CERTIFICATE",
    dimensions?: { width: number; height: number; depth?: number; bleed: number }
  ) => void;
  setDesignTitle: (title: string) => void;
  setCanvasJson: (json: any) => void;
  setPreviewDataUrl: (url: string | null) => void;
  setBoxTextureUrl: (url: string | null) => void;
  setWrapperTextureUrl: (url: string | null) => void;
  setBoxColor: (color: string) => void;
  pushHistory: (json: any) => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
  undo: () => any | null;
  redo: () => any | null;
}

export const CATEGORY_DEFAULTS = {
  VISITING_CARD: { width: 89, height: 51, bleed: 3.0 },
  STICKER: { width: 60, height: 60, bleed: 2.0 },
  BOOK_COVER: { width: 148, height: 210, bleed: 3.0 }, // A5
  WEDDING_CARD: { width: 127, height: 178, bleed: 3.0 }, // 5x7 in
  ENVELOPE: { width: 185, height: 135, bleed: 3.0 },
  CUSTOM_BOX: { width: 180, height: 120, depth: 60, bleed: 5.0 },
  NAME_PLATE: { width: 250, height: 120, bleed: 3.0 },
  CERTIFICATE: { width: 297, height: 210, bleed: 3.0 }, // A4
};

export const useDesignStore = create<DesignState>((set, get) => ({
  currentCategory: "VISITING_CARD",
  dimensionsMm: CATEGORY_DEFAULTS.VISITING_CARD,
  designTitle: "Artisan Card Design",
  canvasJson: null,
  previewDataUrl: null,
  boxTextureUrl: null,
  wrapperTextureUrl: null,
  boxColor: "#12161A",
  history: [],
  historyIndex: -1,

  setCategory: (category, dimensions) => {
    const dims = dimensions || CATEGORY_DEFAULTS[category];
    set({
      currentCategory: category,
      dimensionsMm: dims,
      designTitle: `Bespoke ${category.replace("_", " ")} Design`,
      canvasJson: null,
      previewDataUrl: null,
      history: [],
      historyIndex: -1,
    });
  },

  setDesignTitle: (title) => set({ designTitle: title }),

  setCanvasJson: (json) => set({ canvasJson: json }),

  setPreviewDataUrl: (url) => set({ previewDataUrl: url }),

  setBoxTextureUrl: (url) => set({ boxTextureUrl: url, wrapperTextureUrl: url }),

  setWrapperTextureUrl: (url) => set({ wrapperTextureUrl: url, boxTextureUrl: url }),

  setBoxColor: (color) => set({ boxColor: color }),

  pushHistory: (json) => {
    const { history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push(json);
    // Keep max 20 states
    if (newHistory.length > 20) newHistory.shift();
    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
      canvasJson: json,
    });
  },

  canUndo: () => get().historyIndex > 0,
  canRedo: () => get().historyIndex < get().history.length - 1,

  undo: () => {
    const { history, historyIndex, canUndo } = get();
    if (!canUndo()) return null;
    const prevIndex = historyIndex - 1;
    const targetState = history[prevIndex];
    set({ historyIndex: prevIndex, canvasJson: targetState });
    return targetState;
  },

  redo: () => {
    const { history, historyIndex, canRedo } = get();
    if (!canRedo()) return null;
    const nextIndex = historyIndex + 1;
    const targetState = history[nextIndex];
    set({ historyIndex: nextIndex, canvasJson: targetState });
    return targetState;
  },
}));

