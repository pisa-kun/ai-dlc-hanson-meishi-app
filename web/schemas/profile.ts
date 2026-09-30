import { z } from 'zod';

// ─────────────────────────────────────────────
// 共通: 多言語テキスト
// ─────────────────────────────────────────────
export const LocalizedTextSchema = z.object({
  ja: z.string().min(1, 'ja は必須'),
  en: z.string().min(1, 'en は必須'),
});
export type LocalizedText = z.infer<typeof LocalizedTextSchema>;

// ─────────────────────────────────────────────
// 個別エンティティ
// ─────────────────────────────────────────────
export const ProfileBasicSchema = z.object({
  name: LocalizedTextSchema,
  title: LocalizedTextSchema,
  tagline: LocalizedTextSchema,
  iconImagePath: z.string().min(1, 'iconImagePath は必須'),
});
export type ProfileBasic = z.infer<typeof ProfileBasicSchema>;

export const GalleryImageSchema = z.object({
  id: z.string().min(1),
  path: z.string().min(1),
  alt: LocalizedTextSchema,
  isDefaultMain: z.boolean().optional(),
});
export type GalleryImage = z.infer<typeof GalleryImageSchema>;

export const SkillSchema = z.object({
  id: z.string().min(1),
  name: z.string().min(1),
  category: z
    .enum(['language', 'framework', 'cloud', 'tool', 'design', 'other'])
    .optional(),
});
export type Skill = z.infer<typeof SkillSchema>;

const isoYearMonth = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])$/, 'YYYY-MM 形式で指定してください');
const isoDate = z
  .string()
  .regex(/^\d{4}-(0[1-9]|1[0-2])-(0[1-9]|[12]\d|3[01])$/, 'YYYY-MM-DD 形式で指定してください');

export const CareerEntrySchema = z
  .object({
    id: z.string().min(1),
    startDate: isoYearMonth,
    endDate: isoYearMonth.nullable(),
    organization: LocalizedTextSchema,
    role: LocalizedTextSchema,
    description: LocalizedTextSchema,
  })
  .refine(
    (c) => c.endDate === null || c.startDate <= c.endDate,
    { message: 'startDate は endDate 以前である必要があります', path: ['endDate'] },
  );
export type CareerEntry = z.infer<typeof CareerEntrySchema>;

export const AchievementSchema = z.object({
  id: z.string().min(1),
  date: isoDate,
  title: LocalizedTextSchema,
  description: LocalizedTextSchema,
});
export type Achievement = z.infer<typeof AchievementSchema>;

export const PortfolioItemSchema = z.object({
  id: z.string().min(1),
  title: LocalizedTextSchema,
  summary: LocalizedTextSchema,
  thumbnailPath: z.string().min(1),
  url: z.string().url(),
  tags: z.array(z.string()).optional(),
});
export type PortfolioItem = z.infer<typeof PortfolioItemSchema>;

export const BlogLinkSchema = z.object({
  id: z.string().min(1),
  title: LocalizedTextSchema,
  platform: z.enum(['zenn', 'qiita', 'medium', 'note', 'devto', 'speakerdeck', 'other']),
  publishedDate: isoDate,
  url: z.string().url(),
});
export type BlogLink = z.infer<typeof BlogLinkSchema>;

export const SnsPlatformSchema = z.enum([
  'github',
  'linkedin',
  'qiita',
  'zenn',
  'speakerdeck',
  'x',
  'other',
]);
export type SnsPlatform = z.infer<typeof SnsPlatformSchema>;

export const SnsLinkSchema = z.object({
  id: z.string().min(1),
  platform: SnsPlatformSchema,
  label: LocalizedTextSchema,
  url: z.string().url(),
});
export type SnsLink = z.infer<typeof SnsLinkSchema>;

// ─────────────────────────────────────────────
// ルート
// ─────────────────────────────────────────────
export const ProfileSchema = z
  .object({
    basic: ProfileBasicSchema,
    gallery: z.array(GalleryImageSchema).min(1, 'gallery は1要素以上必要'),
    skills: z.array(SkillSchema),
    career: z.array(CareerEntrySchema),
    achievements: z.array(AchievementSchema),
    portfolio: z.array(PortfolioItemSchema),
    blog: z.array(BlogLinkSchema),
    sns: z.array(SnsLinkSchema),
  })
  .refine(
    (p) => p.gallery.filter((g) => g.isDefaultMain === true).length <= 1,
    { message: 'gallery 内で isDefaultMain=true は高々1つです', path: ['gallery'] },
  );
export type Profile = z.infer<typeof ProfileSchema>;
