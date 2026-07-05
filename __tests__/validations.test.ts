import { describe, it, expect } from 'vitest'
import {
  idSchema,
  slugSchema,
  emailSchema,
  passwordSchema,
  urlSchema,
  hexColorSchema,
  localeSchema,
  articleStatusSchema,
  memberRoleSchema,
  orgPlanSchema,
  aiProviderSchema,
  signInSchema,
  signUpSchema,
  resetPasswordSchema,
  createOrganizationSchema,
  updateOrganizationSchema,
  createHelpCenterSchema,
  updateHelpCenterSchema,
  createCategorySchema,
  updateCategorySchema,
  createSectionSchema,
  updateSectionSchema,
  createArticleSchema,
  updateArticleSchema,
  articleFeedbackSchema,
  searchQuerySchema,
  createLabelSchema,
  updateLabelSchema,
  articleLabelSchema,
  createMediaAssetSchema,
  addMemberSchema,
  updateMemberRoleSchema,
  searchQueryRecordSchema,
} from '@/lib/validations'

// ── Helpers ──
const validUUID = '550e8400-e29b-41d4-a716-446655440000'

// ── Primitives ──

describe('idSchema', () => {
  it('accepts valid UUID', () => {
    expect(idSchema.safeParse(validUUID).success).toBe(true)
  })
  it('accepts UUID v4', () => {
    expect(idSchema.safeParse('f47ac10b-58cc-4372-a567-0e02b2c3d479').success).toBe(true)
  })
  it('rejects empty string', () => {
    expect(idSchema.safeParse('').success).toBe(false)
  })
  it('rejects non-UUID string', () => {
    expect(idSchema.safeParse('not-a-uuid').success).toBe(false)
  })
  it('rejects number', () => {
    expect(idSchema.safeParse(123).success).toBe(false)
  })
  it('error message is Japanese', () => {
    const result = idSchema.safeParse('bad')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('無効なID')
    }
  })
})

describe('slugSchema', () => {
  it('accepts valid slug', () => {
    expect(slugSchema.safeParse('my-help-center').success).toBe(true)
  })
  it('accepts single character', () => {
    expect(slugSchema.safeParse('a').success).toBe(true)
  })
  it('accepts numbers only', () => {
    expect(slugSchema.safeParse('123').success).toBe(true)
  })
  it('accepts mixed lowercase and numbers', () => {
    expect(slugSchema.safeParse('my-app-v2').success).toBe(true)
  })
  it('rejects empty string', () => {
    expect(slugSchema.safeParse('').success).toBe(false)
  })
  it('rejects uppercase letters', () => {
    expect(slugSchema.safeParse('MySlug').success).toBe(false)
  })
  it('rejects spaces', () => {
    expect(slugSchema.safeParse('my slug').success).toBe(false)
  })
  it('rejects underscores', () => {
    expect(slugSchema.safeParse('my_slug').success).toBe(false)
  })
  it('rejects special characters', () => {
    expect(slugSchema.safeParse('slug@!').success).toBe(false)
  })
  it('rejects string over 100 chars', () => {
    expect(slugSchema.safeParse('a'.repeat(101)).success).toBe(false)
  })
  it('accepts exactly 100 chars', () => {
    expect(slugSchema.safeParse('a'.repeat(100)).success).toBe(true)
  })
  it('rejects Japanese characters', () => {
    expect(slugSchema.safeParse('テスト').success).toBe(false)
  })
})

describe('emailSchema', () => {
  it('accepts valid email', () => {
    expect(emailSchema.safeParse('user@example.com').success).toBe(true)
  })
  it('accepts email with subdomain', () => {
    expect(emailSchema.safeParse('user@mail.example.co.jp').success).toBe(true)
  })
  it('rejects empty string', () => {
    expect(emailSchema.safeParse('').success).toBe(false)
  })
  it('rejects missing @', () => {
    expect(emailSchema.safeParse('userexample.com').success).toBe(false)
  })
  it('rejects missing domain', () => {
    expect(emailSchema.safeParse('user@').success).toBe(false)
  })
  it('rejects plain text', () => {
    expect(emailSchema.safeParse('not-an-email').success).toBe(false)
  })
})

describe('passwordSchema', () => {
  it('accepts 8-char password', () => {
    expect(passwordSchema.safeParse('12345678').success).toBe(true)
  })
  it('accepts 128-char password', () => {
    expect(passwordSchema.safeParse('a'.repeat(128)).success).toBe(true)
  })
  it('rejects 7-char password', () => {
    expect(passwordSchema.safeParse('1234567').success).toBe(false)
  })
  it('rejects 129-char password', () => {
    expect(passwordSchema.safeParse('a'.repeat(129)).success).toBe(false)
  })
  it('rejects empty string', () => {
    expect(passwordSchema.safeParse('').success).toBe(false)
  })
  it('error message mentions 8 chars', () => {
    const result = passwordSchema.safeParse('short')
    expect(result.success).toBe(false)
    if (!result.success) {
      expect(result.error.issues[0].message).toContain('8文字以上')
    }
  })
})

describe('urlSchema', () => {
  it('accepts https URL', () => {
    expect(urlSchema.safeParse('https://example.com').success).toBe(true)
  })
  it('accepts http URL', () => {
    expect(urlSchema.safeParse('http://example.com/path?q=1').success).toBe(true)
  })
  it('rejects non-URL string', () => {
    expect(urlSchema.safeParse('not-a-url').success).toBe(false)
  })
  it('rejects empty string', () => {
    expect(urlSchema.safeParse('').success).toBe(false)
  })
  it('rejects URL over 2048 chars', () => {
    expect(urlSchema.safeParse('https://example.com/' + 'a'.repeat(2030)).success).toBe(false)
  })
})

describe('hexColorSchema', () => {
  it('accepts valid hex color', () => {
    expect(hexColorSchema.safeParse('#FF5733').success).toBe(true)
  })
  it('accepts lowercase hex', () => {
    expect(hexColorSchema.safeParse('#ff5733').success).toBe(true)
  })
  it('accepts mixed case', () => {
    expect(hexColorSchema.safeParse('#aAbBcC').success).toBe(true)
  })
  it('rejects 3-digit hex', () => {
    expect(hexColorSchema.safeParse('#F00').success).toBe(false)
  })
  it('rejects missing hash', () => {
    expect(hexColorSchema.safeParse('FF5733').success).toBe(false)
  })
  it('rejects invalid hex chars', () => {
    expect(hexColorSchema.safeParse('#GGHHII').success).toBe(false)
  })
  it('rejects 8-digit hex (alpha)', () => {
    expect(hexColorSchema.safeParse('#FF5733FF').success).toBe(false)
  })
})

describe('localeSchema', () => {
  it('accepts "ja"', () => {
    expect(localeSchema.safeParse('ja').success).toBe(true)
  })
  it('accepts "en-US"', () => {
    expect(localeSchema.safeParse('en-US').success).toBe(true)
  })
  it('rejects single char', () => {
    expect(localeSchema.safeParse('j').success).toBe(false)
  })
  it('rejects uppercase language code', () => {
    expect(localeSchema.safeParse('JA').success).toBe(false)
  })
  it('rejects lowercase country code', () => {
    expect(localeSchema.safeParse('en-us').success).toBe(false)
  })
  it('rejects invalid format', () => {
    expect(localeSchema.safeParse('japanese').success).toBe(false)
  })
})

// ── Enums ──

describe('articleStatusSchema', () => {
  it.each(['draft', 'in_review', 'approved', 'published', 'archived'] as const)(
    'accepts "%s"',
    (status) => {
      expect(articleStatusSchema.safeParse(status).success).toBe(true)
    }
  )
  it('rejects invalid status', () => {
    expect(articleStatusSchema.safeParse('deleted').success).toBe(false)
  })
  it('rejects empty string', () => {
    expect(articleStatusSchema.safeParse('').success).toBe(false)
  })
})

describe('memberRoleSchema', () => {
  it.each(['owner', 'admin', 'editor', 'reviewer', 'viewer'] as const)(
    'accepts "%s"',
    (role) => {
      expect(memberRoleSchema.safeParse(role).success).toBe(true)
    }
  )
  it('rejects invalid role', () => {
    expect(memberRoleSchema.safeParse('superadmin').success).toBe(false)
  })
})

describe('orgPlanSchema', () => {
  it.each(['free', 'pro', 'enterprise'] as const)('accepts "%s"', (plan) => {
    expect(orgPlanSchema.safeParse(plan).success).toBe(true)
  })
  it('rejects invalid plan', () => {
    expect(orgPlanSchema.safeParse('starter').success).toBe(false)
  })
})

describe('aiProviderSchema', () => {
  it.each(['openai', 'anthropic'] as const)('accepts "%s"', (p) => {
    expect(aiProviderSchema.safeParse(p).success).toBe(true)
  })
  it('rejects invalid provider', () => {
    expect(aiProviderSchema.safeParse('google').success).toBe(false)
  })
})

// ── Auth schemas ──

describe('signInSchema', () => {
  it('accepts valid input', () => {
    expect(
      signInSchema.safeParse({ email: 'user@example.com', password: 'pass' }).success
    ).toBe(true)
  })
  it('rejects missing email', () => {
    expect(signInSchema.safeParse({ password: 'pass' }).success).toBe(false)
  })
  it('rejects missing password', () => {
    expect(signInSchema.safeParse({ email: 'user@example.com' }).success).toBe(false)
  })
  it('rejects invalid email', () => {
    expect(
      signInSchema.safeParse({ email: 'bad', password: 'pass' }).success
    ).toBe(false)
  })
  it('rejects empty password', () => {
    expect(
      signInSchema.safeParse({ email: 'user@example.com', password: '' }).success
    ).toBe(false)
  })
})

describe('signUpSchema', () => {
  const valid = { email: 'user@example.com', password: '12345678', name: 'Taro' }

  it('accepts valid input', () => {
    expect(signUpSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects short password', () => {
    expect(signUpSchema.safeParse({ ...valid, password: '1234567' }).success).toBe(false)
  })
  it('rejects empty name', () => {
    expect(signUpSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })
  it('rejects missing email', () => {
    expect(signUpSchema.safeParse({ password: '12345678', name: 'Taro' }).success).toBe(false)
  })
  it('rejects name over 100 chars', () => {
    expect(signUpSchema.safeParse({ ...valid, name: 'a'.repeat(101) }).success).toBe(false)
  })
})

describe('resetPasswordSchema', () => {
  it('accepts valid email', () => {
    expect(resetPasswordSchema.safeParse({ email: 'test@test.com' }).success).toBe(true)
  })
  it('rejects empty email', () => {
    expect(resetPasswordSchema.safeParse({ email: '' }).success).toBe(false)
  })
  it('rejects missing email', () => {
    expect(resetPasswordSchema.safeParse({}).success).toBe(false)
  })
})

// ── Organization ──

describe('createOrganizationSchema', () => {
  const valid = { name: 'My Org', slug: 'my-org' }

  it('accepts valid input', () => {
    expect(createOrganizationSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects empty name', () => {
    expect(createOrganizationSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })
  it('rejects empty slug', () => {
    expect(createOrganizationSchema.safeParse({ ...valid, slug: '' }).success).toBe(false)
  })
  it('rejects invalid slug', () => {
    expect(createOrganizationSchema.safeParse({ ...valid, slug: 'My Org!' }).success).toBe(false)
  })
  it('rejects name over 100 chars', () => {
    expect(
      createOrganizationSchema.safeParse({ ...valid, name: 'a'.repeat(101) }).success
    ).toBe(false)
  })
  it('rejects missing name', () => {
    expect(createOrganizationSchema.safeParse({ slug: 'my-org' }).success).toBe(false)
  })
  it('rejects missing slug', () => {
    expect(createOrganizationSchema.safeParse({ name: 'My Org' }).success).toBe(false)
  })
})

describe('updateOrganizationSchema', () => {
  it('accepts partial update with name only', () => {
    expect(updateOrganizationSchema.safeParse({ name: 'New Name' }).success).toBe(true)
  })
  it('accepts empty object (all optional)', () => {
    expect(updateOrganizationSchema.safeParse({}).success).toBe(true)
  })
  it('accepts plan change', () => {
    expect(updateOrganizationSchema.safeParse({ plan: 'pro' }).success).toBe(true)
  })
  it('rejects invalid plan', () => {
    expect(updateOrganizationSchema.safeParse({ plan: 'invalid' }).success).toBe(false)
  })
  it('accepts nullable logo_url', () => {
    expect(updateOrganizationSchema.safeParse({ logo_url: null }).success).toBe(true)
  })
  it('accepts valid logo_url', () => {
    expect(
      updateOrganizationSchema.safeParse({ logo_url: 'https://cdn.example.com/logo.png' }).success
    ).toBe(true)
  })
  it('rejects invalid logo_url', () => {
    expect(updateOrganizationSchema.safeParse({ logo_url: 'not-url' }).success).toBe(false)
  })
  it('accepts nullable ai_provider', () => {
    expect(updateOrganizationSchema.safeParse({ ai_provider: null }).success).toBe(true)
  })
  it('accepts valid ai_provider', () => {
    expect(updateOrganizationSchema.safeParse({ ai_provider: 'openai' }).success).toBe(true)
  })
})

// ── Help Center ──

describe('createHelpCenterSchema', () => {
  const valid = { name: 'Help Docs', slug: 'help-docs' }

  it('accepts valid input', () => {
    expect(createHelpCenterSchema.safeParse(valid).success).toBe(true)
  })
  it('accepts with optional description', () => {
    expect(
      createHelpCenterSchema.safeParse({ ...valid, description: 'Our help center' }).success
    ).toBe(true)
  })
  it('accepts null description', () => {
    expect(createHelpCenterSchema.safeParse({ ...valid, description: null }).success).toBe(true)
  })
  it('rejects empty name', () => {
    expect(createHelpCenterSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })
  it('rejects name over 200 chars', () => {
    expect(
      createHelpCenterSchema.safeParse({ ...valid, name: 'a'.repeat(201) }).success
    ).toBe(false)
  })
  it('rejects description over 1000 chars', () => {
    expect(
      createHelpCenterSchema.safeParse({ ...valid, description: 'a'.repeat(1001) }).success
    ).toBe(false)
  })
})

describe('updateHelpCenterSchema', () => {
  it('accepts empty object', () => {
    expect(updateHelpCenterSchema.safeParse({}).success).toBe(true)
  })
  it('accepts valid primary_color', () => {
    expect(updateHelpCenterSchema.safeParse({ primary_color: '#1A2B3C' }).success).toBe(true)
  })
  it('rejects invalid primary_color', () => {
    expect(updateHelpCenterSchema.safeParse({ primary_color: 'red' }).success).toBe(false)
  })
  it('accepts valid locale', () => {
    expect(updateHelpCenterSchema.safeParse({ default_locale: 'ja' }).success).toBe(true)
  })
  it('rejects invalid locale', () => {
    expect(updateHelpCenterSchema.safeParse({ default_locale: 'JAPANESE' }).success).toBe(false)
  })
  it('accepts boolean is_public', () => {
    expect(updateHelpCenterSchema.safeParse({ is_public: false }).success).toBe(true)
  })
  it('accepts nullable custom_css', () => {
    expect(updateHelpCenterSchema.safeParse({ custom_css: null }).success).toBe(true)
  })
  it('rejects custom_css over 50000 chars', () => {
    expect(
      updateHelpCenterSchema.safeParse({ custom_css: 'a'.repeat(50001) }).success
    ).toBe(false)
  })
  it('accepts seo_title', () => {
    expect(updateHelpCenterSchema.safeParse({ seo_title: 'SEO Title' }).success).toBe(true)
  })
  it('rejects seo_title over 200 chars', () => {
    expect(
      updateHelpCenterSchema.safeParse({ seo_title: 'a'.repeat(201) }).success
    ).toBe(false)
  })
  it('accepts seo_description', () => {
    expect(updateHelpCenterSchema.safeParse({ seo_description: 'Description' }).success).toBe(true)
  })
  it('rejects seo_description over 500 chars', () => {
    expect(
      updateHelpCenterSchema.safeParse({ seo_description: 'a'.repeat(501) }).success
    ).toBe(false)
  })
  it('accepts nullable favicon_url', () => {
    expect(updateHelpCenterSchema.safeParse({ favicon_url: null }).success).toBe(true)
  })
  it('accepts valid favicon_url', () => {
    expect(
      updateHelpCenterSchema.safeParse({ favicon_url: 'https://example.com/fav.ico' }).success
    ).toBe(true)
  })
  it('accepts nullable custom_domain', () => {
    expect(updateHelpCenterSchema.safeParse({ custom_domain: null }).success).toBe(true)
  })
  it('rejects custom_domain over 255 chars', () => {
    expect(
      updateHelpCenterSchema.safeParse({ custom_domain: 'a'.repeat(256) }).success
    ).toBe(false)
  })
})

// ── Category ──

describe('createCategorySchema', () => {
  it('accepts valid input', () => {
    expect(createCategorySchema.safeParse({ name: 'Getting Started' }).success).toBe(true)
  })
  it('accepts with optional slug', () => {
    expect(
      createCategorySchema.safeParse({ name: 'FAQ', slug: 'faq' }).success
    ).toBe(true)
  })
  it('accepts with optional icon', () => {
    expect(
      createCategorySchema.safeParse({ name: 'FAQ', icon: 'help-circle' }).success
    ).toBe(true)
  })
  it('accepts null description', () => {
    expect(
      createCategorySchema.safeParse({ name: 'FAQ', description: null }).success
    ).toBe(true)
  })
  it('rejects empty name', () => {
    expect(createCategorySchema.safeParse({ name: '' }).success).toBe(false)
  })
  it('rejects name over 100 chars', () => {
    expect(createCategorySchema.safeParse({ name: 'a'.repeat(101) }).success).toBe(false)
  })
  it('rejects description over 500 chars', () => {
    expect(
      createCategorySchema.safeParse({ name: 'FAQ', description: 'a'.repeat(501) }).success
    ).toBe(false)
  })
  it('rejects icon over 50 chars', () => {
    expect(
      createCategorySchema.safeParse({ name: 'FAQ', icon: 'a'.repeat(51) }).success
    ).toBe(false)
  })
})

describe('updateCategorySchema', () => {
  it('accepts empty object', () => {
    expect(updateCategorySchema.safeParse({}).success).toBe(true)
  })
  it('accepts name only', () => {
    expect(updateCategorySchema.safeParse({ name: 'Updated' }).success).toBe(true)
  })
  it('accepts sort_order as integer', () => {
    expect(updateCategorySchema.safeParse({ sort_order: 5 }).success).toBe(true)
  })
  it('accepts sort_order = 0', () => {
    expect(updateCategorySchema.safeParse({ sort_order: 0 }).success).toBe(true)
  })
  it('rejects negative sort_order', () => {
    expect(updateCategorySchema.safeParse({ sort_order: -1 }).success).toBe(false)
  })
  it('rejects float sort_order', () => {
    expect(updateCategorySchema.safeParse({ sort_order: 1.5 }).success).toBe(false)
  })
  it('accepts nullable description', () => {
    expect(updateCategorySchema.safeParse({ description: null }).success).toBe(true)
  })
  it('accepts nullable icon', () => {
    expect(updateCategorySchema.safeParse({ icon: null }).success).toBe(true)
  })
})

// ── Section ──

describe('createSectionSchema', () => {
  it('accepts valid input', () => {
    expect(createSectionSchema.safeParse({ name: 'Basics' }).success).toBe(true)
  })
  it('accepts with optional slug', () => {
    expect(createSectionSchema.safeParse({ name: 'Basics', slug: 'basics' }).success).toBe(true)
  })
  it('accepts null description', () => {
    expect(createSectionSchema.safeParse({ name: 'Basics', description: null }).success).toBe(true)
  })
  it('rejects empty name', () => {
    expect(createSectionSchema.safeParse({ name: '' }).success).toBe(false)
  })
  it('rejects name over 100 chars', () => {
    expect(createSectionSchema.safeParse({ name: 'a'.repeat(101) }).success).toBe(false)
  })
  it('rejects description over 500 chars', () => {
    expect(
      createSectionSchema.safeParse({ name: 'X', description: 'a'.repeat(501) }).success
    ).toBe(false)
  })
})

describe('updateSectionSchema', () => {
  it('accepts empty object', () => {
    expect(updateSectionSchema.safeParse({}).success).toBe(true)
  })
  it('accepts sort_order', () => {
    expect(updateSectionSchema.safeParse({ sort_order: 3 }).success).toBe(true)
  })
  it('rejects negative sort_order', () => {
    expect(updateSectionSchema.safeParse({ sort_order: -1 }).success).toBe(false)
  })
  it('accepts nullable description', () => {
    expect(updateSectionSchema.safeParse({ description: null }).success).toBe(true)
  })
})

// ── Article ──

describe('createArticleSchema', () => {
  it('accepts valid input with title only', () => {
    expect(createArticleSchema.safeParse({ title: 'How to get started' }).success).toBe(true)
  })
  it('accepts with optional slug', () => {
    expect(
      createArticleSchema.safeParse({ title: 'Getting started', slug: 'getting-started' }).success
    ).toBe(true)
  })
  it('accepts with null section_id', () => {
    expect(
      createArticleSchema.safeParse({ title: 'Test', section_id: null }).success
    ).toBe(true)
  })
  it('accepts with valid section_id UUID', () => {
    expect(
      createArticleSchema.safeParse({ title: 'Test', section_id: validUUID }).success
    ).toBe(true)
  })
  it('accepts with content array', () => {
    const content = [{ type: 'paragraph', content: [{ type: 'text', text: 'Hello' }] }]
    expect(createArticleSchema.safeParse({ title: 'Test', content }).success).toBe(true)
  })
  it('defaults content to empty array', () => {
    const result = createArticleSchema.safeParse({ title: 'Test' })
    expect(result.success).toBe(true)
    if (result.success) {
      expect(result.data.content).toEqual([])
    }
  })
  it('rejects empty title', () => {
    expect(createArticleSchema.safeParse({ title: '' }).success).toBe(false)
  })
  it('rejects title over 300 chars', () => {
    expect(createArticleSchema.safeParse({ title: 'a'.repeat(301) }).success).toBe(false)
  })
  it('rejects invalid section_id', () => {
    expect(
      createArticleSchema.safeParse({ title: 'Test', section_id: 'bad-id' }).success
    ).toBe(false)
  })
})

describe('updateArticleSchema', () => {
  it('accepts empty object', () => {
    expect(updateArticleSchema.safeParse({}).success).toBe(true)
  })
  it('accepts title update', () => {
    expect(updateArticleSchema.safeParse({ title: 'New title' }).success).toBe(true)
  })
  it('accepts status change to published', () => {
    expect(updateArticleSchema.safeParse({ status: 'published' }).success).toBe(true)
  })
  it('rejects invalid status', () => {
    expect(updateArticleSchema.safeParse({ status: 'deleted' }).success).toBe(false)
  })
  it('accepts seo_title', () => {
    expect(updateArticleSchema.safeParse({ seo_title: 'SEO Title' }).success).toBe(true)
  })
  it('rejects seo_title over 200 chars', () => {
    expect(updateArticleSchema.safeParse({ seo_title: 'a'.repeat(201) }).success).toBe(false)
  })
  it('accepts seo_description', () => {
    expect(updateArticleSchema.safeParse({ seo_description: 'A description' }).success).toBe(true)
  })
  it('rejects seo_description over 500 chars', () => {
    expect(
      updateArticleSchema.safeParse({ seo_description: 'a'.repeat(501) }).success
    ).toBe(false)
  })
  it('accepts valid expires_at', () => {
    expect(
      updateArticleSchema.safeParse({ expires_at: '2025-12-31T23:59:59Z' }).success
    ).toBe(true)
  })
  it('accepts null expires_at', () => {
    expect(updateArticleSchema.safeParse({ expires_at: null }).success).toBe(true)
  })
  it('rejects invalid expires_at format', () => {
    expect(updateArticleSchema.safeParse({ expires_at: 'tomorrow' }).success).toBe(false)
  })
  it('accepts change_summary', () => {
    expect(
      updateArticleSchema.safeParse({ change_summary: 'Fixed typo' }).success
    ).toBe(true)
  })
  it('rejects change_summary over 500 chars', () => {
    expect(
      updateArticleSchema.safeParse({ change_summary: 'a'.repeat(501) }).success
    ).toBe(false)
  })
  it('accepts null change_summary', () => {
    expect(updateArticleSchema.safeParse({ change_summary: null }).success).toBe(true)
  })
  it('accepts content update', () => {
    expect(
      updateArticleSchema.safeParse({
        content: [{ type: 'paragraph', text: 'Hello' }],
      }).success
    ).toBe(true)
  })
  it('accepts null section_id', () => {
    expect(updateArticleSchema.safeParse({ section_id: null }).success).toBe(true)
  })
  it('accepts valid section_id', () => {
    expect(updateArticleSchema.safeParse({ section_id: validUUID }).success).toBe(true)
  })
  it('rejects invalid section_id', () => {
    expect(updateArticleSchema.safeParse({ section_id: 'not-uuid' }).success).toBe(false)
  })
  it('accepts null seo_title', () => {
    expect(updateArticleSchema.safeParse({ seo_title: null }).success).toBe(true)
  })
  it('accepts null seo_description', () => {
    expect(updateArticleSchema.safeParse({ seo_description: null }).success).toBe(true)
  })
})

// ── Article Feedback ──

describe('articleFeedbackSchema', () => {
  const valid = { article_id: validUUID, is_helpful: true }

  it('accepts valid input', () => {
    expect(articleFeedbackSchema.safeParse(valid).success).toBe(true)
  })
  it('accepts with comment', () => {
    expect(
      articleFeedbackSchema.safeParse({ ...valid, comment: 'Great article!' }).success
    ).toBe(true)
  })
  it('accepts null comment', () => {
    expect(articleFeedbackSchema.safeParse({ ...valid, comment: null }).success).toBe(true)
  })
  it('accepts with fingerprint', () => {
    expect(
      articleFeedbackSchema.safeParse({ ...valid, visitor_fingerprint: 'abc123' }).success
    ).toBe(true)
  })
  it('rejects invalid article_id', () => {
    expect(
      articleFeedbackSchema.safeParse({ ...valid, article_id: 'bad' }).success
    ).toBe(false)
  })
  it('rejects missing is_helpful', () => {
    expect(articleFeedbackSchema.safeParse({ article_id: validUUID }).success).toBe(false)
  })
  it('accepts is_helpful = false', () => {
    expect(
      articleFeedbackSchema.safeParse({ article_id: validUUID, is_helpful: false }).success
    ).toBe(true)
  })
  it('rejects comment over 2000 chars', () => {
    expect(
      articleFeedbackSchema.safeParse({ ...valid, comment: 'a'.repeat(2001) }).success
    ).toBe(false)
  })
  it('rejects fingerprint over 100 chars', () => {
    expect(
      articleFeedbackSchema.safeParse({ ...valid, visitor_fingerprint: 'a'.repeat(101) }).success
    ).toBe(false)
  })
})

// ── Search ──

describe('searchQuerySchema', () => {
  it('accepts valid query', () => {
    expect(searchQuerySchema.safeParse({ query: 'how to reset' }).success).toBe(true)
  })
  it('accepts with session_id', () => {
    expect(
      searchQuerySchema.safeParse({ query: 'test', session_id: 'sess-123' }).success
    ).toBe(true)
  })
  it('accepts null session_id', () => {
    expect(searchQuerySchema.safeParse({ query: 'test', session_id: null }).success).toBe(true)
  })
  it('rejects empty query', () => {
    expect(searchQuerySchema.safeParse({ query: '' }).success).toBe(false)
  })
  it('rejects query over 500 chars', () => {
    expect(searchQuerySchema.safeParse({ query: 'a'.repeat(501) }).success).toBe(false)
  })
  it('rejects session_id over 100 chars', () => {
    expect(
      searchQuerySchema.safeParse({ query: 'test', session_id: 'a'.repeat(101) }).success
    ).toBe(false)
  })
})

// ── Label ──

describe('createLabelSchema', () => {
  const valid = { name: 'Bug', color: '#FF0000' }

  it('accepts valid input', () => {
    expect(createLabelSchema.safeParse(valid).success).toBe(true)
  })
  it('rejects empty name', () => {
    expect(createLabelSchema.safeParse({ ...valid, name: '' }).success).toBe(false)
  })
  it('rejects name over 50 chars', () => {
    expect(createLabelSchema.safeParse({ ...valid, name: 'a'.repeat(51) }).success).toBe(false)
  })
  it('rejects invalid color', () => {
    expect(createLabelSchema.safeParse({ ...valid, color: 'red' }).success).toBe(false)
  })
  it('rejects missing color', () => {
    expect(createLabelSchema.safeParse({ name: 'Bug' }).success).toBe(false)
  })
})

describe('updateLabelSchema', () => {
  it('accepts empty object', () => {
    expect(updateLabelSchema.safeParse({}).success).toBe(true)
  })
  it('accepts name update', () => {
    expect(updateLabelSchema.safeParse({ name: 'Feature' }).success).toBe(true)
  })
  it('accepts color update', () => {
    expect(updateLabelSchema.safeParse({ color: '#00FF00' }).success).toBe(true)
  })
  it('rejects invalid color', () => {
    expect(updateLabelSchema.safeParse({ color: 'blue' }).success).toBe(false)
  })
})

// ── Article Label ──

describe('articleLabelSchema', () => {
  it('accepts valid input', () => {
    expect(
      articleLabelSchema.safeParse({ article_id: validUUID, label_id: validUUID }).success
    ).toBe(true)
  })
  it('rejects invalid article_id', () => {
    expect(
      articleLabelSchema.safeParse({ article_id: 'bad', label_id: validUUID }).success
    ).toBe(false)
  })
  it('rejects invalid label_id', () => {
    expect(
      articleLabelSchema.safeParse({ article_id: validUUID, label_id: 'bad' }).success
    ).toBe(false)
  })
  it('rejects missing article_id', () => {
    expect(articleLabelSchema.safeParse({ label_id: validUUID }).success).toBe(false)
  })
  it('rejects missing label_id', () => {
    expect(articleLabelSchema.safeParse({ article_id: validUUID }).success).toBe(false)
  })
})

// ── Media Asset ──

describe('createMediaAssetSchema', () => {
  const valid = {
    storage_path: 'uploads/org-1/img.png',
    file_name: 'img.png',
    mime_type: 'image/png',
    size_bytes: 1024,
  }

  it('accepts valid input', () => {
    expect(createMediaAssetSchema.safeParse(valid).success).toBe(true)
  })
  it('accepts with alt_text', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, alt_text: 'A screenshot' }).success
    ).toBe(true)
  })
  it('accepts null alt_text', () => {
    expect(createMediaAssetSchema.safeParse({ ...valid, alt_text: null }).success).toBe(true)
  })
  it('rejects empty storage_path', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, storage_path: '' }).success
    ).toBe(false)
  })
  it('rejects empty file_name', () => {
    expect(createMediaAssetSchema.safeParse({ ...valid, file_name: '' }).success).toBe(false)
  })
  it('rejects empty mime_type', () => {
    expect(createMediaAssetSchema.safeParse({ ...valid, mime_type: '' }).success).toBe(false)
  })
  it('rejects invalid mime_type format', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, mime_type: 'png' }).success
    ).toBe(false)
  })
  it('accepts application/pdf mime type', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, mime_type: 'application/pdf' }).success
    ).toBe(true)
  })
  it('rejects negative size_bytes', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, size_bytes: -1 }).success
    ).toBe(false)
  })
  it('rejects size_bytes over 100MB', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, size_bytes: 104857601 }).success
    ).toBe(false)
  })
  it('accepts size_bytes = 0', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, size_bytes: 0 }).success
    ).toBe(true)
  })
  it('accepts exactly 100MB', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, size_bytes: 104857600 }).success
    ).toBe(true)
  })
  it('rejects float size_bytes', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, size_bytes: 1024.5 }).success
    ).toBe(false)
  })
  it('rejects alt_text over 500 chars', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, alt_text: 'a'.repeat(501) }).success
    ).toBe(false)
  })
  it('rejects file_name over 255 chars', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, file_name: 'a'.repeat(256) }).success
    ).toBe(false)
  })
  it('rejects storage_path over 500 chars', () => {
    expect(
      createMediaAssetSchema.safeParse({ ...valid, storage_path: 'a'.repeat(501) }).success
    ).toBe(false)
  })
})

// ── Organization Member ──

describe('addMemberSchema', () => {
  it('accepts valid input', () => {
    expect(addMemberSchema.safeParse({ user_id: validUUID, role: 'editor' }).success).toBe(true)
  })
  it('rejects invalid user_id', () => {
    expect(addMemberSchema.safeParse({ user_id: 'bad', role: 'editor' }).success).toBe(false)
  })
  it('rejects invalid role', () => {
    expect(addMemberSchema.safeParse({ user_id: validUUID, role: 'superadmin' }).success).toBe(false)
  })
  it('rejects missing user_id', () => {
    expect(addMemberSchema.safeParse({ role: 'editor' }).success).toBe(false)
  })
  it('rejects missing role', () => {
    expect(addMemberSchema.safeParse({ user_id: validUUID }).success).toBe(false)
  })
})

describe('updateMemberRoleSchema', () => {
  it('accepts valid role', () => {
    expect(updateMemberRoleSchema.safeParse({ role: 'admin' }).success).toBe(true)
  })
  it('rejects invalid role', () => {
    expect(updateMemberRoleSchema.safeParse({ role: 'manager' }).success).toBe(false)
  })
  it('rejects missing role', () => {
    expect(updateMemberRoleSchema.safeParse({}).success).toBe(false)
  })
})

// ── Search Query Record ──

describe('searchQueryRecordSchema', () => {
  const valid = {
    help_center_id: validUUID,
    query: 'how to login',
    result_count: 5,
  }

  it('accepts valid input', () => {
    expect(searchQueryRecordSchema.safeParse(valid).success).toBe(true)
  })
  it('accepts with clicked_article_id', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, clicked_article_id: validUUID }).success
    ).toBe(true)
  })
  it('accepts null clicked_article_id', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, clicked_article_id: null }).success
    ).toBe(true)
  })
  it('accepts with session_id', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, session_id: 'abc' }).success
    ).toBe(true)
  })
  it('rejects invalid help_center_id', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, help_center_id: 'bad' }).success
    ).toBe(false)
  })
  it('rejects empty query', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, query: '' }).success
    ).toBe(false)
  })
  it('rejects negative result_count', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, result_count: -1 }).success
    ).toBe(false)
  })
  it('rejects float result_count', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, result_count: 2.5 }).success
    ).toBe(false)
  })
  it('accepts result_count = 0', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, result_count: 0 }).success
    ).toBe(true)
  })
  it('rejects invalid clicked_article_id', () => {
    expect(
      searchQueryRecordSchema.safeParse({ ...valid, clicked_article_id: 'bad' }).success
    ).toBe(false)
  })
})
