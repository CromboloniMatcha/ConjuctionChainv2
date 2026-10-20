# Conjunction Chain

A drag-and-plug grammar game: students connect two sentences with the right conjunction.

## Structure
```
conjunction-chain/
├── index.html        Page markup
├── css/styles.css    All styling (light/dark themes, responsive)
├── js/data.js        Default content: conjunctions + questions
├── js/storage.js     Saves teacher edits in the browser (localStorage)
├── js/app.js         Game logic (drag, plug, feedback, progress)
├── js/editor.js      Edit view: add / edit / reorder / delete questions and conjunctions
├── build.py          Optional: bundles everything into dist/conjunction-chain.html
└── dist/             Single-file build
```

## Run
Open `index.html` in a browser. No install or server needed.

## Edit the lessons
Use the **✏️ Edit questions** tab in the app: add, edit, reorder or delete questions and conjunctions. Edits save automatically in *this browser only*. Use “Backup, restore & share” to move them to another device, or “Show as data.js” and paste into `js/data.js` to make them the permanent defaults.

### Or edit js/data.js directly
- `CONJ`: each conjunction with its explanation (`use`) and similar words (`syn`).
- `QUESTIONS`: `top`, `bottom`, and `answer` (a list: any number of correct conjunctions).
- Similar words that are also correct answers for the current question are hidden automatically.

## Single-file build
`python3 build.py`
