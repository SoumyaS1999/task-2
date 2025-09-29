## Setup & Run

- Install: `npm install`
- Start (CRA): `npm start`
- Alternate (if your tooling supports it): `npm run dev`

Data source: `https://jsonplaceholder.typicode.com/photos`

## Approach & Component Structure

- `App`:
  - Creates a Suspense resource that fetches photos via `fetch` (no external libs).
  - Wraps UI in `ErrorBoundary` + `Suspense` with a simple fallback.
  - Renders `PhotosBody`.
- `PhotosBody`:
  - Reads the photos from the Suspense resource.
  - Search: `query` with a 300ms debounced mirror `debouncedQuery`.
  - Virtualization: manual windowing using fixed `rowHeight`, calculating `startIndex`/`endIndex`, and rendering spacer rows above/below the visible slice.
  - Table: single table with sticky `<thead>`, Tailwind styles, alternating rows, hover states, and clickable URL.
  - `PhotoRow` is memoized and shows a 50×50 text placeholder: “img {index}”.

## State & Error Handling

- Loading handled by React Suspense fallback.
- Errors handled by `ErrorBoundary` → “Failed to load data. Please try again.”
- Local state in `PhotosBody`: `query`, `debouncedQuery`, `scrollTop`, `containerHeight`.

## Performance Observations & Trade-offs

- Virtualized rendering keeps DOM size to only the visible rows (+ overscan), which makes scrolling smooth with 5,000 rows.
- Overscan of 8 rows balances responsiveness vs. pop-in.
- Fixed `rowHeight` (70px) simplifies math; if row content height changes, a dynamic/measured approach would be needed.
- Suspense delays initial paint until data resolves; keeps logic simple without intermediate loading states across components.

## Bonus Features

- Debounced client-side search by title.
- Sticky header, Tailwind-based minimal styling, and row/link hover effects.
- Memoized row component for cheaper re-renders.
