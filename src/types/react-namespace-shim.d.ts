// Auto-added to calm VS Code type red underlines for React 19.
import 'react';
declare global {
  namespace React {
    export type FormEvent<T = Element> = import('react').FormEvent<T>;
    export type ChangeEvent<T = Element> = import('react').ChangeEvent<T>;
  }
  interface BeforeUnloadEvent extends Event { returnValue: string; }
}
export {};
