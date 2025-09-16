# Plan for New Matrix Background Effect

This document outlines the steps to implement a new, more reliable, and responsive Matrix-like background effect, replacing the problematic existing one.

## Phase 1: Cleanup (Already partially done, but will re-verify)

1.  **Remove existing Matrix CSS from `src/index.css`:**
    *   Delete all rules related to `.matrix-container`, `.matrix-pattern`, `.matrix-column`, and `@keyframes fall`.
    *   Ensure no other Matrix-specific styles remain.
2.  **Remove existing Matrix HTML from `src/App.tsx`:**
    *   Delete the `<div className="matrix-container">...</div>` block.

## Phase 2: New Component Implementation

1.  **Create `src/components/layout/NewMatrixBackground.tsx`:**
    *   This will be a React component responsible for rendering the Matrix effect.
    *   **Character Generation:** Dynamically generate a grid of characters (e.g., "0" and "1", or Japanese Katakana characters). The number of characters will be responsive to screen size.
    *   **Falling Animation:** Implement a CSS-based falling animation for each character. Each character will have a random `animation-delay` and `animation-duration` to create a natural, staggered effect.
    *   **Styling:**
        *   Characters will be red (aligned with the project's theme).
        *   Apply a subtle glow effect to the characters.
        *   Ensure the background is dark/black.
    *   **Responsiveness:** The component will be designed to scale correctly across different screen sizes and orientations.
2.  **Integrate `NewMatrixBackground.tsx` into `App.tsx`:**
    *   Import the new component.
    *   Render it in the same position where the old Matrix HTML was, ensuring it acts as a full-screen background (`absolute inset-0 -z-10`).

## Phase 3: Verification

1.  **Visual Confirmation:** Verify that the new Matrix effect is visible, responsive, and does not cause horizontal scrollbars.
2.  **Code Cleanliness:** Ensure no leftover code from the old Matrix implementation remains.

---
