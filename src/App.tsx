import { useRef, useEffect, useState, useCallback } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useInView,
  AnimatePresence,
} from "framer-motion";

// ─── Data ────────────────────────────────────────────────────────────────────

const POKEMON_DATA = [
  { id: "006", name: "CHARIZARD",  type: "FIRE",     theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/charizard.gif"  },
  { id: "009", name: "BLASTOISE",  type: "WATER",    theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/blastoise.gif"  },
  { id: "003", name: "VENUSAUR",   type: "GRASS",    theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/venusaur.gif"   },
  { id: "150", name: "MEWTWO",     type: "PSYCHIC",  theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/mewtwo.gif"     },
  { id: "248", name: "TYRANITAR",  type: "ROCK",     theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/tyranitar.gif"  },
  { id: "249", name: "LUGIA",      type: "FLYING",   theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/lugia.gif"      },
  { id: "250", name: "HO-OH",      type: "FIRE",     theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/hooh.gif"       },
  { id: "382", name: "KYOGRE",     type: "WATER",    theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/kyogre.gif"     },
  { id: "383", name: "GROUDON",    type: "GROUND",   theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/groudon.gif"    },
  { id: "384", name: "RAYQUAZA",   type: "DRAGON",   theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/rayquaza.gif"   },
  { id: "445", name: "GARCHOMP",   type: "DRAGON",   theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/garchomp.gif"   },
  { id: "483", name: "DIALGA",     type: "STEEL",    theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/dialga.gif"     },
  { id: "484", name: "PALKIA",     type: "SPATIAL",  theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/palkia.gif"     },
  { id: "487", name: "GIRATINA",   type: "GHOST",    theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/giratina.gif"   },
  { id: "643", name: "RESHIRAM",   type: "FIRE",     theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/reshiram.gif"   },
  { id: "644", name: "ZEKROM",     type: "ELECTRIC", theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/zekrom.gif"     },
  { id: "716", name: "XERNEAS",    type: "FAIRY",    theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/xerneas.gif"    },
  { id: "717", name: "YVELTAL",    type: "DARK",     theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/yveltal.gif"    },
  { id: "791", name: "SOLGALEO",   type: "STEEL",    theme: "light", img: "https://play.pokemonshowdown.com/sprites/ani/solgaleo.gif"   },
  { id: "792", name: "LUNALA",     type: "PSYCHIC",  theme: "dark",  img: "https://play.pokemonshowdown.com/sprites/ani/lunala.gif"     },
];

const S1 = POKEMON_DATA.slice(0, 5);
const S2 = POKEMON_DATA.slice(5, 10);
const S3 = POKEMON_DATA.slice(10, 15);
const S4 = POKEMON_DATA.slice(15, 20);

// ─── Custom Cursor ────────────────────────────────────────────────────────────

function CustomCursor() {
  const dot  = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const ringX = useMotionValue(0);
  const ringY = useMotionValue(0);
  const springX = useSpring(ringX, { stiffness: 160, damping: 20 });
  const springY = useSpring(ringY, { stiffness: 160, damping: 20 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (dot.current) {
        dot.current.style.left  = e.clientX + "px";
        dot.current.style.top   = e.clientY + "px";
      }
      ringX.set(e.clientX);
      ringY.set(e.clientY);
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [ringX, ringY]);

  return (
    <>
      <div ref={dot} className="cursor-dot" />
      <motion.div
        ref={ring}
        className="cursor-ring"
        style={{ x: springX, y: springY, translateX: "-50%", translateY: "-50%" }}
      />
    </>
  );
}

// ─── Fixed HUD ────────────────────────────────────────────────────────────────

function HUD({ isDark }: { isDark: boolean }) {
  const textColor = isDark ? "#F9F6F0" : "#111111";
  const borderColor = isDark ? "rgba(249,246,240,0.15)" : "rgba(17,17,17,0.12)";

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-50"
      animate={{ color: textColor }}
      transition={{ duration: 0.6, ease: "easeInOut" }}
    >
      {/* Frame borders */}
      {(["top","bottom","left","right"] as const).map((side) => (
        <motion.div
          key={side}
          className="absolute"
          style={{
            ...(side === "top"    ? { top: 0, left: 0, right: 0, height: 1 } : {}),
            ...(side === "bottom" ? { bottom: 0, left: 0, right: 0, height: 1 } : {}),
            ...(side === "left"   ? { left: 0, top: 0, bottom: 0, width: 1 } : {}),
            ...(side === "right"  ? { right: 0, top: 0, bottom: 0, width: 1 } : {}),
            background: borderColor,
          }}
          animate={{ background: borderColor }}
          transition={{ duration: 0.6 }}
        />
      ))}

      {/* Navigation bar */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-between px-8 py-5"
        style={{
          backdropFilter: "blur(12px)",
          borderBottom: `1px solid ${borderColor}`,
        }}
      >
        <motion.span
          className="text-xs font-bold tracking-[0.3em] uppercase"
          animate={{ color: textColor }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          CODEX — 2026
        </motion.span>

        <motion.span
          className="text-xs font-bold tracking-[0.3em] uppercase"
          animate={{ color: textColor }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          LEGENDARY ARCHIVE
        </motion.span>

        <motion.span
          className="text-xs font-bold tracking-[0.3em] uppercase"
          animate={{ color: textColor }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          VOL. XX
        </motion.span>
      </motion.div>

      {/* Bottom bar */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 flex items-center justify-between px-8 py-4"
        style={{ borderTop: `1px solid ${borderColor}` }}
      >
        <motion.span
          className="text-[10px] tracking-[0.35em] uppercase opacity-50"
          animate={{ color: textColor }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          SCROLL TO EXPLORE
        </motion.span>
        <motion.span
          className="text-[10px] tracking-[0.35em] uppercase opacity-50"
          animate={{ color: textColor }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          ✦ INTERACTIVE ✦
        </motion.span>
        <motion.span
          className="text-[10px] tracking-[0.35em] uppercase opacity-50"
          animate={{ color: textColor }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          ANIMATED SPRITES
        </motion.span>
      </motion.div>

      {/* Corner metrics */}
      {[
        { cls: "top-16 left-8",    label: "001—020" },
        { cls: "top-16 right-8",   label: "KANTO / SINNOH" },
        { cls: "bottom-12 left-8", label: "FULL SPECTRUM" },
        { cls: "bottom-12 right-8",label: "GEN I — IX" },
      ].map(({ cls, label }) => (
        <motion.div
          key={label}
          className={`absolute ${cls} text-[9px] tracking-[0.3em] uppercase opacity-30`}
          animate={{ color: textColor }}
          transition={{ duration: 0.6 }}
          style={{ fontFamily: "'Space Mono', monospace" }}
        >
          {label}
        </motion.div>
      ))}

      {/* Corner ticks */}
      {["tl","tr","bl","br"].map((c) => (
        <div key={c} className={`corner-tick ${c}`} style={{ color: textColor }} />
      ))}
    </motion.div>
  );
}

// ─── Section 1: Alabaster Minimalist Floats ───────────────────────────────────

function FloatItem({ pokemon, index }: { pokemon: typeof S1[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-30% 0px -30% 0px" });

  const floatY = useMotionValue(0);
  const springFloatY = useSpring(floatY, { stiffness: 30, damping: 15 });

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const offset = index * 1.4;

    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      floatY.set(Math.sin(t * 0.8 + offset) * 14);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [floatY, index]);

  return (
    <div ref={ref} className="h-screen flex items-center justify-center relative">
      <div className="crosshair-h" style={{ color: "#111111" }} />
      <div className="crosshair-v" style={{ color: "#111111" }} />

      <AnimatePresence>
        {isInView && (
          <motion.div
            key={pokemon.id}
            initial={{ opacity: 0, scale: 0.7, y: 60 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.85, y: -40 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-8 select-none"
          >
            <motion.div style={{ y: springFloatY }}>
              <img
                src={pokemon.img}
                alt={pokemon.name}
                className="sprite shadow-hard-cream"
                style={{ width: 220, height: 220, objectFit: "contain" }}
                draggable={false}
              />
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
            >
              <span
                className="text-[clamp(2.5rem,7vw,6rem)] font-bold uppercase tracking-[0.15em] leading-none"
                style={{ color: "#111111", fontFamily: "'Space Mono', monospace" }}
              >
                {pokemon.name}
              </span>
              <div className="flex items-center gap-4">
                <span className="type-pill" style={{ color: "#111111" }}>{pokemon.type}</span>
                <span
                  className="text-[9px] tracking-[0.4em] uppercase opacity-30"
                  style={{ color: "#111111", fontFamily: "'Space Mono', monospace" }}
                >
                  #{pokemon.id}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section1() {
  return (
    <div className="section-cream relative">
      {S1.map((p, i) => (
        <FloatItem key={p.id} pokemon={p} index={i} />
      ))}
    </div>
  );
}

// ─── Section 2: Inversion Rift ────────────────────────────────────────────────

function RiftItem({ pokemon, index }: { pokemon: typeof S2[0]; index: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-20% 0px -20% 0px" });
  const fromLeft = index % 2 === 0;

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const rotateX = useSpring(useTransform(mouseY, [-300, 300], [12, -12]), { stiffness: 100, damping: 20 });
  const rotateY = useSpring(useTransform(mouseX, [-300, 300], [-12, 12]), { stiffness: 100, damping: 20 });

  const onMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const rect = (e.currentTarget as HTMLDivElement).getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  }, [mouseX, mouseY]);

  const onMouseLeave = useCallback(() => {
    mouseX.set(0);
    mouseY.set(0);
  }, [mouseX, mouseY]);

  const floatY = useMotionValue(0);
  const springFloatY = useSpring(floatY, { stiffness: 25, damping: 12 });

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      floatY.set(Math.sin(t * 0.7 + index * 1.1) * 18);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [floatY, index]);

  return (
    <div
      ref={ref}
      className="h-screen flex items-center relative perspective-container"
      style={{ justifyContent: fromLeft ? "flex-start" : "flex-end" }}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
    >
      <div className="crosshair-h" style={{ color: "#F9F6F0" }} />
      <div className="crosshair-v" style={{ color: "#F9F6F0" }} />

      <AnimatePresence>
        {isInView && (
          <motion.div
            key={pokemon.id}
            initial={{ opacity: 0, x: fromLeft ? -200 : 200 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: fromLeft ? -100 : 100 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center gap-8 select-none"
            style={{
              margin: fromLeft ? "0 0 0 12vw" : "0 12vw 0 0",
              transformStyle: "preserve-3d",
            }}
          >
            <motion.div
              style={{
                rotateX,
                rotateY,
                y: springFloatY,
                transformStyle: "preserve-3d",
              }}
            >
              <img
                src={pokemon.img}
                alt={pokemon.name}
                className="sprite shadow-hard-dark"
                style={{ width: 200, height: 200, objectFit: "contain" }}
                draggable={false}
              />
            </motion.div>

            <motion.div
              className="flex flex-col items-center gap-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <span
                className="text-[clamp(2rem,5.5vw,5rem)] font-bold uppercase tracking-[0.15em] leading-none"
                style={{ color: "#F9F6F0", fontFamily: "'Space Mono', monospace" }}
              >
                {pokemon.name}
              </span>
              <div className="flex items-center gap-4">
                <span className="type-pill" style={{ color: "#F9F6F0" }}>{pokemon.type}</span>
                <span
                  className="text-[9px] tracking-[0.4em] uppercase opacity-30"
                  style={{ color: "#F9F6F0", fontFamily: "'Space Mono', monospace" }}
                >
                  #{pokemon.id}
                </span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section2() {
  return (
    <div className="section-charcoal relative">
      {S2.map((p, i) => (
        <RiftItem key={p.id} pokemon={p} index={i} />
      ))}
    </div>
  );
}

// ─── Section 3: Radial Sand Grid ──────────────────────────────────────────────

function Section3() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });

  const orbit = useTransform(scrollYProgress, [0, 1], [0, Math.PI * 2]);
  const smoothOrbit = useSpring(orbit, { stiffness: 40, damping: 18 });

  const RADIUS_X = 340;
  const RADIUS_Y = 130;
  const COUNT = S3.length;

  return (
    <div ref={ref} className="section-sand relative" style={{ minHeight: "400vh" }}>
      <div className="sticky top-0 h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="crosshair-h" style={{ color: "#111111" }} />
        <div className="crosshair-v" style={{ color: "#111111" }} />

        {/* Section label */}
        <motion.div
          className="absolute top-32 left-1/2 -translate-x-1/2 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <span
            className="text-[clamp(0.6rem,1.2vw,1rem)] tracking-[0.4em] uppercase opacity-25"
            style={{ color: "#111111", fontFamily: "'Space Mono', monospace" }}
          >
            ORBITAL RIFT — SAND THEATRE
          </span>
        </motion.div>

        {/* Orbit ring decorative ellipse */}
        <div
          className="absolute pointer-events-none"
          style={{
            width: RADIUS_X * 2 + 120,
            height: RADIUS_Y * 2 + 80,
            borderRadius: "50%",
            border: "1px solid rgba(17,17,17,0.08)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />
        <div
          className="absolute pointer-events-none"
          style={{
            width: RADIUS_X * 2 + 40,
            height: RADIUS_Y * 2 + 20,
            borderRadius: "50%",
            border: "1px solid rgba(17,17,17,0.05)",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        />

        {/* Orbiting sprites */}
        {S3.map((pokemon, i) => {
          const baseAngle = (i / COUNT) * Math.PI * 2;

          return (
            <OrbitalSprite
              key={pokemon.id}
              pokemon={pokemon}
              index={i}
              baseAngle={baseAngle}
              smoothOrbit={smoothOrbit}
              radiusX={RADIUS_X}
              radiusY={RADIUS_Y}
            />
          );
        })}
      </div>
    </div>
  );
}

function OrbitalSprite({
  pokemon, index, baseAngle, smoothOrbit, radiusX, radiusY,
}: {
  pokemon: typeof S3[0];
  index: number;
  baseAngle: number;
  smoothOrbit: ReturnType<typeof useSpring>;
  radiusX: number;
  radiusY: number;
}) {
  const angle = useTransform(smoothOrbit, (v) => v + baseAngle);
  const x     = useTransform(angle, (a) => Math.cos(a) * radiusX);
  const y     = useTransform(angle, (a) => Math.sin(a) * radiusY);
  const scale = useTransform(angle, (a) => {
    const sin = Math.sin(a);
    return 0.65 + (sin + 1) / 2 * 0.65;
  });
  const opacity = useTransform(angle, (a) => {
    const sin = Math.sin(a);
    return 0.35 + (sin + 1) / 2 * 0.65;
  });
  const zIndex = useTransform(angle, (a) => Math.round((Math.sin(a) + 1) * 5));

  return (
    <motion.div
      key={pokemon.id}
      className="absolute flex flex-col items-center gap-3 select-none"
      style={{
        x,
        y,
        scale,
        opacity,
        zIndex,
        translateX: "-50%",
        translateY: "-50%",
        top: "50%",
        left: "50%",
      }}
    >
      <img
        src={pokemon.img}
        alt={pokemon.name}
        className="sprite shadow-hard-cream"
        style={{ width: 150, height: 150, objectFit: "contain" }}
        draggable={false}
      />
      <div className="flex flex-col items-center gap-1 text-center">
        <span
          className="text-[clamp(0.9rem,2.5vw,1.8rem)] font-bold uppercase tracking-[0.2em] leading-none"
          style={{ color: "#111111", fontFamily: "'Space Mono', monospace" }}
        >
          {pokemon.name}
        </span>
        <span className="type-pill" style={{ color: "#111111", fontSize: "0.55rem" }}>
          {pokemon.type}
        </span>
      </div>
    </motion.div>
  );
}

// ─── Section 4: Editorial Canvas Split ────────────────────────────────────────

function SplitItem({
  pokemon,
  index,
}: {
  pokemon: typeof S4[0];
  index: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { margin: "-25% 0px -25% 0px", once: false });

  const floatY = useMotionValue(0);
  const springFloatY = useSpring(floatY, { stiffness: 28, damping: 14 });

  useEffect(() => {
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      floatY.set(Math.sin(t * 0.65 + index * 1.3) * 16);
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, [floatY, index]);

  const isDark = pokemon.theme === "dark";

  return (
    <div
      ref={ref}
      className="h-screen flex items-center justify-center relative overflow-hidden"
    >
      {/* Split background */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full" style={{ background: "#FFFFFF" }} />
        <div className="w-1/2 h-full" style={{ background: "#111111" }} />
      </div>

      {/* Vertical divider line */}
      <div
        className="absolute top-0 bottom-0 left-1/2 w-px pointer-events-none"
        style={{ background: "rgba(17,17,17,0.2)" }}
      />

      {/* Cross hairs */}
      <div className="crosshair-h" style={{ color: "#111111", opacity: 0.04 }} />

      <AnimatePresence>
        {isInView && (
          <motion.div
            key={pokemon.id}
            className="relative z-10 flex flex-col items-center gap-6 select-none"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <motion.div style={{ y: springFloatY }}>
              <img
                src={pokemon.img}
                alt={pokemon.name}
                className="sprite"
                style={{
                  width: 230,
                  height: 230,
                  objectFit: "contain",
                  filter: "drop-shadow(4px 4px 0px rgba(17,17,17,0.15)) drop-shadow(-4px -4px 0px rgba(249,246,240,0.15))",
                }}
                draggable={false}
              />
            </motion.div>

            {/* Name spans across the split — left half in charcoal, right in cream */}
            <div className="relative flex flex-col items-center gap-2">
              <div className="relative overflow-hidden">
                <span
                  className="text-[clamp(2.5rem,6vw,5.5rem)] font-bold uppercase tracking-[0.15em] leading-none block"
                  style={{
                    color: "transparent",
                    WebkitTextStroke: "1px transparent",
                    fontFamily: "'Space Mono', monospace",
                  }}
                >
                  {pokemon.name}
                </span>
                {/* Left half — dark text */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 text-[clamp(2.5rem,6vw,5.5rem)] font-bold uppercase tracking-[0.15em] leading-none block"
                  style={{
                    color: "#111111",
                    fontFamily: "'Space Mono', monospace",
                    clipPath: "inset(0 50% 0 0)",
                  }}
                >
                  {pokemon.name}
                </span>
                {/* Right half — light text */}
                <span
                  aria-hidden="true"
                  className="absolute inset-0 text-[clamp(2.5rem,6vw,5.5rem)] font-bold uppercase tracking-[0.15em] leading-none block"
                  style={{
                    color: "#F9F6F0",
                    fontFamily: "'Space Mono', monospace",
                    clipPath: "inset(0 0 0 50%)",
                  }}
                >
                  {pokemon.name}
                </span>
              </div>

              <div className="flex items-center gap-4">
                {/* Left pill */}
                <span
                  className="type-pill"
                  style={{
                    color: "#111111",
                    borderColor: "#111111",
                    fontSize: "0.58rem",
                  }}
                >
                  {pokemon.type}
                </span>
                {/* Right id */}
                <span
                  className="text-[9px] tracking-[0.4em] uppercase"
                  style={{
                    color: isDark ? "#F9F6F0" : "#111111",
                    fontFamily: "'Space Mono', monospace",
                    opacity: 0.35,
                  }}
                >
                  #{pokemon.id}
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Section4() {
  return (
    <div className="relative">
      {S4.map((p, i) => (
        <SplitItem key={p.id} pokemon={p} index={i} />
      ))}
    </div>
  );
}

// ─── Transition Rift Hero ─────────────────────────────────────────────────────

function TransitionRift() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bg = useTransform(scrollYProgress, [0, 1], ["#F9F6F0", "#111111"]);

  return (
    <motion.div
      ref={ref}
      className="relative h-[20vh] flex items-center justify-center overflow-hidden"
      style={{ background: bg }}
    >
      <motion.div
        className="text-[8vw] font-bold uppercase tracking-[0.2em] select-none pointer-events-none"
        style={{
          color: useTransform(scrollYProgress, [0, 1], ["#111111", "#F9F6F0"]),
          fontFamily: "'Space Mono', monospace",
        }}
      >
        ✦
      </motion.div>
    </motion.div>
  );
}

function TransitionSand() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bg = useTransform(scrollYProgress, [0, 1], ["#111111", "#E6E1DA"]);

  return (
    <motion.div
      ref={ref}
      className="relative h-[20vh] flex items-center justify-center overflow-hidden"
      style={{ background: bg }}
    >
      <motion.div
        className="text-[8vw] font-bold uppercase tracking-[0.2em] select-none pointer-events-none"
        style={{
          color: useTransform(scrollYProgress, [0, 1], ["#F9F6F0", "#111111"]),
          fontFamily: "'Space Mono', monospace",
        }}
      >
        ✦
      </motion.div>
    </motion.div>
  );
}

function TransitionSplit() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const bg = useTransform(scrollYProgress, [0, 1], ["#E6E1DA", "#FFFFFF"]);

  return (
    <motion.div
      ref={ref}
      className="relative h-[20vh] flex items-center justify-center overflow-hidden"
      style={{ background: bg }}
    >
      <motion.div
        className="text-[8vw] font-bold uppercase tracking-[0.2em] select-none pointer-events-none"
        style={{
          color: useTransform(scrollYProgress, [0, 1], ["#111111", "#111111"]),
          fontFamily: "'Space Mono', monospace",
        }}
      >
        ✦
      </motion.div>
    </motion.div>
  );
}

// ─── HUD Dark State Tracker ───────────────────────────────────────────────────

function useIsDark() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const sections = document.querySelectorAll("[data-section]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sec = (entry.target as HTMLElement).dataset.section;
            setIsDark(sec === "rift" || sec === "split");
          }
        });
      },
      { threshold: 0.4 }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return isDark;
}

// ─── Intro Hero ───────────────────────────────────────────────────────────────

function IntroHero() {
  return (
    <div
      className="section-cream relative h-screen flex flex-col items-center justify-center overflow-hidden"
    >
      <div className="crosshair-h" style={{ color: "#111111" }} />
      <div className="crosshair-v" style={{ color: "#111111" }} />

      <motion.div
        className="flex flex-col items-center gap-6 select-none text-center px-8"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
      >
        <motion.span
          className="text-[8px] tracking-[0.5em] uppercase opacity-30"
          style={{ color: "#111111", fontFamily: "'Space Mono', monospace" }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.3 }}
          transition={{ delay: 0.8 }}
        >
          EDITORIAL SHOWCASE — SEASON 2026
        </motion.span>

        <h1
          className="text-[clamp(3.5rem,12vw,11rem)] font-bold uppercase leading-[0.9] tracking-[0.05em]"
          style={{ color: "#111111", fontFamily: "'Space Mono', monospace" }}
        >
          LEGENDARY
          <br />
          <span style={{ WebkitTextStroke: "2px #111111", color: "transparent" }}>
            ARCHIVE
          </span>
        </h1>

        <motion.div
          className="flex items-center gap-6 mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
        >
          <div className="h-px w-16 bg-current opacity-20" style={{ color: "#111111" }} />
          <span
            className="text-[10px] tracking-[0.4em] uppercase opacity-40"
            style={{ color: "#111111", fontFamily: "'Space Mono', monospace" }}
          >
            TWENTY LEGENDARY TITANS
          </span>
          <div className="h-px w-16 bg-current opacity-20" style={{ color: "#111111" }} />
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        className="absolute bottom-24 flex flex-col items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
      >
        <motion.div
          className="w-px h-12 bg-current opacity-20"
          style={{ color: "#111111" }}
          animate={{ scaleY: [1, 0.4, 1] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        />
        <span
          className="text-[8px] tracking-[0.4em] uppercase opacity-25"
          style={{ color: "#111111", fontFamily: "'Space Mono', monospace" }}
        >
          SCROLL
        </span>
      </motion.div>
    </div>
  );
}

// ─── Outro ────────────────────────────────────────────────────────────────────

function Outro() {
  return (
    <div
      className="relative h-screen flex flex-col items-center justify-center overflow-hidden"
      style={{ background: "#111111" }}
    >
      <div className="crosshair-h" style={{ color: "#F9F6F0" }} />
      <div className="crosshair-v" style={{ color: "#F9F6F0" }} />

      <motion.div
        className="flex flex-col items-center gap-8 text-center px-8 select-none"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      >
        <span
          className="text-[8px] tracking-[0.5em] uppercase opacity-25"
          style={{ color: "#F9F6F0", fontFamily: "'Space Mono', monospace" }}
        >
          FIN — END OF ARCHIVE
        </span>

        <h2
          className="text-[clamp(2.5rem,8vw,8rem)] font-bold uppercase leading-[0.9] tracking-[0.08em]"
          style={{ color: "#F9F6F0", fontFamily: "'Space Mono', monospace" }}
        >
          ALL
          <br />
          <span style={{ WebkitTextStroke: "2px #F9F6F0", color: "transparent" }}>
            TWENTY
          </span>
          <br />
          CATALOGUED
        </h2>

        <div className="flex items-center gap-6">
          <div className="h-px w-16 opacity-20" style={{ background: "#F9F6F0" }} />
          <span
            className="text-[9px] tracking-[0.4em] uppercase opacity-30"
            style={{ color: "#F9F6F0", fontFamily: "'Space Mono', monospace" }}
          >
            CODEX COMPLETE
          </span>
          <div className="h-px w-16 opacity-20" style={{ background: "#F9F6F0" }} />
        </div>
      </motion.div>
    </div>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────

export default function App() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const markers = document.querySelectorAll("[data-dark-marker]");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsDark(entry.target.getAttribute("data-dark-marker") === "true");
          }
        });
      },
      { threshold: 0.35 }
    );
    markers.forEach((m) => observer.observe(m));
    return () => observer.disconnect();
  }, []);

  return (
    <div style={{ background: "#F9F6F0" }}>
      <CustomCursor />
      <HUD isDark={isDark} />

      {/* Intro */}
      <div data-dark-marker="false">
        <IntroHero />
      </div>

      {/* Section 1 — Cream */}
      <div data-dark-marker="false">
        <Section1 />
      </div>

      <TransitionRift />

      {/* Section 2 — Dark */}
      <div data-dark-marker="true">
        <Section2 />
      </div>

      <TransitionSand />

      {/* Section 3 — Sand */}
      <div data-dark-marker="false">
        <Section3 />
      </div>

      <TransitionSplit />

      {/* Section 4 — Split */}
      <div data-dark-marker="false">
        <Section4 />
      </div>

      {/* Outro */}
      <div data-dark-marker="true">
        <Outro />
      </div>
    </div>
  );
}
