// src/types/index.ts
export * from './camera';
export * from './photo';
export * from './filter';
export * from './layout';
export * from './canvas';
export * from './error';

// Common utility types
export type Optional<T, K extends keyof T> = Pick<Partial<T>, K> & Omit<T, K>;
export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;
