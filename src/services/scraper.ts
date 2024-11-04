import axios from 'axios';
import * as cheerio from 'cheerio';

interface ScrapedData {
  url: string;
  title: string;
  description: string;
  images: string[];
  schema: any;
}

const CORS_PROXY = 'https://api.allorigins.win/raw?url=';

export class ScraperService {
  private static async fetchWithProxy(url: string): Promise<string> {
    try {
      const response = await axios.get(`${CORS_PROXY}${encodeURIComponent(url)}`, {
        headers: {
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'User-Agent': 'Mozilla/5.0 (compatible; LinkScraper/1.0; +http://example.com/bot)',
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch ${url}: ${error}`);
    }
  }

  private static extractSchema(html: string): any {
    const $ = cheerio.load(html);
    const schemas: any[] = [];

    $('script[type="application/ld+json"]').each((_, element) => {
      try {
        const schema = JSON.parse($(element).html() || '{}');
        schemas.push(schema);
      } catch (error) {
        console.error('Failed to parse schema:', error);
      }
    });

    return schemas;
  }

  private static normalizeUrl(url: string): string {
    if (!/^https?:\/\//i.test(url)) {
      return `https://${url}`;
    }
    return url;
  }

  private static resolveUrl(base: string, path: string): string {
    try {
      return new URL(path, base).href;
    } catch {
      return '';
    }
  }

  static async scrape(url: string): Promise<ScrapedData | null> {
    try {
      const normalizedUrl = this.normalizeUrl(url);
      const html = await this.fetchWithProxy(normalizedUrl);
      const $ = cheerio.load(html);

      // Extract metadata
      const title = $('title').text() || 
                   $('meta[property="og:title"]').attr('content') || 
                   '';

      const description = $('meta[name="description"]').attr('content') || 
                         $('meta[property="og:description"]').attr('content') || 
                         '';

      // Extract images
      const images = $('img')
        .map((_, img) => {
          const src = $(img).attr('src') || '';
          if (src.startsWith('http')) return src;
          if (src.startsWith('//')) return `https:${src}`;
          if (src.startsWith('/')) return this.resolveUrl(normalizedUrl, src);
          return '';
        })
        .get()
        .filter(Boolean);

      // Extract schema
      const schema = this.extractSchema(html);

      return {
        url: normalizedUrl,
        title,
        description,
        images,
        schema,
      };
    } catch (error) {
      console.error(`Failed to scrape ${url}:`, error);
      return null;
    }
  }

  static async scrapeSitemap(url: string): Promise<ScrapedData[]> {
    try {
      const normalizedUrl = this.normalizeUrl(url);
      const xml = await this.fetchWithProxy(normalizedUrl);
      const $ = cheerio.load(xml, { xmlMode: true });
      
      const urls = $('loc')
        .map((_, loc) => $(loc).text())
        .get()
        .filter(Boolean);

      const results = await Promise.allSettled(
        urls.map(url => this.scrape(url))
      );

      return results
        .filter((result): result is PromiseFulfilledResult<ScrapedData> => 
          result.status === 'fulfilled' && result.value !== null
        )
        .map(result => result.value);
    } catch (error) {
      console.error(`Failed to scrape sitemap ${url}:`, error);
      return [];
    }
  }
}