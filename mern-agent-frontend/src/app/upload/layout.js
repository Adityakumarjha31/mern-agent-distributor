

export const metadata = {
  title: "Upload & Distribute | Admin Dashboard",
  description: "Upload and distribute contact lists among agents",
};

export default function UploadLayout({ children }) {
  return (
    <div
      className="upload-wrapper"
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #f0f4ff, #e3e9ff)",
        fontFamily: "Inter, sans-serif",
      }}
    >
      {children}
    </div>
  );
}
