# Design differences

Where the `ui-redesign` client differs from the Claude design
(BigBlueButton 4.0: Current vs Improved). Work through these after the first
pass of the overall architecture. Check an item off when it matches.

## Foundation
- [ ] Shared-library buttons (e.g. Save in Settings) still use the old blue
- [ ] Focus rings on switches and the slide-upload toast icon still use the old blue
- [ ] Icons are BBB's filled set; the design uses thin outline icons

## Bottom bar
- [ ] Extra buttons kept: Profile, minimize/restore presentation
- [ ] Share media icon differs (design: plus in a frame)
- [ ] Bottom-bar People and Chat show a dot, not numbered badges (the tabs do)
- [ ] Device chevron on the mic button is not in the design
- [ ] Phones keep the old navigation button and the white media group
- [ ] Non-default layouts keep the left rail
- [ ] Polls, timer and breakouts open from Apps; existing pins can still show

## Top bar
- [ ] Extra controls kept: connection status, options (three dots)
- [ ] Recording uses BBB's start/stop button, not the small REC label
- [ ] Talking indicator row is kept under the title
- [ ] Alert chips (raised hands, questions, low engagement) not built

## Panels
- [x] People and Chat share one panel with tabs, 360px wide by default
- [ ] People tab keeps the download button, Chat tab keeps its options menu
- [ ] Chat uses BBB's public/private buttons, not an Everyone/Direct switch
- [ ] People list: no filters, wait times, calmer status icons or hover actions
- [ ] Mute all and permissions buttons are kept at the bottom of People
- [ ] Other panels (Notes, Apps, Profile, Poll, Timer) keep BBB's header
- [ ] Tabs are hidden while two panels are open side by side
- [ ] Dark mode: the selected tab is hard to tell apart
- [ ] New strings (tabs, people count) are English only
- [ ] Share media menu opens at the far right, not above its button

## Stage and webcams
- [ ] Whiteboard and slide toolbars are always visible (design: on hover)
- [ ] Webcams default to the top; design puts them on the right when no panel is open
- [ ] Webcam tile styling and "+N more" tile not built

## Not yet tested
- [ ] Active recording, webcams, real screen sharing, breakout rooms, production build
