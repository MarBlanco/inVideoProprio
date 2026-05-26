import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function ensureDirectory(dirPath: string): Promise<void> {
  try {
    await fs.mkdir(dirPath, { recursive: true });
  } catch (error) {
    console.error(`Error creating directory ${dirPath}:`, error);
    throw error;
  }
}

export function generateUniqueFilename(extension: string): string {
  return `${uuidv4()}.${extension}`;
}

export async function deleteFile(filePath: string): Promise<void> {
  try {
    await fs.unlink(filePath);
  } catch (error) {
    console.warn(`Could not delete file ${filePath}:`, error);
  }
}

export async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

export function getTempDirectory(): string {
  return path.join(process.cwd(), 'public', 'temp');
}

export function getOutputDirectory(): string {
  return path.join(process.cwd(), 'public', 'outputs');
}
