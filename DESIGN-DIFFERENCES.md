# Design differences

Where the `ui-redesign` client differs from the Claude design
(BigBlueButton 4.0: Current vs Improved). Work through these after the first
pass of the overall architecture. Check an item off when it matches.

## Foundation
- [ ] Shared-library buttons (e.g. Save in Settings) still use the old blue
- [ ] Focus rings on switches and the slide-upload toast icon still use the old blue
- [ ] Icons are BBB's filled set; the design uses thin outline icons

## Bottom bar
- [ ] Extra button kept: restore presentation, while it is minimized
- [x] Share media is a plus button (design: plus in a frame); phones keep BBB's icon
- [ ] Bottom-bar People and Chat show a dot, not numbered badges (the tabs do)
- [ ] Device chevron on the mic button is not in the design
- [ ] Phones keep the old navigation button and the white media group
- [ ] Non-default layouts keep the left rail
- [ ] Polls, timer and breakouts open from Apps; existing pins can still show

## Top bar
- [ ] Extra controls kept: connection status, options (three dots)
- [ ] Recording uses BBB's start/stop button, not the small REC label
- [ ] Talking indicator is kept, in the top row (the design has none)
- [ ] Slide keeps its proportions, so wide windows leave space at its sides
- [x] Raised hands alert chip, which opens People on the Raised hands filter
- [ ] Question and low engagement chips not built
- [ ] Raised hands chip: phones show only the number

## Panels
- [x] People and Chat share one panel with tabs, 360px wide by default
- [ ] People tab keeps the download button, Chat tab keeps its options menu
- [x] Chat has an Everyone/Direct switch, a direct message list, conversation bubbles and the restyled input
- [ ] Chat: privacy note leaves out "Moderators can't read it" until we confirm that holds on every setup
- [ ] Chat: privacy note uses the full name and sits at the top, not above the first message
- [ ] Chat: unread direct messages show a count, not a dot; Everyone also shows a count while in Direct
- [ ] Chat: moderator messages keep BBB's blue highlight; system messages keep their style
- [ ] Chat: the hover toolbar (reply, react, edit, pin, delete) keeps BBB's design
- [ ] Chat: closing the panel in a direct message hides that conversation until a new message (BBB behavior)
- [x] People list: raised hands with wait times, status columns, hover actions, All and Raised hands filters
- [ ] People list: no Low engagement filter
- [ ] People list: search opens from an icon beside the filters (not in the design)
- [ ] People list: keeps Lower all hands and role labels (Presenter, Moderator, Guest...)
- [ ] People list: says "Presenter", not "Presenting"; adds a "Can draw" label (whiteboard access moved into the menu)
- [ ] People list: the mic icon is also the mute button; raised hands add a lower hand button on hover
- [ ] People list: avatars use BBB's role colors and first two letters, not per-person colors and initials
- [ ] Dark mode: "Presenter" label has low contrast, filter selection is subtle
- [ ] Hidden for now on desktop and tablet, to come back to (sidebar-navigation/hidden-controls.ts): mute all and permissions in People, minimize presentation and Profile in the bottom bar
- [x] Nothing is open on join. The first tool opens alone with a plain title ("PEOPLE 14"), a second turns the header into tabs, a third stacks below as its own section, and later tools join the lower section as tabs
- [x] Action bar buttons: pressed while the tool is anywhere in the panel; select its tab when it isn't showing; close it when it is
- [x] Drag a tab down to stack it, a section's title onto the other section to make it a tab, the header or grip to the other side; dashed overlay with a plain-language label, ghost under the pointer, source at 35%, 6px before a drag starts
- [x] 50/50 split with a draggable divider; neither section can be made shorter than 120px
- [x] Every drag has a keyboard way: the grip in each section header opens an Arrange menu (Move below, Combine with, Move panel to left/right); Shift+F10 or right-click on a tab opens it for that tab. Changes are announced to screen readers
- [x] Losing the presenter role with Polling open closes only Polling; the rest of the panel stays
- [ ] Sections: at most two; minimize (–) collapses a section to its header, and the panel closes when no section is left open (reopening a tool brings the arrangement back)
- [ ] Section title count is #6B7280, not a lighter grey: #A0AEC0 is 2.3:1 on white and fails contrast
- [ ] Switching tabs remounts the tool, as BBB did with panels; People with 100+ people takes about a second to switch to
- [ ] The panel arrangement is stored per browser, not per meeting or user
- [ ] The second column is hidden (sidebar-navigation/hidden-controls.ts), to explore later on the right
- [x] The side panel can be dragged by its header or grip to the other side, or moved from the options menu (three dots); remembered per browser (not in the design)
- [ ] Moving the panel: the bottom bar buttons stay in place; phones and layouts without docked navigation can't move it
- [x] Side panels share one condensed spacing scale: 52px header, 12px sides, 8px gaps (design: 14px sides)
- [ ] Spacing: Notes keeps its editor's own indent, and Profile and breakout room lists keep their inner spacing
- [x] Other panels use the same plain title and close button as People and Chat
- [ ] Other panels keep BBB's content (Notes, Profile, Breakout Rooms) and phones keep BBB's headers
- [ ] Tabs are hidden while two panels are open side by side (second column, hidden for now)
- [ ] Pressing a stacked tab's or title's grip without moving opens the Arrange menu, and the options menu (three dots) no longer stacks panels (move panel stays there)
- [ ] Dark mode: the selected tab is hard to tell apart
- [ ] New strings (tabs, people count, filters, statuses, chat switch, placeholders, slide controls, webcam overflow and raised hands chip) are English only
- [ ] Chat input placeholder was translated in BBB and is now English only
- [x] Poll: setup uses answer chips, live results use bars with a progress card; the voting card is restyled
- [ ] Poll: options stay visible instead of under More options; answers keep BBB's inputs without letter keys
- [ ] Poll: Publish results ends the poll and posts to chat and the slide, as in BBB (design: show or hide on the stage while live); those published charts keep BBB's look
- [ ] Poll: keeps the Poll/Quiz switch, Custom Input, Cancel and the list of who answered what
- [ ] Poll: titles and buttons keep BBB's wording (Polling, Start Poll, Stop poll)
- [x] Timer: phones get the countdown ring and chips in the panel, and a ring pill in the top bar
- [x] Timer: floating card on the stage that can be dragged and minimized, with +1 min, confetti and pulse
- [x] Timer: the card replaces the side panel on desktop and tablet; opening Timer in Apps shows the card
- [ ] Timer: the card adds a Timer/Stopwatch switch, a time you can click to edit, and BBB's music when it is enabled (not in the design)
- [ ] Timer: no +30s and +5m buttons or longer presets; type the time instead
- [ ] Timer: card presets come from BBB's settings (1, 5, 10, 15 min; design: 1, 3, 5, 10); viewers only get minimize
- [ ] Timer: each person moves and minimizes their own card; the place is not saved or shared
- [ ] Timer: phones and layouts without docked navigation keep the top bar pill; no card while something is fullscreen
- [ ] Timer: after time runs out, Reset clears "Time is up" only for the person who pressed it
- [ ] Timer: new card strings are English only
- [ ] Timer: opening the timer starts sharing it with everyone right away, as in BBB
- [x] Plugins opens as a 360px popover above the left edge of the actions bar: "Plugins", Breakout rooms, Poll and Timer cards, then "More plugins" with Q&A board, Quiz, Word cloud and Random picker (icon, one-line description, chevron)
- [x] Picking a plugin closes the popover and starts it; opening People, Chat or Notes closes it
- [ ] Plugins: Q&A board, Word cloud and Random picker aren't built into BBB 4.0, so they show as "Not available on this server"; Quiz opens Polling on the Quiz tab
- [ ] Plugins: pin buttons show on hover, search shows with more than 8 apps, installed plugins are listed after the four (none of this is in the design); the button is still labelled Apps Gallery
- [ ] Plugins: polls and breakouts open in the side panel as tools; phones and layouts without docked navigation keep the gallery panel
- [x] Share media menu opens above its button, 360px wide like Plugins (design: wider)
- [x] Share media menu shows previews above a row of media types (Slides, Video, Screen, Camera, More)
- [ ] Share media: no Audio or URL tab, BBB has no such feature (tab audio comes with screen share)
- [ ] Share media: Camera tab kept (BBB feature, not in the design); More only shows with plugins and has no whiteboard or poll shortcut
- [ ] Share media: one Start sharing button, since the browser asks for screen, window or tab (design: three buttons)
- [ ] Share media: no video file upload
- [ ] Share media: a Stop sharing button shows above the tabs while sharing; presentation cards keep download and delete
- [x] Share media: picking a presentation only selects it, a share button then shows it to everyone (design: no button)
- [ ] Share media: phones and viewers keep BBB's menu
- [ ] Share media: while the screen is shared, the camera can only be shared after Stop sharing (BBB stopped the screen share for you)

## Stage and webcams
- [x] Slide pager, All slides grid, whiteboard tools and minimize sit on the slide and show on hover
- [ ] Slide controls: adds a menu for zoom, fit to width and multi-user whiteboard (not in the design)
- [ ] Slide controls: quick poll, smart media and plugin items show above the pager
- [ ] Whiteboard tools: keeps BBB's extra tools (hand, arrow, note, ellipse, more), redo and style icon; icons are tldraw's
- [ ] Whiteboard options menu kept next to minimize
- [ ] All slides: titles come from the first line of slide text
- [ ] Phones, touch devices, small and portrait slides keep BBB's toolbars (design: pager under the slide, annotate mode)
- [ ] Minimized presentation does not become a tile in the webcam grid
- [ ] Dark mode: white divider lines in the whiteboard tools
- [x] Webcams: a row across the top while the side panel is open, a column on the right while it is closed, until someone moves them
- [x] Stage and webcams ease into place over 300ms when the panel opens, closes or moves (off with reduced motion, and while dragging or resizing)
- [ ] Stage animation: the slide itself resizes at once while its frame eases
- [x] Webcam tiles restyled, with initials for people without a camera and a "+N more" tile
- [ ] Webcams: the strip only appears once someone shares a camera (design: always)
- [ ] Webcams: people without a camera are listed by name, not by speaker or raised hand
- [ ] Webcams: more than five cameras all show; only people without a camera are capped
- [ ] Webcams: keeps mute badges, presenter badge and full names; strip is 120px tall (design: 95px)
- [ ] Webcams: 4:3 cameras show bars at the sides of the widescreen tiles
- [ ] Webcams: "+N more" keeps the full tile size at the side (design: short bar)
- [ ] Phones: BBB's webcam placement, with the new tile look

## Not yet tested
- [ ] People list: guests waiting, locked viewers, listen-only, plugins (111 people checked with lightweight GraphQL users, no cameras)
- [ ] Panel sections: real touch tablets and screen readers (checked with tablet touch emulation, Firefox and WebKit in Playwright, fullscreen with the panel on the right)
- [ ] BBB's own Playwright tests still expect the old people list, chat buttons, slide toolbar and apps gallery panel; the new panels/ tests cover the side panel
- [ ] Chat: direct messages on phone, locked chat, offline participants, pinned messages, polls, plugins, chat in the second panel
- [ ] Slide controls: infinite whiteboard, long decks in All slides, plugin toolbar items, screen magnifiers
- [ ] Webcams: more than 8 people, pinning, focus, virtual backgrounds, plugins, locked webcams, LiveKit, screen share with webcams, dark mode
- [ ] Active recording, real screen sharing, breakout rooms, production build
