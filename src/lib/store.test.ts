import { describe, it, expect, vi, beforeEach } from 'vitest';
import { getCourseCompletionPct, loadState, saveState, completeModulePhase, getModulePhaseProgress, getCourseModuleHearts, setCourseModuleHearts } from '../lib/store';
import { ALL_COURSES, getTotalLessons, getModules } from '../lib/courseData';
import { applyGameRewards, ensureDailyState, getEffectiveHearts } from '../lib/gamification';

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, 'localStorage', { value: localStorageMock });

describe('store', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it('should return default state when no user', () => {
    const state = loadState();
    expect(state.user).toBeNull();
    expect(state.xp).toBe(0);
    expect(state.streak).toBe(0);
    expect(state.hearts).toBe(5);
  });

  it('should save and load user state', () => {
    const mockState = {
      user: { name: 'Test User', email: 'test@test.com', joinedAt: new Date().toISOString() },
      xp: 100,
      streak: 5,
      lastStudyDate: '',
      hearts: 3,
      progress: {},
      chatHistory: [],
      notifications: [],
      studyPlans: [],
      examAttempts: [],
      admissionChecklist: {},
      vocationalTest: null,
      settings: { darkMode: true, language: 'es', notifications: true, emailUpdates: true, publicProfile: false, voiceEnabled: false, voiceLang: 'es', voiceRate: 1 },
      srsItems: [],
      errorBank: [],
      documents: [],
      studySessions: [],
      questionProgress: {},
      importedBanks: [],
      ibBanks: [],
      ibFlashcardEntries: [],
      ibCourseData: [],
      gems: 10,
      lastHeartRefillAt: new Date().toISOString(),
      streakFreezes: 0,
      dailyQuests: [],
      lastQuestDate: '',
      league: { division: 'bronce', weeklyXP: 0, weekStart: '', position: 1, total: 10 },
      xpBoostUntil: null,
      xpBoostMultiplier: 1,
      legendaryLessons: [],
      mascotOutfit: 'base',
      mascotOutfits: ['base'],
      powerups: { revive: 0, timerBoost: 0 },
      dailyXp: { date: '', xp: 0 },
      flags: {},
      modulePhase: {},
      courseHearts: {},
      flashcards: [],
    };

    saveState(mockState);
    expect(localStorageMock.setItem).toHaveBeenCalled();
  });

  it('should calculate course completion percentage', () => {
    const course = ALL_COURSES.find(c => c.id === 'matematicas');
    expect(course).toBeDefined();
    
    if (course) {
      const total = getTotalLessons(course);
      // Empty progress should be 0%
      expect(getCourseCompletionPct(course.id, total)).toBe(0);
    }
  });
});

describe('courseData', () => {
  it('should have all required courses', () => {
    const courseIds = ALL_COURSES.map(c => c.id);
    expect(courseIds).toContain('matematicas');
    expect(courseIds).toContain('fisica');
    expect(courseIds).toContain('quimica');
    expect(courseIds).toContain('historia');
    expect(courseIds).toContain('comunicacion');
    expect(courseIds).toContain('ingles');
    expect(courseIds).toContain('biologia');
    expect(courseIds).toContain('computacion');
  });

  it('should have modules with lessons for each course', () => {
    ALL_COURSES.forEach(course => {
      const modules = getModules(course);
      expect(modules.length).toBeGreaterThan(0);
      
      modules.forEach(module => {
        expect(module.lessons.length).toBeGreaterThan(0);
        module.lessons.forEach(lesson => {
          expect(lesson.id).toBeTruthy();
          expect(lesson.title).toBeTruthy();
          expect(lesson.exercises.length).toBeGreaterThan(0);
        });
      });
    });
  });

  it('should calculate total lessons correctly', () => {
    const course = ALL_COURSES.find(c => c.id === 'matematicas');
    expect(course).toBeDefined();
    
    if (course) {
      const total = getTotalLessons(course);
      expect(total).toBeGreaterThan(0);
    }
  });
});

describe('gamification', () => {
  it('should apply game rewards correctly', () => {
    const state = loadState();
    const initialXp = state.xp;
    
    applyGameRewards(state, { xp: 50, quests: [], gems: 2 });
    
    expect(state.xp).toBe(initialXp + 50);
    expect(state.gems).toBeGreaterThanOrEqual(2);
  });

  it('should ensure daily state resets dailyXp', () => {
    const state = loadState();
    state.dailyXp = { date: '2020-01-01', xp: 999 };
    state.lastQuestDate = '2020-01-01';
    state.dailyQuests = [];

    ensureDailyState(state);

    expect(state.dailyXp.xp).toBe(0);
    expect(state.dailyXp.date).not.toBe('2020-01-01');
  });

  it('should get effective hearts', () => {
    const state = loadState();
    state.hearts = 3;
    state.powerups = { revive: 1, timerBoost: 0 };
    
    const effective = getEffectiveHearts(state);
    expect(effective).toBe(3);
  });
});

describe('course hearts persistence', () => {
  it('should get default hearts for new module', () => {
    const hearts = getCourseModuleHearts('matematicas', 'mat-m1');
    expect(hearts.hearts).toBe(5);
    expect(hearts.noHearts).toBe(false);
  });

  it('should persist and retrieve hearts', () => {
    setCourseModuleHearts('matematicas', 'mat-m1', 3, false);
    const hearts = getCourseModuleHearts('matematicas', 'mat-m1');
    expect(hearts.hearts).toBe(3);
    expect(hearts.noHearts).toBe(false);
  });

  it('should persist noHearts state', () => {
    setCourseModuleHearts('fisica', 'fis-m1', 0, true);
    const hearts = getCourseModuleHearts('fisica', 'fis-m1');
    expect(hearts.hearts).toBe(0);
    expect(hearts.noHearts).toBe(true);
  });
});

describe('module phase progress', () => {
  it('should track phase completion', () => {
    const state = loadState();
    completeModulePhase('matematicas', 'mat-m1', 'teoria', 20);
    
    const progress = getModulePhaseProgress('matematicas', 'mat-m1');
    expect(progress.teoria).toBe(true);
  });
});