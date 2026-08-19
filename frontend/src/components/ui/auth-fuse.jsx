"use client";

import * as React from "react";
import { useState, useId, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";
import * as LabelPrimitive from "@radix-ui/react-label";
import { cva } from "class-variance-authority";
import { Eye, EyeOff, ShieldCheck, Sprout, Satellite, Rocket, Globe } from "lucide-react";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { supabase } from "../../lib/supabase";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Typewriter({
  text,
  speed = 60,
  cursor = "|",
  loop = true,
  deleteSpeed = 40,
  delay = 1800,
  className,
}) {
  const [displayText, setDisplayText] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);
  const [textArrayIndex, setTextArrayIndex] = useState(0);

  const textArray = Array.isArray(text) ? text : [text];
  const currentText = textArray[textArrayIndex] || "";

  useEffect(() => {
    if (!currentText) return;

    const timeout = setTimeout(
      () => {
        if (!isDeleting) {
          if (currentIndex < currentText.length) {
            setDisplayText((prev) => prev + currentText[currentIndex]);
            setCurrentIndex((prev) => prev + 1);
          } else if (loop) {
            setTimeout(() => setIsDeleting(true), delay);
          }
        } else {
          if (displayText.length > 0) {
            setDisplayText((prev) => prev.slice(0, -1));
          } else {
            setIsDeleting(false);
            setCurrentIndex(0);
            setTextArrayIndex((prev) => (prev + 1) % textArray.length);
          }
        }
      },
      isDeleting ? deleteSpeed : speed,
    );

    return () => clearTimeout(timeout);
  }, [
    currentIndex,
    isDeleting,
    currentText,
    loop,
    speed,
    deleteSpeed,
    delay,
    displayText,
    textArray,
  ]);

  return (
    <span className={className}>
      {displayText}
      <span className="animate-pulse">{cursor}</span>
    </span>
  );
}

const labelVariants = cva(
  "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
);

const Label = React.forwardRef(({ className, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(labelVariants(), className)}
    {...props}
  />
));
Label.displayName = LabelPrimitive.Root.displayName;

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl text-sm font-bold ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer",
  {
    variants: {
      variant: {
        default: "bg-cyan-500 text-black hover:bg-cyan-400 font-extrabold shadow-lg shadow-cyan-500/20",
        destructive: "bg-rose-500 text-white hover:bg-rose-600",
        outline: "border border-cyan-500/30 bg-slate-900/80 hover:bg-cyan-500/20 hover:text-cyan-300 text-slate-200",
        secondary: "bg-slate-800 text-slate-100 hover:bg-slate-700",
        ghost: "hover:bg-cyan-500/10 text-cyan-400",
        link: "text-cyan-400 underline-offset-4 hover:underline",
      },
      size: {
        default: "h-11 px-5 py-2.5",
        sm: "h-9 rounded-lg px-3",
        lg: "h-12 rounded-2xl px-6 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

const Button = React.forwardRef(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

const Input = React.forwardRef(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-11 w-full rounded-xl border border-white/15 bg-black/60 px-4 py-3 text-sm text-white shadow-inner transition-all placeholder:text-gray-500 focus-visible:bg-slate-950 focus-visible:border-cyan-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 font-medium",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const PasswordInput = React.forwardRef(
  ({ className, label, ...props }, ref) => {
    const id = useId();
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    return (
      <div className="grid w-full items-center gap-2">
        {label && <Label htmlFor={id} className="text-gray-300 font-semibold text-xs">{label}</Label>}
        <div className="relative">
          <Input id={id} type={showPassword ? "text" : "password"} className={cn("pe-10", className)} ref={ref} {...props} />
          <button type="button" onClick={togglePasswordVisibility} className="absolute inset-y-0 end-0 flex h-full w-10 items-center justify-center text-gray-400 transition-colors hover:text-cyan-400 focus-visible:outline-none" aria-label={showPassword ? "Hide password" : "Show password"}>
            {showPassword ? (<EyeOff className="size-4" aria-hidden="true" />) : (<Eye className="size-4" aria-hidden="true" />)}
          </button>
        </div>
      </div>
    );
  }
);
PasswordInput.displayName = "PasswordInput";

function SignInForm({ role, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignIn = async (event) => {
    event.preventDefault();
    try {
      await supabase.auth.signInWithPassword({ email, password });
    } catch {
      // Demo fallback login
    }
    onLoginSuccess({ email: email || 'demo@hrie.earth', role, name: email ? email.split('@')[0] : (role === 'farmer' ? 'Rajesh Kumar' : 'Underwriter Admin') });
  };

  return (
    <form onSubmit={handleSignIn} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-black text-white tracking-tight">
          Sign In to {role === 'farmer' ? '🌾 Farmer Portal' : '🏢 Insurer Underwriting Suite'}
        </h1>
        <p className="text-xs text-gray-400">Enter your credentials to access GEE satellite underwriting</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-gray-300 font-semibold text-xs">Email Address</Label>
          <Input 
            id="email" 
            name="email" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={role === 'farmer' ? 'farmer@hrie.earth' : 'underwriter@hrie.earth'} 
            required 
          />
        </div>
        <PasswordInput 
          name="password" 
          label="Password" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
          placeholder="••••••••" 
        />
        <Button type="submit" variant="default" className="mt-2 text-sm font-black py-3">
          ⚡ Sign In to Dashboard
        </Button>
      </div>
    </form>
  );
}

function SignUpForm({ role, onLoginSuccess }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignUp = async (event) => {
    event.preventDefault();
    try {
      await supabase.auth.signUp({ email, password, options: { data: { full_name: name, role } } });
    } catch {
      // Demo fallback
    }
    onLoginSuccess({ email: email || 'farmer@hrie.earth', role, name: name || 'Rajesh Kumar' });
  };

  return (
    <form onSubmit={handleSignUp} className="flex flex-col gap-6">
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-black text-white tracking-tight">Create {role === 'farmer' ? '🌾 Farmer' : '🏢 Insurer'} Account</h1>
        <p className="text-xs text-gray-400">Register for satellite physical risk insurance</p>
      </div>
      <div className="grid gap-4">
        <div className="grid gap-1">
          <Label htmlFor="name" className="text-gray-300 font-semibold text-xs">Full Name</Label>
          <Input id="name" name="name" type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder={role === 'farmer' ? 'Rajesh Kumar' : 'Dr. Anita Sharma'} required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="email" className="text-gray-300 font-semibold text-xs">Email Address</Label>
          <Input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="m@example.com" required />
        </div>
        <PasswordInput name="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="••••••••" />
        <Button type="submit" variant="default" className="mt-2 text-sm font-black py-3">
          🚀 Register Account
        </Button>
      </div>
    </form>
  );
}

function AuthFormContainer({ role, setRole, isSignIn, onToggle, onLoginSuccess }) {
  return (
    <div className="mx-auto grid w-[360px] gap-4">
      {/* ROLE SELECTOR TOGGLE */}
      <div className="grid grid-cols-2 p-1.5 bg-black/60 rounded-2xl border border-white/10 text-xs font-bold shadow-xl">
        <button
          onClick={() => setRole('farmer')}
          className={cn(
            "py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer",
            role === 'farmer'
              ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/20 font-black"
              : "text-gray-400 hover:text-white"
          )}
        >
          <Sprout className="w-4 h-4" />
          <span>Farmer Portal</span>
        </button>
        <button
          onClick={() => setRole('insurer')}
          className={cn(
            "py-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all cursor-pointer",
            role === 'insurer'
              ? "bg-emerald-500 text-black shadow-md shadow-emerald-500/20 font-black"
              : "text-gray-400 hover:text-white"
          )}
        >
          <ShieldCheck className="w-4 h-4" />
          <span>Insurer Suite</span>
        </button>
      </div>

      {isSignIn ? <SignInForm role={role} onLoginSuccess={onLoginSuccess} /> : <SignUpForm role={role} onLoginSuccess={onLoginSuccess} />}

      <div className="text-center text-xs text-gray-400">
        {isSignIn ? "Don't have an account?" : "Already have an account?"}{" "}
        <Button variant="link" className="pl-1 text-cyan-400 font-bold" onClick={onToggle}>
          {isSignIn ? "Sign up" : "Sign in"}
        </Button>
      </div>

      <div className="relative text-center text-xs after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t after:border-white/10">
        <span className="relative z-10 bg-slate-950 px-3 text-gray-400 font-mono text-[11px]">Or demo login as</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => onLoginSuccess({ name: 'Rajesh Kumar (Farmer)', role: 'farmer', email: 'farmer@hrie.earth' })}
          className="text-xs font-bold"
        >
          👨‍🌾 Demo Farmer
        </Button>
        <Button 
          variant="outline" 
          type="button" 
          onClick={() => onLoginSuccess({ name: 'Underwriter Admin (ICICI Lombard)', role: 'insurer', email: 'underwriter@hrie.earth' })}
          className="text-xs font-bold"
        >
          🏢 Demo Insurer
        </Button>
      </div>
    </div>
  );
}

export function AuthUI({ onLoginSuccess }) {
  const [isSignIn, setIsSignIn] = useState(true);
  const [role, setRole] = useState('farmer'); // 'farmer' or 'insurer'

  const toggleForm = () => setIsSignIn((prev) => !prev);

  const quotes = [
    "Sentinel-1 SAR + Sentinel-2 GEE Physics Inversion Core",
    "Parametric Micro-Insurance Underwriting & Ghost-Acreage Protection",
    "Real-Time Soil Dielectric & Crop Biomass Telemetry",
    "Automated Disaster Indemnity & Anti-Fraud Safety-Locks"
  ];

  return (
    <div className="w-full min-h-screen md:grid md:grid-cols-2 bg-slate-950 text-slate-100 relative overflow-hidden">
      {/* LEFT COLUMN: FORM CONTAINER */}
      <div className="flex h-screen items-center justify-center p-6 md:h-auto md:p-0 md:py-12 z-20 relative bg-slate-950/90 backdrop-blur-xl border-r border-white/10">
        <AuthFormContainer 
          role={role}
          setRole={setRole}
          isSignIn={isSignIn} 
          onToggle={toggleForm} 
          onLoginSuccess={onLoginSuccess}
        />
      </div>

      {/* RIGHT COLUMN: COSMIC SPACE ANIMATED BACKGROUND (SATELLITES, EARTH, MOON, ROCKET PATH) */}
      <div className="hidden md:block relative bg-slate-950 overflow-hidden select-none">
        {/* Starfield Background Layer */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black opacity-90" />

        {/* Orbit Lines SVG */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-20">
          <ellipse cx="20%" cy="80%" rx="350" ry="200" fill="none" stroke="#06b6d4" strokeWidth="1.5" strokeDasharray="6 6" />
          <ellipse cx="80%" cy="20%" rx="400" ry="220" fill="none" stroke="#10b981" strokeWidth="1.5" strokeDasharray="4 4" />
        </svg>

        {/* EARTH (Bottom Left Cosmic Sphere) */}
        <div className="absolute -bottom-24 -left-24 w-80 h-80 rounded-full bg-gradient-to-br from-cyan-600 via-blue-700 to-indigo-950 shadow-[0_0_80px_rgba(6,182,212,0.4)] border border-cyan-400/30 flex items-center justify-center animate-pulse duration-10000">
          <div className="w-full h-full rounded-full opacity-40 bg-[radial-gradient(circle_at_30%_30%,_rgba(255,255,255,0.8),_transparent)]" />
          <Globe className="w-48 h-48 text-cyan-200/40 absolute animate-spin duration-30000" />
          <span className="absolute bottom-16 right-16 text-xs font-mono font-bold text-cyan-300 bg-black/60 px-3 py-1 rounded-full border border-cyan-500/40">
            🌍 Earth Base
          </span>
        </div>

        {/* MOON (Top Right Celestial Body) */}
        <div className="absolute top-16 right-16 w-36 h-36 rounded-full bg-gradient-to-br from-slate-200 via-slate-400 to-slate-700 shadow-[0_0_50px_rgba(255,255,255,0.25)] border border-white/40 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full bg-slate-600/40 absolute top-4 left-6 shadow-inner" />
          <div className="w-6 h-6 rounded-full bg-slate-600/30 absolute bottom-6 right-8 shadow-inner" />
          <span className="absolute -bottom-6 text-[11px] font-mono font-bold text-slate-300 bg-black/60 px-2.5 py-0.5 rounded-full border border-white/20">
            🌕 Moon Target
          </span>
        </div>

        {/* ROCKET TRAVELING FROM EARTH TO MOON */}
        <div className="absolute bottom-32 left-32 animate-[rocketTravel_12s_infinite_linear]">
          <div className="relative flex items-center gap-2 rotate-[35deg]">
            {/* Rocket Exhaust Trail */}
            <div className="w-24 h-1.5 bg-gradient-to-r from-transparent via-amber-500 to-rose-500 rounded-full blur-[1px] animate-pulse" />
            <Rocket className="w-10 h-10 text-cyan-300 drop-shadow-[0_0_15px_rgba(6,182,212,0.9)]" />
          </div>
        </div>

        {/* ORBITING SATELLITES */}
        <div className="absolute top-1/3 left-1/4 animate-bounce duration-3000">
          <div className="p-3 bg-black/60 rounded-2xl border border-cyan-500/40 backdrop-blur-md shadow-xl flex items-center gap-2">
            <Satellite className="w-6 h-6 text-cyan-400 animate-spin duration-10000" />
            <div>
              <span className="text-[10px] font-black text-white block">Sentinel-1 SAR Radar</span>
              <span className="text-[9px] font-mono text-cyan-300">Active C-Band Inversion</span>
            </div>
          </div>
        </div>

        <div className="absolute bottom-1/3 right-1/4 animate-pulse">
          <div className="p-3 bg-black/60 rounded-2xl border border-emerald-500/40 backdrop-blur-md shadow-xl flex items-center gap-2">
            <Satellite className="w-6 h-6 text-emerald-400" />
            <div>
              <span className="text-[10px] font-black text-white block">Sentinel-2 MSI Optical</span>
              <span className="text-[9px] font-mono text-emerald-300">10m Biomass NDVI</span>
            </div>
          </div>
        </div>

        {/* BOTTOM TYPEWRITER QUOTE FOOTER */}
        <div className="absolute inset-x-0 bottom-0 h-[140px] bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent p-8 flex flex-col justify-end">
          <blockquote className="space-y-2 text-center text-slate-200 z-10">
            <p className="text-base font-bold tracking-wide font-mono text-cyan-300">
              “<Typewriter text={quotes} speed={50} delay={2000} loop={true} />”
            </p>
            <cite className="block text-xs font-semibold text-gray-400 not-italic">
              — Hydro-Resilient Index Engine (HRIE v2.9.0)
            </cite>
          </blockquote>
        </div>

        {/* Custom CSS Keyframe Animation for Rocket Path */}
        <style>{`
          @keyframes rocketTravel {
            0% {
              transform: translate(0px, 0px) scale(0.7);
              opacity: 0.2;
            }
            20% {
              opacity: 1;
            }
            80% {
              opacity: 1;
            }
            100% {
              transform: translate(480px, -360px) scale(1.1);
              opacity: 0;
            }
          }
        `}</style>
      </div>
    </div>
  );
}
