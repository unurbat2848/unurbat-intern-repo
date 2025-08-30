import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class CacheInterceptor implements NestInterceptor {
  private cache = new Map<string, any>();

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const cacheKey = `${request.method}:${request.url}`;

    // Only cache GET requests
    if (request.method !== 'GET') {
      return next.handle();
    }

    // Check if we have cached data
    if (this.cache.has(cacheKey)) {
      console.log(`💾 Cache HIT for ${cacheKey}`);
      return of(this.cache.get(cacheKey));
    }

    console.log(`🔄 Cache MISS for ${cacheKey}`);

    return next.handle().pipe(
      tap((data) => {
        // Store in cache for 30 seconds
        this.cache.set(cacheKey, data);
        setTimeout(() => {
          this.cache.delete(cacheKey);
          console.log(`🗑️ Cache expired for ${cacheKey}`);
        }, 30000);
      })
    );
  }
}