export type RecruitmentFormData = {
  description: string;
  expiresAt: string;
  header: string;
  link: string;
};

export const createRecruitmentData = (suffix: string): RecruitmentFormData => ({
  description: `Created by Playwright E2E ${suffix}.`,
  expiresAt: "2030-12-31T12:00",
  header: `E2E Recruitment ${suffix}`,
  link: `https://example.com/e2e-recruitment-${suffix}`,
});
