import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useSubmitContact } from "@/hooks/useQueries";
import {
  AlertCircle,
  CheckCircle2,
  ChevronDown,
  ExternalLink,
  Loader2,
  Menu,
  Send,
  X,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { SiGithub, SiLinkedin } from "react-icons/si";
import { toast } from "sonner";
import BackgroundAnimation from "./BackgroundAnimation";
import StarCursor from "./StarCursor";

// ── Data ───────────────────────────────────────────────────────────────────
const NAV_LINKS = [
  { label: "About", href: "#about" },
  { label: "Projects", href: "#projects" },
  { label: "Skills", href: "#experience" },
  { label: "Contact", href: "#contact" },
];

const SKILLS = [
  "Python",
  "Machine Learning",
  "Deep Learning",
  "Data Science",
  "Data Analysis",
  "Scikit-learn",
  "TensorFlow",
  "Pandas & NumPy",
  "Flask",
  "Android Dev",
  "OpenCV",
  "Matplotlib",
];

const PROJECTS = [
  {
    title: "Heart Disease Detection System",
    description:
      "ML healthcare engine predicting heart disease risk from clinical parameters. Random Forest model served via Flask for real-time predictions.",
    tags: ["Python", "Scikit-learn", "Flask", "Pandas", "Matplotlib"],
    stat: "94%",
    statLabel: "Accuracy",
    icon: "🫀",
  },
  {
    title: "AI Study Mood Detector",
    description:
      "Android app detecting student emotional state (focused, tired, distracted, stressed) via camera and suggesting personalized productivity actions.",
    tags: ["Android", "TensorFlow Lite", "OpenCV", "Kotlin", "CV"],
    stat: "5",
    statLabel: "States",
    icon: "🧠",
  },
  {
    title: "AI-Powered Diet Planner",
    description:
      "Smart mobile app generating personalized diet plans from health goals, preferences, and calorie targets — auto-adjusting as you progress.",
    tags: ["Android", "Java", "Machine Learning", "Firebase", "SQLite"],
    stat: "100%",
    statLabel: "Personalized",
    icon: "🥗",
  },
  {
    title: "Mood-Based Playlist Generator",
    description:
      "AI music engine mapping mood to Spotify/YouTube playlists via emotion recognition. Fully personalized, real-time listening experience.",
    tags: ["Android", "Java", "AI", "Spotify API", "YouTube API"],
    stat: "∞",
    statLabel: "Playlists",
    icon: "🎵",
  },
];

const EXPERTISE = [
  {
    icon: "🧬",
    area: "ML & AI",
    role: "ML Model Developer",
    badge: "Core Expertise",
    points: [
      "End-to-end ML pipelines built to solve real-world problems — not just demos",
      "Mastery in classification, regression, deep learning, and on-device AI",
      "Random Forest, TensorFlow Lite, and custom neural architectures in production",
    ],
  },
  {
    icon: "📊",
    area: "Data Science",
    role: "Data Scientist & Analyst",
    badge: "Core Expertise",
    points: [
      "Full pipeline: ingestion, cleaning, feature engineering, visual storytelling",
      "Pandas, NumPy, and Matplotlib for deep exploratory analysis",
      "Insights translated to actionable, measurable outcomes",
    ],
  },
  {
    icon: "📱",
    area: "Mobile Dev",
    role: "Android Application Developer",
    badge: "Applied Projects",
    points: [
      "Multiple AI-integrated Android apps shipped in Java and Kotlin",
      "Computer vision (OpenCV) and on-device ML (TensorFlow Lite) embedded directly",
      "Firebase and SQLite powering production-ready data layers",
    ],
  },
];

const STATS = [
  { value: "4+", label: "AI Projects" },
  { value: "3", label: "Tech Domains" },
  { value: "94%", label: "ML Accuracy" },
  { value: "∞", label: "Ambition" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
function useActiveSection() {
  const [active, setActive] = useState("about");
  useEffect(() => {
    const ids = ["about", "projects", "experience", "contact"];
    const obs = ids.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const o = new IntersectionObserver(
        ([e]) => {
          if (e.isIntersecting) setActive(id);
        },
        { threshold: 0.35 },
      );
      o.observe(el);
      return o;
    });
    return () => {
      for (const o of obs) o?.disconnect();
    };
  }, []);
  return active;
}

const up = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.55, ease: "easeOut" as const },
  },
};
const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.09 } },
};

// ── Divider ────────────────────────────────────────────────────────────────
function Divider({ gold }: { gold?: boolean }) {
  return (
    <div
      className="absolute top-0 inset-x-0 h-px"
      style={{
        background: gold
          ? "linear-gradient(90deg,transparent,rgba(255,180,30,0.35),transparent)"
          : "linear-gradient(90deg,transparent,rgba(255,160,30,0.25),rgba(160,60,200,0.2),transparent)",
      }}
    />
  );
}

// ── Section label ──────────────────────────────────────────────────────────
function SectionLabel({
  children,
  gold,
}: { children: React.ReactNode; gold?: boolean }) {
  return (
    <p
      className="text-xs font-black tracking-[0.45em] uppercase mb-3"
      style={{ color: gold ? "#ffa01e" : "#d4a017" }}
    >
      ✦ {children} ✦
    </p>
  );
}

// ── Gradient text ──────────────────────────────────────────────────────────
function GradText({
  children,
  violet,
}: { children: React.ReactNode; violet?: boolean }) {
  return (
    <span
      style={{
        background: violet
          ? "linear-gradient(135deg,#d4a017,#a020a0)"
          : "linear-gradient(135deg,#ffd060,#ff8c00)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      {children}
    </span>
  );
}

// ── Main ───────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const active = useActiveSection();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const submitContact = useSubmitContact();
  const heroRef = useRef<HTMLElement>(null);

  const goTo = (href: string) => {
    setMobileOpen(false);
    document
      .getElementById(href.replace("#", ""))
      ?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await submitContact.mutateAsync(form);
      toast.success("Message received — Namaste! 🙏");
      setForm({ name: "", email: "", message: "" });
    } catch {
      toast.error("Failed to send. Please try again.");
    }
  };

  const year = new Date().getFullYear();
  const hostname = window.location.hostname;

  // palette shortcuts
  const gold = "#d4a017";

  return (
    <div
      className="min-h-screen"
      style={{ background: "#06040c", color: "#f0e6d0" }}
    >
      <BackgroundAnimation />
      <StarCursor />

      {/* ── NAV ── */}
      <header
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-xl"
        style={{
          background: "rgba(6,4,12,0.88)",
          borderBottom: "1px solid rgba(212,160,23,0.18)",
        }}
      >
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Logo */}
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="flex items-center gap-2 bg-transparent border-none p-0 cursor-pointer"
          >
            <span
              className="text-xl"
              style={{ filter: "drop-shadow(0 0 6px rgba(255,160,30,0.7))" }}
            >
              ॐ
            </span>
            <span
              className="font-black text-base tracking-widest uppercase"
              style={{
                background: "linear-gradient(90deg,#ffd060,#d4a017)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              GURUPRASAD
            </span>
          </button>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = active === link.href.replace("#", "");
              return (
                <button
                  key={link.label}
                  type="button"
                  data-ocid="nav.link"
                  onClick={() => goTo(link.href)}
                  className="px-5 py-2 text-xs font-black tracking-[0.25em] uppercase rounded-md transition-all duration-200"
                  style={{
                    color: isActive ? gold : "rgba(240,230,208,0.45)",
                    background: isActive
                      ? "rgba(212,160,23,0.1)"
                      : "transparent",
                    border: isActive
                      ? "1px solid rgba(212,160,23,0.3)"
                      : "1px solid transparent",
                  }}
                >
                  {link.label}
                </button>
              );
            })}
          </nav>

          {/* Mobile toggle */}
          <button
            type="button"
            className="md:hidden p-2"
            style={{ color: "rgba(240,230,208,0.5)" }}
            onClick={() => setMobileOpen((v) => !v)}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <AnimatePresence>
          {mobileOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden overflow-hidden"
              style={{ borderTop: "1px solid rgba(212,160,23,0.12)" }}
            >
              <div className="px-6 py-4 flex flex-col gap-1">
                {NAV_LINKS.map((l) => (
                  <button
                    key={l.label}
                    type="button"
                    data-ocid="nav.link"
                    onClick={() => goTo(l.href)}
                    className="text-left px-4 py-3 text-xs font-black tracking-[0.25em] uppercase rounded-md"
                    style={{ color: "rgba(240,230,208,0.55)" }}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* ── HERO ── */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url('/assets/generated/hero-spiritual.dim_1600x900.jpg')",
          }}
        />
        {/* Overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,4,12,0.60) 0%, rgba(6,4,12,0.25) 45%, rgba(6,4,12,0.95) 100%)",
          }}
        />
        {/* Vertical accent lines */}
        <div
          className="absolute left-8 top-0 bottom-0 w-px hidden lg:block"
          style={{
            background:
              "linear-gradient(180deg,transparent,rgba(212,160,23,0.4),transparent)",
          }}
        />
        <div
          className="absolute right-8 top-0 bottom-0 w-px hidden lg:block"
          style={{
            background:
              "linear-gradient(180deg,transparent,rgba(160,60,200,0.35),transparent)",
          }}
        />

        <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial="hidden"
            animate="visible"
            variants={stagger}
            className="space-y-7"
          >
            {/* Top badge */}
            <motion.div variants={up} className="flex justify-center">
              <span
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-black tracking-[0.3em] uppercase"
                style={{
                  background: "rgba(212,160,23,0.1)",
                  border: "1px solid rgba(212,160,23,0.35)",
                  color: gold,
                }}
              >
                ✦ ML Developer & Data Scientist ✦
              </span>
            </motion.div>

            {/* Name */}
            <motion.h1
              variants={up}
              className="font-black leading-none"
              style={{
                fontSize: "clamp(3rem,10vw,7.5rem)",
                letterSpacing: "-0.02em",
              }}
            >
              <span style={{ color: "#f0e6d0" }}>GURU</span>
              <GradText>PRASAD</GradText>
              <br />
              <span
                style={{
                  fontSize: "clamp(1.2rem,3.5vw,2.8rem)",
                  letterSpacing: "0.35em",
                  color: "rgba(240,230,208,0.55)",
                  fontWeight: 900,
                }}
              >
                POTDAR
              </span>
            </motion.h1>

            {/* Tagline */}
            <motion.p
              variants={up}
              className="text-lg md:text-xl max-w-2xl mx-auto leading-relaxed"
              style={{ color: "rgba(240,230,208,0.55)" }}
            >
              Bridging ancient wisdom with modern intelligence — building AI
              solutions that create real-world impact from Latur, Maharashtra.
            </motion.p>

            {/* Stats */}
            <motion.div
              variants={stagger}
              className="flex flex-wrap justify-center gap-8 pt-2"
            >
              {STATS.map((s) => (
                <motion.div
                  key={s.label}
                  variants={up}
                  className="flex flex-col items-center"
                >
                  <span
                    className="font-black text-3xl md:text-4xl leading-none"
                    style={{
                      background: "linear-gradient(135deg,#ffd060,#ff8c00)",
                      WebkitBackgroundClip: "text",
                      WebkitTextFillColor: "transparent",
                    }}
                  >
                    {s.value}
                  </span>
                  <span
                    className="text-xs font-bold tracking-widest uppercase mt-1"
                    style={{ color: "rgba(240,230,208,0.35)" }}
                  >
                    {s.label}
                  </span>
                </motion.div>
              ))}
            </motion.div>

            {/* CTAs */}
            <motion.div
              variants={up}
              className="flex flex-col sm:flex-row gap-4 justify-center pt-2"
            >
              <Button
                data-ocid="hero.primary_button"
                size="lg"
                onClick={() => goTo("#projects")}
                className="font-black tracking-widest uppercase px-10"
                style={{
                  background: "linear-gradient(135deg,#d4a017,#ff8c00)",
                  border: "none",
                  color: "#06040c",
                  boxShadow: "0 0 24px rgba(212,160,23,0.45)",
                }}
              >
                View My Work
              </Button>
              <Button
                data-ocid="hero.secondary_button"
                size="lg"
                onClick={() => goTo("#contact")}
                className="font-black tracking-widest uppercase px-10"
                style={{
                  background: "transparent",
                  border: "1px solid rgba(212,160,23,0.5)",
                  color: gold,
                  boxShadow: "0 0 14px rgba(212,160,23,0.12)",
                }}
              >
                🙏 Connect
              </Button>
            </motion.div>
          </motion.div>

          {/* Scroll hint */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2, duration: 1 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
          >
            <span
              className="text-xs tracking-widest uppercase"
              style={{ color: "rgba(240,230,208,0.25)" }}
            >
              Scroll
            </span>
            <ChevronDown
              size={18}
              className="animate-bounce"
              style={{ color: "rgba(240,230,208,0.25)" }}
            />
          </motion.div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="py-32 px-6 relative">
        <Divider />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <SectionLabel>About Me</SectionLabel>
            <motion.h2
              variants={up}
              className="font-black text-4xl md:text-6xl mb-16 leading-none"
            >
              <span style={{ color: "#f0e6d0" }}>Turning Data into </span>
              <GradText violet>Dharma</GradText>
            </motion.h2>

            <div className="grid md:grid-cols-2 gap-16 items-start">
              <motion.div variants={up} className="space-y-6">
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "rgba(240,230,208,0.65)" }}
                >
                  ML Developer and Data Scientist from{" "}
                  <span style={{ color: "#f0e6d0", fontWeight: 700 }}>
                    Latur, Maharashtra
                  </span>
                  . I'm driven by the belief that technology — like spirituality
                  — exists to serve humanity. Every model I build is a step
                  toward that purpose.
                </p>
                <p
                  className="text-lg leading-relaxed"
                  style={{ color: "rgba(240,230,208,0.65)" }}
                >
                  From healthcare AI to emotion-sensing Android apps, I craft
                  complete, end-to-end products with real-world impact. I
                  automate what slows people down so they can focus on what
                  truly matters.
                </p>

                {/* Contact info */}
                <div className="flex flex-col gap-3 pt-3">
                  <a
                    href="mailto:gurupreasadpotdar1@gmail.com"
                    className="inline-flex items-center gap-3 text-sm font-bold"
                    style={{ color: gold }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: gold, boxShadow: `0 0 6px ${gold}` }}
                    />
                    gurupreasadpotdar1@gmail.com
                  </a>
                  <span
                    className="inline-flex items-center gap-3 text-sm font-semibold"
                    style={{ color: "rgba(240,230,208,0.35)" }}
                  >
                    <span
                      className="w-2 h-2 rounded-full"
                      style={{ background: "rgba(240,230,208,0.25)" }}
                    />
                    Latur, Maharashtra, India 🇮🇳
                  </span>
                </div>

                {/* Social links */}
                <div className="flex gap-4 pt-1">
                  <a
                    href="https://github.com/Guruprasad456"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
                    style={{ color: "rgba(240,230,208,0.5)" }}
                  >
                    <SiGithub size={16} /> GitHub
                  </a>
                  <a
                    href="https://www.linkedin.com/in/guruprasad-potdar-9928173b7/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm font-bold transition-opacity hover:opacity-80"
                    style={{ color: "rgba(240,230,208,0.5)" }}
                  >
                    <SiLinkedin size={16} /> LinkedIn
                  </a>
                </div>
              </motion.div>

              {/* Skills grid */}
              <motion.div variants={stagger} className="grid grid-cols-3 gap-3">
                {SKILLS.map((skill) => (
                  <motion.div
                    key={skill}
                    variants={up}
                    whileHover={{ scale: 1.05, y: -2 }}
                    className="flex items-center justify-center px-3 py-3 rounded-xl text-xs font-bold text-center cursor-default transition-all duration-200"
                    style={{
                      background: "rgba(212,160,23,0.05)",
                      border: "1px solid rgba(212,160,23,0.18)",
                      color: "rgba(240,230,208,0.65)",
                    }}
                    onMouseEnter={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(212,160,23,0.55)";
                      el.style.color = gold;
                      el.style.background = "rgba(212,160,23,0.1)";
                      el.style.boxShadow = "0 0 12px rgba(212,160,23,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      const el = e.currentTarget as HTMLElement;
                      el.style.borderColor = "rgba(212,160,23,0.18)";
                      el.style.color = "rgba(240,230,208,0.65)";
                      el.style.background = "rgba(212,160,23,0.05)";
                      el.style.boxShadow = "none";
                    }}
                  >
                    {skill}
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section
        id="projects"
        className="py-32 px-6 relative"
        style={{ background: "rgba(12,8,20,0.7)" }}
      >
        <Divider gold />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <SectionLabel gold>Projects</SectionLabel>
            <motion.h2
              variants={up}
              className="font-black text-4xl md:text-6xl mb-16 leading-none"
            >
              <span style={{ color: "#f0e6d0" }}>Creations of </span>
              <GradText>Purpose</GradText>
            </motion.h2>

            <motion.div
              variants={stagger}
              className="grid md:grid-cols-2 gap-5"
            >
              {PROJECTS.map((p, i) => (
                <motion.div
                  key={p.title}
                  variants={up}
                  whileHover={{ y: -6 }}
                  data-ocid={`projects.item.${i + 1}`}
                  className="group relative rounded-2xl p-7 flex flex-col gap-5 transition-all duration-300 cursor-default"
                  style={{
                    background: "rgba(12,8,22,0.95)",
                    border: "1px solid rgba(212,160,23,0.14)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(212,160,23,0.4)";
                    el.style.boxShadow = "0 0 40px rgba(212,160,23,0.08)";
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(212,160,23,0.14)";
                    el.style.boxShadow = "none";
                  }}
                >
                  {/* Top decorative line */}
                  <div
                    className="absolute top-0 inset-x-0 h-px rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity"
                    style={{
                      background:
                        "linear-gradient(90deg,transparent,rgba(212,160,23,0.6),transparent)",
                    }}
                  />

                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <span
                        className="text-2xl flex items-center justify-center rounded-xl w-12 h-12 shrink-0"
                        style={{
                          background: "rgba(212,160,23,0.08)",
                          border: "1px solid rgba(212,160,23,0.2)",
                        }}
                      >
                        {p.icon}
                      </span>
                      <h3
                        className="font-black text-lg leading-tight"
                        style={{ color: "#f0e6d0" }}
                      >
                        {p.title}
                      </h3>
                    </div>
                    <div className="flex flex-col items-end shrink-0">
                      <span
                        className="font-black text-2xl leading-none"
                        style={{
                          background: "linear-gradient(135deg,#ffd060,#ff8c00)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        {p.stat}
                      </span>
                      <span
                        className="text-xs font-bold tracking-wider uppercase mt-0.5"
                        style={{ color: "rgba(240,230,208,0.3)" }}
                      >
                        {p.statLabel}
                      </span>
                    </div>
                  </div>

                  <p
                    className="text-sm leading-relaxed flex-1"
                    style={{ color: "rgba(240,230,208,0.55)" }}
                  >
                    {p.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {p.tags.map((tag) => (
                      <Badge
                        key={tag}
                        className="text-xs font-bold"
                        style={{
                          background: "rgba(212,160,23,0.08)",
                          border: "1px solid rgba(212,160,23,0.22)",
                          color: "rgba(212,160,23,0.85)",
                        }}
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex items-center gap-2">
                    <ExternalLink
                      size={13}
                      style={{ color: "rgba(212,160,23,0.4)" }}
                    />
                    <span
                      className="text-xs font-bold"
                      style={{ color: "rgba(212,160,23,0.4)" }}
                    >
                      View Project
                    </span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── EXPERTISE ── */}
      <section id="experience" className="py-32 px-6 relative">
        <Divider />
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <SectionLabel>Expertise</SectionLabel>
            <motion.h2
              variants={up}
              className="font-black text-4xl md:text-6xl mb-16 leading-none"
            >
              <span style={{ color: "#f0e6d0" }}>The </span>
              <GradText violet>Sadhana</GradText>
              <span
                style={{
                  color: "rgba(240,230,208,0.35)",
                  fontSize: "0.5em",
                  letterSpacing: "0.06em",
                }}
              >
                {" "}
                — the practice
              </span>
            </motion.h2>

            <div className="space-y-5">
              {EXPERTISE.map((item, i) => (
                <motion.div
                  key={item.area}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{ once: true, margin: "-40px" }}
                  variants={up}
                  data-ocid={`experience.item.${i + 1}`}
                  className="rounded-2xl p-7 md:p-8 transition-all duration-300"
                  style={{
                    background: "rgba(12,8,22,0.9)",
                    border: "1px solid rgba(212,160,23,0.12)",
                  }}
                >
                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    <div
                      className="text-2xl flex items-center justify-center rounded-xl w-14 h-14 shrink-0"
                      style={{
                        background: "rgba(212,160,23,0.07)",
                        border: "1px solid rgba(212,160,23,0.2)",
                        boxShadow: "0 0 12px rgba(212,160,23,0.08)",
                      }}
                    >
                      {item.icon}
                    </div>
                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                          <h3
                            className="font-black text-xl"
                            style={{ color: "#f0e6d0" }}
                          >
                            {item.role}
                          </h3>
                          <p
                            className="text-sm font-black tracking-wider uppercase mt-0.5"
                            style={{ color: gold }}
                          >
                            {item.area}
                          </p>
                        </div>
                        <span
                          className="text-xs font-black tracking-widest uppercase px-4 py-1.5 rounded-full"
                          style={{
                            background: "rgba(160,60,200,0.1)",
                            border: "1px solid rgba(160,60,200,0.25)",
                            color: "rgba(200,120,255,0.9)",
                          }}
                        >
                          {item.badge}
                        </span>
                      </div>
                      <ul className="space-y-2">
                        {item.points.map((pt) => (
                          <li
                            key={pt}
                            className="flex gap-3 text-sm leading-relaxed"
                            style={{ color: "rgba(240,230,208,0.55)" }}
                          >
                            <span
                              className="mt-1 shrink-0"
                              style={{ color: gold }}
                            >
                              ▸
                            </span>
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section
        id="contact"
        className="py-32 px-6 relative"
        style={{ background: "rgba(12,8,20,0.7)" }}
      >
        <Divider gold />
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-80px" }}
            variants={stagger}
          >
            <SectionLabel gold>Contact</SectionLabel>
            <motion.h2
              variants={up}
              className="font-black text-4xl md:text-6xl mb-4 leading-none"
            >
              <span style={{ color: "#f0e6d0" }}>Begin the </span>
              <GradText>Journey</GradText>
            </motion.h2>
            <motion.p
              variants={up}
              className="text-lg mb-12"
              style={{ color: "rgba(240,230,208,0.45)" }}
            >
              Have a project that needs AI intelligence? Let's build something
              meaningful together.
            </motion.p>

            <motion.form
              variants={up}
              onSubmit={handleSubmit}
              className="space-y-5 rounded-2xl p-8"
              style={{
                background: "rgba(12,8,22,0.97)",
                border: "1px solid rgba(212,160,23,0.18)",
                boxShadow: "0 0 50px rgba(212,160,23,0.04)",
              }}
            >
              {(
                [
                  {
                    id: "name",
                    label: "Your Name",
                    type: "text",
                    placeholder: "Guruprasad Potdar",
                    key: "name",
                  },
                  {
                    id: "email",
                    label: "Email Address",
                    type: "email",
                    placeholder: "you@email.com",
                    key: "email",
                  },
                ] as const
              ).map(({ id, label, type, placeholder, key }) => (
                <div key={id} className="space-y-2">
                  <Label
                    htmlFor={id}
                    className="text-xs font-black tracking-[0.3em] uppercase"
                    style={{ color: "rgba(240,230,208,0.4)" }}
                  >
                    {label}
                  </Label>
                  <Input
                    id={id}
                    data-ocid="contact.input"
                    type={type}
                    placeholder={placeholder}
                    value={form[key as "name" | "email"]}
                    onChange={(e) =>
                      setForm((p) => ({ ...p, [key]: e.target.value }))
                    }
                    required
                    style={{
                      background: "rgba(240,230,208,0.04)",
                      border: "1px solid rgba(212,160,23,0.2)",
                      color: "#f0e6d0",
                    }}
                  />
                </div>
              ))}
              <div className="space-y-2">
                <Label
                  htmlFor="message"
                  className="text-xs font-black tracking-[0.3em] uppercase"
                  style={{ color: "rgba(240,230,208,0.4)" }}
                >
                  Your Message
                </Label>
                <Textarea
                  id="message"
                  data-ocid="contact.textarea"
                  placeholder="Describe your project, idea, or challenge..."
                  rows={5}
                  value={form.message}
                  onChange={(e) =>
                    setForm((p) => ({ ...p, message: e.target.value }))
                  }
                  required
                  className="resize-none"
                  style={{
                    background: "rgba(240,230,208,0.04)",
                    border: "1px solid rgba(212,160,23,0.2)",
                    color: "#f0e6d0",
                  }}
                />
              </div>

              {submitContact.isSuccess && (
                <div
                  data-ocid="contact.success_state"
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(212,160,23,0.1)",
                    border: "1px solid rgba(212,160,23,0.3)",
                    color: gold,
                  }}
                >
                  <CheckCircle2 size={16} /> Message received — Namaste! 🙏
                </div>
              )}
              {submitContact.isError && (
                <div
                  data-ocid="contact.error_state"
                  className="flex items-center gap-2 text-sm rounded-xl px-4 py-3"
                  style={{
                    background: "rgba(200,50,50,0.08)",
                    border: "1px solid rgba(200,50,50,0.25)",
                    color: "#ff7070",
                  }}
                >
                  <AlertCircle size={16} /> Something went wrong. Please try
                  again.
                </div>
              )}

              <Button
                data-ocid="contact.submit_button"
                type="submit"
                size="lg"
                disabled={submitContact.isPending}
                className="w-full font-black tracking-widest uppercase"
                style={{
                  background: "linear-gradient(135deg,#d4a017,#ff8c00)",
                  border: "none",
                  color: "#06040c",
                  boxShadow: "0 0 24px rgba(212,160,23,0.35)",
                }}
              >
                {submitContact.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />🙏 Send Message
                  </>
                )}
              </Button>
            </motion.form>
          </motion.div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer
        className="py-10 px-6"
        style={{ borderTop: "1px solid rgba(212,160,23,0.12)" }}
      >
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center sm:items-start gap-1">
            <div className="flex items-center gap-2">
              <span
                style={{ filter: "drop-shadow(0 0 4px rgba(255,160,30,0.5))" }}
              >
                ॐ
              </span>
              <span className="text-sm font-black" style={{ color: gold }}>
                Guruprasad Potdar
              </span>
            </div>
            <p className="text-xs" style={{ color: "rgba(240,230,208,0.2)" }}>
              © {year}.{" "}
              <a
                href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(hostname)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-70 transition-opacity"
              >
                Built with caffeine.ai
              </a>
            </p>
          </div>
          <div className="flex items-center gap-5">
            {[
              {
                href: "https://github.com/Guruprasad456",
                Icon: SiGithub,
                label: "GitHub",
              },
              {
                href: "https://www.linkedin.com/in/guruprasad-potdar-9928173b7/",
                Icon: SiLinkedin,
                label: "LinkedIn",
              },
            ].map(({ href, Icon, label }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="transition-all duration-200"
                style={{ color: "rgba(240,230,208,0.3)" }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLElement).style.color = gold;
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLElement).style.color =
                    "rgba(240,230,208,0.3)";
                }}
              >
                <Icon size={20} />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}
