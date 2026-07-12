import { type CSSProperties, useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  capabilities,
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
import VariableProximity from "./components/VariableProximity";
import BorderGlow from "./components/BorderGlow";

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
      gsap.set(".hero-title-line", {
        yPercent: 116,
        scaleY: 0.64,
        skewY: 4,
        transformOrigin: "0% 100%",
      });
      gsap.set(".hero-kicker, .hero-copy, .hero-tags span, .hero-actions a", { autoAlpha: 0, y: 34 });
      gsap.set(".hero-console", {
        autoAlpha: 0,
        y: 60,
        scale: 0.94,
        rotationY: -8,
        clipPath: "inset(0 0 100% 0)",
        transformOrigin: "50% 100%",
      });
      gsap.set(".hero-background img", { autoAlpha: 0.18, x: 110, scale: 1.16, transformOrigin: "80% 50%" });
      gsap.set(".hero-dot-grid", { autoAlpha: 0, scale: 1.05 });
      gsap.set(".site-nav", { autoAlpha: 0, y: -30 });

      const opening = gsap.timeline({ defaults: { ease: "power4.out" } });

      opening
        .fromTo(
          ".opening-curtain__line",
          { scaleX: 0, transformOrigin: "0% 50%" },
          { scaleX: 1, duration: 0.72, ease: "expo.inOut", stagger: 0.08 },
          0.05,
        )
        .to(".opening-curtain__line", { xPercent: 118, duration: 0.74, ease: "expo.inOut", stagger: 0.06 }, 0.62)
        .to(".opening-curtain", { clipPath: "inset(0 0 100% 0)", duration: 1.12, ease: "expo.inOut" }, 0.66)
        .to(".opening-curtain", { autoAlpha: 0, duration: 0.1 }, 1.78)
        .to(".site-nav", { autoAlpha: 1, y: 0, duration: 0.92 }, 0.95)
        .to(".hero-background img", { autoAlpha: 0.88, x: 0, scale: 1, duration: 1.75, ease: "power3.out" }, 0.82)
        .to(".hero-dot-grid", { autoAlpha: 1, scale: 1, duration: 1.35, ease: "sine.out" }, 1.0)
        .to(".hero-title-line", { yPercent: 0, scaleY: 1, skewY: 0, duration: 1.34, stagger: 0.15 }, 1.0)
        .to(".hero-kicker", { autoAlpha: 1, y: 0, duration: 0.86, ease: "power3.out" }, 1.12)
        .to(".hero-copy", { autoAlpha: 1, y: 0, duration: 0.94, ease: "power3.out" }, 1.42)
        .to(".hero-tags span", { autoAlpha: 1, y: 0, duration: 0.72, stagger: 0.07, ease: "power3.out" }, 1.62)
        .to(".hero-actions a", { autoAlpha: 1, y: 0, duration: 0.78, stagger: 0.1, ease: "power3.out" }, 1.78)
        .to(
          ".hero-console",
          { autoAlpha: 1, y: 0, scale: 1, rotationY: 0, clipPath: "inset(0 0 0% 0)", duration: 1.24 },
          1.36,
        )
        .fromTo(".avatar-placeholder img", { scale: 1.12 }, { scale: 1, duration: 1.4, ease: "power3.out" }, 1.65);

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
          ".profile-panel, .timeline-item, .stat-card, .work-card, .capability-card, .social-card",
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
            { autoAlpha: 0, xPercent: -18, scaleX: 0.72, y: 46, transformOrigin: "0% 50%" },
            { autoAlpha: 1, xPercent: 0, scaleX: 1, y: 0, duration: 1.2, ease: "power4.out" },
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
  return (
    <section className="section hero-section" id="landing">
      <div className="hero-background" aria-hidden="true">
        <picture>
          <source srcSet={assetPath("/images/hero-mobile.png")} media="(max-width: 767px)" />
          <img src={assetPath("/images/hero-desktop.png")} alt="" />
        </picture>
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
          <p className="hero-kicker">AI Creator / Builder Log</p>
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

        <BorderGlow
          className="hero-console hero-border-glow"
          aria-label="个人定位控制台"
          backgroundColor="rgba(17, 17, 26, 0.58)"
          borderRadius={8}
          glowColor="189 86 65"
          glowRadius={58}
          glowIntensity={0.82}
          coneSpread={22}
          fillOpacity={0.22}
          animated
          colors={["#8B5CF6", "#6366F1", "#22D3EE"]}
        >
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
        </BorderGlow>
      </div>
    </section>
  );
}

function Journey() {
  return (
    <section className="section journey-section reveal" id="journey">
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
      <div className="section-inner">
        <SectionHeading
          kicker="Featured Works"
          title="作品实验室"
          copy="每张卡片都是一个未来可替换的作品容器，覆盖AI项目、网页案例、自动化脚本和AI短视频。"
        />
        <div className="works-grid">
          {works.map((work, index) => (
            <WorkCard key={work.title} work={work} index={index} />
          ))}
        </div>
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
    <article className="capability-card">
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
            这里将汇总邮箱、抖音、GitHub、小红书和TikTok。真实账号准备好后，只需要替换数据文件。
          </p>
        </div>
        <div className="connect-grid">
          {socialLinks.map((link) => (
            <SocialCard key={link.label} link={link} />
          ))}
        </div>
      </div>
    </section>
  );
}

function SocialCard({ link }: { link: SocialLink }) {
  const Icon = link.label === "Email" ? Mail : link.label === "GitHub" ? Github : MessageCircle;

  return (
    <a className="social-card" href={link.href}>
      <Icon size={20} />
      <span>{link.label}</span>
      <strong>{link.value}</strong>
    </a>
  );
}

function VariableText({
  label,
  className,
  fromFontVariationSettings,
  toFontVariationSettings,
  radius,
  falloff,
}: {
  label: string;
  className: string;
  fromFontVariationSettings: string;
  toFontVariationSettings: string;
  radius: number;
  falloff: "linear" | "exponential" | "gaussian";
}) {
  const containerRef = useRef<HTMLElement | null>(null);

  return (
    <span className="variable-text-shell" ref={containerRef}>
      <VariableProximity
        label={label}
        className={className}
        fromFontVariationSettings={fromFontVariationSettings}
        toFontVariationSettings={toFontVariationSettings}
        containerRef={containerRef}
        radius={radius}
        falloff={falloff}
      />
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
