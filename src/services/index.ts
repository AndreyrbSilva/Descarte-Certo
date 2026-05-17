export { api } from "./api";
export { supabase } from "./supabase";

// auth
export {
  registerUser,
  loginUser,
  logout,
  sendVerifyCode,
  verifyEmail,
  changeEmail,
  confirmChangeEmail,
  changePassword,
  requestPasswordReset,
  verifyResetCode,
  resetPassword,
  setup2FA,
  verify2FA,
  disable2FA,
  fetchMe,
} from "./authService";

// home
export { fetchHomeData } from "./homeService";

// profile
export { fetchProfile, uploadAvatar, fetchPublicProfile } from "./profileService";

// ranking
export type { RankingEntry } from "./rankingService";
export { fetchTurmaRanking, fetchEscolaRanking } from "./rankingService";

// scan
export type { ScanCategory, ScanResult } from "./scanService";
export { NotTrashError, submitScan } from "./scanService";

// achievements
export type { AchievementData, NewAchievement, AchievementsResponse } from "./achievementService";
export { fetchAchievements } from "./achievementService";

// missions
export type { DailyMissionData } from "./missionService";
export { fetchDailyMission } from "./missionService";
