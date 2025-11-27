# Nano Interior 🍌

An InteriorAI-style web application built with Next.js, TailwindCSS, and Venice.ai's API. This app allows users to redesign interior photos using AI-powered image editing.

## Features

- **Minimalist Interface**: Clean, 2-column layout inspired by InteriorAI.
- **Fast Generation**: Powered by Venice.ai's API.
- **Style Presets**: One-click style transformation (Modern, Scandinavian, Industrial, etc.).
- **History**: Locally saved history of generated designs.
- **Responsive**: Works on desktop and mobile (optimized for desktop workflow).
- **Privacy-Focused**: Uses Venice.ai's uncensored and privacy-respecting API.

## Tech Stack

- **Frontend**: Next.js 15 (App Router), TailwindCSS v4, Lucide React.
- **Backend**: Next.js API Routes (Edge Runtime compatible).
- **AI Inference**: Venice.ai API (`/image/edit` endpoint).

## Getting Started

### Prerequisites

- Node.js 18+
- A Venice.ai API Key

### Installation

1. Clone the repository (or use the provided folder).
2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file in the root directory and add your Venice API key:

```env
VENICE_API_KEY=your_venice_api_key_here
```

4. Run the development server:

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) with your browser.

## How It Works

1. **Upload**: The user uploads an image, which is automatically resized to <1024px to optimize for API limits.
2. **Configure**: The user selects a style (e.g., Modern, Boho) or enters a custom prompt.
3. **Generate**: The app sends the image and a carefully engineered prompt to the Venice `/api/v1/image/edit` endpoint.
   - The prompt strategy uses keyword reinforcement (e.g., `(IGNORE ORIGINAL FURNITURE)`) to force a complete redesign while preserving the room's structure.
4. **Display**: The generated image is returned and displayed with a smooth transition.

## Troubleshooting

- **"Venice API Error"**: Check your API key and ensure your image is not corrupted.
- **"Not changing furniture"**: The AI tries to preserve the original image structure. Try a different style or try the generation again; sometimes the model needs a second pass.
- **"400 Bad Request"**: Usually due to image size. The app handles resizing automatically, but very large files might still cause issues.

## Deployment

This project is ready for deployment on Vercel.

1. Push your code to GitHub/GitLab.
2. Import the project into Vercel.
3. Add the `VENICE_API_KEY` environment variable in Vercel Project Settings.
4. Deploy.

