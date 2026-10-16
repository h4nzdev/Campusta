// src/pages/auth/LandingPage.jsx
import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { motion, AnimatePresence } from "framer-motion";
import {
  QrCode,
  ClipboardList,
  ShieldCheck,
  BarChart3,
  Bell,
  MapPin,
  ArrowRight,
  ArrowLeft,
  Mail,
  Phone,
  MapPinned,
  Camera,
  Send,
  Users,
  Wrench,
  GraduationCap,
  ChevronRight,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

/* ---------- SVG Placeholders ---------- */
function HeroIllustration() {
  return (
    <svg viewBox="0 0 500 500" className="w-full h-auto" fill="none">
      <defs>
        <linearGradient id="heroGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
      </defs>

      {/* Backdrop circle */}
      <circle cx="250" cy="250" r="200" fill="#eff6ff" />
      <circle cx="250" cy="250" r="150" fill="#dbeafe" opacity="0.5" />

      {/* Main phone frame */}
      <rect
        x="150"
        y="100"
        width="200"
        height="320"
        rx="28"
        fill="url(#cardGrad)"
        stroke="#cbd5e1"
        strokeWidth="2"
      />
      <rect x="160" y="110" width="180" height="300" rx="20" fill="#ffffff" />

      {/* Screen content */}
      <rect
        x="180"
        y="140"
        width="140"
        height="60"
        rx="10"
        fill="url(#heroGrad)"
        opacity="0.9"
      />
      <rect
        x="195"
        y="160"
        width="80"
        height="8"
        rx="4"
        fill="#ffffff"
        opacity="0.9"
      />
      <rect
        x="195"
        y="175"
        width="110"
        height="6"
        rx="3"
        fill="#ffffff"
        opacity="0.6"
      />

      {/* QR pattern */}
      <rect
        x="180"
        y="215"
        width="60"
        height="60"
        rx="8"
        fill="#f8fafc"
        stroke="#e2e8f0"
        strokeWidth="1.5"
      />
      <rect x="190" y="225" width="12" height="12" rx="2" fill="#3b82f6" />
      <rect x="218" y="225" width="12" height="12" rx="2" fill="#3b82f6" />
      <rect x="190" y="253" width="12" height="12" rx="2" fill="#3b82f6" />
      <rect x="218" y="253" width="12" height="12" rx="2" fill="#6366f1" />

      {/* List items */}
      <rect x="250" y="215" width="70" height="8" rx="4" fill="#cbd5e1" />
      <rect x="250" y="233" width="55" height="8" rx="4" fill="#e2e8f0" />
      <rect x="250" y="251" width="65" height="8" rx="4" fill="#e2e8f0" />

      {/* Button */}
      <rect
        x="180"
        y="290"
        width="140"
        height="36"
        rx="10"
        fill="url(#heroGrad)"
      />
      <rect
        x="220"
        y="305"
        width="60"
        height="6"
        rx="3"
        fill="#ffffff"
        opacity="0.9"
      />

      {/* Floating badge 1 */}
      <g>
        <circle
          cx="380"
          cy="160"
          r="30"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />
        <path
          d="M370 160 l6 6 l14 -14"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
        />
      </g>

      {/* Floating badge 2 */}
      <g>
        <circle
          cx="120"
          cy="330"
          r="28"
          fill="#ffffff"
          stroke="#e2e8f0"
          strokeWidth="1.5"
        />
        <circle cx="120" cy="330" r="10" fill="#f59e0b" />
        <circle cx="120" cy="330" r="4" fill="#ffffff" />
      </g>
    </svg>
  );
}

function SectionBlob({ className = "", color = "#dbeafe" }) {
  return (
    <svg viewBox="0 0 200 200" className={className} fill={color}>
      <path
        d="M45,-60C58,-52,68,-38,72,-22C76,-6,74,12,66,26C58,40,44,50,28,56C12,62,-6,64,-22,58C-38,52,-52,38,-58,22C-64,6,-62,-12,-54,-26C-46,-40,-32,-50,-16,-58C0,-66,16,-68,45,-60Z"
        transform="translate(100 100)"
      />
    </svg>
  );
}

/* ---------- Section 1: Hero ---------- */
function HeroSection() {
  const containerRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  const ctaRef = useRef(null);
  const heroSvgRef = useRef(null);
  const badgeRefs = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.from(titleRef.current, { y: 60, opacity: 0, duration: 1 })
        .from(
          subtitleRef.current,
          { y: 40, opacity: 0, duration: 0.8 },
          "-=0.6",
        )
        .from(ctaRef.current, { y: 30, opacity: 0, duration: 0.6 }, "-=0.5")
        .from(
          heroSvgRef.current,
          { scale: 0.8, opacity: 0, duration: 1.2, ease: "power3.out" },
          "-=1",
        )
        .from(
          badgeRefs.current,
          {
            scale: 0,
            opacity: 0,
            duration: 0.6,
            stagger: 0.15,
            ease: "back.out(1.7)",
          },
          "-=0.5",
        );

      // Parallax on mouse move
      const el = containerRef.current;
      const handleMouseMove = (e) => {
        const { innerWidth, innerHeight } = window;
        const x = (e.clientX / innerWidth - 0.5) * 2;
        const y = (e.clientY / innerHeight - 0.5) * 2;

        gsap.to(heroSvgRef.current, {
          rotationY: x * 10,
          rotationX: -y * 10,
          x: x * 20,
          y: y * 20,
          duration: 0.8,
          ease: "power2.out",
          transformPerspective: 1000,
        });
        gsap.to(badgeRefs.current[0], { x: x * -30, y: y * -30, duration: 1 });
        gsap.to(badgeRefs.current[1], { x: x * 30, y: y * 30, duration: 1 });
      };

      el.addEventListener("mousemove", handleMouseMove);
      return () => el.removeEventListener("mousemove", handleMouseMove);
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center overflow-hidden
        bg-gradient-to-br from-blue-50 via-white to-indigo-50"
    >
      <SectionBlob className="absolute -top-32 -right-32 w-[500px] h-[500px] opacity-40 pointer-events-none" />
      <SectionBlob
        className="absolute -bottom-40 -left-40 w-[600px] h-[600px] opacity-20 pointer-events-none"
        color="#c7d2fe"
      />

      <div className="relative max-w-7xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/70 backdrop-blur-md border border-blue-100 text-blue-600 text-xs font-medium">
            <Sparkles className="w-3.5 h-3.5" />
            Smart Campus Maintenance
          </div>

          <h1
            ref={titleRef}
            className="mt-6 text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-[1.1] tracking-tight"
          >
            Report. Track.{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Resolve.
            </span>
          </h1>

          <p
            ref={subtitleRef}
            className="mt-6 text-lg text-gray-600 max-w-xl leading-relaxed"
          >
            CAMPUSTA streamlines campus maintenance at USPF. Scan a QR code,
            submit a concern, and track every step — from report to verified
            resolution.
          </p>

          <div ref={ctaRef} className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                bg-blue-600 text-white font-medium hover:bg-blue-700
                shadow-[0_12px_32px_-12px_rgba(59,130,246,0.7)] transition"
            >
              Get Started
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl
                bg-white border border-gray-200 text-gray-700 font-medium
                hover:bg-gray-50 transition"
            >
              <QrCode className="w-4 h-4 text-blue-600" />
              Scan QR to Report
            </Link>
          </div>
        </div>

        <div className="relative flex justify-center">
          <div ref={heroSvgRef} className="w-full max-w-lg">
            <HeroIllustration />
          </div>

          {/* Floating badges */}
          <div
            ref={(el) => (badgeRefs.current[0] = el)}
            className="absolute top-10 right-4 lg:right-10 px-3 py-2 rounded-xl
              bg-white/90 backdrop-blur-md border border-gray-100
              shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]
              flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs font-medium text-gray-700">
              Verified Fix
            </span>
          </div>

          <div
            ref={(el) => (badgeRefs.current[1] = el)}
            className="absolute bottom-16 left-4 lg:left-0 px-3 py-2 rounded-xl
              bg-white/90 backdrop-blur-md border border-gray-100
              shadow-[0_8px_30px_-12px_rgba(0,0,0,0.15)]
              flex items-center gap-2"
          >
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-medium text-gray-700">
              ITBU · Room 302
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 2: About ---------- */
function AboutSection() {
  const sectionRef = useRef(null);
  const cardsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(cardsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 80,
        opacity: 0,
        rotationX: -15,
        duration: 1,
        stagger: 0.15,
        ease: "power3.out",
        transformPerspective: 1000,
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const features = [
    {
      icon: QrCode,
      title: "QR-Based Reporting",
      description:
        "Scan a location badge and the form auto-pins the exact campus spot.",
      accent: "from-blue-500 to-indigo-600",
    },
    {
      icon: ClipboardList,
      title: "Ticket Lifecycle",
      description:
        "Follow every concern — Open, In Progress, Resolved, Closed.",
      accent: "from-emerald-500 to-teal-600",
    },
    {
      icon: ShieldCheck,
      title: "Verified Resolutions",
      description: "Reporters confirm fixes before tickets are truly closed.",
      accent: "from-amber-500 to-orange-600",
    },
    {
      icon: BarChart3,
      title: "Admin Analytics",
      description: "Live dashboards on response times and campus-wide trends.",
      accent: "from-rose-500 to-pink-600",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 bg-white overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
            About CAMPUSTA
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Built for a smarter campus
          </h2>
          <p className="mt-4 text-gray-600">
            We replace informal, verbal reporting with a structured system that
            actually gets things fixed.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => {
            const Icon = f.icon;
            return (
              <div
                key={f.title}
                ref={(el) => (cardsRef.current[i] = el)}
                className="group p-6 rounded-2xl bg-white border border-gray-100
                  shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]
                  hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.15)]
                  transition-shadow duration-300"
              >
                <div
                  className={`w-12 h-12 flex items-center justify-center rounded-xl bg-gradient-to-br ${f.accent} shadow-[0_8px_24px_-8px_rgba(59,130,246,0.5)]`}
                >
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="mt-5 text-base font-semibold text-gray-900">
                  {f.title}
                </h3>
                <p className="mt-2 text-sm text-gray-600 leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 3: How It Works ---------- */
function HowItWorksSection() {
  const sectionRef = useRef(null);
  const stepsRef = useRef([]);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(stepsRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
        },
        x: -60,
        opacity: 0,
        duration: 0.9,
        stagger: 0.15,
        ease: "power3.out",
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const steps = [
    {
      icon: QrCode,
      title: "Scan or Select Location",
      description: "Students and faculty scan a QR badge at the problem site.",
    },
    {
      icon: Send,
      title: "Submit the Concern",
      description: "Pick a category, describe the issue, attach a photo.",
    },
    {
      icon: Wrench,
      title: "Maintenance Handles It",
      description: "Admin assigns the ticket; personnel updates progress.",
    },
    {
      icon: CheckCircle2,
      title: "Verify & Close",
      description: "Reporter confirms the fix — ticket is marked closed.",
    },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 overflow-hidden"
    >
      <SectionBlob
        className="absolute -top-32 left-1/3 w-[500px] h-[500px] opacity-30 pointer-events-none"
        color="#c7d2fe"
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
            How It Works
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            From report to resolution
          </h2>
          <p className="mt-4 text-gray-600">
            Four simple steps — designed to keep nothing lost or forgotten.
          </p>
        </div>

        <div className="relative">
          {/* Connecting line */}
          <div className="hidden lg:block absolute top-10 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-200 to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((s, i) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.title}
                  ref={(el) => (stepsRef.current[i] = el)}
                  className="relative"
                >
                  <div
                    className="relative w-20 h-20 mx-auto flex items-center justify-center rounded-2xl
                    bg-white border-2 border-blue-100
                    shadow-[0_8px_30px_-12px_rgba(59,130,246,0.3)]"
                  >
                    <Icon className="w-8 h-8 text-blue-600" />
                    <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shadow-md">
                      {i + 1}
                    </div>
                  </div>
                  <h3 className="mt-5 text-base font-semibold text-gray-900 text-center">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-gray-600 text-center leading-relaxed">
                    {s.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 4: Usages Carousel ---------- */
function UsagesSection() {
  const sectionRef = useRef(null);
  const [active, setActive] = useState(0);

  const usages = [
    {
      role: "Students",
      icon: GraduationCap,
      accent: "from-blue-500 to-indigo-600",
      title: "Report in seconds",
      description:
        "Scan a QR code near any classroom, lab, or facility — the location fills in automatically. Describe the issue and submit.",
      points: [
        "QR auto-fills location",
        "Track your ticket status",
        "Verify completed fixes",
      ],
    },
    {
      role: "Faculty",
      icon: Users,
      accent: "from-emerald-500 to-teal-600",
      title: "Priority concern reporting",
      description:
        "Report classroom and lab issues that affect lessons. Set priority for concerns that disrupt teaching.",
      points: [
        "Mark concerns as high priority",
        "Track all your requests",
        "Direct line to admin",
      ],
    },
    {
      role: "Maintenance",
      icon: Wrench,
      accent: "from-amber-500 to-orange-600",
      title: "Clear task workflow",
      description:
        "Accept assignments, update progress, add work notes and resolution photos — all from one dashboard.",
      points: [
        "See assigned tasks only",
        "Log work notes & photos",
        "Mark tickets resolved",
      ],
    },
    {
      role: "Admin",
      icon: ShieldCheck,
      accent: "from-rose-500 to-pink-600",
      title: "Full campus oversight",
      description:
        "Assign tickets to personnel, generate QR badges, manage users, and view analytics across all buildings.",
      points: [
        "Route tickets efficiently",
        "Manage QR locations",
        "Live analytics dashboards",
      ],
    },
  ];

  const next = () => setActive((a) => (a + 1) % usages.length);
  const prev = () => setActive((a) => (a - 1 + usages.length) % usages.length);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(sectionRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // Auto-advance
  useEffect(() => {
    const id = setInterval(next, 6000);
    return () => clearInterval(id);
  }, []);

  const current = usages[active];
  const Icon = current.icon;

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 bg-white overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
            Who Uses CAMPUSTA
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            One system, every role
          </h2>
          <p className="mt-4 text-gray-600">
            Built with four tailored experiences — students, faculty,
            maintenance, and admin.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative">
          <div
            className="rounded-3xl border border-gray-100 bg-white
            shadow-[0_20px_60px_-20px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={active}
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="grid grid-cols-1 lg:grid-cols-2 gap-0"
              >
                {/* Left: info */}
                <div className="p-8 sm:p-12">
                  <div
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-gradient-to-br ${current.accent} shadow-[0_8px_24px_-8px_rgba(59,130,246,0.5)]`}
                  >
                    <Icon className="w-4 h-4 text-white" />
                    <span className="text-xs font-semibold text-white">
                      {current.role}
                    </span>
                  </div>

                  <h3 className="mt-6 text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
                    {current.title}
                  </h3>
                  <p className="mt-3 text-gray-600 leading-relaxed">
                    {current.description}
                  </p>

                  <ul className="mt-6 space-y-2.5">
                    {current.points.map((p) => (
                      <li
                        key={p}
                        className="flex items-center gap-2 text-sm text-gray-700"
                      >
                        <span
                          className={`w-5 h-5 rounded-full bg-gradient-to-br ${current.accent} flex items-center justify-center shrink-0`}
                        >
                          <CheckCircle2 className="w-3 h-3 text-white" />
                        </span>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Right: SVG placeholder */}
                <div
                  className={`relative bg-gradient-to-br ${current.accent} p-12 flex items-center justify-center overflow-hidden`}
                >
                  <div className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-white/10 blur-2xl" />
                  <div className="absolute -bottom-20 -left-10 w-64 h-64 rounded-full bg-white/5 blur-3xl" />
                  <motion.div
                    initial={{ scale: 0.85, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1, duration: 0.4 }}
                    className="relative"
                  >
                    <div className="w-32 h-32 rounded-3xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center">
                      <Icon className="w-16 h-16 text-white" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {usages.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActive(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === active
                      ? "w-8 bg-blue-600"
                      : "w-2 bg-gray-300 hover:bg-gray-400"
                  }`}
                  aria-label={`Go to slide ${i + 1}`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={prev}
                className="w-10 h-10 flex items-center justify-center rounded-xl
                  bg-white border border-gray-200 text-gray-600
                  hover:bg-gray-50 transition"
              >
                <ArrowLeft className="w-4 h-4" />
              </button>
              <button
                onClick={next}
                className="w-10 h-10 flex items-center justify-center rounded-xl
                  bg-blue-600 text-white hover:bg-blue-700
                  shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
              >
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------- Section 5: Contact ---------- */
function ContactSection() {
  const sectionRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(formRef.current, {
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 75%",
        },
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
      });
    }, sectionRef);
    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 px-6 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50 overflow-hidden"
    >
      <div className="max-w-6xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-50 text-blue-600 text-xs font-medium">
            Get in Touch
          </div>
          <h2 className="mt-5 text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
            Questions or feedback?
          </h2>
          <p className="mt-4 text-gray-600">
            Reach out to the CAMPUSTA team — we'd love to hear from you.
          </p>
        </div>

        <div ref={formRef} className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Contact info */}
          <div className="lg:col-span-2 space-y-4">
            <ContactCard icon={Mail} label="Email" value="admin@uspf.edu.ph" />
            <ContactCard icon={Phone} label="Phone" value="+63 (32) 123-4567" />
            <ContactCard
              icon={MapPinned}
              label="Location"
              value="USPF Main Campus, Cebu City"
            />
          </div>

          {/* Form */}
          <div
            className="lg:col-span-3 p-8 rounded-2xl bg-white border border-gray-100
            shadow-[0_20px_60px_-20px_rgba(0,0,0,0.1)]"
          >
            <form onSubmit={(e) => e.preventDefault()} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Name
                  </label>
                  <input
                    type="text"
                    placeholder="Your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1.5">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="you@uspf.edu.ph"
                    className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white
                      text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400 transition"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  placeholder="How can we help?"
                  className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-white
                    text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 focus:border-blue-400
                    resize-none transition"
                />
              </div>

              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl
                  bg-blue-600 text-white text-sm font-medium hover:bg-blue-700
                  shadow-[0_12px_32px_-12px_rgba(59,130,246,0.7)] transition"
              >
                <Send className="w-4 h-4" />
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactCard({ icon: Icon, label, value }) {
  return (
    <div
      className="flex items-center gap-4 p-5 rounded-2xl bg-white border border-gray-100
      shadow-[0_8px_30px_-12px_rgba(0,0,0,0.08)]"
    >
      <div className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl bg-blue-50">
        <Icon className="w-5 h-5 text-blue-600" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] uppercase tracking-wide text-gray-400 font-medium">
          {label}
        </p>
        <p className="text-sm text-gray-800 truncate">{value}</p>
      </div>
    </div>
  );
}

/* ---------- Main ---------- */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <header
        className="fixed top-0 left-0 right-0 z-50
        bg-white/70 backdrop-blur-xl border-b border-gray-200/60
        shadow-[0_4px_24px_-12px_rgba(0,0,0,0.06)]"
      >
        <div className="max-w-7xl mx-auto px-6 py-3.5 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-50">
              <QrCode className="w-4 h-4 text-blue-600" />
            </div>
            <span className="text-lg font-bold text-gray-800 tracking-tight">
              CAMPUSTA
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            <a
              href="#about"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              About
            </a>
            <a
              href="#how"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              How it works
            </a>
            <a
              href="#usages"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Usages
            </a>
            <a
              href="#contact"
              className="text-sm text-gray-600 hover:text-blue-600 transition"
            >
              Contact
            </a>
          </nav>

          <Link
            to="/login"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl
              bg-blue-600 text-white text-sm font-medium hover:bg-blue-700
              shadow-[0_8px_24px_-8px_rgba(59,130,246,0.6)] transition"
          >
            Login
            <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </header>

      {/* Sections */}
      <main className="pt-16">
        <HeroSection />
        <div id="about">
          <AboutSection />
        </div>
        <div id="how">
          <HowItWorksSection />
        </div>
        <div id="usages">
          <UsagesSection />
        </div>
        <div id="contact">
          <ContactSection />
        </div>
      </main>

      {/* Footer */}
      <footer className="relative bg-gray-900 text-gray-400 overflow-hidden">
        <div className="absolute -top-32 left-1/4 w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-40 right-1/4 w-[500px] h-[500px] rounded-full bg-indigo-500/10 blur-3xl pointer-events-none" />

        <div className="relative max-w-7xl mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 flex items-center justify-center rounded-xl bg-blue-500/20">
                  <QrCode className="w-4 h-4 text-blue-400" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  CAMPUSTA
                </span>
              </div>
              <p className="mt-4 text-sm text-gray-400 max-w-md leading-relaxed">
                Smart Campus Maintenance and Service Management System for the
                University of Southern Philippines Foundation.
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">System</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#about" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#how" className="hover:text-white transition">
                    How it works
                  </a>
                </li>
                <li>
                  <a href="#usages" className="hover:text-white transition">
                    Usages
                  </a>
                </li>
                <li>
                  <Link to="/login" className="hover:text-white transition">
                    Login
                  </Link>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-white mb-3">Contact</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5" /> admin@uspf.edu.ph
                </li>
                <li className="flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5" /> Cebu City, PH
                </li>
              </ul>
            </div>
          </div>

          <div className="mt-10 pt-6 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-xs text-gray-500">
              © {new Date().getFullYear()} CAMPUSTA. All rights reserved.
            </p>
            <p className="text-xs text-gray-500">
              Developed by{" "}
              <span className="text-gray-300 font-medium">
                2026 BSIT Students
              </span>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
