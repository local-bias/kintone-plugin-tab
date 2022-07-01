import React from 'react';

declare module 'react' {
  /** childrenを追加したファンクションコンポーネント型 */
  type FCwC<P = Record<string, unknown>> = React.FunctionComponent<
    P & { children: React.ReactNode }
  >;

  /** classNameを追加したファンクションコンポーネント型 */
  type FCX<P = Record<string, unknown>> = React.FunctionComponent<P & { className?: string }>;
}
