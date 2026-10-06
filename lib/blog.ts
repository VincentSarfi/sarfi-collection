import fs from 'fs';
import path from 'path';

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  category: string;
  publishedAt: string;
  /** Datum der letzten inhaltlichen Überarbeitung (YYYY-MM-DD) */
  updatedAt?: string;
  readingTime: number;
  image: string;
  tags: string[];
  property?: 'haus28' | 'schoenblick' | null;
  /** Entwurf: nur im Dev-Server sichtbar, nie im Production-Build */
  draft?: boolean;
};

export type BlogMeta = Omit<BlogPost, 'content'>;

const POSTS_DIR = path.join(process.cwd(), 'data', 'blog', 'posts');
const SHOW_DRAFTS = process.env.NODE_ENV !== 'production';

function readPost(file: string): BlogPost {
  return JSON.parse(fs.readFileSync(path.join(POSTS_DIR, file), 'utf-8')) as BlogPost;
}

function isVisible(post: BlogPost): boolean {
  return SHOW_DRAFTS || !post.draft;
}

export function getAllPosts(): BlogMeta[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  const files = fs.readdirSync(POSTS_DIR).filter((f) => f.endsWith('.json'));
  return files
    .map(readPost)
    .filter(isVisible)
    .map((post) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { content, ...meta } = post;
      return meta;
    })
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

export function getPost(slug: string): BlogPost | null {
  if (!/^[a-z0-9äöüß-]+$/i.test(slug)) return null;
  if (!fs.existsSync(path.join(POSTS_DIR, `${slug}.json`))) return null;
  const post = readPost(`${slug}.json`);
  return isVisible(post) ? post : null;
}

export function getAllSlugs(): string[] {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith('.json') && isVisible(readPost(f)))
    .map((f) => f.replace('.json', ''));
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
}
