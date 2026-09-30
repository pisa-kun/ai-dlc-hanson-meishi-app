import { z } from 'zod';
import { LocalizedTextSchema, GalleryImageSchema, SkillSchema, ProfileBasicSchema } from './profile';

/**
 * 趣味一覧アイテム（url は任意 — リンク先がない趣味もある）
 */
export const HobbyItemSchema = z.object({
  id: z.string().min(1),
  title: LocalizedTextSchema,
  summary: LocalizedTextSchema,
  thumbnailPath: z.string().min(1),
  url: z.string().default(''),
  tags: z.array(z.string()).optional(),
});
export type HobbyItem = z.infer<typeof HobbyItemSchema>;

/**
 * 趣味ページ用のプロフィールスキーマ
 * 表示セクション: プロフィール + スキルタグ + 趣味一覧
 */
export const HobbyProfileSchema = z.object({
  basic: ProfileBasicSchema,
  gallery: z.array(GalleryImageSchema).min(1),
  skills: z.array(SkillSchema),
  portfolio: z.array(HobbyItemSchema),
}).refine(
  (p) => p.gallery.filter((g) => g.isDefaultMain === true).length <= 1,
  { message: 'gallery 内で isDefaultMain=true は高々1つです', path: ['gallery'] },
);

export type HobbyProfile = z.infer<typeof HobbyProfileSchema>;
