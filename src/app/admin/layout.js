export const metadata = {
  title: { default: "Admin", template: "%s · Admin" },
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }) {
  return <div className="min-h-svh bg-mist font-sans text-navy">{children}</div>;
}
