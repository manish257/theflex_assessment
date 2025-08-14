export default function Container({ children }: { children: React.ReactNode }) {
    return <div className="max-w-[1180px] mx-auto px-5">{children}</div>;
  }
  