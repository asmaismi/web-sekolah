// src/lib/ProbeBoundary.tsx
import React from "react";

type Props = { name: string; children: React.ReactNode };

export default class ProbeBoundary extends React.Component<Props, { hasError: boolean }> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: unknown) {
    console.error(`[Probe:%s]`, this.props.name, error);
  }
  render() {
    if (this.state.hasError) return null; // jangan ubah UI, cukup nol jika error
    return this.props.children;
  }
}
