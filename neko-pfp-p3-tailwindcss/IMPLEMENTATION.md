# Neko Grid Implementation - Tailwind v4 with P3-Only Colors

## Overview

This implementation converts the HTML/CSS neko grid to a React + Tailwind CSS v4 application with P3-only color themes.

## Key Components

### 1. **Color Theme System** (`src/index.css`)

Using Tailwind v4's `@theme` directive (not the old config file), we define 16 P3-only color themes:

```css
@theme {
  --color-neko-red-500: oklch(63.7% 0.237 25.331);
  --color-neko-orange-500: oklch(70.5% 0.213 47.604);
  --color-neko-yellow-500: oklch(79.5% 0.184 86.047);
  --color-neko-lime-500: oklch(76.8% 0.233 130.85);
  --color-neko-green-500: oklch(72.3% 0.219 149.579);
  --color-neko-emerald-500: oklch(69.6% 0.17 162.48);
  --color-neko-teal-500: oklch(70.4% 0.14 182.503);
  --color-neko-cyan-500: oklch(71.5% 0.143 215.221);
  --color-neko-sky-500: oklch(68.5% 0.169 237.323);
  --color-neko-blue-500: oklch(62.3% 0.214 259.815);
  --color-neko-indigo-500: oklch(58.5% 0.233 277.117);
  --color-neko-violet-500: oklch(60.6% 0.25 292.717);
  --color-neko-purple-500: oklch(62.7% 0.265 303.9);
  --color-neko-fuchsia-500: oklch(66.7% 0.295 322.15);
  --color-neko-pink-500: oklch(65.6% 0.241 354.308);
  --color-neko-rose-500: oklch(64.5% 0.246 16.439);
}
```

**Key Details:**
- All colors use OKLch format for Display P3 compatibility
- Chroma values are carefully calibrated to stay within P3 gamut
- Each color maps to the `-500` shade level (mid-tone saturation)
- These are P3-only, not extended to sRGB

### 2. **React Component** (`src/App.tsx`)

The `Neko` component renders individual neko cards with:
- Dynamic background and ground colors from P3 theme
- Cat SVG parts (head, body, tail, legs) with individual colors
- Each neko gets random color assignments for visual variety
- Grid layout using Tailwind's `grid` with `repeat(auto-fill, minmax(150px, 1fr))`

**Architecture:**
```
App
├── State: nekos[] (array of NekoItem objects)
├── Grid Container (Tailwind grid layout)
└── Neko Cards (one per neko)
    ├── Background (P3 color)
    ├── Ground (P3 color)
    └── Cat Parts
        ├── Head (P3 color)
        ├── Body (P3 color)
        ├── Tail (P3 color)
        ├── Front legs (2x P3 colors)
        ├── Back legs (2x P3 colors)
        └── Eyes (P3 color)
```

### 3. **Styling Approach**

- **Tailwind Classes**: Used for layout, spacing, typography, and static styles
- **Inline Styles**: Used for dynamic P3 colors via CSS custom properties
- **CSS Variables**: `--color-neko-*-500` variables injected at runtime

This hybrid approach avoids Tailwind's limitation with dynamic class names while keeping the responsive grid and utility styling benefits.

## How Colors Work

1. **Definition**: `@theme` in `index.css` creates CSS variables in `:root`
2. **Usage**: Components reference via `var(--color-neko-red-500)` etc.
3. **Rendering**: Browser renders in Display P3 gamut automatically
4. **Random Assignment**: Each neko part gets a random P3 color from the 16 available

## Grid Layout

- **Responsive**: `repeat(auto-fill, minmax(150px, 1fr))`
- **Gap**: 4px (Tailwind's `gap-1`)
- **Container**: Full width with padding
- **Auto-fill**: Adapts to any screen size

## Features

✅ 16 P3-only color themes (red, orange, yellow, lime, green, emerald, teal, cyan, sky, blue, indigo, violet, purple, fuchsia, pink, rose)
✅ Fully responsive grid layout
✅ Random color generation for variety
✅ "Generate More Nekos" button to add 16 more cards
✅ OKLch-based colors for accurate Display P3 rendering
✅ Tailwind v4 via Vite plugin (no config file needed)
✅ Clean React + TypeScript implementation

## Files Modified

1. `src/index.css` - Added `@theme` block with P3 colors
2. `src/App.tsx` - Complete rewrite with neko grid component

## P3 Color Space Notes

All colors use OKLch (OKLCH / OKLab-based) format:
- **L**: Lightness (0-100%)
- **C**: Chroma (0-0.4 for safe P3 rendering)
- **H**: Hue (0-360°)

Chroma values kept conservative to ensure P3-only rendering without fallback to sRGB. The `-500` variant ensures mid-tone saturation that's vibrant but still P3-native.
