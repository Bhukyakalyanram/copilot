# Mini Code Copilot

A lightweight code-generation UI built using Next.js App Router.

## Features
- Prompt input
- Language selector (Python / JavaScript / C++)
- Mock AI API using Next.js API route
- Code output with syntax highlighting
- History saved in localStorage
- Clean Tailwind UI

## Setup
npm install
npm run dev

## API
POST /api/generate
{ "prompt": "reverse string", "language": "python" }

## Future Improvements
- Real AI integration
- Theme toggle
- Favorites
