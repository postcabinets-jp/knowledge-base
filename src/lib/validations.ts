import { z } from 'zod'

// ── Primitives ──

export const idSchema = z.string().uuid('無効なIDです')

export const slugSchema = z
  .string()
  .min(1, 'スラッグは必須です')
  .max(100, 'スラッグは100文字以内です')
  .regex(/^[a-z0-9-]+$/, 'スラッグは英小文字・数字・ハイフンのみ')

export const emailSchema = z
  .string()
  .min(1, 'メールアドレスは必須です')
  .email('無効なメールアドレスです')

export const passwordSchema = z
  .string()
  .min(8, 'パスワードは8文字以上で設定してください')
  .max(128, 'パスワードは128文字以内です')

export const urlSchema = z
  .string()
  .url('無効なURLです')
  .max(2048, 'URLは2048文字以内です')

export const hexColorSchema = z
  .string()
  .regex(/^#[0-9a-fA-F]{6}$/, '無効なカラーコードです（例: #FF5733）')

export const localeSchema = z
  .string()
  .min(2, 'ロケールは2文字以上です')
  .max(10, 'ロケールは10文字以内です')
  .regex(/^[a-z]{2}(-[A-Z]{2})?$/, '無効なロケール形式です（例: ja, en-US）')

// ── Enums ──

export const articleStatusSchema = z.enum(
  ['draft', 'in_review', 'approved', 'published', 'archived'],
  { message: '無効なステータスです' }
)

export const memberRoleSchema = z.enum(
  ['owner', 'admin', 'editor', 'reviewer', 'viewer'],
  { message: '無効なロールです' }
)

export const orgPlanSchema = z.enum(
  ['free', 'pro', 'enterprise'],
  { message: '無効なプランです' }
)

export const aiProviderSchema = z.enum(
  ['openai', 'anthropic'],
  { message: '無効なAIプロバイダです' }
)

// ── Auth ──

export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'パスワードは必須です'),
})

export const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z
    .string()
    .min(1, '名前は必須です')
    .max(100, '名前は100文字以内です'),
})

export const resetPasswordSchema = z.object({
  email: emailSchema,
})

// ── Organization ──

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, '組織名は必須です')
    .max(100, '組織名は100文字以内です'),
  slug: slugSchema,
})

export const updateOrganizationSchema = z.object({
  name: z
    .string()
    .min(1, '組織名は必須です')
    .max(100, '組織名は100文字以内です')
    .optional(),
  slug: slugSchema.optional(),
  logo_url: urlSchema.nullable().optional(),
  ai_provider: aiProviderSchema.nullable().optional(),
  ai_api_key_encrypted: z.string().max(1000, 'APIキーが長すぎます').nullable().optional(),
  plan: orgPlanSchema.optional(),
})

// ── Help Center ──

export const createHelpCenterSchema = z.object({
  name: z
    .string()
    .min(1, 'ヘルプセンター名は必須です')
    .max(200, 'ヘルプセンター名は200文字以内です'),
  slug: slugSchema,
  description: z
    .string()
    .max(1000, '説明は1000文字以内です')
    .nullable()
    .optional(),
})

export const updateHelpCenterSchema = z.object({
  name: z
    .string()
    .min(1, 'ヘルプセンター名は必須です')
    .max(200, 'ヘルプセンター名は200文字以内です')
    .optional(),
  slug: slugSchema.optional(),
  custom_domain: z
    .string()
    .max(255, 'カスタムドメインは255文字以内です')
    .nullable()
    .optional(),
  description: z
    .string()
    .max(1000, '説明は1000文字以内です')
    .nullable()
    .optional(),
  logo_url: urlSchema.nullable().optional(),
  favicon_url: urlSchema.nullable().optional(),
  primary_color: hexColorSchema.optional(),
  custom_css: z
    .string()
    .max(50000, 'カスタムCSSは50000文字以内です')
    .nullable()
    .optional(),
  default_locale: localeSchema.optional(),
  is_public: z.boolean().optional(),
  seo_title: z
    .string()
    .max(200, 'SEOタイトルは200文字以内です')
    .nullable()
    .optional(),
  seo_description: z
    .string()
    .max(500, 'SEO説明は500文字以内です')
    .nullable()
    .optional(),
})

// ── Category ──

export const createCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名は必須です')
    .max(100, 'カテゴリ名は100文字以内です'),
  slug: slugSchema.optional(),
  description: z
    .string()
    .max(500, '説明は500文字以内です')
    .nullable()
    .optional(),
  icon: z
    .string()
    .max(50, 'アイコンは50文字以内です')
    .nullable()
    .optional(),
})

export const updateCategorySchema = z.object({
  name: z
    .string()
    .min(1, 'カテゴリ名は必須です')
    .max(100, 'カテゴリ名は100文字以内です')
    .optional(),
  description: z
    .string()
    .max(500, '説明は500文字以内です')
    .nullable()
    .optional(),
  icon: z
    .string()
    .max(50, 'アイコンは50文字以内です')
    .nullable()
    .optional(),
  sort_order: z
    .number()
    .int('並び順は整数です')
    .min(0, '並び順は0以上です')
    .optional(),
})

// ── Section ──

export const createSectionSchema = z.object({
  name: z
    .string()
    .min(1, 'セクション名は必須です')
    .max(100, 'セクション名は100文字以内です'),
  slug: slugSchema.optional(),
  description: z
    .string()
    .max(500, '説明は500文字以内です')
    .nullable()
    .optional(),
})

export const updateSectionSchema = z.object({
  name: z
    .string()
    .min(1, 'セクション名は必須です')
    .max(100, 'セクション名は100文字以内です')
    .optional(),
  description: z
    .string()
    .max(500, '説明は500文字以内です')
    .nullable()
    .optional(),
  sort_order: z
    .number()
    .int('並び順は整数です')
    .min(0, '並び順は0以上です')
    .optional(),
})

// ── Article ──

export const createArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(300, 'タイトルは300文字以内です'),
  slug: slugSchema.optional(),
  section_id: idSchema.nullable().optional(),
  content: z.array(z.record(z.unknown())).default([]),
})

export const updateArticleSchema = z.object({
  title: z
    .string()
    .min(1, 'タイトルは必須です')
    .max(300, 'タイトルは300文字以内です')
    .optional(),
  content: z.array(z.record(z.unknown())).optional(),
  status: articleStatusSchema.optional(),
  section_id: idSchema.nullable().optional(),
  seo_title: z
    .string()
    .max(200, 'SEOタイトルは200文字以内です')
    .nullable()
    .optional(),
  seo_description: z
    .string()
    .max(500, 'SEO説明は500文字以内です')
    .nullable()
    .optional(),
  expires_at: z
    .string()
    .datetime('無効な日時形式です')
    .nullable()
    .optional(),
  change_summary: z
    .string()
    .max(500, '変更サマリーは500文字以内です')
    .nullable()
    .optional(),
})

// ── Article Feedback ──

export const articleFeedbackSchema = z.object({
  article_id: idSchema,
  is_helpful: z.boolean({ message: '評価は必須です' }),
  comment: z
    .string()
    .max(2000, 'コメントは2000文字以内です')
    .nullable()
    .optional(),
  visitor_fingerprint: z
    .string()
    .max(100, 'フィンガープリントが長すぎます')
    .nullable()
    .optional(),
})

// ── Search ──

export const searchQuerySchema = z.object({
  query: z
    .string()
    .min(1, '検索キーワードは必須です')
    .max(500, '検索キーワードは500文字以内です'),
  session_id: z
    .string()
    .max(100, 'セッションIDが長すぎます')
    .nullable()
    .optional(),
})

// ── Label ──

export const createLabelSchema = z.object({
  name: z
    .string()
    .min(1, 'ラベル名は必須です')
    .max(50, 'ラベル名は50文字以内です'),
  color: hexColorSchema,
})

export const updateLabelSchema = z.object({
  name: z
    .string()
    .min(1, 'ラベル名は必須です')
    .max(50, 'ラベル名は50文字以内です')
    .optional(),
  color: hexColorSchema.optional(),
})

// ── Article Label ──

export const articleLabelSchema = z.object({
  article_id: idSchema,
  label_id: idSchema,
})

// ── Media Asset ──

export const createMediaAssetSchema = z.object({
  storage_path: z
    .string()
    .min(1, 'ストレージパスは必須です')
    .max(500, 'ストレージパスは500文字以内です'),
  file_name: z
    .string()
    .min(1, 'ファイル名は必須です')
    .max(255, 'ファイル名は255文字以内です'),
  mime_type: z
    .string()
    .min(1, 'MIMEタイプは必須です')
    .max(100, 'MIMEタイプは100文字以内です')
    .regex(/^[a-z]+\/[a-z0-9.+-]+$/, '無効なMIMEタイプです'),
  size_bytes: z
    .number()
    .int('ファイルサイズは整数です')
    .min(0, 'ファイルサイズは0以上です')
    .max(104857600, 'ファイルサイズは100MBまでです'),
  alt_text: z
    .string()
    .max(500, '代替テキストは500文字以内です')
    .nullable()
    .optional(),
})

// ── Organization Member ──

export const addMemberSchema = z.object({
  user_id: idSchema,
  role: memberRoleSchema,
})

export const updateMemberRoleSchema = z.object({
  role: memberRoleSchema,
})

// ── Search Query (analytics) ──

export const searchQueryRecordSchema = z.object({
  help_center_id: idSchema,
  query: z
    .string()
    .min(1, '検索キーワードは必須です')
    .max(500, '検索キーワードは500文字以内です'),
  result_count: z
    .number()
    .int('結果数は整数です')
    .min(0, '結果数は0以上です'),
  clicked_article_id: idSchema.nullable().optional(),
  session_id: z
    .string()
    .max(100, 'セッションIDが長すぎます')
    .nullable()
    .optional(),
})

// ── Type exports ──

export type SignIn = z.infer<typeof signInSchema>
export type SignUp = z.infer<typeof signUpSchema>
export type ResetPassword = z.infer<typeof resetPasswordSchema>
export type CreateOrganization = z.infer<typeof createOrganizationSchema>
export type UpdateOrganization = z.infer<typeof updateOrganizationSchema>
export type CreateHelpCenter = z.infer<typeof createHelpCenterSchema>
export type UpdateHelpCenter = z.infer<typeof updateHelpCenterSchema>
export type CreateCategory = z.infer<typeof createCategorySchema>
export type UpdateCategory = z.infer<typeof updateCategorySchema>
export type CreateSection = z.infer<typeof createSectionSchema>
export type UpdateSection = z.infer<typeof updateSectionSchema>
export type CreateArticle = z.infer<typeof createArticleSchema>
export type UpdateArticle = z.infer<typeof updateArticleSchema>
export type ArticleFeedback = z.infer<typeof articleFeedbackSchema>
export type SearchQueryInput = z.infer<typeof searchQuerySchema>
export type CreateLabel = z.infer<typeof createLabelSchema>
export type UpdateLabel = z.infer<typeof updateLabelSchema>
export type ArticleLabel = z.infer<typeof articleLabelSchema>
export type CreateMediaAsset = z.infer<typeof createMediaAssetSchema>
export type AddMember = z.infer<typeof addMemberSchema>
export type UpdateMemberRole = z.infer<typeof updateMemberRoleSchema>
export type SearchQueryRecord = z.infer<typeof searchQueryRecordSchema>
