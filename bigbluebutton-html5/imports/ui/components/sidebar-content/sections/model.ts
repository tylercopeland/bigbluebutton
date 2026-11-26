// The side panel as one or two sections, top to bottom, each with one or more
// tools. A section with several tools shows them as tabs. Kept free of React
// so the rules can be read, and tested, on their own.

export interface PanelSection {
  /** Tool (panel) ids, in tab order */
  tabs: string[];
  /** The tool that is showing */
  active: string;
  /** Collapsed to its header */
  minimized: boolean;
}

export interface PanelSections {
  sections: PanelSection[];
  /** Share of the height that the top section takes, from 0 to 1 */
  ratio: number;
  /** The tool used last, which the rest of the client treats as the open panel */
  focus: string | null;
}

export const MAX_SECTIONS = 2;
export const DEFAULT_RATIO = 0.5;

export const EMPTY: PanelSections = { sections: [], ratio: DEFAULT_RATIO, focus: null };

export const findSection = (state: PanelSections, tool: string) => (
  state.sections.findIndex((section) => section.tabs.includes(tool))
);

export const isVisible = (state: PanelSections) => (
  state.sections.some((section) => !section.minimized)
);

/** Whether the tool is in the panel, even as a tab that isn't selected */
export const isToolOpen = (state: PanelSections, tool: string) => (
  isVisible(state) && findSection(state, tool) !== -1
);

/** Whether the tool's content is on screen */
export const isToolShowing = (state: PanelSections, tool: string) => state.sections.some(
  (section) => !section.minimized && section.active === tool,
);

// The focus must always be a tool that is showing, or nothing
const withFocus = (state: PanelSections, preferred: string | null): PanelSections => {
  const showing = (tool: string | null) => !!tool && isToolShowing(state, tool);
  let focus: string | null = null;
  if (showing(preferred)) focus = preferred;
  else if (showing(state.focus)) focus = state.focus;
  else focus = state.sections.find((section) => !section.minimized)?.active ?? null;
  return { ...state, focus };
};

const replaceSection = (
  state: PanelSections, index: number, section: PanelSection | null,
): PanelSections => ({
  ...state,
  sections: section
    ? state.sections.map((current, i) => (i === index ? section : current))
    : state.sections.filter((_, i) => i !== index),
});

const withoutTool = (section: PanelSection, tool: string): PanelSection | null => {
  const index = section.tabs.indexOf(tool);
  if (index === -1) return section;
  const tabs = section.tabs.filter((id) => id !== tool);
  if (!tabs.length) return null;
  const active = section.active === tool ? tabs[Math.max(0, index - 1)] : section.active;
  return { ...section, tabs, active };
};

/**
 * Shows a tool. One already in the panel becomes the selected tab. A new one
 * opens on its own, becomes a tab next to a single tool, and stacks below
 * once a section has tabs. Past two sections, it joins the lower one.
 */
export const openTool = (
  state: PanelSections, tool: string, canStack: boolean,
): PanelSections => {
  const index = findSection(state, tool);
  if (index !== -1) {
    const section = state.sections[index];
    return withFocus(replaceSection(state, index, { ...section, active: tool, minimized: false }), tool);
  }

  const { sections } = state;
  if (!sections.length) {
    return withFocus({ ...state, sections: [{ tabs: [tool], active: tool, minimized: false }] }, tool);
  }

  const last = sections.length - 1;
  const shouldStack = canStack && sections.length < MAX_SECTIONS && sections[last].tabs.length > 1;
  if (shouldStack) {
    return withFocus({
      ...state,
      sections: [...sections, { tabs: [tool], active: tool, minimized: false }],
    }, tool);
  }

  const target = sections[last];
  return withFocus(replaceSection(state, last, {
    tabs: [...target.tabs, tool], active: tool, minimized: false,
  }), tool);
};

export const closeTool = (state: PanelSections, tool: string): PanelSections => {
  const index = findSection(state, tool);
  if (index === -1) return state;
  return withFocus(replaceSection(state, index, withoutTool(state.sections[index], tool)), null);
};

/** What an action bar button does: shows its tool, or closes it if it is showing */
export const toggleTool = (
  state: PanelSections, tool: string, canStack: boolean,
): PanelSections => (
  isToolShowing(state, tool) ? closeTool(state, tool) : openTool(state, tool, canStack)
);

/** Takes a tab out of the only section and stacks it below */
export const canMoveBelow = (state: PanelSections, tool: string, canStack: boolean) => (
  canStack
  && state.sections.length === 1
  && state.sections[0].tabs.length > 1
  && state.sections[0].tabs.includes(tool)
);

export const moveBelow = (
  state: PanelSections, tool: string, canStack: boolean,
): PanelSections => {
  if (!canMoveBelow(state, tool, canStack)) return state;
  const [top] = state.sections;
  const rest = withoutTool(top, tool) as PanelSection;
  return withFocus({
    ...state,
    ratio: DEFAULT_RATIO,
    sections: [{ ...rest, minimized: false }, { tabs: [tool], active: tool, minimized: false }],
  }, tool);
};

/** The section a tool can join as a tab: the other one, when there are two */
export const getCombineTarget = (state: PanelSections, tool: string) => {
  const index = findSection(state, tool);
  if (index === -1 || state.sections.length < 2) return -1;
  return index === 0 ? 1 : 0;
};

export const combine = (state: PanelSections, tool: string): PanelSections => {
  const target = getCombineTarget(state, tool);
  if (target === -1) return state;
  const source = findSection(state, tool);
  const sections = state.sections.map((section, i) => {
    if (i === source) return withoutTool(section, tool);
    if (i === target) return { tabs: [...section.tabs, tool], active: tool, minimized: false };
    return section;
  }).filter((section): section is PanelSection => section !== null);
  return withFocus({ ...state, sections }, tool);
};

export const minimize = (state: PanelSections, index: number): PanelSections => {
  const section = state.sections[index];
  if (!section) return state;
  return withFocus(replaceSection(state, index, { ...section, minimized: true }), null);
};

export const expand = (state: PanelSections, index: number): PanelSections => {
  const section = state.sections[index];
  if (!section) return state;
  return withFocus(replaceSection(state, index, { ...section, minimized: false }), section.active);
};

export const setRatio = (state: PanelSections, ratio: number): PanelSections => ({
  ...state,
  ratio: Math.min(1, Math.max(0, ratio)),
});

// What is stored can't be trusted to have the expected shape
export const parse = (stored: unknown, isAllowed: (tool: string) => boolean): PanelSections => {
  const value = stored as Partial<PanelSections> | null;
  if (!value || !Array.isArray(value.sections)) return EMPTY;
  const seen = new Set<string>();
  const sections = value.sections.slice(0, MAX_SECTIONS).map((section): PanelSection | null => {
    if (!section || !Array.isArray(section.tabs)) return null;
    const tabs = section.tabs.filter((tool): tool is string => (
      typeof tool === 'string' && isAllowed(tool) && !seen.has(tool) && !!seen.add(tool)
    ));
    if (!tabs.length) return null;
    return {
      tabs,
      active: tabs.includes(section.active) ? section.active : tabs[0],
      minimized: section.minimized === true,
    };
  }).filter((section): section is PanelSection => section !== null);
  const ratio = typeof value.ratio === 'number' && value.ratio > 0 && value.ratio < 1
    ? value.ratio : DEFAULT_RATIO;
  return withFocus({ sections, ratio, focus: null }, typeof value.focus === 'string' ? value.focus : null);
};
