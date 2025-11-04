import { useCallback, useEffect, useState } from "react";

const NEKO_COLORS = [
  "neko-red",
  "neko-orange",
  "neko-yellow",
  "neko-lime",
  "neko-green",
  "neko-emerald",
  "neko-teal",
  "neko-cyan",
  "neko-sky",
  "neko-blue",
  "neko-indigo",
  "neko-violet",
  "neko-purple",
  "neko-fuchsia",
  "neko-pink",
  "neko-rose",
] as const;

type NekoColor = (typeof NEKO_COLORS)[number];
type ColorName = NekoColor extends `neko-${infer Name}` ? Name : never;

function createColorEntry<T extends NekoColor>(color: T) {
  type Name = T extends `neko-${infer N}` ? N : never;
  return [
    color,
    {
      name: color.replace("neko-", "") as Name,
      color,
      var: `var(--color-${color})` as const,
      bg: `bg-${color}` as const,
    },
  ] as const;
}

const colors = Object.fromEntries(NEKO_COLORS.map(createColorEntry)) as {
  [K in NekoColor]: ReturnType<typeof createColorEntry<K>>[1];
};

const allCursors = [
  { name: "mouse", emoji: "🐭" },
  { name: "rabbit", emoji: "🐇" },
  { name: "fish", emoji: "🐟" },
  { name: "blowfish", emoji: "🐡" },
  { name: "shark", emoji: "🦈" },
  { name: "octopus", emoji: "🐙" },
  { name: "steak", emoji: "🥩" },
  { name: "cheese", emoji: "🧀" },
  { name: "snake", emoji: "🐍" },
  { name: "pretzel", emoji: "🥨" },
  { name: "lobster", emoji: "🦞" },
  { name: "yarn", emoji: "🧶" },
  { name: "pineapple", emoji: "🍍" },
  { name: "banana", emoji: "🍌" },
  { name: "pear", emoji: "🍐" },
  { name: "crab", emoji: "🦀" },
  { name: "shrimp", emoji: "🦐" },
  { name: "eggplant", emoji: "🍆" },
  { name: "cucumber", emoji: "🥒" },
  { name: "popcorn", emoji: "🍿" },
  // { name: "cheese wedge", emoji: "🧀" },
  { name: "ear of corn", emoji: "🌽" },
  { name: "tropical fish", emoji: "🐠" },
  { name: "oyster", emoji: "🦪" },
  { name: "grapes", emoji: "🍇" },
  { name: "bacon", emoji: "🥓" },
  { name: "watermelon", emoji: "🍉" },
  { name: "squid", emoji: "🦑" },
  { name: "fish cake", emoji: "🍥" },
  { name: "peach", emoji: "🍑" },
  { name: "sushi", emoji: "🍣" },
  { name: "tangerine", emoji: "🍊" },
  { name: "mango", emoji: "🥭" },
  // { name: "cut of meat", emoji: "🥩" },
  { name: "fried shrimp", emoji: "🍤" },
  { name: "meat on bone", emoji: "🍖" },
  { name: "milk", emoji: "🥛" },
  { name: "sausage", emoji: "🌭" },
  // { name: "tuna", emoji: "🐟" },
  // { name: "salmon", emoji: "🐟" },
  { name: "rubberduck", emoji: "🦆" },
];

interface NekoItem {
  id: string;
  bgColor: (typeof colors)[NekoColor];
  groundColor: string;
  catEyes: (typeof colors)[NekoColor];
  catHead: (typeof colors)[NekoColor];
  catBody: (typeof colors)[NekoColor];
  catTail: (typeof colors)[NekoColor];
  catLeg1: (typeof colors)[NekoColor];
  catLeg2: (typeof colors)[NekoColor];
  catLeg3: (typeof colors)[NekoColor];
  catLeg4: (typeof colors)[NekoColor];
  cursor: { name: string; emoji: string };
}

// interface NekoItem {
//   id: string;
//   bgColor: NekoColor;
//   groundColor: NekoColor;
//   catEyes: NekoColor;
//   catHead: NekoColor;
//   catBody: NekoColor;
//   catTail: NekoColor;
//   catLeg1: NekoColor;
//   catLeg2: NekoColor;
//   catLeg3: NekoColor;
//   catLeg4: NekoColor;
//   cursor: { name: string; emoji: string };
// }

function NekoCard({ neko }: { neko: NekoItem }) {
  return (
    <div
      className={`rounded-full relative h-[150px] w-[150px] overflow-hidden }`}
      data-neko={JSON.stringify({
        bgColor: neko.bgColor.name,
        groundColor: neko.groundColor,
        catEyes: neko.catEyes.name,
        catHead: neko.catHead.name,
        catBody: neko.catBody.name,
        catTail: neko.catTail.name,
        catLeg1: neko.catLeg1.name,
        catLeg2: neko.catLeg2.name,
        catLeg3: neko.catLeg3.name,
        catLeg4: neko.catLeg4.name,
        cursor: neko.cursor,
      })}
    >
      {/* Cat container */}
      <div className="-translate-x-1/2 absolute bottom-[50px] left-1/2 h-[30px] w-[60px]">
        {/* Head */}
        <div className="-top-[30px] absolute right-[22px] z-10 h-[40px] w-[48px]">
          <svg
            viewBox="0 -0.5 76 61"
            shapeRendering="crispEdges"
            className="h-full w-full"
          >
            <polygon
              points="63.8,54.1 50.7,54.1 50.7,59.6 27.1,59.6 27.1,54.1 12.4,54.1 12.4,31.8 63.8,31.8"
              fill={neko.catEyes.var}
            />
            <path
              d="M15.3,45.9h5.1V35.7h-5.1C15.3,35.7,15.3,45.9,15.3,45.9z M45.8,56.1V51H30.6v5.1H45.8z M61.1,35.7H56v10.2h5.1 V35.7z M10.2,61.2v-5.1H5.1V51H0V25.5h5.1V15.3h5.1V5.1h5.1V0h5.1v5.1h5.1v5.1h5.1v5.1c0,0,15.2,0,15.2,0v-5.1h5.1V5.1H56V0h5.1v5.1h5.1v10.2h5.1v10.2h5.1l0,25.5h-5.1v5.1h-5.1v5.1H10.2z"
              fill={neko.catHead.var}
            />
          </svg>

          {/* Emoji Icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 20 24"
            className="absolute h-[24px] w-[24px]"
            style={{ left: "-20px", top: "40px", zIndex: 15 }}
          >
            <text
              y="50%"
              x="50%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="20"
            >
              {neko.cursor.emoji}
            </text>
          </svg>
        </div>

        {/* Body */}
        <div className="absolute h-[30px] w-[60px]">
          <svg
            viewBox="0 0 91.7 40.8"
            shapeRendering="crispEdges"
            className="h-full w-full"
          >
            <path
              d="M91.7,40.8H0V10.2h5.1V5.1h5.1V0h66.2v5.1h10.2v5.1h5.1L91.7,40.8z"
              fill={neko.catBody.var}
            />
          </svg>
        </div>

        {/* Tail */}
        <div className="-top-[25px] absolute left-[45px] h-[36px] w-[15px]">
          <svg
            viewBox="0 0 25.5 61.1"
            shapeRendering="crispEdges"
            className="h-full w-full"
          >
            <polygon
              points="10.2,56 10.2,50.9 5.1,50.9 5.1,40.7 0,40.7 0,20.4 5.1,20.4 5.1,10.2 10.2,10.2 10.2,5.1 15.3,5.1 15.3,0 25.5,0 25.5,10.2 20.4,10.2 20.4,15.3 15.3,15.3 15.3,20.4 10.2,20.4 10.2,40.7 15.3,40.7 15.3,45.8 20.4,45.8 20.4,50.9 25.5,50.9 25.5,61.1 15.3,61.1 15.3,56"
              fill={neko.catTail.var}
            />
          </svg>
        </div>

        {/* Front Legs */}
        <div className="absolute right-[30px] h-[30px] w-[30px]">
          <div className="-bottom-[15px] absolute right-0 h-[20px] w-[10px]">
            <svg
              viewBox="0 0 14 30.5"
              shapeRendering="crispEdges"
              className="h-full w-full"
            >
              <polygon
                points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0"
                fill={neko.catLeg1.var}
              />
            </svg>
          </div>
          <div className="-bottom-[15px] absolute left-0 h-[20px] w-[10px]">
            <svg
              viewBox="0 0 14 30.5"
              shapeRendering="crispEdges"
              className="h-full w-full"
            >
              <polygon
                points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0"
                fill={neko.catLeg2.var}
              />
            </svg>
          </div>
        </div>

        {/* Back Legs */}
        <div className="absolute left-[35px] h-[30px] w-[25px]">
          <div className="-bottom-[15px] absolute right-0 h-[20px] w-[10px]">
            <svg
              viewBox="0 0 14 30.5"
              shapeRendering="crispEdges"
              className="h-full w-full"
            >
              <polygon
                points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0"
                fill={neko.catLeg3.var}
              />
            </svg>
          </div>
          <div className="-bottom-[15px] absolute left-0 h-[20px] w-[10px]">
            <svg
              viewBox="0 0 14 30.5"
              shapeRendering="crispEdges"
              className="h-full w-full"
            >
              <polygon
                points="15.3,30.5 5.1,30.5 5.1,25.4 0,25.4 0,0 15.3,0"
                fill={neko.catLeg4.var}
              />
            </svg>
          </div>
        </div>
      </div>

      {/* Ground */}
      <div
        className={`absolute bottom-0 left-0 h-[35px] w-full`}
        // style={{ backgroundColor: neko.groundColor }}
      />
    </div>
  );
}

function App() {
  const [nekos, setNekos] = useState<NekoItem[]>([]);

  const generateRandomNeko = useCallback((): NekoItem => {
    const getRandomColor = () => {
      const color = NEKO_COLORS[Math.floor(Math.random() * NEKO_COLORS.length)];

      return colors[color];
    };

    const getRandomCursor = () =>
      allCursors[Math.floor(Math.random() * allCursors.length)];

    const groundAsDarkerBG = Math.random() < 1;
    const bg = getRandomColor();

    const ground = groundAsDarkerBG
      ? `color-mix(in oklch, ${bg.var} 55%, black)`
      : getRandomColor().var;

    const cat = getRandomColor();
    const eyes = getRandomColor();

    return {
      id: Math.random().toString(36).slice(2, 9),
      bgColor: bg,
      groundColor: ground,
      catEyes: eyes,
      catHead: cat,
      catBody: cat,
      catTail: cat,
      catLeg1: cat,
      catLeg2: cat,
      catLeg3: cat,
      catLeg4: cat,
      cursor: getRandomCursor(),
    };
  }, []);

  useEffect(() => {
    const initialNekos = Array.from({ length: 176 }, () =>
      generateRandomNeko(),
    );
    setNekos(initialNekos);
  }, [generateRandomNeko]);

  const addMoreNekos = () => {
    const newNekos = Array.from({ length: 44 }, () => generateRandomNeko());
    setNekos((prev) => [...prev, ...newNekos]);
  };

  return (
    <div className="flex h-screen w-screen flex-col bg-linear-to-br from-gray-900 to-gray-800">
      <div className="flex-1 overflow-auto p-8">
        <h1 className="mb-2 font-bold text-4xl text-white">Neko PFP Gallery</h1>
        <p className="mb-8 text-gray-400">
          P3-only vibrant nekos • {nekos.length} total
        </p>
        <div className="flex w-full flex-wrap items-center justify-center gap-4">
          {nekos.map((neko) => (
            <NekoCard key={neko.id} neko={neko} />
          ))}
        </div>
      </div>

      <div className="border-gray-700 border-t p-8">
        <button
          onClick={addMoreNekos}
          className="rounded-lg bg-linear-to-r from-pink-500 to-purple-500 px-6 py-3 font-bold text-white shadow-lg transition-all duration-200 hover:from-pink-600 hover:to-purple-600 hover:shadow-xl active:from-pink-700 active:to-purple-700"
        >
          Generate 48 More Nekos
        </button>
      </div>
    </div>
  );
}

export default App;
