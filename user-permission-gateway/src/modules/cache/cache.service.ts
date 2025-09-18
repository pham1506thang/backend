import { Injectable } from '@nestjs/common';

@Injectable()
export class CacheService {
  private cache = new Map<string, any>();
  private readonly TTL = parseInt(process.env.CACHE_TTL) || 300; // 5 minutes default
  private readonly MAX_ITEMS = parseInt(process.env.CACHE_MAX_ITEMS) || 10000;

  /**
   * Get value from cache
   */
  get<T>(key: string): T | null {
    const cached = this.cache.get(key);
    
    if (!cached) return null;
    
    // Check if expired
    if (Date.now() - cached.timestamp > this.TTL * 1000) {
      this.cache.delete(key);
      return null;
    }
    
    return cached.value;
  }

  /**
   * Set value in cache
   */
  set(key: string, value: any, ttl?: number): void {
    // Check cache size limit
    if (this.cache.size >= this.MAX_ITEMS) {
      this.evictOldest();
    }
    
    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl: ttl || this.TTL,
    });
  }

  /**
   * Delete value from cache
   */
  delete(key: string): boolean {
    return this.cache.delete(key);
  }

  /**
   * Alias for delete method
   */
  del(key: string): boolean {
    return this.delete(key);
  }

  /**
   * Clear all cache
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Check if key exists in cache
   */
  has(key: string): boolean {
    const cached = this.cache.get(key);
    
    if (!cached) return false;
    
    // Check if expired
    if (Date.now() - cached.timestamp > cached.ttl * 1000) {
      this.cache.delete(key);
      return false;
    }
    
    return true;
  }

  /**
   * Get cache size
   */
  size(): number {
    return this.cache.size;
  }

  /**
   * Get cache stats
   */
  getStats(): { size: number; maxSize: number; ttl: number } {
    return {
      size: this.cache.size,
      maxSize: this.MAX_ITEMS,
      ttl: this.TTL,
    };
  }

  /**
   * Evict oldest cache entries
   */
  private evictOldest(): void {
    const entries = Array.from(this.cache.entries());
    entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
    
    // Remove oldest 10% of entries
    const toRemove = Math.ceil(entries.length * 0.1);
    for (let i = 0; i < toRemove; i++) {
      this.cache.delete(entries[i][0]);
    }
  }
}
