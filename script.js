/* ============================================================
   ENGINEERING BLUEPRINT INTERACTION SYSTEM
   Vibhor Kiran Sardar — Systems & AI/ML Architecture
   ============================================================ */
(() => {
  "use strict";

  /* ───────────────────────────────────────────────
     1. Theme Switcher (Architectural Paper / Blueprint Mode)
     ─────────────────────────────────────────────── */
  const themeToggleBtn = document.getElementById("themeToggleBtn");
  const themeToggleLabel = document.getElementById("themeToggleLabel");

  const applyTheme = (theme) => {
    document.body.setAttribute("data-theme", theme);
    if (themeToggleLabel) {
      themeToggleLabel.textContent = theme === "blueprint" ? "[ MODE: BLUEPRINT ]" : "[ MODE: PAPER ]";
    }
    try {
      localStorage.setItem("vibhor_spec_theme", theme);
    } catch {
      // localStorage may be disabled in restricted environments
    }
  };

  // Initialize theme from storage or default to paper
  let currentTheme = "paper";
  try {
    const saved = localStorage.getItem("vibhor_spec_theme");
    if (saved === "blueprint" || saved === "paper") {
      currentTheme = saved;
    }
  } catch {
    currentTheme = "paper";
  }
  applyTheme(currentTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener("click", () => {
      currentTheme = currentTheme === "paper" ? "blueprint" : "paper";
      applyTheme(currentTheme);
    });
  }

  /* ───────────────────────────────────────────────
     2. Hero Cycling Role Readout
     ─────────────────────────────────────────────── */
  const roleRotatorText = document.getElementById("roleRotatorText");
  const roles = [
    "AI & ML ENGINEER",
    "FULL-STACK DEVELOPER",
    "C++ SYSTEMS SOLVER"
  ];
  let roleIdx = 0;

  if (roleRotatorText) {
    setInterval(() => {
      roleIdx = (roleIdx + 1) % roles.length;
      roleRotatorText.style.opacity = "0";
      setTimeout(() => {
        roleRotatorText.textContent = roles[roleIdx];
        roleRotatorText.style.opacity = "1";
      }, 180);
    }, 2500);
  }

  /* ───────────────────────────────────────────────
     3. Interactive Card Arc Carousel (02 // Systems)
     ─────────────────────────────────────────────── */
  const arcCards = document.querySelectorAll(".arc-card");
  const arcPrevBtn = document.getElementById("arcPrevBtn");
  const arcNextBtn = document.getElementById("arcNextBtn");
  const arcCurrIdx = document.getElementById("arcCurrIdx");
  const arcCarouselWrapper = document.getElementById("arcCarouselWrapper");

  let activeCardIndex = 0;
  const totalCards = arcCards.length;
  const AUTO_ROTATE_DELAY = 3000;
  let autoRotateTimer = null;
  let isHovered = false;
  let isDragging = false;

  const updateArcPositions = (activeIndex) => {
    if (!arcCards.length) return;
    const isMobile = window.innerWidth <= 768;
    const xStep1 = isMobile ? 145 : 240;
    const xStep2 = isMobile ? 260 : 440;

    arcCards.forEach((card, index) => {
      // Calculate wrapped shortest distance in range [-2, 2]
      let diff = index - activeIndex;
      while (diff > 2) diff -= totalCards;
      while (diff < -2) diff += totalCards;

      let x = 0;
      let y = 0;
      let rot = 0;
      let scale = 1;
      let opacity = 1;
      let zIndex = 1;
      let isCenter = false;

      if (diff === 0) {
        x = 0;
        y = isMobile ? -10 : -16;
        rot = 0;
        scale = 1;
        opacity = 1;
        zIndex = 10;
        isCenter = true;
      } else if (diff === -1) {
        x = -xStep1;
        y = isMobile ? 18 : 24;
        rot = isMobile ? -8 : -12;
        scale = isMobile ? 0.90 : 0.92;
        opacity = 0.75;
        zIndex = 5;
      } else if (diff === 1) {
        x = xStep1;
        y = isMobile ? 18 : 24;
        rot = isMobile ? 8 : 12;
        scale = isMobile ? 0.90 : 0.92;
        opacity = 0.75;
        zIndex = 5;
      } else if (diff === -2) {
        x = -xStep2;
        y = isMobile ? 45 : 72;
        rot = isMobile ? -16 : -24;
        scale = isMobile ? 0.78 : 0.84;
        opacity = isMobile ? 0.25 : 0.45;
        zIndex = 2;
      } else if (diff === 2) {
        x = xStep2;
        y = isMobile ? 45 : 72;
        rot = isMobile ? 16 : 24;
        scale = isMobile ? 0.78 : 0.84;
        opacity = isMobile ? 0.25 : 0.45;
        zIndex = 2;
      } else {
        x = diff < 0 ? -xStep2 * 1.3 : xStep2 * 1.3;
        y = 120;
        rot = diff < 0 ? -32 : 32;
        scale = 0.7;
        opacity = 0;
        zIndex = 0;
      }

      card.style.transform = `translateX(${x}px) translateY(${y}px) rotate(${rot}deg) scale(${scale})`;
      card.style.opacity = opacity;
      card.style.zIndex = zIndex;
      card.classList.toggle("arc-card--active", isCenter);

      // Reset and trigger progress bar on the active center card
      const pBar = card.querySelector(".arc-card-progress");
      if (pBar) {
        pBar.style.animation = "none";
        if (isCenter) {
          // Force layout reflow so animation restarts cleanly from 0%
          void pBar.offsetWidth;
          pBar.style.animation = `card-progress-fill ${AUTO_ROTATE_DELAY}ms linear infinite`;
        }
      }
    });

    if (arcCurrIdx) {
      arcCurrIdx.textContent = String(activeIndex + 1).padStart(2, "0");
    }
  };

  /* Auto-Rotation Engine */
  const nextCard = () => {
    activeCardIndex = (activeCardIndex + 1) % totalCards;
    updateArcPositions(activeCardIndex);
  };

  const prevCard = () => {
    activeCardIndex = (activeCardIndex - 1 + totalCards) % totalCards;
    updateArcPositions(activeCardIndex);
  };

  const startAutoRotate = () => {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
    if (!isHovered && !isDragging && !document.hidden) {
      if (arcCarouselWrapper) arcCarouselWrapper.classList.remove("is-paused");
      autoRotateTimer = setInterval(nextCard, AUTO_ROTATE_DELAY);
    }
  };

  const pauseAutoRotate = () => {
    if (autoRotateTimer) {
      clearInterval(autoRotateTimer);
      autoRotateTimer = null;
    }
    if (arcCarouselWrapper) arcCarouselWrapper.classList.add("is-paused");
  };

  const resetAutoRotate = () => {
    pauseAutoRotate();
    startAutoRotate();
  };

  // Pause rotation when tab is hidden, resume when tab is active
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      pauseAutoRotate();
    } else {
      startAutoRotate();
    }
  });

  // Initialize Card Arc Positions & Start Timer
  updateArcPositions(activeCardIndex);
  startAutoRotate();

  // Hover detection to pause/resume
  if (arcCarouselWrapper) {
    arcCarouselWrapper.addEventListener("mouseenter", () => {
      isHovered = true;
      pauseAutoRotate();
    });

    arcCarouselWrapper.addEventListener("mouseleave", () => {
      isHovered = false;
      if (!isDragging) {
        startAutoRotate();
      }
    });
  }

  // Click on a side card to focus it and reset timer
  arcCards.forEach((card, index) => {
    card.addEventListener("click", (e) => {
      if (index !== activeCardIndex) {
        e.preventDefault();
        activeCardIndex = index;
        updateArcPositions(activeCardIndex);
        resetAutoRotate();
      }
    });
  });

  // Prev & Next Buttons
  if (arcPrevBtn) {
    arcPrevBtn.addEventListener("click", () => {
      prevCard();
      resetAutoRotate();
    });
  }

  if (arcNextBtn) {
    arcNextBtn.addEventListener("click", () => {
      nextCard();
      resetAutoRotate();
    });
  }

  // Keyboard Left / Right navigation
  window.addEventListener("keydown", (e) => {
    if (document.activeElement && (document.activeElement.tagName === "INPUT" || document.activeElement.tagName === "TEXTAREA")) return;
    if (e.key === "ArrowLeft") {
      prevCard();
      resetAutoRotate();
    } else if (e.key === "ArrowRight") {
      nextCard();
      resetAutoRotate();
    }
  });

  // Touch Swipe & Mouse Drag
  if (arcCarouselWrapper) {
    let startX = 0;
    let startY = 0;
    let isPointerDown = false;

    arcCarouselWrapper.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a") || e.target.closest("button")) return;
      startX = e.clientX;
      startY = e.clientY;
      isPointerDown = true;
      isDragging = true;
      pauseAutoRotate();
    });

    const handlePointerEnd = (e) => {
      if (!isPointerDown) return;
      isPointerDown = false;
      isDragging = false;
      const diffX = e.clientX - startX;
      const diffY = e.clientY - startY;

      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0) {
          prevCard();
        } else {
          nextCard();
        }
      }

      if (!isHovered) {
        startAutoRotate();
      } else {
        pauseAutoRotate();
      }
    };

    arcCarouselWrapper.addEventListener("pointerup", handlePointerEnd);
    arcCarouselWrapper.addEventListener("pointercancel", () => {
      isPointerDown = false;
      isDragging = false;
      if (!isHovered) startAutoRotate();
    });
  }

  // Update on Window Resize
  window.addEventListener("resize", () => {
    updateArcPositions(activeCardIndex);
  }, { passive: true });

  /* ───────────────────────────────────────────────
     5. Interactive Mini-Terminal (CLI Spec)
     ─────────────────────────────────────────────── */
  const termOutput = document.getElementById("termOutput");
  const termForm = document.getElementById("termForm");
  const termInput = document.getElementById("termInput");
  const termChips = document.querySelectorAll(".term-chip");

  const commands = {
    whoami: `
      <div class="term-response">
        <p><strong class="term-accent">VIBHOR KIRAN SARDAR</strong> // CANDIDATE_SPEC</p>
        <p>• INSTITUTION: VIT Bhopal University (B.Tech CSE with AI/ML Specialization, 3rd Year)</p>
        <p>• SPECIALIZATION: Autonomous Agentic AI, Audio RAG Pipelines, High-Performance C++ Systems</p>
        <p>• STATUS: <span class="term-accent">[ AVAILABLE FOR SDE &amp; AI INTERNSHIPS / FULL-TIME ROLES ]</span></p>
      </div>
    `,
    skills: `
      <div class="term-response">
        <p><strong class="term-accent">[LANGUAGES]</strong> Python, C++, TypeScript, JavaScript, SQL, Bash</p>
        <p><strong class="term-accent">[AI / ML]</strong> RAG Pipelines, Agentic AI, PyTorch, Scikit-learn, Computer Vision, Whisper STT</p>
        <p><strong class="term-accent">[FULL-STACK]</strong> FastAPI, React, Next.js, Node.js, WebSockets, REST APIs, Tailwind</p>
        <p><strong class="term-accent">[CORE CS]</strong> Data Structures &amp; Algorithms, OS Internals, DBMS, Computer Networks, Docker, Git</p>
      </div>
    `,
    projects: `
      <div class="term-response">
        <p><strong class="term-accent">SYS_01 Second Mind:</strong> Autonomous Voice RAG &amp; Agentic Workspace (FastAPI, Whisper)</p>
        <p><strong class="term-accent">SYS_02 ChestScan AI:</strong> Thoracic Pathology Detection Web App (PyTorch, React) → <a href="https://chestscan-ai.vercel.app" target="_blank" rel="noopener noreferrer" class="inline-link">chestscan-ai.vercel.app</a></p>
        <p><strong class="term-accent">SYS_03 Stock Market Engine:</strong> Quantitative Equity Prediction &amp; Wealth Pipeline (NSE/BSE)</p>
        <p><strong class="term-accent">SYS_04 DSA &amp; Core CS:</strong> 35+ Day Continuous #DrGViswanathanChallenge LeetCode Milestone in C++</p>
      </div>
    `,
    contact: `
      <div class="term-response">
        <p>EMAIL:    <a href="mailto:vibhorsardar2@gmail.com" class="inline-link">vibhorsardar2@gmail.com</a></p>
        <p>LINKEDIN: <a href="https://linkedin.com/in/vibhorsardar" target="_blank" rel="noopener noreferrer" class="inline-link">linkedin.com/in/vibhorsardar</a></p>
        <p>GITHUB:   <a href="https://github.com/vibhorsardar" target="_blank" rel="noopener noreferrer" class="inline-link">github.com/vibhorsardar</a></p>
        <p>LOCATION: Bhopal, Madhya Pradesh, India</p>
      </div>
    `,
    help: `
      <div class="term-response">
        <p>SUPPORTED SPECIFICATION INSTRUCTIONS:</p>
        <p><strong class="term-accent">whoami</strong>   - Print engineer profile, education &amp; status</p>
        <p><strong class="term-accent">skills</strong>   - Output production tech stack &amp; core competencies</p>
        <p><strong class="term-accent">projects</strong> - List production systems &amp; live deployment endpoints</p>
        <p><strong class="term-accent">contact</strong>  - Dispatch coordinates &amp; networking channels</p>
        <p><strong class="term-accent">clear</strong>    - Clear active terminal buffer</p>
        <p><strong class="term-accent">help</strong>     - Print instruction manual</p>
      </div>
    `
  };

  const runTerminalCommand = (raw) => {
    if (!termOutput) return;
    const cmd = raw.trim().toLowerCase();
    if (!cmd) return;

    if (cmd === "clear") {
      termOutput.innerHTML = `
        <div class="term-welcome-msg">
          BUFFER CLEARED. Type a command or execute via quick-action chips.
        </div>
      `;
      if (termInput) termInput.value = "";
      return;
    }

    const logEntry = document.createElement("div");
    logEntry.className = "term-log-entry";
    logEntry.innerHTML = `
      <div class="term-cmd-line">
        <span>vibhor@sys-spec:~$</span>
        <span>${raw}</span>
      </div>
      <div class="term-cmd-out">
        ${commands[cmd] || `<p class="term-err">zsh: command not found: <code>${raw}</code>. Type 'help' for manual.</p>`}
      </div>
    `;

    termOutput.appendChild(logEntry);
    termOutput.scrollTop = termOutput.scrollHeight;

    if (termInput) {
      termInput.value = "";
    }
  };

  if (termForm) {
    termForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (termInput) {
        runTerminalCommand(termInput.value);
      }
    });
  }

  termChips.forEach((chip) => {
    chip.addEventListener("click", () => {
      const cmd = chip.dataset.cmd;
      if (cmd) {
        runTerminalCommand(cmd);
        if (termInput) termInput.focus();
      }
    });
  });

  /* ───────────────────────────────────────────────
     6. One-Click Copy Email (Hero & Footer)
     ─────────────────────────────────────────────── */
  const copyButtons = [
    document.getElementById("heroCopyEmailBtn"),
    document.getElementById("footerCopyEmailBtn")
  ].filter(Boolean);

  copyButtons.forEach((btn) => {
    const labelSpan = btn.querySelector(".copy-label");
    const originalText = labelSpan ? labelSpan.textContent : btn.textContent;

    btn.addEventListener("click", async () => {
      const email = btn.dataset.email || "vibhorsardar2@gmail.com";
      try {
        await navigator.clipboard.writeText(email);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = email;
        ta.style.position = "fixed";
        ta.style.opacity = "0";
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
      }

      btn.classList.add("copied");
      if (labelSpan) {
        labelSpan.textContent = "[ COPIED ✓ ]";
      }

      setTimeout(() => {
        btn.classList.remove("copied");
        if (labelSpan) {
          labelSpan.textContent = originalText;
        }
      }, 2200);
    });
  });

  /* ───────────────────────────────────────────────
     7. Sticky Spec Bar Active Link Highlighting
     ─────────────────────────────────────────────── */
  const navLinks = document.querySelectorAll(".spec-nav-link");
  const sections = [
    { id: "hero", el: document.getElementById("hero") },
    { id: "systems", el: document.getElementById("systems") },
    { id: "cli", el: document.getElementById("cli") },
    { id: "timeline", el: document.getElementById("timeline") },
    { id: "contact", el: document.getElementById("contact") },
  ];

  const updateActiveNav = () => {
    const scrollMid = window.scrollY + window.innerHeight * 0.3;
    let currentId = "hero";

    for (let i = sections.length - 1; i >= 0; i--) {
      const { id, el } = sections[i];
      if (el && scrollMid >= el.offsetTop) {
        currentId = id;
        break;
      }
    }

    navLinks.forEach((link) => {
      link.classList.toggle("active", link.dataset.section === currentId);
    });
  };

  window.addEventListener("scroll", updateActiveNav, { passive: true });
  updateActiveNav();

})();
