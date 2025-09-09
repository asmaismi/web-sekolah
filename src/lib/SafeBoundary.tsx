// src/lib/SafeBoundary.tsx
import React from "react";

type Props = { children: React.ReactNode };

export default class SafeBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: unknown) {
    // Jangan crash UI, cukup log
    console.error(error);
  }

  render() {
    if (this.state.hasError) return null;
    return this.props.children;
  }
}
