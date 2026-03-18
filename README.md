# Swift Convert (Next.js)

A lightweight Next.js app providing PDF and image conversion tools via API routes.

## Running locally

1. Install dependencies:

```bash
npm install
```

2. Start the development server:

```bash
npm run dev
```

3. Open http://localhost:5001 in your browser.

## Notes

- This project is implemented entirely in Next.js (Node.js), with no Python runtime required.
- Conversion logic is powered by Node.js libraries such as `canvas`, `pdfjs-dist`, `sharp` and `pdf-lib`.

## Testing

Run the automated regression tests:

```bash
npm test
```
