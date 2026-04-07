export const metadata = {
  title: 'FAQ - Swift Convert',
  description: 'Frequently asked questions about Swift Convert',
};

export default function FAQ() {
  return (
    <main style={{ background: 'var(--bg)', minHeight: '100vh', padding: '60px 0' }}>
      <article style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px', background: 'var(--card)', borderRadius: '8px', border: '1px solid var(--line)' }}>
        <h1 style={{ fontSize: '2rem', marginBottom: '30px', color: 'var(--ink)' }}>Frequently Asked Questions</h1>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--ink)', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', marginBottom: '15px' }}>General Questions</h2>
          
          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Is Swift Convert really free with unlimited conversions?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Yes, completely free. Convert as many files as you want with no daily limits, no ads, and no hidden fees. We believe everyone deserves access to quality conversion tools. We may offer premium features in the future, but the core service will always remain free.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>How is my data protected and what happens to my files?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Your files are protected using HTTPS encryption during transfer. Files are processed on secure servers and automatically deleted within 1 hour of upload. We never permanently store, backup, analyze, or access your files. We only see file metadata for quality assurance. Your privacy is our top priority.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>What are the file size and upload limits?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>File size limits vary by conversion type: PDF→Image (30MB), Image→PDF (20MB), Compress Image/PDF (15MB), Convert Format (20MB), Edit PDF (30MB per file). These optimized limits ensure fast, reliable processing on our infrastructure. For batch processing, you can upload multiple files subject to the per-file limits.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Do I need to create an account?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>No. You can start converting files immediately without registration. Creating a free account is optional and provides benefits like saving your conversion history, storing conversion presets, getting faster support, and accessing previous downloads for up to 7 days.</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--ink)', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', marginBottom: '15px' }}>Conversion & Technical</h2>
          
          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>What file formats are supported?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>We support PDF, JPG, PNG, WebP, and TIFF formats. You can convert between any of these formats, compress images, edit and optimize PDFs, convert images to PDF, and batch process multiple files together.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Can I edit PDFs? Can I merge or rearrange pages?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Yes! The Edit PDF tool offers two modes: <strong>Merge</strong> (combine 2+ PDFs into one) and <strong>Rearrange & Rotate</strong> (edit a single PDF by reordering pages, rotating pages 90° at a time, and removing unwanted pages). Visual thumbnails make it easy to see and adjust pages before converting.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>How long does conversion typically take?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Most conversions complete in under 2 seconds. Small files usually finish in less than 1 second. Large files (50MB+) may take 5-15 seconds depending on size, format, and processing complexity.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Will I lose quality when converting?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Quality depends on your format choice and settings. PNG maintains 100% quality (lossless compression). JPG and WebP let you choose quality from 50-100%. Most users find 80-85% quality imperceptible from maximum and saves 50-70% file size. For archival or professional work, use PNG or high JPG quality (90%+).</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Can I convert without internet once the files are uploaded?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>No, you need an active internet connection. Our conversion processing happens on our servers, so a continuous connection ensures your files convert reliably and securely. You can work on other things while waiting—no disruption needed.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>What if conversion fails?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>If conversion fails, you&apos;ll get an error message explaining why. Common causes: corrupted file, unsupported file type, or server timeout on very large files. Try re-uploading or check our troubleshooting guide. Contact support if the problem persists.</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--ink)', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', marginBottom: '15px' }}>Account & Premium</h2>
          
          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Do I need to create an account to convert files?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>No account is required. You can start converting immediately as a guest. Creating a free account is optional and enables: saved conversion history, custom presets, download access for up to 7 days, and priority email support.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Are there any limits on free conversions?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Unlimited! You can convert as many files as you want with no daily limits, no throttling, and no ads. The service is completely free for everyone, forever.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Will you offer paid plans in the future?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>We may offer optional premium plans later for power users needing higher limits, priority processing, or advanced features. However, the core service will always remain free with no restrictions.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>How long can I download my converted files?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Converted files are available for download for 1 hour if you don&apos;t have an account. With a free account, you can re-download converted files for up to 7 days. Download immediately for best reliability.</p>
        </div>

        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '1.3rem', color: 'var(--ink)', borderBottom: '2px solid var(--primary)', paddingBottom: '10px', marginBottom: '15px' }}>Legal & Security</h2>
          
          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Can I use converted files for commercial purposes?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Yes, absolutely. You have full rights to use converted files for any purpose&mdash;personal projects, commercial products, resale, or redistribution. No licensing fees, restrictions, or attribution required. The file remains yours to use however you wish.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Is my data secure? What security measures are in place?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Yes, your data is secure. All connections use HTTPS encryption. Files are processed on secure, isolated servers and automatically deleted within 1 hour. We don&apos;t store files permanently, back them up, or grant employees access to them. We never analyze, scan, or use your content for any purpose.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>GDPR and privacy compliance?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>Swift Convert respects privacy rights and operates in compliance with GDPR and other major privacy regulations. We collect minimal data, never track users across websites, and don&apos;t use cookies for advertising. Read our full privacy policy for details.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>What about malware or virus scanning?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>We perform basic security checks but do not provide virus scanning. If you&apos;re concerned about file safety, scan files with your antivirus before uploading. We automatically delete all files after 1 hour regardless of origin.</p>

          <h3 style={{ fontSize: '1.1rem', marginTop: '20px', marginBottom: '10px', color: 'var(--ink)' }}>Is the app open source?</h3>
          <p style={{ color: 'var(--muted)', lineHeight: '1.6' }}>The core conversion library is available open source on GitHub for transparency. The web interface and infrastructure are proprietary. Check our GitHub for contribution opportunities.</p>
        </div>

        <div style={{ background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: '8px', padding: '20px', marginTop: '40px' }}>
          <h3 style={{ marginTop: 0, color: 'var(--primary)' }}>Still have questions?</h3>
          <p style={{ color: 'var(--muted)', margin: '10px 0 0 0' }}>Check our <a href="/docs/troubleshooting" style={{ color: 'var(--primary)', textDecoration: 'none' }}>troubleshooting guide</a> or contact our support team at support@swift-convert.com</p>
        </div>
      </article>
    </main>
  );
}
