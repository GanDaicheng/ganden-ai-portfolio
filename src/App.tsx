import { lazy, Suspense, type CSSProperties, useEffect, useRef, useState } from "react";
import {
  ArrowDownRight,
  Bot,
  Clapperboard,
  Code2,
  FolderOpen,
  Github,
  Mail,
  MessageCircle,
  Orbit,
  Play,
  Radio,
  Sparkles,
  TerminalSquare,
  WandSparkles,
  Youtube,
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  capabilities,
  heroShowcasePanels,
  journey,
  profile,
  socialLinks,
  stats,
  works,
  type Capability,
  type SocialLink,
  type Stat,
  type Work,
} from "./data/portfolio";
import DotGrid from "./components/DotGrid";
import BorderGlow from "./components/BorderGlow";
import LightRays from "./components/LightRays";
import LogoLoop from "./components/LogoLoop";
import TargetCursor from "./components/TargetCursor";
import CircularGallery from "./components/CircularGallery";

const LaserFlow = lazy(() => import("./components/LaserFlow"));
const LineWaves = lazy(() => import("./components/LineWaves"));

gsap.registerPlugin(ScrollTrigger);

const navItems = [
  { label: "起点", href: "#landing" },
  { label: "轨迹", href: "#journey" },
  { label: "作品", href: "#works" },
  { label: "能力", href: "#capabilities" },
  { label: "连接", href: "#connect" },
];

const workIcons = [Bot, Code2, TerminalSquare, Clapperboard];
const capabilityIcons = [Code2, Orbit, Bot, WandSparkles, Play];
const heroShowcaseIcons = [Bot, Code2, WandSparkles];
const assetPath = (path: string) => `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;

function App() {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !rootRef.current) {
      return;
    }

    const context = gsap.context(() => {
      gsap.set(".opening-curtain", { autoAlpha: 1 });
      gsap.set(".opening-curtain__grid", { autoAlpha: 0, scale: 1.08 });
      gsap.set(".opening-curtain__beam", {
        autoAlpha: 0,
        xPercent: -50,
        scaleY: 0.42,
        transformOrigin: "50% 0%",
      });
      gsap.set(".opening-curtain__mark", { autoAlpha: 0, scale: 0.7 });
      gsap.set(".opening-curtain__line", {
        autoAlpha: 0,
        xPercent: -50,
        scaleX: 0,
        transformOrigin: "50% 50%",
      });
      gsap.set(".hero-title-line", {
        yPercent: 122,
        scaleY: 0.72,
        skewY: 2,
        transformOrigin: "0% 100%",
      });
      gsap.set(".hero-kicker, .hero-copy, .hero-tags span, .hero-actions a", { autoAlpha: 0, y: 28 });
      gsap.set(".hero-stage-card-main", {
        autoAlpha: 0,
        y: 72,
        scale: 0.92,
        clipPath: "inset(0 0 100% 0)",
        transformOrigin: "50% 100%",
      });
      gsap.set(".hero-stage-card-side", { autoAlpha: 0, y: 54, scale: 0.88, rotate: 0 });
      gsap.set(".hero-stage-connector", { autoAlpha: 0, scaleX: 0, transformOrigin: "50% 50%" });
      gsap.set(".hero-background img", { autoAlpha: 0.18, x: 110, scale: 1.16, transformOrigin: "80% 50%" });
      gsap.set(".hero-dot-grid", { autoAlpha: 0, scale: 1.05 });
      gsap.set(".hero-blueprint", { autoAlpha: 0, scale: 1.04 });
      gsap.set(".hero-spotlight", { autoAlpha: 0, xPercent: -50, scaleY: 0.72, transformOrigin: "50% 0%" });
      gsap.set(".hero-light-rays", { autoAlpha: 0, scale: 1.04 });
      gsap.set(".hero-crosshair", { autoAlpha: 0, scale: 0.6 });
      gsap.set(".site-nav", { autoAlpha: 0, y: -30 });

      const opening = gsap.timeline({ defaults: { ease: "expo.out" } });

      opening
        .to(".opening-curtain__grid", { autoAlpha: 1, scale: 1, duration: 0.9, ease: "sine.out" }, 0)
        .to(".opening-curtain__beam", { autoAlpha: 1, scaleY: 1, duration: 1.05, ease: "power3.out" }, 0.12)
        .to(".opening-curtain__mark", { autoAlpha: 1, scale: 1, duration: 0.74, stagger: 0.08, ease: "power3.out" }, 0.2)
        .to(".opening-curtain__line", { autoAlpha: 1, scaleX: 1, duration: 0.9, stagger: 0.1, ease: "expo.inOut" }, 0.28)
        .to(".opening-curtain__line", { autoAlpha: 0.18, scaleX: 0.28, duration: 0.78, stagger: 0.08, ease: "expo.inOut" }, 1.02)
        .to(".opening-curtain__beam", { autoAlpha: 0.42, scaleY: 1.22, duration: 0.86, ease: "sine.out" }, 1.12)
        .to(".opening-curtain", { autoAlpha: 0, duration: 0.92, ease: "sine.inOut" }, 1.34)
        .to(".site-nav", { autoAlpha: 1, y: 0, duration: 1.0 }, 1.04)
        .to(".hero-background img", { autoAlpha: 0.28, x: 0, scale: 1, duration: 1.8, ease: "power3.out" }, 0.86)
        .to(".hero-blueprint", { autoAlpha: 1, scale: 1, duration: 1.7, ease: "sine.out" }, 0.9)
        .to(".hero-spotlight", { autoAlpha: 0.05, scaleY: 1, duration: 1.65, ease: "power3.out" }, 1.0)
        .to(".hero-light-rays", { autoAlpha: 1, scale: 1, duration: 1.7, ease: "sine.out" }, 1.04)
        .to(".hero-dot-grid", { autoAlpha: 0.56, scale: 1, duration: 1.45, ease: "sine.out" }, 1.1)
        .to(".hero-crosshair", { autoAlpha: 1, scale: 1, duration: 0.9, stagger: 0.12, ease: "power3.out" }, 1.18)
        .to(".hero-kicker", { autoAlpha: 1, y: 0, duration: 0.82, ease: "power3.out" }, 1.3)
        .to(".hero-title-line", { yPercent: 0, scaleY: 1, skewY: 0, duration: 1.28, stagger: 0.14 }, 1.42)
        .to(".hero-copy", { autoAlpha: 1, y: 0, duration: 0.88, ease: "power3.out" }, 1.9)
        .to(".hero-tags span", { autoAlpha: 1, y: 0, duration: 0.68, stagger: 0.06, ease: "power3.out" }, 2.08)
        .to(".hero-actions a", { autoAlpha: 1, y: 0, duration: 0.74, stagger: 0.08, ease: "power3.out" }, 2.24)
        .to(
          ".hero-stage-card-main",
          { autoAlpha: 1, y: 0, scale: 1, clipPath: "inset(0 0 0% 0)", duration: 1.18 },
          2.02,
        )
        .to(".hero-stage-connector", { autoAlpha: 1, scaleX: 1, duration: 0.95, ease: "power3.out" }, 2.32)
        .to(
          ".hero-stage-card-side",
          { autoAlpha: 1, y: 0, scale: 1, rotate: (index) => (index === 0 ? -3 : 3), duration: 1.0, stagger: 0.1 },
          2.48,
        )
        .fromTo(".avatar-placeholder img", { scale: 1.1 }, { scale: 1, duration: 1.35, ease: "power3.out" }, 2.46);

      gsap.to(".signal-orbit", {
        rotate: 360,
        duration: 28,
        ease: "none",
        repeat: -1,
        transformOrigin: "50% 50%",
      });

      gsap.utils.toArray<HTMLElement>(".reveal").forEach((section) => {
        const ghost = section.querySelector(".section-ghost-title");
        const kicker = section.querySelector(".section-kicker");
        const title = section.querySelector(".section-heading h2, .connect-heading h2");
        const copy = section.querySelector(".section-heading > p:last-child, .connect-heading > p:last-child");
        const cards = section.querySelectorAll(
          ".profile-panel, .timeline-item, .stat-card, .work-card, .capability-card, .social-card, .connect-logo-loop-shell",
        );
        const images = section.querySelectorAll(".profile-avatar img, .avatar-placeholder img");

        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 78%",
            once: true,
          },
        });

        if (ghost) {
          tl.fromTo(
            ghost,
            { autoAlpha: 0, xPercent: -50, scaleX: 0.72, y: 46, transformOrigin: "50% 50%" },
            { autoAlpha: 1, xPercent: -50, scaleX: 1, y: 0, duration: 1.2, ease: "power4.out" },
            0,
          );
        }

        tl.fromTo(kicker, { autoAlpha: 0, y: 28 }, { autoAlpha: 1, y: 0, duration: 0.76, ease: "power3.out" }, 0.14)
          .fromTo(
            title,
            { autoAlpha: 0, yPercent: 72, scaleY: 0.78, transformOrigin: "0% 100%" },
            { autoAlpha: 1, yPercent: 0, scaleY: 1, duration: 0.98, ease: "power4.out" },
            0.24,
          )
          .fromTo(copy, { autoAlpha: 0, y: 24 }, { autoAlpha: 1, y: 0, duration: 0.82, ease: "power3.out" }, 0.44)
          .fromTo(
            cards,
            { autoAlpha: 0, y: 86, scale: 0.94, clipPath: "inset(18% 0 0 0)" },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: "inset(0% 0 0 0)",
              duration: 1.05,
              ease: "power4.out",
              stagger: { each: 0.09, from: "start" },
            },
            0.62,
          );

        if (images.length > 0) {
          tl.fromTo(
            images,
            { y: 28, scale: 1.14 },
            { y: 0, scale: 1, duration: 1.2, ease: "sine.out", stagger: 0.08 },
            0.7,
          );
        }
      });

      gsap.utils.toArray<HTMLElement>(".work-card, .capability-card, .stat-card").forEach((card) => {
        gsap.to(card, {
          yPercent: -3,
          ease: "none",
          scrollTrigger: {
            trigger: card,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.8,
          },
        });
      });
    }, rootRef);

    return () => context.revert();
  }, []);

  useEffect(() => {
    const scrollToHash = (hash: string, delay = 0) => {
      if (!hash || hash === "#") {
        return;
      }

      window.setTimeout(() => {
        const target = document.querySelector(hash);

        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }, delay);
    };

    const handleAnchorClick = (event: MouseEvent) => {
      const target = event.target as Element | null;
      const anchor = target?.closest<HTMLAnchorElement>('a[href^="#"]');

      if (!anchor) {
        return;
      }

      const hash = anchor.getAttribute("href");

      if (!hash || hash === "#") {
        return;
      }

      event.preventDefault();
      history.pushState(null, "", hash);
      scrollToHash(hash);
    };

    const handleHashChange = () => scrollToHash(window.location.hash);

    document.addEventListener("click", handleAnchorClick);
    window.addEventListener("hashchange", handleHashChange);
    scrollToHash(window.location.hash, 2400);

    return () => {
      document.removeEventListener("click", handleAnchorClick);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <div className="site-shell" ref={rootRef}>
      <OpeningCurtain />
      <AmbientField />
      <header className="site-nav" aria-label="主导航">
        <a className="brand-mark" href="#landing" aria-label="返回首页">
          <span className="brand-dot" />
          {profile.siteName}
        </a>
        <nav>
          {navItems.map((item) => (
            <a key={item.href} href={item.href}>
              {item.label}
            </a>
          ))}
        </nav>
        <a className="nav-contact" href="#connect">
          <Mail size={16} />
          联系
        </a>
      </header>

      <main>
        <Landing />
        <Journey />
        <FeaturedWorks />
        <CoreCapabilities />
        <Connect />
      </main>
    </div>
  );
}

function OpeningCurtain() {
  return (
    <div className="opening-curtain" aria-hidden="true">
      <span className="opening-curtain__grid" />
      <span className="opening-curtain__beam" />
      <span className="opening-curtain__mark opening-curtain__mark-a" />
      <span className="opening-curtain__mark opening-curtain__mark-b" />
      <span className="opening-curtain__line" />
      <span className="opening-curtain__line" />
      <span className="opening-curtain__line" />
    </div>
  );
}

function AmbientField() {
  return (
    <div className="ambient-field" aria-hidden="true">
      <div className="ambient-grid" />
      <div className="glow glow-cyan" />
      <div className="glow glow-indigo" />
      <div className="particle-field">
        {Array.from({ length: 32 }).map((_, index) => (
          <span key={index} style={{ "--i": index } as React.CSSProperties} />
        ))}
      </div>
    </div>
  );
}

function Landing() {
  const sidePanels = heroShowcasePanels.slice(0, 2);
  const mainPanel = heroShowcasePanels[2];

  return (
    <section className="section hero-section" id="landing">
      <div className="hero-background" aria-hidden="true">
        <picture>
          <source srcSet={assetPath("/images/hero-mobile.png")} media="(max-width: 767px)" />
          <img src={assetPath("/images/hero-desktop.png")} alt="" />
        </picture>
        <div className="hero-blueprint" />
        <div className="hero-spotlight" />
        <LightRays
          className="hero-light-rays"
          raysOrigin="top-center"
          raysColor="#22D3EE"
          raysSpeed={0.22}
          lightSpread={1.48}
          rayLength={2.15}
          pulsating
          fadeDistance={1.35}
          saturation={0.86}
          followMouse
          mouseInfluence={0.05}
          noiseAmount={0.055}
          distortion={0.08}
        />
        <div className="hero-crosshair hero-crosshair-one" />
        <div className="hero-crosshair hero-crosshair-two" />
        <DotGrid
          className="hero-dot-grid"
          dotSize={2}
          gap={30}
          baseColor="#6366F1"
          activeColor="#22D3EE"
          proximity={135}
          speedTrigger={80}
          shockRadius={260}
          shockStrength={2.4}
          resistance={700}
          returnDuration={1.25}
        />
      </div>
      <div className="section-inner hero-layout">
        <div className="hero-copy-block">
          <p className="hero-kicker">Introducing / Builder Log</p>
          <h1 className="hero-title">
            <span className="hero-title-line">
              <VariableText
                label={profile.siteName}
                className="variable-title variable-hero-title"
                fromFontVariationSettings="'wght' 720, 'opsz' 18"
                toFontVariationSettings="'wght' 1000, 'opsz' 44"
                radius={150}
                falloff="gaussian"
              />
            </span>
            <span className="hero-title-line">
              <VariableText
                label="把AI想法推进到可运行的作品现场"
                className="variable-title variable-hero-subtitle"
                fromFontVariationSettings="'wght' 500, 'opsz' 16"
                toFontVariationSettings="'wght' 860, 'opsz' 38"
                radius={136}
                falloff="gaussian"
              />
            </span>
          </h1>
          <p className="hero-copy">{profile.intro}</p>
          <div className="hero-tags" aria-label="核心标签">
            {profile.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
          <div className="hero-actions">
            <a className="primary-action" href="#works">
              查看作品实验室
              <ArrowDownRight size={18} />
            </a>
            <a className="ghost-action" href={`mailto:${profile.email}`}>
              <Mail size={18} />
              发送邮件
            </a>
          </div>
        </div>

        <div className="hero-stage" aria-label="GanDen AI 展示台">
          <div className="hero-stage-connector" aria-hidden="true" />
          {sidePanels.map((panel, index) => {
            const Icon = heroShowcaseIcons[index];

            return (
              <article className={`hero-stage-card hero-stage-card-side hero-stage-card-${index === 0 ? "left" : "right"}`} key={panel.title}>
                <div className="hero-card-topline">
                  <span>{panel.eyebrow}</span>
                  <Icon size={18} />
                </div>
                <h2>{panel.title}</h2>
                <p>{panel.description}</p>
                <div className="hero-card-signal">{panel.signal}</div>
                <div className="hero-card-tags">
                  {panel.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </article>
            );
          })}

          <article className="hero-stage-card hero-stage-card-main">
            <div className="console-header">
              <span />
              <span />
              <span />
              <strong>GanDen.signal</strong>
            </div>
            <div className="signal-stage">
              <div className="signal-orbit orbit-one" />
              <div className="signal-orbit orbit-two" />
              <AvatarPortrait className="avatar-placeholder" />
            </div>
            <div className="hero-meta">
              <p>{profile.identity}</p>
              <div>
                <Radio size={16} />
                <span>Open for AI experiments</span>
              </div>
            </div>
            <div className="hero-card-main-footer">
              <span>{mainPanel.eyebrow}</span>
              <strong>{mainPanel.title}</strong>
              <p>{mainPanel.signal}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section journey-section reveal" id="journey">
      <div className="journey-waves-layer" aria-hidden="true">
        <Suspense fallback={null}>
          <LineWaves
            speed={0.18}
            innerLineCount={24}
            outerLineCount={30}
            warpIntensity={0.42}
            rotation={-18}
            edgeFadeWidth={0.18}
            colorCycleSpeed={0.28}
            brightness={0.055}
            color1="#8B5CF6"
            color2="#6366F1"
            color3="#22D3EE"
            enableMouseInteraction
            mouseInfluence={0.55}
          />
        </Suspense>
      </div>
      <div className="section-inner">
        <SectionHeading
          kicker="My Journey"
          title="成长轨迹"
          copy="从内容表达、AIGC落地到Agent工作流，预留一条可持续更新的个人实践时间线。"
        />
        <div className="journey-layout">
          <BorderGlow
            className="profile-panel glass-panel profile-border-glow"
            backgroundColor="rgba(23, 23, 34, 0.7)"
            borderRadius={8}
            glowColor="260 84 68"
            glowRadius={34}
            glowIntensity={0.72}
            coneSpread={24}
            fillOpacity={0.2}
            animated
            colors={["#8B5CF6", "#6366F1", "#22D3EE"]}
          >
            <AvatarPortrait className="profile-avatar" compact />
            <p>{profile.identity}</p>
            <div className="social-mini-list">
              {socialLinks.slice(0, 4).map((link) => (
                <a key={link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          </BorderGlow>
          <div className="timeline">
            {journey.map((item) => (
              <article className="timeline-item" key={item.title}>
                <span>{item.period}</span>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
          <div className="stats-grid">
            {stats.map((stat, index) => (
              <StatCard key={stat.label} stat={stat} index={index} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}


function StatCard({ stat, index }: { stat: Stat; index: number }) {
  const previewStyle = { "--stat-delay": `${index * 35}ms` } as CSSProperties;

  return (
    <article className="stat-card stat-folder-card" tabIndex={0} style={previewStyle}>
      <div className="stat-folder-stack" aria-hidden="true">
        {stat.work.previews.map((preview, previewIndex) => (
          <span className={`preview-shot preview-shot-${previewIndex + 1}`} key={preview}>
            <span>{preview}</span>
          </span>
        ))}
        <span className="folder-shell">
          <FolderOpen size={18} />
        </span>
      </div>
      <div className="stat-body">
        <strong>{stat.value}</strong>
        <span>{stat.label}</span>
      </div>
      <div className="stat-work-popover">
        <small>{stat.work.type}</small>
        <h3>{stat.work.title}</h3>
        <p>{stat.work.description}</p>
        <div className="stat-work-tags">
          {stat.work.tags.map((tag) => (
            <span key={tag}>{tag}</span>
          ))}
        </div>
      </div>
    </article>
  );
}

function AvatarPortrait({ className, compact = false }: { className: string; compact?: boolean }) {
  const [imageReady, setImageReady] = useState(true);

  return (
    <div className={className} role="img" aria-label={profile.avatarAlt}>
      {imageReady ? (
        <img src={profile.avatarSrc} alt={profile.avatarAlt} onError={() => setImageReady(false)} />
      ) : (
        <>
          {compact ? <span>GD</span> : <Sparkles size={34} />}
          {!compact && <span>{profile.displayName}</span>}
        </>
      )}
    </div>
  );
}

function FeaturedWorks() {
  return (
    <section className="section works-section reveal" id="works">
      <div className="works-laser-layer" aria-hidden="true">
        <Suspense fallback={null}>
          <LaserFlow
            horizontalBeamOffset={0}
            verticalBeamOffset={-0.08}
            horizontalSizing={0.72}
            verticalSizing={1.38}
            color="#8B5CF6"
            fogIntensity={0.28}
            fogScale={0.38}
            wispDensity={0.72}
            wispSpeed={8.5}
            wispIntensity={2.4}
            flowSpeed={0.2}
            flowStrength={0.16}
            mouseTiltStrength={0.045}
            falloffStart={1.45}
            dpr={1.2}
          />
        </Suspense>
      </div>
      <div className="section-inner">
        <SectionHeading
          kicker="Featured Works"
          title="作品实验室"
          copy="每张卡片都是一个未来可替换的作品容器，覆盖AI项目、网页案例、自动化脚本和AI短视频。"
        />
        <CircularGallery className="works-gallery" bend={0} scrollEase={0.075}>
          {works.map((work, index) => (
            <WorkCard key={work.title} work={work} index={index} />
          ))}
        </CircularGallery>
      </div>
    </section>
  );
}

function WorkCard({ work, index }: { work: Work; index: number }) {
  const Icon = workIcons[index % workIcons.length];

  return (
    <article className="work-card">
      <div className="work-card-top">
        <span>{work.type}</span>
        <Icon size={22} />
      </div>
      <h3>{work.title}</h3>
      <p>{work.description}</p>
      <div className="tag-row">
        {work.tags.map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </article>
  );
}

function CoreCapabilities() {
  return (
    <section className="section capabilities-section reveal" id="capabilities">
      <TargetCursor
        targetSelector=".capability-card.cursor-target"
        activeAreaSelector="#capabilities"
        spinDuration={3.4}
        hoverDuration={0.32}
        hideDefaultCursor={false}
        parallaxOn
        cursorColor="rgba(216, 236, 248, 0.86)"
        cursorColorOnTarget="#22D3EE"
      />
      <div className="section-inner capability-layout">
        <SectionHeading
          kicker="Core Capabilities"
          title="能力矩阵"
          copy="把开发、动效、AI工作流、提示词和内容生产放在同一个执行系统里。"
        />
        <div className="capability-grid">
          {capabilities.map((capability, index) => (
            <CapabilityCard key={capability.title} capability={capability} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

function CapabilityCard({ capability, index }: { capability: Capability; index: number }) {
  const Icon = capabilityIcons[index % capabilityIcons.length];

  return (
    <article className="capability-card cursor-target">
      <div className="capability-icon">
        <Icon size={22} />
      </div>
      <h3>{capability.title}</h3>
      <p>{capability.description}</p>
      <div className="signal-list">
        {capability.signals.map((signal) => (
          <span key={signal}>{signal}</span>
        ))}
      </div>
    </article>
  );
}

function Connect() {
  const [activeContact, setActiveContact] = useState<SocialLink | null>(null);
  const [copiedContact, setCopiedContact] = useState<string | null>(null);
  const fallbackContact = socialLinks.find((link) => link.label === "邮箱") ?? socialLinks[0];

  const contactLogos = socialLinks.map((link) => ({
    node: (
      <ContactLogoPill link={link} onActivate={() => setActiveContact(link)} />
    ),
    title: link.label,
  }));

  const handleCopyContact = async (link: SocialLink) => {
    const value = getContactValue(link);
    await navigator.clipboard.writeText(value);
    setCopiedContact(link.label);
    window.setTimeout(() => setCopiedContact(null), 1400);
  };

  return (
    <section className="section connect-section reveal" id="connect">
      <div className="section-inner connect-layout">
        <div className="connect-heading">
          <span className="section-ghost-title" aria-hidden="true">
            Let&apos;s Connect
          </span>
          <p className="section-kicker">Let&apos;s Connect</p>
          <h2>
            <VariableText
              label="建立连接"
              className="variable-title variable-section-title"
              fromFontVariationSettings="'wght' 640, 'opsz' 16"
              toFontVariationSettings="'wght' 960, 'opsz' 40"
              radius={118}
              falloff="gaussian"
            />
          </h2>
          <p>
            这里将汇总 GitHub、YouTube、抖音、哔哩哔哩、邮箱和小红书。真实账号准备好后，只需要替换数据文件。
          </p>
        </div>
        <div className="connect-stack" onMouseLeave={() => setActiveContact(null)}>
          <div className="connect-logo-loop-shell">
            <LogoLoop
              logos={contactLogos}
              speed={38}
              direction="left"
              logoHeight={58}
              gap={18}
              hoverSpeed={0}
              fadeOut
              fadeOutColor="#171722"
              ariaLabel="GanDen contact channels"
            />
          </div>
          <ContactHoverCard
            link={activeContact ?? fallbackContact}
            copied={Boolean(activeContact && copiedContact === activeContact.label)}
            idle={!activeContact}
            onCopy={() => {
              if (activeContact) void handleCopyContact(activeContact);
            }}
          />
        </div>
      </div>
    </section>
  );
}

function ContactLogoPill({ link, onActivate }: { link: SocialLink; onActivate: () => void }) {
  return (
    <button
      className="connect-logo-pill"
      type="button"
      onMouseEnter={onActivate}
      onFocus={onActivate}
      aria-label={`查看 ${link.label} 联系方式`}
    >
      <SocialIcon label={link.label} size={26} />
      <span>{link.label}</span>
    </button>
  );
}

function ContactHoverCard({
  link,
  copied,
  idle,
  onCopy,
}: {
  link: SocialLink;
  copied: boolean;
  idle: boolean;
  onCopy: () => void;
}) {
  return (
    <div className={`contact-hover-card${idle ? " contact-hover-card--idle" : ""}`} onMouseEnter={() => undefined}>
      <div className="contact-hover-card__icon">
        <SocialIcon label={link.label} size={24} />
      </div>
      <div className="contact-hover-card__body">
        <span>{idle ? "选择一个联系方式" : link.label}</span>
        <strong>{idle ? "鼠标移到上方图标，即可查看链接并复制" : getContactValue(link)}</strong>
      </div>
      <button className="contact-copy-button" type="button" onClick={onCopy} disabled={idle}>
        {copied ? "已复制" : "复制"}
      </button>
    </div>
  );
}

function getContactValue(link: SocialLink) {
  if (link.href.startsWith("mailto:")) return link.href.replace("mailto:", "");
  if (link.href !== "#connect") return link.href;
  return link.value;
}

function SocialIcon({ label, size = 22 }: { label: string; size?: number }) {
  if (label === "GitHub") return <Github size={size} />;
  if (label === "YouTube") return <Youtube size={size} />;
  if (label === "邮箱") return <Mail size={size} />;
  if (label === "哔哩哔哩") return <span className="social-glyph social-glyph-bili">B</span>;
  if (label === "小红书") return <span className="social-glyph social-glyph-red">RED</span>;
  if (label === "抖音") return <span className="social-glyph social-glyph-douyin">抖</span>;
  return <MessageCircle size={size} />;
}

function VariableText({
  label,
  className,
}: {
  label: string;
  className: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  radius: number;
  falloff: "linear" | "exponential" | "gaussian";
}) {
  return (
    <span className="variable-text-shell">
      <span className={className}>{label}</span>
    </span>
  );
}

function SectionHeading({
  kicker,
  title,
  copy,
}: {
  kicker: string;
  title: string;
  copy: string;
}) {
  return (
    <div className="section-heading">
      <span className="section-ghost-title" aria-hidden="true">
        {kicker}
      </span>
      <p className="section-kicker">{kicker}</p>
      <h2>
        <VariableText
          label={title}
          className="variable-title variable-section-title"
          fromFontVariationSettings="'wght' 640, 'opsz' 16"
          toFontVariationSettings="'wght' 960, 'opsz' 40"
          radius={118}
          falloff="gaussian"
        />
      </h2>
      <p>{copy}</p>
    </div>
  );
}

export default App;
