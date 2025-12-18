"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChevronRight, Mail, MapPin, GraduationCap, Briefcase, Code2, Star, Volume2, VolumeX } from "lucide-react"

type Screen = "start" | "about" | "skills" | "experience" | "contact"

export default function GamePortfolio() {
  const [currentScreen, setCurrentScreen] = useState<Screen>("start")
  const [displayText, setDisplayText] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [loadingDots, setLoadingDots] = useState("")
  const [isMuted, setIsMuted] = useState(false)
  const bgMusicRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    // Create audio context for background music
    const bgMusic = new Audio()
    bgMusic.src = "/background-music.mp3"
    bgMusic.loop = true
    bgMusic.volume = 0.3
    bgMusicRef.current = bgMusic

    // Auto-play with user interaction
    const playMusic = () => {
      console.log('Attempting to play background music...')
      bgMusic.play().catch((error) => {
        console.error('Background music blocked:', error)
      })
      document.removeEventListener("click", playMusic)
    }
    document.addEventListener("click", playMusic)

    return () => {
      bgMusic.pause()
      document.removeEventListener("click", playMusic)
    }
  }, [])

  useEffect(() => {
    if (bgMusicRef.current) {
      bgMusicRef.current.muted = isMuted
    }
  }, [isMuted])

  useEffect(() => {
    if (!isLoading) return

    const interval = setInterval(() => {
      setLoadingDots((prev) => {
        if (prev === "...") return ""
        return prev + "."
      })
    }, 300)

    return () => clearInterval(interval)
  }, [isLoading])

  const playSound = (type: "click" | "navigate" | "success") => {
    if (isMuted) {
      console.log(`Sound ${type} muted`)
      return
    }

    const audio = new Audio()
    audio.volume = 0.5

    switch (type) {
      case "click":
        audio.src = "/click.mp3"
        break
      case "navigate":
        audio.src = "/navigate.mp3"
        break
      case "success":
        audio.src = "/success.mp3"
        break
    }

    console.log(`Playing sound: ${type} from ${audio.src}`)
    audio.play().catch((error) => {
      console.error(`Failed to play ${type} sound:`, error)
    })
  }

  const navigateTo = (screen: Screen) => {
    playSound("navigate")
    setIsLoading(true)
    setLoadingDots("")

    setTimeout(
      () => {
        setCurrentScreen(screen)
        setDisplayText("")
        setIsLoading(false)
        playSound("success")
      },
      1000 + Math.random() * 500,
    )
  }

  return (
    <div className="min-h-screen bg-background scanlines">
      <button
        onClick={() => {
          playSound("click")
          setIsMuted(!isMuted)
        }}
        className="fixed top-4 right-4 z-50 pixel-border bg-card p-3 hover:bg-accent/20 transition-colors retro-button"
        aria-label={isMuted ? "Unmute" : "Mute"}
      >
        {isMuted ? <VolumeX className="w-5 h-5 text-muted-foreground" /> : <Volume2 className="w-5 h-5 text-primary" />}
      </button>

      {isLoading && (
        <div className="fixed inset-0 bg-background z-50 flex items-center justify-center">
          <div className="text-center space-y-6 animate-pulse">
            <div className="inline-block">
              <div className="w-16 h-16 pixel-border bg-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary loading-bar"></div>
              </div>
            </div>

            <div className="space-y-2">
              <div className="text-xl md:text-2xl font-bold text-primary pixel-text">LOADING{loadingDots}</div>
              <div className="text-xs text-muted-foreground">PLEASE WAIT</div>
            </div>

            <div className="w-64 h-4 pixel-border bg-card mx-auto overflow-hidden">
              <div className="h-full bg-accent loading-progress"></div>
            </div>
          </div>
        </div>
      )}

      {/* Game Container */}
      <div className="mx-auto max-w-6xl px-4 py-8">
        {currentScreen === "start" && <StartScreen onNavigate={navigateTo} playSound={playSound} />}
        {currentScreen === "about" && <AboutScreen onNavigate={navigateTo} playSound={playSound} />}
        {currentScreen === "skills" && <SkillsScreen onNavigate={navigateTo} playSound={playSound} />}
        {currentScreen === "experience" && <ExperienceScreen onNavigate={navigateTo} playSound={playSound} />}
        {currentScreen === "contact" && <ContactScreen onNavigate={navigateTo} playSound={playSound} />}
      </div>
    </div>
  )
}

// Start Screen Component
function StartScreen({
  onNavigate,
  playSound,
}: { onNavigate: (screen: Screen) => void; playSound: (type: "click" | "navigate" | "success") => void }) {
  return (
    <div className="flex min-h-[90vh] flex-col items-center justify-center gap-8 text-center">
      <div className="space-y-4">
        <div className="inline-block pixel-border bg-card p-6">
          <div className="relative">
            <div className="text-4xl md:text-6xl font-bold text-primary pixel-text">CHHON</div>
            <div className="text-4xl md:text-6xl font-bold text-secondary pixel-text mt-2">PUTHEYKA</div>
          </div>
        </div>

        <div className="text-xs md:text-sm text-muted-foreground leading-relaxed max-w-2xl px-4">
          PHP Backend Developer | Laravel | API Development | TDD
        </div>
      </div>

      <div className="space-y-3 w-full max-w-md px-4">
        <MenuButton onClick={() => onNavigate("about")} playSound={playSound}>
          <ChevronRight className="w-4 h-4" />
          <span>About Me</span>
        </MenuButton>
        <MenuButton onClick={() => onNavigate("skills")} playSound={playSound}>
          <ChevronRight className="w-4 h-4" />
          <span>Skills</span>
        </MenuButton>
        <MenuButton onClick={() => onNavigate("experience")} playSound={playSound}>
          <ChevronRight className="w-4 h-4" />
          <span>Experience</span>
        </MenuButton>
        <MenuButton onClick={() => onNavigate("contact")} playSound={playSound}>
          <ChevronRight className="w-4 h-4" />
          <span>Contact</span>
        </MenuButton>
      </div>

      <div className="text-xs text-muted-foreground blink mt-8">SELECT YOUR QUEST</div>
    </div>
  )
}

// About Screen Component
function AboutScreen({
  onNavigate,
  playSound,
}: { onNavigate: (screen: Screen) => void; playSound: (type: "click" | "navigate" | "success") => void }) {
  return (
    <div className="space-y-8 py-8">
      <ScreenHeader title="CHARACTER INFO" onBack={() => onNavigate("start")} playSound={playSound} />

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="pixel-border bg-card p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-16 h-16 bg-primary rounded pixel-border flex items-center justify-center">
            <img
              src="profile-pixcel.png"
              alt="Avatar"
              className="w-full h-full object-cover rounded"
            />
          </div>
            <div>
              <h2 className="text-lg font-bold text-primary">Chhon Putheyka</h2>
              <p className="text-xs text-muted-foreground">Backend Engineer</p>
            </div>
          </div>

          <div className="space-y-3 text-xs leading-relaxed">
            <p className="text-foreground">
              Passionate about backend development and web technologies. I specialize in building scalable, secure, and
              efficient server-side applications.
            </p>
          </div>
        </Card>

        <Card className="pixel-border bg-card p-6 space-y-4">
          <h3 className="text-sm font-bold text-primary border-b-2 border-border pb-2">STATS</h3>

          <div className="space-y-3">
            <StatItem icon={<MapPin className="w-4 h-4" />} label="Location" value="Phnom Penh, Cambodia" />
            <StatItem
              icon={<GraduationCap className="w-4 h-4" />}
              label="Education"
              value="Bachelor of IT Engineering"
              subValue="Royal University of Phnom Penh (2020-2024)"
            />
            <StatItem icon={<Briefcase className="w-4 h-4" />} label="Role" value="Backend Engineer & Innovator" />
          </div>
        </Card>
      </div>

      <Card className="pixel-border bg-accent/20 p-6">
        <div className="flex items-start gap-3">
          <Star className="w-6 h-6 text-accent flex-shrink-0 mt-1" />
          <div className="space-y-2">
            <h3 className="text-sm font-bold text-accent-foreground">MISSION</h3>
            <p className="text-xs leading-relaxed text-foreground">
              Transforming ideas into robust, efficient solutions. Building the invisible infrastructure that powers
              amazing user experiences.
            </p>
          </div>
        </div>
      </Card>

      <NavigationButtons onNavigate={onNavigate} current="about" playSound={playSound} />
    </div>
  )
}

// Skills Screen Component
function SkillsScreen({
  onNavigate,
  playSound,
}: { onNavigate: (screen: Screen) => void; playSound: (type: "click" | "navigate" | "success") => void }) {
  const skills = [
    { name: "PHP", level: "Advanced", icon: "🐘" },
    { name: "Laravel", level: "Advanced", icon: "🔺" },
    { name: "API Development", level: "Advanced", icon: "🔌" },
    { name: "Database Design", level: "Advanced", icon: "🗄️" },
    { name: "PostgreSQL", level: "Intermediate", icon: "🐘" },
    { name: "MySQL", level: "Advanced", icon: "🐬" },
    { name: "TDD / Unit Testing", level: "Intermediate", icon: "✅" },
    { name: "Git", level: "Advanced", icon: "🔀" },
    { name: "DBMS", level: "Advanced", icon: "💾" },
    { name: "Backend Architecture", level: "Intermediate", icon: "🏗️" },
  ]

  const secondarySkills = [
    { name: "Vue.js", icon: "💚" },
    { name: "React.js", icon: "⚛️" },
  ]

  return (
    <div className="space-y-8 py-8">
      <ScreenHeader title="SKILL INVENTORY" onBack={() => onNavigate("start")} playSound={playSound} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, index) => (
          <Card key={index} className="pixel-border bg-card p-4 hover:bg-accent/10 transition-colors retro-button">
            <div className="flex items-center gap-3">
              <div className="text-2xl">{skill.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xs font-bold text-primary truncate">{skill.name}</h3>
                <Badge variant="secondary" className="text-[10px] mt-1 pixel-border">
                  {skill.level}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Card className="pixel-border bg-secondary/20 p-6">
        <h3 className="text-sm font-bold text-secondary mb-4">SECONDARY SKILLS</h3>
        <div className="flex flex-wrap gap-2">
          {secondarySkills.map((skill, index) => (
            <Badge key={index} variant="outline" className="pixel-border text-xs">
              {skill.icon} {skill.name}
            </Badge>
          ))}
        </div>
      </Card>

      <Card className="pixel-border bg-card p-6">
        <h3 className="text-sm font-bold text-primary mb-4 border-b-2 border-border pb-2">POWER-UPS</h3>
        <div className="grid gap-3 sm:grid-cols-2">
          <PowerUp icon="🌐" title="RESTful APIs" />
          <PowerUp icon="🔒" title="Backend Security" />
          <PowerUp icon="✨" title="Clean Code" />
          <PowerUp icon="🧩" title="Problem Solving" />
        </div>
      </Card>

      <NavigationButtons onNavigate={onNavigate} current="skills" playSound={playSound} />
    </div>
  )
}

// Experience Screen Component
function ExperienceScreen({
  onNavigate,
  playSound,
}: { onNavigate: (screen: Screen) => void; playSound: (type: "click" | "navigate" | "success") => void }) {
  const experiences = [
    {
      level: "LEVEL 3",
      title: "Junior PHP Backend Developer",
      company: "DRSB EXPRESS CO., LTD",
      duration: "Jan 2025 – Present",
      status: "CURRENT QUEST",
      responsibilities: [
        "Backend development with Laravel",
        "API design and integration",
        "Database design and optimization",
        "Unit testing and TDD",
        "Team collaboration",
      ],
    },
    {
      level: "LEVEL 2",
      title: "Junior PHP Backend Developer (Internship)",
      company: "KiloIT | Laravel",
      duration: "Jul 2024 – Jan 2025",
      status: "COMPLETED",
      responsibilities: [
        "Server-side development using Laravel",
        "Database management (MySQL)",
        "Writing clean, maintainable code",
      ],
    },
    {
      level: "LEVEL 1",
      title: "Web Developer",
      company: "Center of Science and Technology Advanced Development (CSTAD)",
      duration: "2023 – 2024",
      status: "COMPLETED",
      responsibilities: ["Web development", "React.js basics", "Frontend fundamentals"],
    },
  ]

  return (
    <div className="space-y-8 py-8">
      <ScreenHeader title="EXPERIENCE LEVELS" onBack={() => onNavigate("start")} playSound={playSound} />

      <div className="space-y-6">
        {experiences.map((exp, index) => (
          <Card key={index} className="pixel-border bg-card p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Badge className="pixel-border bg-accent text-accent-foreground text-[10px]">{exp.level}</Badge>
                  <Badge
                    variant={exp.status === "CURRENT QUEST" ? "default" : "secondary"}
                    className="pixel-border text-[10px]"
                  >
                    {exp.status}
                  </Badge>
                </div>
                <h3 className="text-sm font-bold text-primary">{exp.title}</h3>
                <p className="text-xs text-secondary">{exp.company}</p>
              </div>
              <div className="text-xs text-muted-foreground">{exp.duration}</div>
            </div>

            <div className="space-y-2">
              <h4 className="text-xs font-bold text-foreground">ACHIEVEMENTS:</h4>
              <ul className="space-y-1">
                {exp.responsibilities.map((resp, idx) => (
                  <li key={idx} className="text-xs text-foreground flex items-start gap-2">
                    <span className="text-accent">▸</span>
                    <span className="leading-relaxed">{resp}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        ))}
      </div>

      <NavigationButtons onNavigate={onNavigate} current="experience" playSound={playSound} />
    </div>
  )
}

// Contact Screen Component
function ContactScreen({
  onNavigate,
  playSound,
}: { onNavigate: (screen: Screen) => void; playSound: (type: "click" | "navigate" | "success") => void }) {
  return (
    <div className="space-y-8 py-8">
      <ScreenHeader title="END GAME SCREEN" onBack={() => onNavigate("start")} playSound={playSound} />

      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-8">
        <Card className="pixel-border bg-card p-8 max-w-md w-full text-center space-y-6">
          <div className="text-4xl">🎮</div>

          <div className="space-y-3">
            <h2 className="text-lg font-bold text-primary">GAME COMPLETE!</h2>
            <p className="text-xs text-foreground leading-relaxed">
              Thank you for exploring my portfolio. Ready to collaborate on your next project?
            </p>
          </div>

          <div className="space-y-3 pt-4">
            <ContactButton
              icon={<Mail className="w-4 h-4" />}
              label="Email"
              value="chhonputheyka@gmail.com"
              href="mailto:chhonputheyka@gmail.com"
              playSound={playSound}
            />
            <ContactButton
              icon={<Code2 className="w-4 h-4" />}
              label="LinkedIn"
              value="Connect with me"
              href="https://www.linkedin.com/in/chhon-putheka/"
              playSound={playSound}
            />
            <ContactButton
              icon={<Code2 className="w-4 h-4" />}
              label="X"
              value="Connect me on X"
              href="https://x.com/ChhonPutheka"
              playSound={playSound}
            />
          </div>
        </Card>

        <Button
          onClick={() => {
            playSound("click")
            onNavigate("start")
          }}
          className="retro-button bg-primary text-primary-foreground hover:bg-primary/90 text-xs"
        >
          ← RETURN TO START
        </Button>
      </div>
    </div>
  )
}

// Helper Components
function MenuButton({
  onClick,
  children,
  playSound,
}: { onClick: () => void; children: React.ReactNode; playSound: (type: "click" | "navigate" | "success") => void }) {
  return (
    <Button
      onClick={() => {
        playSound("click")
        onClick()
      }}
      className="w-full retro-button bg-primary text-primary-foreground hover:bg-primary/90 justify-start gap-2 text-xs h-12 pixel-border"
    >
      {children}
    </Button>
  )
}

function ScreenHeader({
  title,
  onBack,
  playSound,
}: { title: string; onBack: () => void; playSound: (type: "click" | "navigate" | "success") => void }) {
  return (
    <div className="flex items-center justify-between pixel-border-thick bg-primary p-4">
      <h1 className="text-sm md:text-base font-bold text-primary-foreground">{title}</h1>
      <Button
        onClick={() => {
          playSound("click")
          onBack()
        }}
        variant="ghost"
        size="sm"
        className="text-primary-foreground hover:bg-primary-foreground/20 text-xs"
      >
        ← BACK
      </Button>
    </div>
  )
}

function StatItem({
  icon,
  label,
  value,
  subValue,
}: { icon: React.ReactNode; label: string; value: string; subValue?: string }) {
  return (
    <div className="flex items-start gap-3">
      <div className="text-secondary mt-0.5">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
        <div className="text-xs font-bold text-foreground">{value}</div>
        {subValue && <div className="text-[10px] text-muted-foreground">{subValue}</div>}
      </div>
    </div>
  )
}

function PowerUp({ icon, title }: { icon: string; title: string }) {
  return (
    <div className="pixel-border bg-accent/20 p-3 flex items-center gap-3 hover:bg-accent/30 transition-colors float">
      <span className="text-xl">{icon}</span>
      <span className="text-xs font-bold text-foreground">{title}</span>
    </div>
  )
}

function NavigationButtons({
  onNavigate,
  current,
  playSound,
}: {
  onNavigate: (screen: Screen) => void
  current: Screen
  playSound: (type: "click" | "navigate" | "success") => void
}) {
  const order: Screen[] = ["about", "skills", "experience", "contact"]
  const currentIndex = order.indexOf(current)
  const prev = currentIndex > 0 ? order[currentIndex - 1] : null
  const next = currentIndex < order.length - 1 ? order[currentIndex + 1] : null

  return (
    <div className="flex items-center justify-between gap-4 pt-6">
      {prev ? (
        <Button
          onClick={() => {
            playSound("click")
            onNavigate(prev)
          }}
          variant="outline"
          className="retro-button pixel-border text-xs"
        >
          ← PREVIOUS
        </Button>
      ) : (
        <div />
      )}
      <Button
        onClick={() => {
          playSound("click")
          onNavigate("start")
        }}
        variant="ghost"
        className="text-xs text-muted-foreground"
      >
        MAIN MENU
      </Button>
      {next ? (
        <Button
          onClick={() => {
            playSound("click")
            onNavigate(next)
          }}
          className="retro-button bg-secondary text-secondary-foreground hover:bg-secondary/90 text-xs"
        >
          NEXT →
        </Button>
      ) : (
        <div />
      )}
    </div>
  )
}

function ContactButton({
  icon,
  label,
  value,
  href,
  playSound,
}: {
  icon: React.ReactNode
  label: string
  value: string
  href: string
  playSound: (type: "click" | "navigate" | "success") => void
}) {
  return (
    <a
      href={href}
      onClick={() => playSound("click")}
      className="flex items-center gap-3 pixel-border bg-secondary/20 p-3 hover:bg-secondary/30 transition-colors retro-button text-left w-full"
    >
      <div className="text-secondary">{icon}</div>
      <div className="flex-1 min-w-0">
        <div className="text-[10px] text-muted-foreground uppercase">{label}</div>
        <div className="text-xs font-bold text-foreground truncate">{value}</div>
      </div>
    </a>
  )
}
