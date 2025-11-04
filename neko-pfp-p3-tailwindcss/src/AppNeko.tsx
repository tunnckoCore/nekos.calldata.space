/**
 * AppNeko.tsx
 *
 * Single-file React component that renders the entire Neko as one scalable SVG.
 * Matches the original neko.html template structure exactly.
 *
 * Structure:
 * - Sky background
 * - Ground
 * - Body (path)
 * - Tail (polygon)
 * - Back legs (2 polygons, flipped)
 * - Front legs (2 polygons, flipped)
 * - Eyes polygon (dark band with mouth cutout - shows through head cutouts)
 * - Head path (with cutouts for eyes and mouth areas)
 *
 * Each part uses a UNIQUE debug color for identification.
 */

const AppNeko: React.FC = () => {
  return (
    <div className="neko-root" aria-hidden={false}>
      <style>{`
        .neko-root {
          --neko-sky: #00ff7f;           /* MAGENTA */
          --neko-ground: #007000;        /* YELLOW */
          --neko-left-eye: #00ffff;      /* GREEN - left eye band */
          --neko-right-eye: #00ffff;     /* CYAN - right eye band */
          --neko-mouth: #ffffe0;         /* BLACK - mouth band */
          --neko-head: #c71585;          /* LIGHT PINK */
          --neko-body: #4b0082;          /* ORANGE */
          --neko-tail: #4b0082;          /* RED */
          --neko-leg-1: #4b0082;         /* BLUE - front-right */
          --neko-leg-2: #4b0082;         /* DEEP PINK - front-left */
          --neko-leg-3: #4b0082;         /* DARK VIOLET - back-right */
          --neko-leg-4: #4b0082;         /* SADDLE BROWN - back-left */

          display: inline-block;
        }

        .neko-root svg {
          width: 100%;
          height: auto;
          display: block;
        }

        .neko-root svg * {
          shape-rendering: crispEdges;
          image-rendering: pixelated;
        }
      `}</style>

      <svg
        viewBox="0 0 150 150"
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Single SVG Neko Cat"
      >
        {/* SKY */}
        <rect x="0" y="0" width="150" height="150" fill="var(--neko-sky)" />

        {/* GROUND */}
        <rect x="0" y="115" width="150" height="35" fill="var(--neko-ground)" />

        {/* BODY */}
        <path
          fill="var(--neko-body)"
          d="M105,98 L45,98 L45,84.5 L48.333,84.5 L48.333,81.75 L51.667,81.75 L51.667,78 L94.667,78 L94.667,81.75 L101.333,81.75 L101.333,84.5 L105,84.5 L105,98z"
        />

        {/* TAIL */}
        <polygon
          fill="var(--neko-tail)"
          points="96,85 96,82 93,82 93,76 90,76 90,64 93,64 93,58 96,58 96,55 99,55 99,52 105,52 105,58 102,58 102,61 99,61 99,64 96,64 96,76 99,76 99,79 102,79 102,82 105,82 105,88 99,88 99,85"
        />

        {/* BACK LEGS - FLIPPED */}
        <polygon
          fill="var(--neko-leg-4)"
          points="64.5,115 71,115 71,111.656 74.25,111.656 74.25,95 64.5,95"
        />
        <polygon
          fill="var(--neko-leg-3)"
          points="93.5,115 100,115 100,111.656 103.25,111.656 103.25,95 93.5,95"
        />

        {/* FRONT LEGS - FLIPPED */}
        <polygon
          fill="var(--neko-leg-2)"
          points="79,115 85.5,115 85.5,111.656 88.75,111.656 88.75,95 79,95"
        />
        <polygon
          fill="var(--neko-leg-1)"
          points="45,115 51.5,115 51.5,111.656 54.75,111.656 54.75,95 45,95"
        />

        {/* LEFT EYE BAND - shows through left eye cutout in head */}
        {/* Left eye cutout in head path: x=42.66 to 45.88, y=67.738 to 74.393 */}
        <rect
          x="42.66"
          y="67.738"
          width="3.22"
          height="6.655"
          fill="var(--neko-left-eye)"
        />

        {/* RIGHT EYE BAND - shows through right eye cutout in head */}
        {/* Right eye cutout in head path: x=68.33 to 71.55, y=67.738 to 74.393 */}
        <rect
          x="68.33"
          y="67.738"
          width="3.22"
          height="6.655"
          fill="var(--neko-right-eye)"
        />

        {/* MOUTH BAND - shows through mouth cutout in head */}
        {/* Mouth cutout in head path: x=52.33 to 61.91, y=77.475 to 80.721 */}
        <rect
          x="52.33"
          y="77.475"
          width="9.58"
          height="3.246"
          fill="var(--neko-mouth)"
        />

        {/* HEAD PATH - with cutouts for left eye, right eye, and mouth */}
        <path
          fill="var(--neko-head)"
          d="M42.66,74.393 L45.88,74.393 L45.88,67.738 L42.66,67.738 L42.66,74.393z M61.91,80.721 L61.91,77.475 L52.33,77.475 L52.33,80.721 L61.91,80.721z M71.55,67.738 L68.33,67.738 L68.33,74.393 L71.55,74.393 L71.55,74.393z M39.44,84.295 L39.44,80.721 L36.22,80.721 L36.22,77.475 L33,77.475 L33,61.082 L36.22,61.082 L36.22,54.361 L39.44,54.361 L39.44,47.689 L42.66,47.689 L42.66,44.328 L45.88,44.328 L45.88,47.689 L49.11,47.689 L49.11,51.016 L52.33,51.016 L52.33,54.361 L61.91,54.361 L61.91,51.016 L65.13,51.016 L65.13,47.689 L68.33,47.689 L68.33,44.328 L71.55,44.328 L71.55,47.689 L74.77,47.689 L74.77,54.361 L77.99,54.361 L77.99,61.082 L81.21,61.082 L81.21,77.475 L77.99,77.475 L77.99,80.721 L74.77,80.721 L74.77,84.295 L39.44,84.295z"
        />
      </svg>
    </div>
  );
};

export default AppNeko;
