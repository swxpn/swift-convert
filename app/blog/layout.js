import '../blog.css';

export const metadata = {
  title: 'Blog - Swift Convert',
  description: 'Tips, tricks, and industry news about file conversion and optimization',
};

export default function BlogLayout({ children }) {
  return (
    <div className="blog-layout">
      {children}
    </div>
  );
}
