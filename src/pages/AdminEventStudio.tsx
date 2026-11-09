import { useState } from "react";
import { motion } from "framer-motion";
import {
  Settings,
  Users,
  Snowflake,
  Puzzle,
  RotateCw,
  Link2,
  Plus,
  Trash2,
  Edit2,
  Save,
  Download,
  Upload,
  RotateCcw,
  Check,
  Sparkles,
  Info,
  HelpCircle,
  Eye,
} from "lucide-react";
import GameLayout from "@/components/GameLayout";
import {
  useEvent,
  TECH_FEST_TEMPLATES,
  type BreakIceQuestion,
  type PuzzleRoundData,
  type QuizCategory,
  type QuizQuestion,
  type MatchPair,
  type Team,
  type ThemePreset,
} from "@/contexts/EventContext";
import { ImageInput } from "@/components/ImageInput";
import { sound } from "@/lib/sound";

type AdminTab = "settings" | "teams" | "break-ice" | "puzzles" | "wheel" | "match";

export const AdminEventStudio = () => {
  const {
    eventData,
    updateSettings,
    updateEventData,
    addTeam,
    editTeam,
    removeTeam,
    loadTemplate,
    exportConfig,
    importConfig,
    resetToDefaults,
  } = useEvent();

  const [activeTab, setActiveTab] = useState<AdminTab>("settings");
  const [saveBanner, setSaveBanner] = useState(false);

  const showSaved = () => {
    sound.playCorrect();
    setSaveBanner(true);
    setTimeout(() => setSaveBanner(false), 2500);
  };

  // ----------------------------------------------------
  // Teams Local State / Editing
  // ----------------------------------------------------
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamColor, setNewTeamColor] = useState("#00f0ff");
  const [newTeamAvatar, setNewTeamAvatar] = useState("⚡");

  const handleCreateTeam = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeamName.trim()) return;
    addTeam(newTeamName.trim(), newTeamColor, newTeamAvatar);
    setNewTeamName("");
    showSaved();
  };

  // ----------------------------------------------------
  // Break The Ice Editing
  // ----------------------------------------------------
  const [editingIceQ, setEditingIceQ] = useState<BreakIceQuestion | null>(null);

  const handleSaveIceQuestion = (q: BreakIceQuestion) => {
    const list = [...eventData.breakTheIce.questions];
    const idx = list.findIndex((item) => item.id === q.id);
    if (idx >= 0) {
      list[idx] = q;
    } else {
      list.push(q);
    }
    updateEventData({
      breakTheIce: { ...eventData.breakTheIce, questions: list },
    });
    setEditingIceQ(null);
    showSaved();
  };

  const handleDeleteIceQuestion = (id: string) => {
    sound.playClick();
    const list = eventData.breakTheIce.questions.filter((q) => q.id !== id);
    updateEventData({
      breakTheIce: { ...eventData.breakTheIce, questions: list },
    });
    showSaved();
  };

  // ----------------------------------------------------
  // Puzzle Rounds Editing
  // ----------------------------------------------------
  const [editingPuzzle, setEditingPuzzle] = useState<PuzzleRoundData | null>(null);

  const handleSavePuzzle = (p: PuzzleRoundData) => {
    const list = [...eventData.puzzles];
    const idx = list.findIndex((item) => item.id === p.id);
    if (idx >= 0) {
      list[idx] = p;
    } else {
      list.push(p);
    }
    updateEventData({ puzzles: list });
    setEditingPuzzle(null);
    showSaved();
  };

  const handleDeletePuzzle = (id: string) => {
    sound.playClick();
    const list = eventData.puzzles.filter((p) => p.id !== id);
    updateEventData({ puzzles: list });
    showSaved();
  };

  // ----------------------------------------------------
  // Quiz Wheel Slices & Questions Editing
  // ----------------------------------------------------
  const [selectedCatId, setSelectedCatId] = useState<string>(
    eventData.quizWheel.categories[0]?.id || ""
  );
  const [editingQuizQ, setEditingQuizQ] = useState<{ catId: string; q: QuizQuestion } | null>(null);
  const [newCatName, setNewCatName] = useState("");
  const [newCatColor, setNewCatColor] = useState("hsl(185, 100%, 50%)");

  const currentCategory = eventData.quizWheel.categories.find((c) => c.id === selectedCatId);

  const handleAddCategory = () => {
    if (!newCatName.trim()) return;
    const newCat: QuizCategory = {
      id: `cat-${Date.now()}`,
      name: newCatName.trim(),
      color: newCatColor,
      questions: [],
    };
    updateEventData({
      quizWheel: {
        ...eventData.quizWheel,
        categories: [...eventData.quizWheel.categories, newCat],
      },
    });
    setSelectedCatId(newCat.id);
    setNewCatName("");
    showSaved();
  };

  const handleDeleteCategory = (catId: string) => {
    sound.playClick();
    const cats = eventData.quizWheel.categories.filter((c) => c.id !== catId);
    updateEventData({
      quizWheel: { ...eventData.quizWheel, categories: cats },
    });
    if (selectedCatId === catId && cats.length > 0) {
      setSelectedCatId(cats[0].id);
    }
    showSaved();
  };

  const handleSaveQuizQuestion = (catId: string, q: QuizQuestion) => {
    const cats = eventData.quizWheel.categories.map((c) => {
      if (c.id !== catId) return c;
      const qList = [...c.questions];
      const idx = qList.findIndex((item) => item.id === q.id);
      if (idx >= 0) {
        qList[idx] = q;
      } else {
        qList.push(q);
      }
      return { ...c, questions: qList };
    });
    updateEventData({ quizWheel: { ...eventData.quizWheel, categories: cats } });
    setEditingQuizQ(null);
    showSaved();
  };

  const handleDeleteQuizQuestion = (catId: string, qId: string) => {
    sound.playClick();
    const cats = eventData.quizWheel.categories.map((c) => {
      if (c.id !== catId) return c;
      return { ...c, questions: c.questions.filter((item) => item.id !== qId) };
    });
    updateEventData({ quizWheel: { ...eventData.quizWheel, categories: cats } });
    showSaved();
  };

  // ----------------------------------------------------
  // Match The Logic Pairs Editing
  // ----------------------------------------------------
  const [editingPair, setEditingPair] = useState<MatchPair | null>(null);

  const handleSavePair = (pair: MatchPair) => {
    const list = [...eventData.matchTheLogic.pairs];
    const idx = list.findIndex((item) => item.id === pair.id);
    if (idx >= 0) {
      list[idx] = pair;
    } else {
      list.push(pair);
    }
    updateEventData({
      matchTheLogic: { ...eventData.matchTheLogic, pairs: list },
    });
    setEditingPair(null);
    showSaved();
  };

  const handleDeletePair = (id: string) => {
    sound.playClick();
    const list = eventData.matchTheLogic.pairs.filter((p) => p.id !== id);
    updateEventData({
      matchTheLogic: { ...eventData.matchTheLogic, pairs: list },
    });
    showSaved();
  };

  // ----------------------------------------------------
  // Import JSON Handler
  // ----------------------------------------------------
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const success = importConfig(reader.result as string);
      if (success) {
        showSaved();
      } else {
        alert("Failed to parse event JSON configuration file.");
      }
    };
    reader.readAsText(file);
  };

  return (
    <GameLayout
      title="Event Organizer Studio"
      icon="⚙️"
      subtitle="Full Control CMS: Questions, Options, Media, Teams & Presets"
    >
      {/* Save Toast Notification */}
      {saveBanner && (
        <motion.div
          className="fixed top-20 right-6 z-50 flex items-center gap-2 rounded-xl border border-neon-lime/60 bg-neon-lime/20 px-4 py-2.5 font-display text-sm font-bold text-neon-lime backdrop-blur-md shadow-2xl"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0 }}
        >
          <Check size={18} />
          Changes Saved to Stage Memory!
        </motion.div>
      )}

      {/* Tabs Navigation */}
      <div className="mb-8 flex flex-wrap gap-2 border-b border-border/80 pb-4">
        {[
          { id: "settings" as AdminTab, label: "Event Settings & Presets", icon: Settings },
          { id: "teams" as AdminTab, label: `Teams (${eventData.teams.length})`, icon: Users },
          {
            id: "break-ice" as AdminTab,
            label: `Break the Ice (${eventData.breakTheIce.questions.length})`,
            icon: Snowflake,
          },
          { id: "puzzles" as AdminTab, label: `AI Puzzles (${eventData.puzzles.length})`, icon: Puzzle },
          {
            id: "wheel" as AdminTab,
            label: `Quiz Wheel (${eventData.quizWheel.categories.length} Categories)`,
            icon: RotateCw,
          },
          {
            id: "match" as AdminTab,
            label: `Match Logic (${eventData.matchTheLogic.pairs.length} Pairs)`,
            icon: Link2,
          },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                sound.playClick();
                setActiveTab(tab.id);
              }}
              className={`flex items-center gap-2 rounded-xl px-4 py-2.5 font-display text-xs font-bold uppercase tracking-wider transition-all sm:text-sm ${
                isActive
                  ? "border-2 border-primary bg-primary/20 text-primary shadow-[0_0_15px_hsl(185_100%_50%/0.3)]"
                  : "border border-border bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* ==================================================== */}
      {/* TAB 1: SETTINGS & PRESETS */}
      {/* ==================================================== */}
      {activeTab === "settings" && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Branding Form */}
            <div className="rounded-2xl border border-primary/30 bg-card/70 p-6 shadow-xl backdrop-blur-md">
              <h2 className="mb-4 font-display text-xl font-bold text-primary text-glow-cyan flex items-center gap-2">
                <Settings size={20} /> Event Identity & Stage Theme
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Event Main Title (Projector Header)
                  </label>
                  <input
                    type="text"
                    value={eventData.settings.name}
                    onChange={(e) => updateSettings({ name: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2.5 font-display text-lg font-bold text-foreground focus:border-primary focus:outline-none"
                    placeholder="e.g. RESPONSIBLE AI CLASH"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground">
                    Tagline / Organizers / Host College
                  </label>
                  <input
                    type="text"
                    value={eventData.settings.tagline}
                    onChange={(e) => updateSettings({ tagline: e.target.value })}
                    className="mt-1 w-full rounded-xl border border-border bg-background px-4 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    placeholder="e.g. Annual Tech Fest 2026 | Department of Computer Science"
                  />
                </div>

                {/* Theme presets */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-2">
                    Visual Color Theme
                  </label>
                  <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                    {[
                      { id: "cyber-cyan" as ThemePreset, label: "Cyber Cyan", color: "#00f0ff" },
                      { id: "matrix-emerald" as ThemePreset, label: "Matrix Emerald", color: "#00ff66" },
                      { id: "solar-amber" as ThemePreset, label: "Solar Amber", color: "#ffb700" },
                      { id: "synth-violet" as ThemePreset, label: "Synth Violet", color: "#d946ef" },
                    ].map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => updateSettings({ theme: t.id })}
                        className={`flex items-center gap-2 rounded-xl border p-2.5 text-left text-xs font-semibold transition-all ${
                          eventData.settings.theme === t.id
                            ? "border-primary bg-primary/20 text-foreground ring-2 ring-primary"
                            : "border-border bg-background/50 text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        <span
                          className="h-3.5 w-3.5 rounded-full"
                          style={{ backgroundColor: t.color }}
                        />
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Scoring & Timer Defaults */}
                <div className="grid grid-cols-3 gap-3 pt-2">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Timer (Sec)
                    </label>
                    <input
                      type="number"
                      min={10}
                      max={180}
                      value={eventData.settings.timerSeconds}
                      onChange={(e) => updateSettings({ timerSeconds: Number(e.target.value) || 30 })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Direct Pts
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={100}
                      value={eventData.settings.directPoints}
                      onChange={(e) => updateSettings({ directPoints: Number(e.target.value) || 10 })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Pass Pts
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={50}
                      value={eventData.settings.passedPoints}
                      onChange={(e) => updateSettings({ passedPoints: Number(e.target.value) || 5 })}
                      className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Presets & Backup / Restore */}
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur-md">
                <h3 className="mb-3 font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Sparkles className="text-neon-amber" size={18} /> Pre-Engineered Event Templates
                </h3>
                <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
                  Instantly rebrand and prep the entire arena questions and logic for a specific event domain:
                </p>

                <div className="space-y-2.5">
                  {Object.entries(TECH_FEST_TEMPLATES).map(([key, t]) => (
                    <div
                      key={key}
                      className="flex items-center justify-between rounded-xl border border-border/80 bg-background/50 p-3.5 transition-all hover:border-primary/40"
                    >
                      <div>
                        <div className="font-display text-sm font-bold text-foreground">
                          {t.label}
                        </div>
                        <div className="text-xs text-muted-foreground">{t.desc}</div>
                      </div>
                      <button
                        onClick={() => {
                          if (confirm(`Load template "${t.label}"? This will populate the arena with curated questions.`)) {
                            loadTemplate(key);
                            showSaved();
                          }
                        }}
                        className="rounded-lg border border-primary/40 bg-primary/10 px-3 py-1.5 font-display text-xs font-bold text-primary hover:bg-primary/25"
                      >
                        Load Preset
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* JSON Export / Import */}
              <div className="rounded-2xl border border-border bg-card/70 p-6 shadow-xl backdrop-blur-md">
                <h3 className="mb-3 font-display text-lg font-bold text-foreground flex items-center gap-2">
                  <Download size={18} className="text-neon-cyan" /> Event Backup & Migration
                </h3>
                <p className="mb-4 text-xs text-muted-foreground leading-relaxed">
                  Export your customized questions, images, rounds, and teams to a standalone JSON file, or load one from another organizer.
                </p>

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={exportConfig}
                    className="flex items-center gap-2 rounded-xl border border-primary/50 bg-primary/10 px-4 py-2.5 font-display text-xs font-bold text-primary hover:bg-primary/25"
                  >
                    <Download size={15} /> Export Event JSON
                  </button>

                  <label className="flex cursor-pointer items-center gap-2 rounded-xl border border-border bg-card px-4 py-2.5 font-display text-xs font-bold text-foreground hover:bg-muted">
                    <Upload size={15} /> Import Event JSON
                    <input
                      type="file"
                      accept=".json"
                      onChange={handleFileUpload}
                      className="hidden"
                    />
                  </label>

                  <button
                    onClick={() => {
                      if (confirm("Reset all arena games, questions and teams to default state?")) {
                        resetToDefaults();
                        showSaved();
                      }
                    }}
                    className="flex items-center gap-2 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-2.5 font-display text-xs font-bold text-destructive hover:bg-destructive/20 ml-auto"
                  >
                    <RotateCcw size={15} /> Reset Defaults
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 2: TEAMS MANAGEMENT */}
      {/* ==================================================== */}
      {activeTab === "teams" && (
        <div className="space-y-8">
          {/* Add Team Bar */}
          <form
            onSubmit={handleCreateTeam}
            className="flex flex-wrap items-end gap-3 rounded-2xl border border-primary/30 bg-card/70 p-5 shadow-xl backdrop-blur-md"
          >
            <div className="flex-1 min-w-[200px]">
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Team Name
              </label>
              <input
                type="text"
                value={newTeamName}
                onChange={(e) => setNewTeamName(e.target.value)}
                placeholder="e.g. Epsilon Knights"
                className="w-full rounded-xl border border-border bg-background px-4 py-2 font-display text-sm text-foreground focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Avatar / Icon
              </label>
              <input
                type="text"
                value={newTeamAvatar}
                onChange={(e) => setNewTeamAvatar(e.target.value)}
                className="w-20 rounded-xl border border-border bg-background px-3 py-2 text-center text-lg focus:border-primary focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-1">
                Color
              </label>
              <input
                type="color"
                value={newTeamColor}
                onChange={(e) => setNewTeamColor(e.target.value)}
                className="h-10 w-16 cursor-pointer rounded-xl border border-border bg-background p-1"
              />
            </div>

            <button
              type="submit"
              className="flex items-center gap-2 rounded-xl border border-neon-lime/50 bg-neon-lime/15 px-5 py-2.5 font-display text-sm font-bold text-neon-lime hover:bg-neon-lime/25"
            >
              <Plus size={16} /> Add Team
            </button>
          </form>

          {/* Teams Grid */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {eventData.teams.map((team, idx) => (
              <div
                key={team.id}
                className="relative rounded-2xl border border-border/80 bg-card/70 p-5 shadow-lg backdrop-blur-md"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-3xl">{team.avatar}</span>
                  <div className="flex items-center gap-1.5">
                    <span
                      className="h-4 w-4 rounded-full border border-white/40"
                      style={{ backgroundColor: team.color }}
                    />
                    {eventData.teams.length > 2 && (
                      <button
                        onClick={() => removeTeam(team.id)}
                        className="rounded-lg p-1 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                        title="Remove Team"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Team Name
                    </label>
                    <input
                      type="text"
                      value={team.name}
                      onChange={(e) => editTeam(team.id, { name: e.target.value })}
                      className="w-full rounded-lg border border-border bg-background px-3 py-1.5 font-display text-sm font-bold text-foreground"
                    />
                  </div>

                  <div className="flex gap-2">
                    <div className="flex-1">
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Emoji
                      </label>
                      <input
                        type="text"
                        value={team.avatar}
                        onChange={(e) => editTeam(team.id, { avatar: e.target.value })}
                        className="w-full rounded-lg border border-border bg-background px-2 py-1 text-center text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Color
                      </label>
                      <input
                        type="color"
                        value={team.color}
                        onChange={(e) => editTeam(team.id, { color: e.target.value })}
                        className="h-8 w-14 cursor-pointer rounded-lg border border-border bg-background p-0.5"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 3: BREAK THE ICE QUESTIONS */}
      {/* ==================================================== */}
      {activeTab === "break-ice" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-primary">
                Break the Ice Questions
              </h2>
              <p className="text-xs text-muted-foreground">
                Rapid-fire opening questions revealed when ice shields are cracked on stage.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setEditingIceQ({
                  id: `ice-${Date.now()}`,
                  question: "",
                  hint: "",
                  points: 10,
                });
              }}
              className="flex items-center gap-2 rounded-xl border border-neon-cyan/50 bg-neon-cyan/15 px-4 py-2 font-display text-xs font-bold text-neon-cyan hover:bg-neon-cyan/25"
            >
              <Plus size={16} /> New Question
            </button>
          </div>

          {/* Question List */}
          <div className="space-y-3">
            {eventData.breakTheIce.questions.map((q, idx) => (
              <div
                key={q.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/70 p-4 transition-all hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 font-display text-xs font-bold text-primary">
                    #{idx + 1}
                  </span>
                  <div>
                    <p className="font-display text-base font-semibold text-foreground">
                      {q.question || <span className="italic text-muted-foreground">Untitled question</span>}
                    </p>
                    {q.hint && (
                      <p className="text-xs text-muted-foreground mt-0.5">
                        <span className="text-primary font-medium">Hint:</span> {q.hint}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {q.imageUrl && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      Has Image
                    </span>
                  )}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setEditingIceQ(q);
                    }}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-card hover:text-foreground"
                    title="Edit Question"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeleteIceQuestion(q.id)}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                    title="Delete Question"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit / Create Ice Question Modal */}
          {editingIceQ && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md">
              <div className="w-full max-w-xl rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl">
                <h3 className="mb-4 font-display text-lg font-bold text-primary">
                  {editingIceQ.question ? "Edit Ice Question" : "New Ice Question"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Question Text
                    </label>
                    <textarea
                      rows={3}
                      value={editingIceQ.question}
                      onChange={(e) => setEditingIceQ({ ...editingIceQ, question: e.target.value })}
                      placeholder="e.g. What does 'AI hallucination' mean in Generative AI?"
                      className="mt-1 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Host Hint (optional)
                    </label>
                    <input
                      type="text"
                      value={editingIceQ.hint || ""}
                      onChange={(e) => setEditingIceQ({ ...editingIceQ, hint: e.target.value })}
                      placeholder="e.g. Think about confidently generated factual inaccuracies"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Question Image Input */}
                  <ImageInput
                    label="Attach Image to Question (optional)"
                    value={editingIceQ.imageUrl}
                    onChange={(val) => setEditingIceQ({ ...editingIceQ, imageUrl: val })}
                  />

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingIceQ(null)}
                      className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveIceQuestion(editingIceQ)}
                      className="rounded-xl bg-primary px-5 py-2 font-display text-sm font-bold text-background hover:bg-primary/90"
                    >
                      Save Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 4: AI PUZZLE ROUNDS */}
      {/* ==================================================== */}
      {activeTab === "puzzles" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-primary">
                Mystery AI Puzzle Rounds
              </h2>
              <p className="text-xs text-muted-foreground">
                3x3 grid tiles hiding a secret program, app, or concept with 9 progressive clues.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setEditingPuzzle({
                  id: `puzzle-${Date.now()}`,
                  title: "New Mystery Puzzle",
                  answer: "Secret Answer",
                  points: 15,
                  clues: Array(9).fill("Clue description..."),
                });
              }}
              className="flex items-center gap-2 rounded-xl border border-neon-magenta/50 bg-neon-magenta/15 px-4 py-2 font-display text-xs font-bold text-neon-magenta hover:bg-neon-magenta/25"
            >
              <Plus size={16} /> New Puzzle Round
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            {eventData.puzzles.map((p, idx) => (
              <div
                key={p.id}
                className="rounded-2xl border border-border/80 bg-card/70 p-5 shadow-lg backdrop-blur-md transition-all hover:border-primary/40"
              >
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <span className="font-display text-xs font-bold uppercase tracking-wider text-primary">
                      Round {idx + 1}
                    </span>
                    <h3 className="font-display text-lg font-bold text-foreground">
                      {p.title}
                    </h3>
                    <p className="font-display text-sm font-semibold text-neon-lime">
                      Answer: {p.answer}
                    </p>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => {
                        sound.playClick();
                        setEditingPuzzle(p);
                      }}
                      className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-card hover:text-foreground"
                    >
                      <Edit2 size={16} />
                    </button>
                    {eventData.puzzles.length > 1 && (
                      <button
                        onClick={() => handleDeletePuzzle(p.id)}
                        className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                      >
                        <Trash2 size={16} />
                      </button>
                    )}
                  </div>
                </div>

                <div className="mt-3 rounded-xl bg-background/50 p-3">
                  <div className="text-xs font-semibold text-muted-foreground mb-1.5">
                    Clue Preview (9 Tiles):
                  </div>
                  <div className="grid grid-cols-3 gap-1 text-[11px] text-muted-foreground">
                    {p.clues.slice(0, 3).map((c, i) => (
                      <div key={i} className="truncate rounded bg-muted/40 p-1">
                        {i + 1}. {c}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Puzzle Modal */}
          {editingPuzzle && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md overflow-y-auto">
              <div className="my-auto w-full max-w-2xl rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl">
                <h3 className="mb-4 font-display text-lg font-bold text-primary">
                  Configure Puzzle Round
                </h3>

                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground">
                        Round Title
                      </label>
                      <input
                        type="text"
                        value={editingPuzzle.title}
                        onChange={(e) => setEditingPuzzle({ ...editingPuzzle, title: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-muted-foreground">
                        Revealed Answer
                      </label>
                      <input
                        type="text"
                        value={editingPuzzle.answer}
                        onChange={(e) => setEditingPuzzle({ ...editingPuzzle, answer: e.target.value })}
                        className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground"
                      />
                    </div>
                  </div>

                  {/* Mystery Image Upload */}
                  <ImageInput
                    label="Secret Mystery Image (Revealed under tiles)"
                    value={editingPuzzle.imageUrl}
                    onChange={(val) => setEditingPuzzle({ ...editingPuzzle, imageUrl: val })}
                  />

                  {/* 9 Clues */}
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground mb-1.5">
                      9 Progressive Clues (Tiles 1 to 9)
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-3 max-h-60 overflow-y-auto pr-1">
                      {Array.from({ length: 9 }).map((_, i) => (
                        <div key={i}>
                          <span className="text-[10px] text-muted-foreground">Tile {i + 1}</span>
                          <textarea
                            rows={2}
                            value={editingPuzzle.clues[i] || ""}
                            onChange={(e) => {
                              const nextClues = [...editingPuzzle.clues];
                              nextClues[i] = e.target.value;
                              setEditingPuzzle({ ...editingPuzzle, clues: nextClues });
                            }}
                            className="w-full rounded-lg border border-border bg-background p-1.5 text-xs text-foreground focus:border-primary focus:outline-none"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingPuzzle(null)}
                      className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSavePuzzle(editingPuzzle)}
                      className="rounded-xl bg-primary px-5 py-2 font-display text-sm font-bold text-background hover:bg-primary/90"
                    >
                      Save Puzzle
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 5: QUIZ WHEEL CATEGORIES & QUESTIONS */}
      {/* ==================================================== */}
      {activeTab === "wheel" && (
        <div className="space-y-6">
          {/* Wheel Categories Management */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border/80 pb-4">
            <div>
              <h2 className="font-display text-xl font-bold text-primary">
                AI Quiz Wheel & Slices
              </h2>
              <p className="text-xs text-muted-foreground">
                Customize wheel categories, colors, and multiple choice questions.
              </p>
            </div>

            {/* Add Category Form */}
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="New Category Name..."
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs text-foreground"
              />
              <button
                onClick={handleAddCategory}
                className="flex items-center gap-1 rounded-xl border border-neon-lime/40 bg-neon-lime/15 px-3 py-1.5 font-display text-xs font-bold text-neon-lime hover:bg-neon-lime/25"
              >
                <Plus size={14} /> Add Slice
              </button>
            </div>
          </div>

          {/* Category Selector Pills */}
          <div className="flex flex-wrap gap-2">
            {eventData.quizWheel.categories.map((cat) => (
              <div
                key={cat.id}
                className={`flex items-center gap-2 rounded-xl border px-3.5 py-2 transition-all ${
                  selectedCatId === cat.id
                    ? "border-primary bg-primary/20 text-foreground"
                    : "border-border bg-card/60 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                <button
                  onClick={() => {
                    sound.playClick();
                    setSelectedCatId(cat.id);
                  }}
                  className="flex items-center gap-2 font-display text-xs font-bold uppercase tracking-wider"
                >
                  <span
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: cat.color }}
                  />
                  {cat.name} ({cat.questions.length})
                </button>
                {eventData.quizWheel.categories.length > 2 && (
                  <button
                    onClick={() => handleDeleteCategory(cat.id)}
                    className="ml-1 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={13} />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Current Category Questions */}
          {currentCategory && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-display text-sm font-semibold text-muted-foreground">
                  Questions in <span className="text-primary">{currentCategory.name}</span>:
                </span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setEditingQuizQ({
                      catId: currentCategory.id,
                      q: {
                        id: `q-${Date.now()}`,
                        question: "",
                        options: [
                          { id: "o1", text: "Option A", isCorrect: true },
                          { id: "o2", text: "Option B", isCorrect: false },
                          { id: "o3", text: "Option C", isCorrect: false },
                          { id: "o4", text: "Option D", isCorrect: false },
                        ],
                        explanation: "",
                      },
                    });
                  }}
                  className="flex items-center gap-1.5 rounded-xl border border-primary/40 bg-primary/10 px-3 py-1.5 font-display text-xs font-bold text-primary hover:bg-primary/20"
                >
                  <Plus size={14} /> Add Question
                </button>
              </div>

              <div className="space-y-3">
                {currentCategory.questions.map((q, idx) => (
                  <div
                    key={q.id}
                    className="rounded-2xl border border-border/80 bg-card/70 p-4 transition-all hover:border-primary/40"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="font-display text-sm font-bold text-foreground">
                          #{idx + 1} {q.question}
                        </div>
                        <div className="grid grid-cols-2 gap-1.5 pt-1 text-xs">
                          {q.options.map((opt, oi) => (
                            <div
                              key={opt.id || oi}
                              className={`rounded px-2 py-1 ${
                                opt.isCorrect
                                  ? "bg-neon-lime/15 font-semibold text-neon-lime border border-neon-lime/30"
                                  : "bg-muted/30 text-muted-foreground"
                              }`}
                            >
                              {["A", "B", "C", "D"][oi]}. {opt.text}
                            </div>
                          ))}
                        </div>
                        {q.explanation && (
                          <div className="text-[11px] text-muted-foreground italic pt-1">
                            💡 {q.explanation}
                          </div>
                        )}
                      </div>

                      <div className="flex gap-1.5 shrink-0">
                        <button
                          onClick={() => {
                            sound.playClick();
                            setEditingQuizQ({ catId: currentCategory.id, q });
                          }}
                          className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-card hover:text-foreground"
                        >
                          <Edit2 size={15} />
                        </button>
                        <button
                          onClick={() => handleDeleteQuizQuestion(currentCategory.id, q.id)}
                          className="rounded-lg border border-border p-1.5 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Edit Quiz Question Modal */}
          {editingQuizQ && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md overflow-y-auto">
              <div className="my-auto w-full max-w-2xl rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl">
                <h3 className="mb-4 font-display text-lg font-bold text-primary">
                  Edit Multiple Choice Question
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Question Text
                    </label>
                    <textarea
                      rows={2}
                      value={editingQuizQ.q.question}
                      onChange={(e) =>
                        setEditingQuizQ({
                          ...editingQuizQ,
                          q: { ...editingQuizQ.q, question: e.target.value },
                        })
                      }
                      className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Question Image Input */}
                  <ImageInput
                    label="Question Image (optional)"
                    value={editingQuizQ.q.questionImage}
                    onChange={(val) =>
                      setEditingQuizQ({
                        ...editingQuizQ,
                        q: { ...editingQuizQ.q, questionImage: val },
                      })
                    }
                  />

                  {/* 4 Options */}
                  <div className="space-y-2">
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Answer Choices (Select the radio of the correct answer)
                    </label>
                    {editingQuizQ.q.options.map((opt, optIdx) => (
                      <div
                        key={opt.id || optIdx}
                        className="flex items-center gap-2 rounded-xl border border-border bg-background/60 p-2"
                      >
                        <input
                          type="radio"
                          name="correctOption"
                          checked={opt.isCorrect}
                          onChange={() => {
                            const newOptions = editingQuizQ.q.options.map((o, idx) => ({
                              ...o,
                              isCorrect: idx === optIdx,
                            }));
                            setEditingQuizQ({
                              ...editingQuizQ,
                              q: { ...editingQuizQ.q, options: newOptions },
                            });
                          }}
                          className="h-4 w-4 cursor-pointer text-primary"
                        />
                        <span className="font-display text-xs font-bold text-primary">
                          {["A", "B", "C", "D"][optIdx]}:
                        </span>
                        <input
                          type="text"
                          value={opt.text}
                          onChange={(e) => {
                            const newOptions = [...editingQuizQ.q.options];
                            newOptions[optIdx] = { ...opt, text: e.target.value };
                            setEditingQuizQ({
                              ...editingQuizQ,
                              q: { ...editingQuizQ.q, options: newOptions },
                            });
                          }}
                          className="flex-1 rounded-lg border border-border bg-background px-3 py-1 text-sm text-foreground focus:border-primary focus:outline-none"
                        />
                      </div>
                    ))}
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Host Explanation / Insight
                    </label>
                    <input
                      type="text"
                      value={editingQuizQ.q.explanation || ""}
                      onChange={(e) =>
                        setEditingQuizQ({
                          ...editingQuizQ,
                          q: { ...editingQuizQ.q, explanation: e.target.value },
                        })
                      }
                      placeholder="Why is this answer correct?"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-xs text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingQuizQ(null)}
                      className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSaveQuizQuestion(editingQuizQ.catId, editingQuizQ.q)}
                      className="rounded-xl bg-primary px-5 py-2 font-display text-sm font-bold text-background hover:bg-primary/90"
                    >
                      Save Question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ==================================================== */}
      {/* TAB 6: MATCH THE LOGIC PAIRS */}
      {/* ==================================================== */}
      {activeTab === "match" && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-display text-xl font-bold text-primary">
                Match The Logic Pairs
              </h2>
              <p className="text-xs text-muted-foreground">
                Connect concepts, terms, protocols, and definitions.
              </p>
            </div>
            <button
              onClick={() => {
                sound.playClick();
                setEditingPair({
                  id: `pair-${Date.now()}`,
                  term: "",
                  definition: "",
                });
              }}
              className="flex items-center gap-2 rounded-xl border border-neon-amber/50 bg-neon-amber/15 px-4 py-2 font-display text-xs font-bold text-neon-amber hover:bg-neon-amber/25"
            >
              <Plus size={16} /> New Match Pair
            </button>
          </div>

          <div className="space-y-3">
            {eventData.matchTheLogic.pairs.map((p, idx) => (
              <div
                key={p.id}
                className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-card/70 p-4 transition-all hover:border-primary/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-4">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-neon-amber/10 font-display text-xs font-bold text-neon-amber">
                    #{idx + 1}
                  </span>
                  <div>
                    <span className="font-display text-base font-bold text-foreground">
                      {p.term || <span className="italic text-muted-foreground">Empty Term</span>}
                    </span>
                    <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                      {p.definition || <span className="italic text-muted-foreground">Empty Definition</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-end sm:self-center">
                  {(p.termImage || p.definitionImage) && (
                    <span className="rounded bg-primary/10 px-2 py-0.5 text-[11px] font-semibold text-primary">
                      Image Pair
                    </span>
                  )}
                  <button
                    onClick={() => {
                      sound.playClick();
                      setEditingPair(p);
                    }}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-card hover:text-foreground"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    onClick={() => handleDeletePair(p.id)}
                    className="rounded-lg border border-border p-2 text-muted-foreground hover:bg-destructive/20 hover:text-destructive"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Edit Match Pair Modal */}
          {editingPair && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/85 p-4 backdrop-blur-md">
              <div className="w-full max-w-xl rounded-2xl border border-primary/40 bg-card p-6 shadow-2xl">
                <h3 className="mb-4 font-display text-lg font-bold text-primary">
                  Edit Concept & Definition Pair
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Term / Concept
                    </label>
                    <input
                      type="text"
                      value={editingPair.term}
                      onChange={(e) => setEditingPair({ ...editingPair, term: e.target.value })}
                      placeholder="e.g. Prompt Engineering"
                      className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-muted-foreground">
                      Matching Definition / Explanation
                    </label>
                    <textarea
                      rows={3}
                      value={editingPair.definition}
                      onChange={(e) => setEditingPair({ ...editingPair, definition: e.target.value })}
                      placeholder="e.g. Designing context and directives to elicit optimal LLM completions"
                      className="mt-1 w-full rounded-xl border border-border bg-background p-2.5 text-sm text-foreground focus:border-primary focus:outline-none"
                    />
                  </div>

                  {/* Term Image (optional) */}
                  <ImageInput
                    label="Term Image / Diagram (optional)"
                    value={editingPair.termImage}
                    onChange={(val) => setEditingPair({ ...editingPair, termImage: val })}
                  />

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={() => setEditingPair(null)}
                      className="rounded-xl border border-border px-4 py-2 text-sm text-muted-foreground hover:bg-muted"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSavePair(editingPair)}
                      className="rounded-xl bg-primary px-5 py-2 font-display text-sm font-bold text-background hover:bg-primary/90"
                    >
                      Save Pair
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </GameLayout>
  );
};

export default AdminEventStudio;
