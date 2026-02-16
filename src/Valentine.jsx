import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* assets */
import EnvelopeClosed from "./assets/envelope-closed.png";
import EnvelopeOpen from "./assets/envelope-open.png";
import Letter from "./assets/letter.png";
import Heart from "./assets/heart.gif";
import Teddy from "./assets/teddy.gif";

import BgHeart from "./assets/bg-heart.png";
import BgLetter from "./assets/bg-letter.png";
import BgChocolate from "./assets/bg-chocolate.png";
import BgCard from "./assets/bg-card.png";

/* constants */
const MODES = ["RANDOM", "SWAP", "DODGE", "CONFIRM"];
const ACTIVE_MODES = ["SWAP", "DODGE", "CONFIRM"];

const QUESTIONS = [
  "Are you sure?",
  "Do you really want to break my heart?",
  "Think again, please",
  "This feels like a mistake",
  "Last chance to reconsider",
];

const HAPPY_MESSAGES = [
  "Good choice. Your future self approves 💖",
  "That just unlocked extra happiness for you ✨",
  "You chose correctly. Life gets sweeter now 🍫",
  "This decision comes with daily smiles 🥰",
  "Smart move. This was clearly the best option 💕",
  "Congratulations. You picked the winning path 🌸",
  "This choice has excellent taste written all over it 💫",
  "Nice. Your luck just improved a little 💖",
  "That was the better timeline, honestly ✨",
  "You deserve this choice. It suits you 💗",
];

const backgroundItems = [
  { src: BgHeart, left: "10%", size: 36 },
  { src: BgLetter, left: "30%", size: 42 },
  { src: BgChocolate, left: "60%", size: 38 },
  { src: BgCard, left: "80%", size: 44 },
];

export default function Valentine() {
  /* stage */
  const [stage, setStage] = useState("closed");
  const [submitted, setSubmitted] = useState(false);

  /* mode */
  const randomMode = useMemo(
    () => ACTIVE_MODES[Math.floor(Math.random() * ACTIVE_MODES.length)],
    [],
  );
  const [mode, setMode] = useState("RANDOM");
  const activeMode = mode === "RANDOM" ? randomMode : mode;

  /* roles */
  const [leftRole, setLeftRole] = useState("YES");
  const rightRole = leftRole === "YES" ? "NO" : "YES";

  /* confirm */
  const [questionIndex, setQuestionIndex] = useState(0);
  const [yesScale, setYesScale] = useState(1);

  /* dodge */
  const [noOffset, setNoOffset] = useState({ x: 0, y: 0 });
  const noRef = useRef(null);

  /* opening animation */
  useEffect(() => {
    const t1 = setTimeout(() => setStage("open"), 600);
    const t2 = setTimeout(() => setStage("letter"), 900);
    const t3 = setTimeout(() => setStage("content"), 1500);
    return () => [t1, t2, t3].forEach(clearTimeout);
  }, []);

  /* swap */
  const swapRoles = () => {
    setLeftRole((r) => (r === "YES" ? "NO" : "YES"));
    setNoOffset({ x: 0, y: 0 });
  };

  /* true dodge: distance based */
  const handleMouseMove = (e) => {
    if (activeMode !== "DODGE" || !noRef.current) return;

    const rect = noRef.current.getBoundingClientRect();
    const noCenter = {
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    };

    const dx = e.clientX - noCenter.x;
    const dy = e.clientY - noCenter.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const SAFE_DISTANCE = 120;

    if (distance < SAFE_DISTANCE) {
      const angle = Math.random() * Math.PI * 2;
      const jump = 220 + Math.random() * 120;

      setNoOffset({
        x: Math.cos(angle) * jump,
        y: Math.sin(angle) * jump,
      });
    }
  };

  const handleClick = (role) => {
    if (role === "NO" && activeMode === "CONFIRM") {
      setQuestionIndex((q) => Math.min(q + 1, QUESTIONS.length - 1));
      setYesScale((s) => s + 0.2); // NEVER capped
      return;
    }

    if (role === "YES") {
      setSubmitted(true);
    }
  };

  const happyMessage = useMemo(
    () => HAPPY_MESSAGES[Math.floor(Math.random() * HAPPY_MESSAGES.length)],
    [],
  );

  return (
    <div
      className="relative min-h-screen overflow-hidden bg-gradient-to-br from-pink-200 via-rose-200 to-pink-300 flex items-center justify-center"
      onMouseMove={handleMouseMove}
    >
      {/* background */}
      {backgroundItems.map((item, i) => (
        <motion.img
          key={i}
          src={item.src}
          className="absolute opacity-15 pointer-events-none"
          style={{ left: item.left, width: item.size, bottom: -100 }}
          animate={{ y: [0, -900], x: [0, i % 2 ? -40 : 40] }}
          transition={{
            duration: 30 + i * 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}

      <div className="relative w-full max-w-lg h-[580px] flex items-center justify-center z-10">
        {/* envelope */}
        <motion.img
          src={stage === "closed" ? EnvelopeClosed : EnvelopeOpen}
          className="absolute w-64 z-10"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
        />

        {/* letter */}
        <AnimatePresence>
          {stage !== "closed" && (
            <motion.img
              src={Letter}
              className="absolute w-72 z-20"
              initial={{ y: 90, opacity: 0 }}
              animate={{ y: -90, opacity: 1 }}
            />
          )}
        </AnimatePresence>

        {/* card */}
        <AnimatePresence>
          {stage === "content" && (
            <motion.div
              className="absolute w-full max-w-md bg-white/90 backdrop-blur-md rounded-3xl shadow-2xl p-8 text-center z-30"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
            >
              {!submitted ? (
                <>
                  <img src={Heart} className="mx-auto w-16 mb-4" />

                  <h1 className="text-3xl font-semibold text-rose-600 mb-2">
                    {activeMode === "CONFIRM"
                      ? QUESTIONS[questionIndex]
                      : "Will you be my Valentine"}
                  </h1>

                  {/* mode selector */}
                  <div className="flex justify-center mb-5">
                    <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-rose-100 border border-rose-200 shadow-sm">
                      <span className="text-sm text-rose-500">Mode</span>
                      <select
                        value={mode}
                        onChange={(e) => setMode(e.target.value)}
                        className="bg-transparent text-sm font-medium text-rose-600 focus:outline-none"
                      >
                        {MODES.map((m) => (
                          <option key={m}>{m}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <img src={Teddy} className="mx-auto w-40 mb-8" />

                  {/* buttons */}
                  <div className="relative flex items-center justify-center gap-6 h-24">
                    {/* LEFT */}
                    <button
                      onMouseEnter={() => {
                        if (activeMode === "SWAP" && leftRole === "NO")
                          swapRoles();
                      }}
                      onClick={() => handleClick(leftRole)}
                      style={{
                        transform:
                          leftRole === "YES"
                            ? `scale(${yesScale})`
                            : activeMode === "DODGE"
                              ? `translate(${noOffset.x}px, ${noOffset.y}px)`
                              : "none",
                      }}
                      ref={leftRole === "NO" ? noRef : null}
                      className={`px-8 py-4 rounded-full text-lg font-medium shadow-md transition-all duration-200 ${
                        leftRole === "YES"
                          ? "bg-rose-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {leftRole}
                    </button>

                    {/* RIGHT */}
                    <button
                      onMouseEnter={() => {
                        if (activeMode === "SWAP" && rightRole === "NO")
                          swapRoles();
                      }}
                      onClick={() => handleClick(rightRole)}
                      style={{
                        transform:
                          rightRole === "YES"
                            ? `scale(${yesScale})`
                            : activeMode === "DODGE"
                              ? `translate(${noOffset.x}px, ${noOffset.y}px)`
                              : "none",
                      }}
                      ref={rightRole === "NO" ? noRef : null}
                      className={`px-8 py-4 rounded-full text-lg font-medium shadow-md transition-all duration-200 ${
                        rightRole === "YES"
                          ? "bg-rose-500 text-white"
                          : "bg-gray-200 text-gray-700"
                      }`}
                    >
                      {rightRole}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <motion.div className="absolute inset-0 pointer-events-none">
                    {[...Array(16)].map((_, i) => (
                      <motion.div
                        key={i}
                        className="absolute w-3 h-3 bg-rose-400 rounded-full"
                        style={{ left: `${Math.random() * 100}%` }}
                        animate={{ y: [0, 500], rotate: 360 }}
                        transition={{
                          duration: 2 + Math.random(),
                          repeat: Infinity,
                        }}
                      />
                    ))}
                  </motion.div>

                  <img src={Heart} className="mx-auto w-20 mb-6" />
                  <h1 className="text-4xl font-semibold text-rose-600">
                    {happyMessage}
                  </h1>
                </>
              )}

              <p className="mt-8 text-sm text-rose-400">With care.</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
