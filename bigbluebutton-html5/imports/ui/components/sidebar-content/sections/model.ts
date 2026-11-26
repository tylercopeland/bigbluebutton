// The side panel as one or two sections, top to bottom, plus one tool that can
// be docked in a panel of its own on the other side of the stage. The top
// section holds up to two tools as tabs, the lower section one. Kept free of
// React so the rules can be read, and tested, on their own.

export interface PanelSection {
  /** Tool (panel) ids, in tab order */
  tabs: string[];
  /** The tool that is showing */
  active: string;
}

export interface PanelSections {
  sections: PanelSection[];
  /** Share of the height that the top section takes, from 0 to 1 */
  ratio: number;
  /** The tool used last in the side panel, which the rest of the client treats as the open panel */
  focus: string | null;
  /** The tool in the panel on the other side of the stage */
  aside: string | null;
}

/** How many tools each section holds: two tabs at the top, one below */
export const SECTION_CAPACITY = [2, 1];
export const DEFAULT_RATIO = 0.5;

export const EMPTY: PanelSections = {
  sections: [], ratio: DEFAULT_RATIO, focus: null, aside: null,
};

export const findSection = (state: PanelSections, tool: string) => (
  state.sections.findIndex((section) => section.tabs.includes(tool))
);

/** Whether the side panel shows */
export const isVisible = (state: PanelSections) => state.sections.length > 0;

export const isAside = (state: PanelSections, tool: string) => state.aside === tool;

/** Whether the tool is in either panel, even as a tab that isn't selected */
export const isToolOpen = (state: PanelSections, tool: string) => (
  findSection(state, tool) !== -1 || isAside(state, tool)
);

/** Whether the tool's content is on screen */
export const isToolShowing = (state: PanelSections, tool: string) => (
  isAside(state, tool) || state.sections.some((section) => section.active === tool)
);

const isFull = (state: PanelSections, index: number) => (
  (state.sections[index]?.tabs.length ?? 0) >= SECTION_CAPACITY[index]
);

// The focus must always be a tool showing in the side panel, or nothing
const withFocus = (state: PanelSections, preferred: string | null): PanelSections => {
  const showing = (tool: string | null) => (
    !!tool && state.sections.some((section) => section.active === tool)
  );
  let focus: string | null = null;
  if (showing(preferred)) focus = preferred;
  else if (showing(state.focus)) focus = state.focus;
  else focus = state.sections[0]?.active ?? null;
  return { ...state, focus };
};

const withoutTool = (state: PanelSections, tool: string): PanelSections => {
  const sections = state.sections.map((section): PanelSection | null => {
    const index = section.tabs.indexOf(tool);
    if (index === -1) return section;
    const tabs = section.tabs.filter((id) => id !== tool);
    if (!tabs.length) return null;
    const active = section.active === tool ? tabs[Math.max(0, index - 1)] : section.active;
    return { tabs, active };
  }).filter((section): section is PanelSection => section !== null);
  // Without a top section, the lower one moves up
  return { ...state, sections, aside: state.aside === tool ? null : state.aside };
};

const single = (tool: string): PanelSection => ({ tabs: [tool], active: tool });

/**
 * Adds a tool to the side panel: alone, then as the second tab, then as a
 * section of its own below. Once both are full it takes the lower section's
 * place, or the unselected tab's when there is no room to stack.
 */
const addToPanel = (state: PanelSections, tool: string, canStack: boolean): PanelSections => {
  const [top, bottom] = state.sections;
  let sections: PanelSection[];
  if (!top) {
    sections = [single(tool)];
  } else if (!isFull(state, 0)) {
    sections = [{ tabs: [...top.tabs, tool], active: tool }, ...(bottom ? [bottom] : [])];
  } else if (bottom || canStack) {
    sections = [top, single(tool)];
  } else {
    const kept = top.active;
    const tabs = top.tabs.map((id) => (id === kept ? id : tool));
    sections = [{ tabs, active: tool }];
  }
  return withFocus({ ...state, sections }, tool);
};

/** Shows a tool. One already open is selected; a new one joins the side panel. */
export const openTool = (
  state: PanelSections, tool: string, canStack: boolean,
): PanelSections => {
  if (isAside(state, tool)) return state;
  const index = findSection(state, tool);
  if (index !== -1) {
    const sections = state.sections.map((section, i) => (
      i === index ? { ...section, active: tool } : section
    ));
    return withFocus({ ...state, sections }, tool);
  }
  return addToPanel(state, tool, canStack);
};

export const closeTool = (state: PanelSections, tool: string): PanelSections => {
  if (!isToolOpen(state, tool)) return state;
  return withFocus(withoutTool(state, tool), null);
};

/** What an action bar button does: shows its tool, or closes it if it is showing */
export const toggleTool = (
  state: PanelSections, tool: string, canStack: boolean,
): PanelSections => (
  isToolShowing(state, tool) ? closeTool(state, tool) : openTool(state, tool, canStack)
);

/** Closes a section of the side panel and every tool in it */
export const closeSection = (state: PanelSections, index: number): PanelSections => {
  if (!state.sections[index]) return state;
  return withFocus({ ...state, sections: state.sections.filter((_, i) => i !== index) }, null);
};

/** Stacks a tool as the lower section: a tab of the only section, or the docked tool */
export const canMoveBelow = (state: PanelSections, tool: string, canStack: boolean) => {
  if (!canStack || state.sections.length !== 1) return false;
  const [top] = state.sections;
  return isAside(state, tool) || (top.tabs.length > 1 && top.tabs.includes(tool));
};

export const moveBelow = (
  state: PanelSections, tool: string, canStack: boolean,
): PanelSections => {
  if (!canMoveBelow(state, tool, canStack)) return state;
  const rest = withoutTool(state, tool);
  return withFocus({
    ...rest,
    ratio: DEFAULT_RATIO,
    sections: [rest.sections[0], single(tool)],
  }, tool);
};

/**
 * The section a tool can be added to as a tab, or -1. Only the top section
 * has tabs, so a tool dropped on the lower section joins it at the top.
 */
export const getCombineTarget = (state: PanelSections, tool: string) => {
  const [top, bottom] = state.sections;
  if (!top) return -1;
  const index = findSection(state, tool);
  if (isAside(state, tool) || index === 1) return isFull(state, 0) ? -1 : 0;
  if (index === 0 && bottom && top.tabs.length === 1) return 1;
  return -1;
};

export const combine = (state: PanelSections, tool: string): PanelSections => {
  const target = getCombineTarget(state, tool);
  if (target === -1) return state;
  const rest = withoutTool(state, tool);
  // The top section emptied, so the lower one is now first
  const [joined, ...others] = rest.sections;
  return withFocus({
    ...rest,
    sections: [{ tabs: [...joined.tabs, tool], active: tool }, ...others.slice(target === 1 ? 1 : 0)],
  }, tool);
};

/** Docks a tool in the panel on the other side. The tool there before goes back to the side panel. */
export const canMoveAside = (state: PanelSections, tool: string) => findSection(state, tool) !== -1;

export const moveAside = (
  state: PanelSections, tool: string, canStack: boolean,
): PanelSections => {
  if (!canMoveAside(state, tool)) return state;
  const previous = state.aside;
  const moved = withFocus({ ...withoutTool(state, tool), aside: tool }, null);
  return previous ? addToPanel(moved, previous, canStack) : moved;
};

/** Brings the docked tool back to the side panel */
export const moveBack = (state: PanelSections, canStack: boolean): PanelSections => {
  const { aside } = state;
  if (!aside) return state;
  return addToPanel({ ...state, aside: null }, aside, canStack);
};

export const closeAside = (state: PanelSections): PanelSections => (
  state.aside ? { ...state, aside: null } : state
);

export const setRatio = (state: PanelSections, ratio: number): PanelSections => ({
  ...state,
  ratio: Math.min(1, Math.max(0, ratio)),
});

// What is stored can't be trusted to have the expected shape
export const parse = (stored: unknown, isAllowed: (tool: string) => boolean): PanelSections => {
  const value = stored as Partial<PanelSections> | null;
  if (!value || !Array.isArray(value.sections)) return EMPTY;
  const storedSections = value.sections as Array<{ tabs?: unknown; active?: unknown; minimized?: unknown }>;
  const seen = new Set<string>();
  const take = (tool: unknown): tool is string => (
    typeof tool === 'string' && isAllowed(tool) && !seen.has(tool) && !!seen.add(tool)
  );
  const aside = take(value.aside) ? value.aside as string : null;
  const sections = storedSections
    // Sections used to be able to collapse; a collapsed one now counts as closed
    .filter((section) => section && Array.isArray(section.tabs) && section.minimized !== true)
    .map((section): PanelSection | null => {
      const tabs = (section.tabs as unknown[]).filter(take);
      if (!tabs.length) return null;
      return { tabs, active: tabs.includes(section.active as string) ? section.active as string : tabs[0] };
    })
    .filter((section): section is PanelSection => section !== null)
    .slice(0, SECTION_CAPACITY.length)
    .map((section, index) => {
      const capacity = SECTION_CAPACITY[index];
      if (section.tabs.length <= capacity) return section;
      const tabs = [section.active, ...section.tabs.filter((id) => id !== section.active)]
        .slice(0, capacity);
      return { tabs, active: section.active };
    });
  const ratio = typeof value.ratio === 'number' && value.ratio > 0 && value.ratio < 1
    ? value.ratio : DEFAULT_RATIO;
  return withFocus(
    {
      sections, ratio, focus: null, aside,
    },
    typeof value.focus === 'string' ? value.focus : null,
  );
};
