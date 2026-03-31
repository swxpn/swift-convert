import Link from 'next/link';

const blogPosts = [
  {
    id: 'webp-guide',
    title: 'The Ultimate Guide to WebP Format',
    excerpt: 'Learn why WebP is the future of web images and how to get started with format conversion.',
    date: 'March 24, 2026',
    category: 'Guides',
    readTime: '5 min read',
    slug: '/blog/webp-guide',
  },
  {
    id: 'pdf-compression',
    title: 'How to Reduce PDF File Size Without Losing Quality',
    excerpt: 'Master PDF compression techniques to send large files via email easily.',
    date: 'March 20, 2026',
    category: 'Tips',
    readTime: '4 min read',
    slug: '/blog/pdf-compression',
  },
  {
    id: 'batch-processing',
    title: 'Save Hours with Batch Image Processing',
    excerpt: 'Discover how batch conversion can streamline your workflow and save time.',
    date: 'March 15, 2026',
    category: 'Productivity',
    readTime: '6 min read',
    slug: '/blog/batch-processing',
  },
  {
    id: 'image-formats-explained',
    title: 'JPG vs PNG vs WebP: Which Format Should You Use?',
    excerpt: 'A comprehensive comparison of the most popular image formats and when to use each one.',
    date: 'March 10, 2026',
    category: 'Education',
    readTime: '7 min read',
    slug: '/blog/image-formats-explained',
  },
];

export const metadata = {
  title: 'Blog - Swift Convert',
  description: 'Read tips, tricks, and guides about file conversion and optimization',
};

export default function Blog() {
  return (
    <main className="blog-main">
      {/* Header */}
      <header className="blog-header">
        <div className="container">
          <h1>Swift Convert Blog</h1>
          <p>Tips, tricks, and guides for file conversion and optimization</p>
        </div>
      </header>

      {/* Blog Posts */}
      <div className="container">
        <div className="blog-grid">
          {blogPosts.map((post) => (
            <article key={post.id} className="blog-card">
              <div className="blog-category">{post.category}</div>
              <h2>
                <Link href={post.slug}>{post.title}</Link>
              </h2>
              <p className="blog-excerpt">{post.excerpt}</p>
              <div className="blog-meta">
                <span className="blog-date">{post.date}</span>
                <span className="blog-read-time">{post.readTime}</span>
              </div>
              <Link href={post.slug} className="read-more">
                Read Article →
              </Link>
            </article>
          ))}
        </div>
      </div>

      {/* Newsletter */}
      <section className="newsletter">
        <div className="container">
          <h2>Subscribe to Our Newsletter</h2>
          <p>Get tips and updates delivered to your inbox</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  );
}
