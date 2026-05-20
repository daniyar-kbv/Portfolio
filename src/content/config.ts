import { defineCollection, z } from 'astro:content';
import { projectCategories } from '../data/site';

const wixMediaSchema = z.object({
  src: z.string(),
  fileName: z.string().optional(),
  title: z.string().optional(),
  alt: z.string().optional(),
  type: z.string().optional(),
  slug: z.string().optional(),
  settings: z.record(z.unknown()).optional(),
});

const projects = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    subtitle: z.string(),
    description: z.string(),
    category: z.enum(projectCategories),
    typeTags: z.array(z.string()),
    techTags: z.array(z.string()),
    status: z.string().optional(),
    featured: z.boolean(),
    priority: z.number().int(),
    role: z.string().optional(),
    stack: z.array(z.string()),
    links: z.array(
      z.object({
        type: z.string(),
        label: z.string(),
        url: z.string(),
      }),
    ),
    thumbnail: z.string().optional(),
    image: z.string().optional(),
    showMediaBanner: z.boolean(),
    media: z.array(z.string()).optional(),
    screenshots: z.array(z.string()).optional(),
    coverAlt: z.string().optional(),
    highlights: z.array(z.string()).optional(),
    wix: z
      .object({
        id: z.string(),
        path: z.string(),
        thumbnail: wixMediaSchema.optional(),
        banners: z.array(wixMediaSchema).default([]),
        manualSort: z.string().optional(),
        status: z.string().optional(),
        createdAt: z.string().optional(),
        updatedAt: z.string().optional(),
      })
      .optional(),
  }),
});

export const collections = {
  projects,
};
