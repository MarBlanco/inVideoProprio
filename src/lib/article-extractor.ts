import { extract } from '@extractus/article-extractor';
import axios from 'axios';
import { ExtractedArticle } from '@/types';
import { ValidationError } from '@/utils/validators';

export async function extractArticleContent(url: string): Promise<ExtractedArticle> {
  try {
    const article = await extract(url);

    if (!article || !article.content) {
      throw new ValidationError('No se pudo extraer contenido del artículo');
    }

    return {
      title: article.title || 'Sin título',
      content: cleanContent(article.content),
      description: article.description || '',
      image: article.image || '',
      author: article.author || '',
      publishedAt: article.published || ''
    };
  } catch (error) {
    if (error instanceof ValidationError) throw error;
    console.error('Error extracting article:', error);
    throw new ValidationError('Error al extraer el artículo. Verifica que la URL sea válida.');
  }
}

function cleanContent(content: string): string {
  return content
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, 5000);
}
