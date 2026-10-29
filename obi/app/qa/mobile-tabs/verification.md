# Mobile navigation pills

- Replaced mobile menu toggle and open state with always-visible navigation links below the wordmark. Desktop retains the existing navigation layout.
- Four pill buttons stay on one line and scroll horizontally if needed; active page uses aria-current and a distinct fill/border.
- Changing pages or browser history reveals the active pill without scrolling the document. No expandable header or menu state remains.
- Browser checks: at 320px, navigation client width 288px / scroll width 368px, no document horizontal overflow; Sources scrolls into view and Back restores Family tree and scroll offset zero. Header height remains 117px including its border. At 1440px desktop header remains 76px including border.
- Mobile home viewport budget includes the persistent navigation row. Existing tree motion safeguards remain unchanged.
