import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Building2,
  DoorOpen,
  Hand,
  Users,
  Armchair,
  CheckCircle2,
  XCircle,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Volume2,
  VolumeX,
  Mic,
  MicOff,
  RotateCcw,
  Trophy,
  Award,
  Check,
  Smile,
  Eye,
  MessageSquare,
  Volume,
  HeartHandshake,
  UserCheck,
  ChevronRight,
  Sparkle,
} from "lucide-react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { cn } from "@/lib/utils";

// ==========================================
// TYPES & INTERFACES
// ==========================================

export type ScenarioPage =
  | "intro"
  | "story"
  | "tips"
  | "quiz"
  | "practice"
  | "feedback"
  | "completion";

interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface Question {
  id: number;
  question: string;
  options: QuestionOption[];
}

// ==========================================
// KNOWLEDGE CHECK DATA
// ==========================================

const QUESTIONS: Question[] = [
  {
    id: 1,
    question: "What should you do before sitting in a manager's office?",
    options: [
      { id: "1a", text: "Sit immediately", isCorrect: false, explanation: "Sitting down before permitted can seem overly informal or intrusive." },
      { id: "1b", text: "Wait for permission", isCorrect: true, explanation: "Correct! Waiting until offered a seat shows respect and professional composure." },
      { id: "1c", text: "Ignore the manager", isCorrect: false, explanation: "Ignoring the manager is unprofessional." },
      { id: "1d", text: "Walk away", isCorrect: false, explanation: "Walking away avoids communication completely." },
    ],
  },
  {
    id: 2,
    question: "How should you greet your new colleagues on your first day?",
    options: [
      { id: "2a", text: "Mumble quietly", isCorrect: false, explanation: "Mumbling creates an impression of low confidence." },
      { id: "2b", text: "Smile and greet politely", isCorrect: true, explanation: "Correct! A warm smile and clear greeting builds instant rapport." },
      { id: "2c", text: "Look at your phone", isCorrect: false, explanation: "Looking at your phone signals disinterest." },
      { id: "2d", text: "Avoid eye contact", isCorrect: false, explanation: "Avoiding eye contact makes you seem distant or unapproachable." },
    ],
  },
  {
    id: 3,
    question: "What is key to showing confidence when introducing yourself?",
    options: [
      { id: "3a", text: "Speak slowly with natural eye contact", isCorrect: true, explanation: "Correct! Controlled speed and gentle eye contact convey clear self-assurance." },
      { id: "3b", text: "Shout very loud", isCorrect: false, explanation: "Shouting is aggressive rather than confident." },
      { id: "3c", text: "Turn your back", isCorrect: false, explanation: "Turning away breaks connection." },
      { id: "3d", text: "Interrupt others", isCorrect: false, explanation: "Interrupting disrupts positive workplace dialogue." },
    ],
  },
  {
    id: 4,
    question: "When meeting your manager for the first time, what is proper etiquette?",
    options: [
      { id: "4a", text: "Offer a polite handshake & warm greeting", isCorrect: true, explanation: "Correct! A polite greeting paired with a respectful gesture sets a professional standard." },
      { id: "4b", text: "Demand a seat", isCorrect: false, explanation: "Demanding a seat lacks courtesy." },
      { id: "4c", text: "Complain about traffic", isCorrect: false, explanation: "Complaining immediately leaves a negative impression." },
      { id: "4d", text: "Skip introducing yourself", isCorrect: false, explanation: "Skipping introductions creates confusion." },
    ],
  },
];

// ==========================================
// TIPS DATA
// ==========================================

const TIPS_DATA = [
  {
    id: "smile",
    title: "Smile",
    icon: Smile,
    badge: "Positive Impression",
    description: "Maintaining a friendly smile creates a positive first impression.",
    color: "from-amber-500/20 to-orange-500/10 border-amber-500/30 text-amber-500",
  },
  {
    id: "eye-contact",
    title: "Eye Contact",
    icon: Eye,
    badge: "Build Trust",
    description: "Maintain natural eye contact while speaking.",
    color: "from-blue-500/20 to-cyan-500/10 border-blue-500/30 text-blue-500",
  },
  {
    id: "greeting",
    title: "Greeting",
    icon: MessageSquare,
    badge: "Warm Start",
    description: "Always greet people politely.",
    color: "from-emerald-500/20 to-green-500/10 border-emerald-500/30 text-emerald-500",
  },
  {
    id: "speak-clearly",
    title: "Speak Clearly",
    icon: Volume,
    badge: "Clarity & Pace",
    description: "Speak slowly and confidently.",
    color: "from-purple-500/20 to-indigo-500/10 border-purple-500/30 text-purple-500",
  },
  {
    id: "respect",
    title: "Respect",
    icon: HeartHandshake,
    badge: "Professional Tone",
    description: "Be respectful and professional.",
    color: "from-rose-500/20 to-pink-500/10 border-rose-500/30 text-rose-500",
  },
  {
    id: "etiquette",
    title: "Workplace Etiquette",
    icon: UserCheck,
    badge: "Courtesy Rule",
    description: "Wait for permission before sitting.",
    color: "from-teal-500/20 to-emerald-500/10 border-teal-500/30 text-teal-500",
  },
];

// ==========================================
// VECTOR SVG ANIMATED SCENE ILLUSTRATIONS
// ==========================================

function OfficeBuildingScene() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" aria-hidden="true">
      <defs>
        <linearGradient id="skyGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="50%" stopColor="#312e81" />
          <stop offset="100%" stopColor="#4338ca" />
        </linearGradient>
        <linearGradient id="glassGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(56, 189, 248, 0.4)" />
          <stop offset="100%" stopColor="rgba(99, 102, 241, 0.2)" />
        </linearGradient>
        <linearGradient id="doorGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#0284c7" stopOpacity="0.6" />
        </linearGradient>
      </defs>

      {/* Background Sky & Sun */}
      <rect width="800" height="450" fill="url(#skyGrad)" rx="16" />
      <circle cx="700" cy="80" r="45" fill="#fef08a" opacity="0.85" className="animate-pulse" />
      <circle cx="700" cy="80" r="70" fill="#fef08a" opacity="0.15" />

      {/* Distant skyline */}
      <path d="M0 350 L80 350 L80 280 L140 280 L140 350 L260 350 L260 220 L340 220 L340 350 L800 350 L800 450 L0 450 Z" fill="#1e1b4b" opacity="0.6" />

      {/* Main Office Building */}
      <rect x="220" y="70" width="360" height="300" rx="12" fill="#0f172a" stroke="#6366f1" strokeWidth="2" />
      <rect x="235" y="85" width="330" height="270" fill="url(#glassGrad)" rx="8" />

      {/* Window Grid */}
      {[0, 1, 2, 3].map((row) =>
        [0, 1, 2, 3, 4].map((col) => (
          <rect
            key={`${row}-${col}`}
            x={260 + col * 55}
            y={105 + row * 45}
            width="40"
            height="32"
            rx="4"
            fill={(row + col) % 2 === 0 ? "#7dd3fc" : "#e0e7ff"}
            opacity={0.7}
          />
        ))
      )}

      {/* Entrance Canopy & Door */}
      <path d="M330 310 L470 310 L490 320 L310 320 Z" fill="#38bdf8" />
      <rect x="360" y="320" width="80" height="50" rx="4" fill="url(#doorGrad)" stroke="#38bdf8" strokeWidth="2" />
      <line x1="400" y1="320" x2="400" y2="370" stroke="#0f172a" strokeWidth="2" />

      {/* Pathway */}
      <polygon points="340,370 460,370 560,450 240,450" fill="#334155" />
      <line x1="400" y1="370" x2="400" y2="450" stroke="#f8fafc" strokeDasharray="8 8" opacity="0.6" />

      {/* Company Logo Badge on Building */}
      <rect x="320" y="80" width="160" height="24" rx="12" fill="#4338ca" stroke="#818cf8" strokeWidth="1.5" />
      <text x="400" y="96" textAnchor="middle" fill="#ffffff" fontSize="11" fontWeight="bold" letterSpacing="1">
        EXPRESSABLE HQ
      </text>

      {/* Walking Character */}
      <g className="transition-transform duration-700">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="60 0; 0 0"
          dur="3s"
          repeatCount="indefinite"
        />
        {/* Shadow */}
        <ellipse cx="300" cy="425" rx="22" ry="6" fill="#020617" opacity="0.4" />

        {/* Legs walking motion */}
        <line x1="293" y1="390" x2="285" y2="425" stroke="#1e293b" strokeWidth="6" strokeLinecap="round">
          <animate attributeName="x2" values="285; 295; 285" dur="0.8s" repeatCount="indefinite" />
        </line>
        <line x1="307" y1="390" x2="315" y2="425" stroke="#1e293b" strokeWidth="6" strokeLinecap="round">
          <animate attributeName="x2" values="315; 305; 315" dur="0.8s" repeatCount="indefinite" />
        </line>

        {/* Body & Jacket */}
        <rect x="285" y="340" width="30" height="52" rx="8" fill="#2563eb" />
        <path d="M292 340 L300 355 L308 340 Z" fill="#ffffff" />
        <polygon points="300,345 304,365 296,365" fill="#dc2626" />

        {/* Head */}
        <circle cx="300" cy="320" r="16" fill="#fca5a5" />
        {/* Hair */}
        <path d="M284 318 C284 300 316 300 316 318 Z" fill="#1e1b4b" />
        {/* Laptop bag strap */}
        <line x1="288" y1="340" x2="312" y2="385" stroke="#78350f" strokeWidth="3" />
        <rect x="306" y="375" width="16" height="14" rx="2" fill="#92400e" />
      </g>
    </svg>
  );
}

function OfficeEntranceScene() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" aria-hidden="true">
      <defs>
        <linearGradient id="interiorBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
        <linearGradient id="deskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#1d4ed8" />
        </linearGradient>
      </defs>

      <rect width="800" height="450" fill="url(#interiorBg)" rx="16" />

      {/* Glass Doors background */}
      <rect x="50" y="60" width="160" height="320" fill="#38bdf8" opacity="0.15" stroke="#38bdf8" strokeWidth="2" rx="4" />
      <line x1="200" y1="60" x2="200" y2="380" stroke="#38bdf8" strokeWidth="3" />

      {/* Decorative Wall Artwork */}
      <rect x="300" y="80" width="220" height="100" rx="8" fill="#1e1b4b" stroke="#818cf8" strokeWidth="2" />
      <text x="410" y="130" textAnchor="middle" fill="#38bdf8" fontSize="16" fontWeight="bold">
        WELCOME TO EXPRESSABLE
      </text>

      {/* Indoor Potted Plants */}
      <ellipse cx="680" cy="380" rx="24" ry="12" fill="#78350f" />
      <path d="M680 380 L670 330 L690 330 Z" fill="#92400e" />
      <circle cx="680" cy="300" r="30" fill="#10b981" opacity="0.9" />
      <circle cx="665" cy="285" r="22" fill="#059669" />
      <circle cx="695" cy="285" r="22" fill="#34d399" />

      {/* Reception Desk */}
      <path d="M420 280 L720 280 L700 380 L440 380 Z" fill="url(#deskGrad)" />
      <rect x="440" y="270" width="260" height="15" rx="4" fill="#93c5fd" />

      {/* Laptop on Reception Desk */}
      <polygon points="560,270 590,270 595,250 555,250" fill="#94a3b8" />
      <rect x="558" y="232" width="34" height="20" rx="2" fill="#38bdf8" />

      {/* Receptionist */}
      <g>
        <ellipse cx="580" cy="265" rx="16" ry="6" fill="#020617" opacity="0.3" />
        <circle cx="580" cy="195" r="16" fill="#fed7aa" />
        {/* Hair */}
        <path d="M564 195 C564 175 596 175 596 195 Z" fill="#7c2d12" />
        <rect x="566" y="215" width="28" height="40" rx="6" fill="#ec4899" />

        {/* Waving Arm */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="0 566 220; 20 566 220; 0 566 220"
            dur="1.2s"
            repeatCount="indefinite"
          />
          <line x1="566" y1="220" x2="540" y2="190" stroke="#fed7aa" strokeWidth="6" strokeLinecap="round" />
          <circle cx="538" cy="188" r="5" fill="#fed7aa" />
        </g>
      </g>

      {/* Entering Character (Opens Door) */}
      <g transform="translate(180, 0)">
        <circle cx="100" cy="200" r="18" fill="#fca5a5" />
        <path d="M82 198 C82 180 118 180 118 198 Z" fill="#1e1b4b" />
        <rect x="84" y="222" width="32" height="58" rx="8" fill="#2563eb" />
        <line x1="90" y1="280" x2="88" y2="380" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
        <line x1="110" y1="280" x2="112" y2="380" stroke="#1e293b" strokeWidth="7" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function GreetingScene() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" aria-hidden="true">
      <defs>
        <linearGradient id="warmBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1e1b4b" />
          <stop offset="100%" stopColor="#312e81" />
        </linearGradient>
        <radialGradient id="sparkleGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="450" fill="url(#warmBg)" rx="16" />

      {/* Glow effect behind character */}
      <circle cx="400" cy="210" r="160" fill="url(#sparkleGlow)" />

      {/* Character Center Stage */}
      <g transform="translate(260, 40)">
        {/* Shadow */}
        <ellipse cx="140" cy="380" rx="55" ry="12" fill="#020617" opacity="0.4" />

        {/* Legs */}
        <line x1="120" y1="250" x2="115" y2="380" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />
        <line x1="160" y1="250" x2="165" y2="380" stroke="#1e293b" strokeWidth="12" strokeLinecap="round" />

        {/* Torso & Suit Jacket */}
        <rect x="100" y="140" width="80" height="120" rx="16" fill="#2563eb" />
        <polygon points="140,140 128,170 152,170" fill="#ffffff" />
        <polygon points="140,150 145,185 135,185" fill="#e11d48" />

        {/* Head & Smiling Face */}
        <circle cx="140" cy="95" r="38" fill="#fca5a5" />
        {/* Hair */}
        <path d="M102 95 C102 50 178 50 178 95 Z" fill="#1e1b4b" />
        {/* Eyes (Friendly) */}
        <ellipse cx="126" cy="92" rx="4" ry="5" fill="#020617" />
        <ellipse cx="154" cy="92" rx="4" ry="5" fill="#020617" />
        {/* Smile Arc */}
        <path d="M124 110 Q140 125 156 110" stroke="#7f1d1d" strokeWidth="4" fill="none" strokeLinecap="round" />

        {/* Animated Waving Hand */}
        <g>
          <animateTransform
            attributeName="transform"
            type="rotate"
            values="-15 180 150; 25 180 150; -15 180 150"
            dur="1s"
            repeatCount="indefinite"
          />
          <line x1="180" y1="150" x2="230" y2="90" stroke="#fca5a5" strokeWidth="10" strokeLinecap="round" />
          {/* Hand Palm */}
          <circle cx="234" cy="85" r="12" fill="#fca5a5" />
          {/* Fingers */}
          <circle cx="230" cy="72" r="4" fill="#fca5a5" />
          <circle cx="238" cy="73" r="4" fill="#fca5a5" />
          <circle cx="245" cy="78" r="4" fill="#fca5a5" />
        </g>
      </g>
    </svg>
  );
}

function MeetingManagerScene() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" aria-hidden="true">
      <defs>
        <linearGradient id="officeBg" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#020617" />
          <stop offset="100%" stopColor="#1e1b4b" />
        </linearGradient>
      </defs>

      <rect width="800" height="450" fill="url(#officeBg)" rx="16" />

      {/* Office Window behind */}
      <rect x="250" y="40" width="300" height="180" rx="8" fill="#1e293b" stroke="#475569" strokeWidth="3" />
      <line x1="400" y1="40" x2="400" y2="220" stroke="#475569" strokeWidth="2" />
      <line x1="250" y1="130" x2="550" y2="130" stroke="#475569" strokeWidth="2" />

      {/* Left Person: Manager (Grey suit) */}
      <g transform="translate(140, 60)">
        <ellipse cx="100" cy="340" rx="45" ry="10" fill="#020617" opacity="0.5" />
        <circle cx="100" cy="85" r="32" fill="#fed7aa" />
        <path d="M68 85 C68 45 132 45 132 85 Z" fill="#475569" />
        <rect x="65" y="125" width="70" height="110" rx="14" fill="#334155" />
        <line x1="82" y1="235" x2="80" y2="340" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
        <line x1="118" y1="235" x2="120" y2="340" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* Right Person: Learner Character */}
      <g transform="translate(420, 60)">
        <ellipse cx="100" cy="340" rx="45" ry="10" fill="#020617" opacity="0.5" />
        <circle cx="100" cy="85" r="32" fill="#fca5a5" />
        <path d="M68 85 C68 45 132 45 132 85 Z" fill="#1e1b4b" />
        <rect x="65" y="125" width="70" height="110" rx="14" fill="#2563eb" />
        <line x1="82" y1="235" x2="80" y2="340" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
        <line x1="118" y1="235" x2="120" y2="340" stroke="#1e293b" strokeWidth="10" strokeLinecap="round" />
      </g>

      {/* Animated Handshake in Center */}
      <g transform="translate(330, 200)">
        <animateTransform
          attributeName="transform"
          type="translate"
          values="330 200; 330 192; 330 200"
          dur="0.6s"
          repeatCount="indefinite"
        />

        {/* Manager's extended right arm */}
        <path d="M-80 -15 L15 15" stroke="#fed7aa" strokeWidth="12" strokeLinecap="round" />
        {/* Character's extended left arm */}
        <path d="M220 -15 L125 15" stroke="#fca5a5" strokeWidth="12" strokeLinecap="round" />

        {/* Hands Clasping */}
        <circle cx="70" cy="18" r="16" fill="#fed7aa" />
        <circle cx="75" cy="18" r="16" fill="#fca5a5" opacity="0.9" />

        {/* Sparkles around Handshake */}
        <circle cx="70" cy="-10" r="4" fill="#fef08a" className="animate-ping" />
        <circle cx="45" cy="30" r="3" fill="#38bdf8" />
        <circle cx="95" cy="30" r="3" fill="#38bdf8" />
      </g>
    </svg>
  );
}

function SittingScene() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" aria-hidden="true">
      <defs>
        <linearGradient id="roomGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#0f172a" />
          <stop offset="100%" stopColor="#1e293b" />
        </linearGradient>
      </defs>

      <rect width="800" height="450" fill="url(#roomGrad)" rx="16" />

      {/* Executive Desk */}
      <rect x="80" y="260" width="340" height="120" rx="8" fill="#475569" stroke="#64748b" strokeWidth="2" />
      <rect x="70" y="250" width="360" height="16" rx="4" fill="#94a3b8" />

      {/* Manager behind Desk pointing to chair */}
      <g transform="translate(160, 100)">
        <circle cx="100" cy="70" r="30" fill="#fed7aa" />
        <path d="M70 70 C70 30 130 30 130 70 Z" fill="#334155" />
        <rect x="70" y="105" width="60" height="80" rx="10" fill="#1e293b" />

        {/* Manager Pointing Arm towards chair */}
        <line x1="120" y1="120" x2="220" y2="150" stroke="#fed7aa" strokeWidth="8" strokeLinecap="round" />
        <polygon points="220,150 232,148 224,156" fill="#fed7aa" />
      </g>

      {/* Comfortable Office Chair on right */}
      <g transform="translate(520, 200)">
        {/* Chair Back */}
        <rect x="30" y="0" width="80" height="110" rx="12" fill="#2563eb" stroke="#3b82f6" strokeWidth="2" />
        {/* Chair Seat */}
        <rect x="20" y="100" width="100" height="24" rx="8" fill="#1d4ed8" />
        {/* Base Leg */}
        <rect x="65" y="124" width="10" height="60" fill="#64748b" />
        <ellipse cx="70" cy="184" rx="45" ry="8" fill="#334155" />
      </g>

      {/* Character Sitting comfortably on chair */}
      <g transform="translate(520, 120)">
        {/* Head */}
        <circle cx="70" cy="40" r="28" fill="#fca5a5" />
        <path d="M42 40 C42 5 98 5 98 40 Z" fill="#1e1b4b" />
        {/* Seated Torso */}
        <rect x="42" y="70" width="56" height="75" rx="10" fill="#1d4ed8" />
        {/* Folded Seated Legs */}
        <path d="M50 145 L10 180 L-20 180" stroke="#1e293b" strokeWidth="10" fill="none" strokeLinecap="round" />
      </g>
    </svg>
  );
}

function CongratulationsScene() {
  return (
    <svg viewBox="0 0 800 450" className="w-full h-full rounded-2xl" aria-hidden="true">
      <defs>
        <radialGradient id="goldGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
          <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
        </radialGradient>
      </defs>

      <rect width="800" height="450" fill="#0f172a" rx="16" />

      {/* Background Burst Rays */}
      <circle cx="400" cy="200" r="220" fill="url(#goldGlow)" />

      {/* Trophy Badge in Center */}
      <g transform="translate(340, 80)">
        <circle cx="60" cy="60" r="65" fill="#f59e0b" opacity="0.2" className="animate-pulse" />
        <circle cx="60" cy="60" r="50" fill="#f59e0b" />
        {/* Star */}
        <polygon points="60,25 70,45 92,48 76,64 80,86 60,75 40,86 44,64 28,48 50,45" fill="#ffffff" />
      </g>

      {/* Floating Sparkle Stars */}
      {[
        { x: 160, y: 100, r: 6 },
        { x: 640, y: 120, r: 8 },
        { x: 220, y: 300, r: 5 },
        { x: 580, y: 320, r: 7 },
      ].map((star, i) => (
        <circle key={i} cx={star.x} cy={star.y} r={star.r} fill="#fef08a" className="animate-ping" />
      ))}
    </svg>
  );
}

// ==========================================
// MAIN COMPONENT: FIRST DAY AT OFFICE
// ==========================================

export function FirstDayAtOfficeScenario({
  onBackToSimulations,
}: {
  onBackToSimulations?: () => void;
}) {
  const { announce, reducedMotion } = useAccessibility();

  // Navigation State
  const [currentPage, setCurrentPage] = useState<ScenarioPage>("intro");
  const [storyCardIndex, setStoryCardIndex] = useState(0);

  // Sound / Audio TTS State
  const [isMuted, setIsMuted] = useState(false);

  // Knowledge Check Quiz State
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<Record<number, boolean>>({});

  // Practice Conversation State
  const [speechText, setSpeechText] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // TTS Speech Synthesis helper
  const speakText = (text: string) => {
    if (isMuted || typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  };

  // Announce page changes for accessibility
  useEffect(() => {
    switch (currentPage) {
      case "intro":
        announce("Scenario Introduction: First Day at Office loaded.");
        break;
      case "story":
        announce(`Story Card ${storyCardIndex + 1} of 6 loaded.`);
        break;
      case "tips":
        announce("Communication Tips section loaded.");
        break;
      case "quiz":
        announce("Mini Knowledge Check loaded.");
        break;
      case "practice":
        announce("Practice Conversation loaded. Introduce yourself to the AI Coach.");
        break;
      case "feedback":
        announce("AI Communication Feedback loaded.");
        break;
      case "completion":
        announce("Congratulations! You completed the First Day at Office simulation.");
        break;
    }
  }, [currentPage, storyCardIndex, announce]);

  // Voice recording timer handling
  useEffect(() => {
    if (isRecording) {
      timerRef.current = setInterval(() => {
        setRecordingTime((t) => t + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
      setRecordingTime(0);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  // Story Cards Data
  const STORY_CARDS = [
    {
      id: 1,
      title: "🏢 Office Building",
      text: "Welcome to your first day at work.",
      speechBubble: null,
      illustration: <OfficeBuildingScene />,
    },
    {
      id: 2,
      title: "🚪 Office Entrance",
      text: "Character opens the door. Receptionist smiles and gives a small wave.",
      speechBubble: { speaker: "Receptionist", text: "Good Morning!" },
      illustration: <OfficeEntranceScene />,
    },
    {
      id: 3,
      title: "👋 Greeting",
      text: "Character smiles and waves politely.",
      speechBubble: { speaker: "You", text: "Good Morning. I am happy to join the team." },
      illustration: <GreetingScene />,
    },
    {
      id: 4,
      title: "🤝 Meeting Manager",
      text: "Manager extends hand for a firm, polite handshake.",
      speechBubble: {
        speaker: "Manager",
        text: "Welcome to our team.",
        replySpeaker: "You",
        replyText: "Thank you. I am excited to work here.",
      },
      illustration: <MeetingManagerScene />,
    },
    {
      id: 5,
      title: "🪑 Sitting",
      text: "Manager points to a chair. Character waits politely before sitting down.",
      speechBubble: { speaker: "Manager", text: "Please have a seat." },
      tip: "Always wait for permission before sitting.",
      illustration: <SittingScene />,
    },
    {
      id: 6,
      title: "🎉 Congratulations",
      text: "You completed your first workplace interaction!",
      skills: ["Professional Greeting", "Eye Contact", "Confidence", "Respect", "Communication"],
      illustration: <CongratulationsScene />,
    },
  ];

  // Story Navigation
  const handleNextStoryCard = () => {
    if (storyCardIndex < STORY_CARDS.length - 1) {
      setStoryCardIndex((prev) => prev + 1);
      const nextCard = STORY_CARDS[storyCardIndex + 1];
      if (nextCard?.speechBubble) {
        speakText(nextCard.speechBubble.text);
      }
    } else {
      setCurrentPage("tips");
    }
  };

  const handlePrevStoryCard = () => {
    if (storyCardIndex > 0) {
      setStoryCardIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation for Story Cards
  useEffect(() => {
    if (currentPage !== "story") return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "Space") {
        handleNextStoryCard();
      } else if (e.key === "ArrowLeft") {
        handlePrevStoryCard();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [currentPage, storyCardIndex]);

  // Voice recording simulation toggle
  const toggleRecording = () => {
    if (isRecording) {
      setIsRecording(false);
      announce("Voice recording stopped.");
    } else {
      setIsRecording(true);
      announce("Voice recording started. Speak your introduction.");
      // Sample transcribed text fallback
      setTimeout(() => {
        setSpeechText(
          "Good morning! I am very happy to join the team today as your new colleague. I look forward to working together!"
        );
      }, 2500);
    }
  };

  // Quiz Handling
  const handleSelectQuizOption = (questionId: number, optionId: string) => {
    setQuizAnswers((prev) => ({ ...prev, [questionId]: optionId }));
    setQuizSubmitted((prev) => ({ ...prev, [questionId]: true }));
    const question = QUESTIONS.find((q) => q.id === questionId);
    const selected = question?.options.find((o) => o.id === optionId);
    if (selected) {
      announce(selected.isCorrect ? `Correct! ${selected.explanation}` : `Incorrect. ${selected.explanation}`);
    }
  };

  const allQuizAnswered = QUESTIONS.every((q) => quizAnswers[q.id]);

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Top Header Breadcrumb & Mute Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border pb-4">
        <div className="flex items-center gap-2">
          {onBackToSimulations && (
            <button
              type="button"
              onClick={onBackToSimulations}
              className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <ArrowLeft className="size-3.5" />
              Workplace Simulations
            </button>
          )}
          <span className="text-xs text-muted-foreground">/</span>
          <span className="text-xs font-bold text-primary">First Day at Office</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setIsMuted(!isMuted)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-semibold"
            aria-label={isMuted ? "Unmute Voiceover" : "Mute Voiceover"}
          >
            {isMuted ? <VolumeX className="size-4 text-destructive" /> : <Volume2 className="size-4 text-primary" />}
            <span>{isMuted ? "Muted" : "Voice On"}</span>
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* PAGE 1: SCENARIO INTRODUCTION */}
      {/* ========================================== */}
      {currentPage === "intro" && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 sm:p-8 space-y-8"
        >
          <div className="grid gap-8 lg:grid-cols-12 items-center">
            {/* Visual Hero Illustration */}
            <div className="lg:col-span-6 relative aspect-video sm:aspect-[4/3] rounded-2xl overflow-hidden shadow-lg border border-border">
              <OfficeBuildingScene />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/90 backdrop-blur px-3 py-1 text-xs font-bold text-primary-foreground shadow">
                  <Sparkles className="size-3.5" /> Premium Visual Learning
                </span>
              </div>
            </div>

            {/* Intro Details */}
            <div className="lg:col-span-6 space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-primary">
                  Workplace Scenario #1
                </span>
                <h1 className="mt-1 text-3xl font-extrabold tracking-tight sm:text-4xl text-foreground">
                  First Day at Office
                </h1>
                <p className="mt-3 text-base text-muted-foreground leading-relaxed">
                  Learn how to professionally enter a workplace, greet colleagues, introduce yourself, and communicate confidently during your first day.
                </p>
              </div>

              {/* Meta Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl border border-border bg-secondary/50 p-3">
                  <span className="text-xs text-muted-foreground font-medium">Estimated Time</span>
                  <p className="mt-1 text-sm font-bold text-foreground">⏱️ 5 Minutes</p>
                </div>
                <div className="rounded-xl border border-border bg-secondary/50 p-3">
                  <span className="text-xs text-muted-foreground font-medium">Difficulty Level</span>
                  <p className="mt-1 text-sm font-bold text-success">🟢 Easy</p>
                </div>
              </div>

              {/* Target Skills */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2.5">
                  Skills You Will Master
                </h3>
                <div className="flex flex-wrap gap-2">
                  {[
                    "Professional Greeting",
                    "Self Introduction",
                    "Communication Confidence",
                    "Workplace Etiquette",
                  ].map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary"
                    >
                      <CheckCircle2 className="size-3.5" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Start CTA */}
              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setCurrentPage("story");
                    setStoryCardIndex(0);
                  }}
                  className="w-full sm:w-auto inline-flex min-h-12 items-center justify-center gap-3 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg shadow-primary/25 hover:opacity-95 transition-all"
                >
                  Start Animated Story
                  <ArrowRight className="size-5" />
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* PAGE 2: ANIMATED VISUAL STORY (6 CARDS) */}
      {/* ========================================== */}
      {currentPage === "story" && (
        <div className="space-y-4">
          {/* Top Story Header & Progress Bar */}
          <div className="flex items-center justify-between gap-4 glass-card rounded-xl px-4 py-3">
            <div className="flex items-center gap-3 flex-1">
              <span className="text-xs font-bold text-muted-foreground shrink-0">
                Card {storyCardIndex + 1} of {STORY_CARDS.length}
              </span>
              <div
                className="h-2.5 flex-1 rounded-full bg-secondary overflow-hidden"
                role="progressbar"
                aria-valuenow={storyCardIndex + 1}
                aria-valuemin={1}
                aria-valuemax={6}
                aria-label="Story Progress"
              >
                <div
                  className="h-full bg-primary transition-all duration-500 rounded-full"
                  style={{ width: `${((storyCardIndex + 1) / STORY_CARDS.length) * 100}%` }}
                />
              </div>
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage("intro")}
              className="text-xs font-semibold text-muted-foreground hover:text-foreground px-2 py-1"
            >
              Exit Story
            </button>
          </div>

          {/* Story Card Container */}
          <AnimatePresence mode="wait">
            <motion.div
              key={storyCardIndex}
              initial={reducedMotion ? false : { opacity: 0, x: 40 }}
              animate={{ opacity: 1, x: 0 }}
              exit={reducedMotion ? { opacity: 1 } : { opacity: 0, x: -40 }}
              transition={{ duration: 0.3 }}
              className="glass-card rounded-2xl p-6 sm:p-8 space-y-6 relative overflow-hidden min-h-[480px] flex flex-col justify-between"
            >
              {/* Card Title */}
              <div className="flex items-center justify-between border-b border-border pb-3">
                <h2 className="text-xl sm:text-2xl font-bold text-foreground flex items-center gap-2">
                  {STORY_CARDS[storyCardIndex]!.title}
                </h2>
                <span className="text-xs text-muted-foreground">Press Space or → to advance</span>
              </div>

              {/* Vector Scene Illustration */}
              <div className="relative aspect-video max-h-[300px] w-full rounded-xl overflow-hidden border border-border shadow-inner bg-slate-950">
                {STORY_CARDS[storyCardIndex]!.illustration}

                {/* Speech Bubble Overlay Animation */}
                {STORY_CARDS[storyCardIndex]!.speechBubble && (
                  <motion.div
                    initial={reducedMotion ? false : { scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-4 right-4 max-w-xs sm:max-w-sm rounded-2xl bg-card/95 border-2 border-primary p-4 shadow-xl backdrop-blur text-card-foreground"
                  >
                    <div className="flex items-center justify-between gap-2 border-b border-border pb-1 mb-1">
                      <span className="text-xs font-extrabold text-primary uppercase">
                        {STORY_CARDS[storyCardIndex]!.speechBubble!.speaker}
                      </span>
                      <button
                        type="button"
                        onClick={() =>
                          speakText(STORY_CARDS[storyCardIndex]!.speechBubble!.text)
                        }
                        className="text-muted-foreground hover:text-primary"
                        aria-label="Listen to speech bubble"
                      >
                        <Volume2 className="size-3.5" />
                      </button>
                    </div>
                    <p className="text-sm font-semibold leading-snug">
                      "{STORY_CARDS[storyCardIndex]!.speechBubble!.text}"
                    </p>

                    {/* Manager/User Reply inside bubble if card 4 */}
                    {STORY_CARDS[storyCardIndex]!.speechBubble!.replyText && (
                      <div className="mt-3 pt-2 border-t border-border">
                        <span className="text-xs font-extrabold text-success uppercase">
                          {STORY_CARDS[storyCardIndex]!.speechBubble!.replySpeaker}
                        </span>
                        <p className="text-sm font-semibold text-foreground">
                          "{STORY_CARDS[storyCardIndex]!.speechBubble!.replyText}"
                        </p>
                      </div>
                    )}
                  </motion.div>
                )}
              </div>

              {/* Story Narrative Text & Etiquette Callout Tip */}
              <div className="space-y-3">
                <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed">
                  {STORY_CARDS[storyCardIndex]!.text}
                </p>

                {/* Card 5 Etiquette Tip */}
                {STORY_CARDS[storyCardIndex]!.tip && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4 text-amber-600 dark:text-amber-300"
                  >
                    <Armchair className="size-5 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold uppercase tracking-wider block">
                        Workplace Etiquette Tip
                      </span>
                      <p className="text-sm font-bold mt-0.5">
                        {STORY_CARDS[storyCardIndex]!.tip}
                      </p>
                    </div>
                  </motion.div>
                )}

                {/* Card 6 Skills Chips */}
                {STORY_CARDS[storyCardIndex]!.skills && (
                  <div className="pt-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground block mb-2">
                      Key Takeaway Skills:
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {STORY_CARDS[storyCardIndex]!.skills!.map((sk) => (
                        <span
                          key={sk}
                          className="inline-flex items-center gap-1.5 rounded-full bg-success/15 border border-success/30 px-3 py-1 text-xs font-bold text-success"
                        >
                          <Check className="size-3.5" /> {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Story Card Controls */}
              <div className="flex items-center justify-between pt-4 border-t border-border">
                <button
                  type="button"
                  onClick={handlePrevStoryCard}
                  disabled={storyCardIndex === 0}
                  className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-2 text-sm font-semibold disabled:opacity-40"
                >
                  <ArrowLeft className="size-4" /> Previous
                </button>

                <button
                  type="button"
                  onClick={handleNextStoryCard}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2 text-sm font-bold text-primary-foreground hover:opacity-95 shadow"
                >
                  {storyCardIndex === STORY_CARDS.length - 1 ? (
                    <>
                      Continue to Communication Tips <ChevronRight className="size-4" />
                    </>
                  ) : (
                    <>
                      Next Card <ArrowRight className="size-4" />
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* ========================================== */}
      {/* PAGE 3: COMMUNICATION TIPS */}
      {/* ========================================== */}
      {currentPage === "tips" && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="glass-card rounded-2xl p-6 sm:p-8 space-y-6">
            <header className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-primary">
                Workplace Protocol
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
                6 Key Communication Tips
              </h2>
              <p className="text-sm text-muted-foreground">
                Review these essential behaviors demonstrated in the story before taking your knowledge check.
              </p>
            </header>

            {/* Tips Grid */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {TIPS_DATA.map((tip, idx) => {
                const IconComponent = tip.icon;
                return (
                  <motion.div
                    key={tip.id}
                    initial={reducedMotion ? false : { opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.08 }}
                    className={cn(
                      "group relative rounded-xl border bg-gradient-to-br p-5 transition-all hover:scale-[1.02] shadow-sm",
                      tip.color
                    )}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="inline-flex size-11 items-center justify-center rounded-xl bg-background/80 shadow border border-border">
                        <IconComponent className="size-6" />
                      </div>
                      <span className="rounded-full bg-background/60 px-2.5 py-0.5 text-xs font-extrabold uppercase tracking-wide border border-border">
                        {tip.badge}
                      </span>
                    </div>

                    <h3 className="text-lg font-bold text-foreground">{tip.title}</h3>
                    <p className="mt-2 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                      {tip.description}
                    </p>
                  </motion.div>
                );
              })}
            </div>

            {/* Action Bar */}
            <div className="flex justify-end pt-4 border-t border-border">
              <button
                type="button"
                onClick={() => setCurrentPage("quiz")}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg hover:opacity-95"
              >
                Proceed to Knowledge Check
                <ArrowRight className="size-5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* PAGE 4: MINI KNOWLEDGE CHECK */}
      {/* ========================================== */}
      {currentPage === "quiz" && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <header className="space-y-2 border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Interactive Assessment
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Mini Knowledge Check
            </h2>
            <p className="text-sm text-muted-foreground">
              Answer all 4 workplace etiquette questions to unlock your conversation practice session.
            </p>
          </header>

          {/* Question List */}
          <div className="space-y-8">
            {QUESTIONS.map((q) => {
              const selectedId = quizAnswers[q.id];
              const isSubmitted = quizSubmitted[q.id];

              return (
                <div key={q.id} className="rounded-xl border border-border bg-card/60 p-5 space-y-4">
                  <h3 className="text-base sm:text-lg font-bold text-foreground flex items-center gap-2">
                    <span className="inline-flex size-7 items-center justify-center rounded-full bg-primary/10 text-primary text-xs font-extrabold">
                      {q.id}
                    </span>
                    {q.question}
                  </h3>

                  {/* Options */}
                  <div className="grid gap-2.5 sm:grid-cols-2">
                    {q.options.map((opt) => {
                      const isSelected = selectedId === opt.id;
                      let optionStyle = "border-border bg-card hover:bg-secondary";

                      if (isSelected) {
                        optionStyle = opt.isCorrect
                          ? "border-success bg-success/15 text-success font-bold"
                          : "border-destructive bg-destructive/15 text-destructive font-bold";
                      }

                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectQuizOption(q.id, opt.id)}
                          className={cn(
                            "w-full rounded-xl border p-4 text-left text-sm transition-all flex items-center justify-between min-h-12",
                            optionStyle
                          )}
                        >
                          <span>{opt.text}</span>
                          {isSelected && (
                            <span>
                              {opt.isCorrect ? (
                                <CheckCircle2 className="size-5 text-success" />
                              ) : (
                                <XCircle className="size-5 text-destructive" />
                              )}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Explanation */}
                  {isSubmitted && selectedId && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className={cn(
                        "rounded-lg p-3 text-xs sm:text-sm font-medium border flex items-start gap-2.5",
                        q.options.find((o) => o.id === selectedId)?.isCorrect
                          ? "bg-success/10 border-success/30 text-success"
                          : "bg-destructive/10 border-destructive/30 text-destructive"
                      )}
                    >
                      <Sparkles className="size-4 shrink-0 mt-0.5" />
                      <div>
                        {q.options.find((o) => o.id === selectedId)?.explanation}
                      </div>
                    </motion.div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Continue Action */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <span className="text-xs text-muted-foreground">
              {Object.keys(quizAnswers).length} of {QUESTIONS.length} questions answered
            </span>

            <button
              type="button"
              disabled={!allQuizAnswered}
              onClick={() => setCurrentPage("practice")}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg hover:opacity-95 disabled:opacity-40"
            >
              Start Practice Conversation
              <ArrowRight className="size-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* PAGE 5: PRACTICE CONVERSATION */}
      {/* ========================================== */}
      {currentPage === "practice" && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <header className="space-y-2 border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              Interactive AI Rehearsal
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Practice Your Workplace Introduction
            </h2>
            <p className="text-sm text-muted-foreground">
              Introduce yourself confidently to your AI Manager using your voice or text keyboard.
            </p>
          </header>

          {/* AI Coach Speech Bubble Container */}
          <div className="flex items-start gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-5">
            <div className="relative shrink-0">
              <div className="inline-flex size-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-md">
                <Users className="size-7" />
              </div>
              <span className="absolute -top-1 -right-1 flex size-3.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
                <span className="relative inline-flex rounded-full size-3.5 bg-success"></span>
              </span>
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-extrabold text-primary uppercase">
                  AI Workplace Coach
                </span>
                <span className="rounded bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold text-primary">
                  Online
                </span>
              </div>
              <p className="text-base sm:text-lg font-bold text-foreground">
                "Now it is your turn. Please introduce yourself."
              </p>
            </div>
          </div>

          {/* Voice Microphone Record Option */}
          <div className="rounded-2xl border border-border bg-card/80 p-6 text-center space-y-4">
            <h3 className="text-sm font-bold text-muted-foreground uppercase tracking-wider">
              Option 1: Speak Your Introduction
            </h3>

            <div className="flex flex-col items-center justify-center gap-3">
              <button
                type="button"
                onClick={toggleRecording}
                className={cn(
                  "relative inline-flex size-20 items-center justify-center rounded-full transition-all shadow-xl",
                  isRecording
                    ? "bg-destructive text-destructive-foreground animate-pulse scale-110"
                    : "bg-primary text-primary-foreground hover:scale-105"
                )}
                aria-label={isRecording ? "Stop recording speech" : "Start recording speech"}
              >
                {isRecording ? <MicOff className="size-8" /> : <Mic className="size-8" />}
              </button>

              <span className="text-xs font-semibold text-muted-foreground">
                {isRecording ? `Recording... (${recordingTime}s)` : "Tap microphone to speak"}
              </span>

              {/* Animated Waveform Visualizer */}
              {isRecording && (
                <div className="flex items-center gap-1.5 h-8 my-1">
                  {[40, 70, 30, 90, 50, 80, 40].map((h, i) => (
                    <span
                      key={i}
                      className="w-1.5 rounded-full bg-primary animate-pulse"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Text Input Area */}
          <div className="space-y-3">
            <label htmlFor="user-speech-input" className="text-sm font-bold text-foreground block">
              Option 2: Type Your Introduction
            </label>
            <textarea
              id="user-speech-input"
              rows={4}
              value={speechText}
              onChange={(e) => setSpeechText(e.target.value)}
              placeholder="Good morning! I am very happy to join the team today as your new colleague..."
              className="w-full rounded-xl border border-border bg-background p-4 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition"
            />
          </div>

          {/* Submit Action */}
          <div className="flex justify-between items-center pt-4 border-t border-border">
            <button
              type="button"
              onClick={() =>
                setSpeechText(
                  "Good morning! I am happy to join the team today as your new software specialist. I look forward to contributing!"
                )
              }
              className="text-xs font-semibold text-primary hover:underline"
            >
              Use Sample Introduction
            </button>

            <button
              type="button"
              disabled={!speechText.trim()}
              onClick={() => setCurrentPage("feedback")}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg hover:opacity-95 disabled:opacity-40"
            >
              Submit & Get AI Feedback
              <Sparkles className="size-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* PAGE 6: AI FEEDBACK */}
      {/* ========================================== */}
      {currentPage === "feedback" && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card rounded-2xl p-6 sm:p-8 space-y-6"
        >
          <header className="space-y-2 border-b border-border pb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              AI Evaluation Report
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-foreground">
              Communication Scorecard
            </h2>
            <p className="text-sm text-muted-foreground">
              Here is your multi-dimensional workplace speech feedback.
            </p>
          </header>

          {/* Scores Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: "Pronunciation", score: 92, tone: "text-success", color: "bg-success" },
              { label: "Confidence", score: 95, tone: "text-success", color: "bg-success" },
              { label: "Professional Tone", score: 96, tone: "text-success", color: "bg-success" },
              { label: "Grammar", score: 90, tone: "text-success", color: "bg-success" },
              { label: "Vocabulary", score: 88, tone: "text-primary", color: "bg-primary" },
              { label: "Eye Contact", score: 94, tone: "text-success", color: "bg-success" },
            ].map((item) => (
              <div key={item.label} className="rounded-xl border border-border bg-card/60 p-4 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className={cn("text-base font-extrabold", item.tone)}>{item.score}%</span>
                </div>
                <div className="h-2 w-full rounded-full bg-secondary overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.score}%` }}
                    transition={{ duration: 1 }}
                    className={cn("h-full rounded-full", item.color)}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Recommendation Cards */}
          <div className="space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              AI Coaching Recommendations
            </h3>
            <div className="grid gap-3 sm:grid-cols-2">
              <div className="rounded-xl border border-success/30 bg-success/10 p-4 flex items-start gap-3">
                <CheckCircle2 className="size-5 text-success shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Great Greeting</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your opening greeting was warm, clear, and professional.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 flex items-start gap-3">
                <Volume className="size-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Speak Slightly Slower</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Slowing down your pacing slightly gives colleagues time to process your introduction.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-blue-500/30 bg-blue-500/10 p-4 flex items-start gap-3">
                <Eye className="size-5 text-blue-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Maintain Confidence</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Your tone projected genuine warmth and self-assurance.
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-purple-500/30 bg-purple-500/10 p-4 flex items-start gap-3">
                <Sparkles className="size-5 text-purple-500 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-bold text-foreground">Use Professional Vocabulary</h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    Excellent choice of words suitable for an office environment.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Continue Action */}
          <div className="flex justify-end pt-4 border-t border-border">
            <button
              type="button"
              onClick={() => setCurrentPage("completion")}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-8 text-base font-bold text-primary-foreground shadow-lg hover:opacity-95"
            >
              Complete Simulation
              <Trophy className="size-5" />
            </button>
          </div>
        </motion.div>
      )}

      {/* ========================================== */}
      {/* PAGE 7: COMPLETION */}
      {/* ========================================== */}
      {currentPage === "completion" && (
        <motion.div
          initial={reducedMotion ? false : { opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-card rounded-2xl p-8 text-center space-y-8 relative overflow-hidden"
        >
          {/* Confetti Particle Sparkles Background */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {[...Array(20)].map((_, i) => (
              <span
                key={i}
                className="absolute size-2 rounded-full bg-amber-400 animate-ping"
                style={{
                  top: `${Math.random() * 100}%`,
                  left: `${Math.random() * 100}%`,
                  animationDuration: `${1 + Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Badge Unlocked Trophy Hero */}
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="relative inline-flex size-24 items-center justify-center rounded-3xl bg-gradient-to-tr from-amber-500 to-yellow-300 text-slate-950 shadow-2xl shadow-amber-500/40">
              <Trophy className="size-12" />
              <Sparkles className="absolute -top-2 -right-2 size-6 text-amber-200 animate-bounce" />
            </div>

            <div>
              <span className="text-xs font-extrabold uppercase tracking-widest text-warning">
                Badge Unlocked
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-foreground">
                First Workplace Simulation
              </h2>
              <p className="mt-2 text-sm text-muted-foreground max-w-md mx-auto">
                Congratulations! You successfully mastered visual workplace communication and completed your first day office scenario.
              </p>
            </div>
          </div>

          {/* Milestone Checklist */}
          <div className="mx-auto max-w-md rounded-2xl border border-border bg-card/80 p-5 space-y-3 text-left">
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                Animated Visual Story
              </span>
              <span className="text-xs font-bold text-success">Completed</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                Mini Knowledge Check
              </span>
              <span className="text-xs font-bold text-success">4/4 Passed</span>
            </div>
            <div className="flex items-center justify-between text-sm font-semibold">
              <span className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-success" />
                Practice Conversation
              </span>
              <span className="text-xs font-bold text-success">93% Overall Score</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-4 pt-4">
            <button
              type="button"
              onClick={() => {
                setCurrentPage("intro");
                setStoryCardIndex(0);
                setQuizAnswers({});
                setQuizSubmitted({});
                setSpeechText("");
              }}
              className="inline-flex min-h-12 items-center gap-2 rounded-xl border border-border bg-card px-6 text-sm font-bold hover:bg-secondary"
            >
              <RotateCcw className="size-4" />
              Practice Again
            </button>

            {onBackToSimulations && (
              <button
                type="button"
                onClick={onBackToSimulations}
                className="inline-flex min-h-12 items-center gap-2 rounded-xl bg-primary px-8 text-sm font-bold text-primary-foreground shadow-lg hover:opacity-95"
              >
                Return to Dashboard / Simulations
                <ArrowRight className="size-4" />
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
}
