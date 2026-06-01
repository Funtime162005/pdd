// KidsTheme.ts — Central design tokens for the NRI Kids gamified UI
// Inspired by Duolingo, Lingokids, PBS Kids

export const Colors = {
  // Primary palette
  green: '#22C55E',
  greenDark: '#16A34A',
  greenLight: '#DCFCE7',
  greenGlow: 'rgba(34,197,94,0.3)',

  sky: '#38BDF8',
  skyDark: '#0284C7',
  skyLight: '#E0F2FE',

  yellow: '#FACC15',
  yellowDark: '#EAB308',
  yellowLight: '#FEF9C3',
  yellowGlow: 'rgba(250,204,21,0.4)',

  orange: '#FB923C',
  orangeDark: '#EA580C',
  orangeLight: '#FFEDD5',

  purple: '#A855F7',
  purpleDark: '#7C3AED',
  purpleLight: '#F3E8FF',
  purpleGlow: 'rgba(168,85,247,0.3)',

  pink: '#F472B6',
  pinkDark: '#DB2777',
  pinkLight: '#FCE7F3',

  red: '#F87171',
  redLight: '#FEE2E2',

  // Backgrounds
  bg: '#FFF9F0',
  bgCard: '#FFFFFF',
  bgMuted: '#F8F7FF',

  // Text
  textDark: '#1E1B4B',
  textMid: '#4B5563',
  textLight: '#9CA3AF',
  textWhite: '#FFFFFF',

  // Gradients (as tuples)
  gradGreen: ['#22C55E', '#16A34A'] as [string, string],
  gradSky: ['#38BDF8', '#0EA5E9'] as [string, string],
  gradYellow: ['#FACC15', '#F59E0B'] as [string, string],
  gradOrange: ['#FB923C', '#EA580C'] as [string, string],
  gradPurple: ['#A855F7', '#7C3AED'] as [string, string],
  gradPink: ['#F472B6', '#EC4899'] as [string, string],
  gradHero: ['#22C55E', '#38BDF8'] as [string, string],
  gradWarm: ['#FFF9F0', '#FEF3C7'] as [string, string],
  gradCool: ['#EFF6FF', '#F0FFFE'] as [string, string],
};

export const Fonts = {
  // These are loaded via useFonts in the root layout
  heading: 'FredokaOne_400Regular',
  body: 'Nunito_700Bold',
  bodyReg: 'Nunito_400Regular',
  bodySemi: 'Nunito_600SemiBold',
  bodyBold: 'Nunito_800ExtraBold',
};

export const Radius = {
  sm: 12,
  md: 20,
  lg: 28,
  xl: 36,
  pill: 100,
};

export const Shadow = {
  green: {
    shadowColor: '#22C55E',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  yellow: {
    shadowColor: '#FACC15',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
  purple: {
    shadowColor: '#A855F7',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 8,
  },
  card: {
    shadowColor: '#1E1B4B',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 5,
  },
  soft: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
};

// Motivational mascot messages per screen
export const MascotMessages: Record<string, string> = {
  dashboard: "Let's crush today's lesson! 💪",
  games: "Pick a game and earn XP! 🎮",
  community: "Say hi to your friends! 👋",
  leaderboard: "You can reach the top! 🏆",
  culture: "Discover your heritage! 🌺",
  profile: "Looking great, champ! ⭐",
  login: "Welcome back, superstar! 🌟",
  home: "Ready for an adventure? 🚀",
};
