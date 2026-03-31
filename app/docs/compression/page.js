export const metadata = {
  title: 'Compression Guide - Swift Convert',
  description: 'Learn how to compress PDFs and images effectively',
};

export default function Compression() {
  return (
    <article className="doc-article">
      <h1>Compression Guide</h1>
      
      <p className="lead">
        Reduce file sizes while maintaining quality. Learn how to compress PDFs and images effectively with Swift Convert.
      </p>

      <h2>Why Compress?</h2>
      <ul>
        <li>📧 Attach larger files to emails</li>
        <li>💾 Save storage space</li>
        <li>⚡ Faster downloads and uploads</li>
        <li>🌐 Better website performance</li>
        <li>📱 Mobile-friendly file sizes</li>
      </ul>

      <h2>PDF Compression</h2>
      <h3>How It Works</h3>
      <p>PDF compression using a combination of techniques:</p>
      <ul>
        <li><strong>Image Compression:</strong> Reduces quality of embedded images</li>
        <li><strong>Font Optimization:</strong> Removes unused font glyphs</li>
        <li><strong>Stream Compression:</strong> Uses algorithm-based compression</li>
        <li><strong>Metadata Removal:</strong> Strips unnecessary data</li>
        <li><strong>Object Deduplication:</strong> Removes duplicate content</li>
      </ul>

      <h3>Compression Levels</h3>
      <div className="compression-levels">
        <div className="level">
          <h4>🟢 Low Compression</h4>
          <p><strong>Compression:</strong> 10-15%</p>
          <p><strong>Quality:</strong> No visible difference</p>
          <p><strong>Best for:</strong> Final documents, printing</p>
        </div>
        <div className="level">
          <h4>🟡 Medium Compression</h4>
          <p><strong>Compression:</strong> 30-40%</p>
          <p><strong>Quality:</strong> Minimal difference</p>
          <p><strong>Best for:</strong> Email, general use</p>
        </div>
        <div className="level">
          <h4>🔴 High Compression</h4>
          <p><strong>Compression:</strong> 50-70%</p>
          <p><strong>Quality:</strong> Some quality loss</p>
          <p><strong>Best for:</strong> Storage, archival</p>
        </div>
      </div>

      <h2>Image Compression</h2>
      <h3>Format Selection</h3>
      <table className="comparison-table">
        <thead>
          <tr>
            <th>Format</th>
            <th>Compression</th>
            <th>Quality</th>
            <th>Best For</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong>WebP</strong></td>
            <td>Excellent</td>
            <td>High</td>
            <td>Web, general use</td>
          </tr>
          <tr>
            <td><strong>JPG</strong></td>
            <td>Good</td>
            <td>Medium-High</td>
            <td>Photos, graphics</td>
          </tr>
          <tr>
            <td><strong>PNG</strong></td>
            <td>Fair</td>
            <td>Excellent</td>
            <td>Documents, text</td>
          </tr>
          <tr>
            <td><strong>TIFF</strong></td>
            <td>Poor</td>
            <td>Perfect</td>
            <td>Archival, professional</td>
          </tr>
        </tbody>
      </table>

      <h3>Quality Settings for Images</h3>
      <ul>
        <li><strong>100%:</strong> Lossless or minimal compression</li>
        <li><strong>85%:</strong> Imperceptible quality loss, good compression</li>
        <li><strong>70%:</strong> Small quality loss, excellent compression</li>
        <li><strong>50%:</strong> Visible quality loss, maximum compression</li>
      </ul>

      <h2>Compression Tips</h2>
      <div className="tips-list">
        <div className="tip-item">
          <h4>📊 Choose the Right Format</h4>
          <p>WebP offers the best compression for most images. Use JPG for photos, PNG for documents.</p>
        </div>
        <div className="tip-item">
          <h4>📷 Adjust Quality, Not Size</h4>
          <p>Use quality sliders rather than resizing. Quality 80-85% usually looks identical to 100%.</p>
        </div>
        <div className="tip-item">
          <h4>🖼️ Batch Compress</h4>
          <p>Compress multiple images at once. Apply the same settings to maintain consistency.</p>
        </div>
        <div className="tip-item">
          <h4>📄 Compress Before Sharing</h4>
          <p>Compress PDFs and images before sending via email or uploading to cloud services.</p>
        </div>
        <div className="tip-item">
          <h4>🎨 Consider Your Use Case</h4>
          <p>Documents need higher quality (PNG). Web images can use lower quality (WebP/JPG).</p>
        </div>
        <div className="tip-item">
          <h4>✅ Always Preview</h4>
          <p>Check the preview before conversion to ensure quality meets your expectations.</p>
        </div>
      </div>

      <h2>Real-World Examples</h2>
      <h3>Example 1: Email Attachment</h3>
      <ul>
        <li><strong>Original PDF:</strong> 50MB (with high-quality images)</li>
        <li><strong>Tool:</strong> PDF Compression (Medium)</li>
        <li><strong>Result:</strong> 15MB (70% reduction)</li>
        <li><strong>Quality:</strong> Still looks great when viewed on screen</li>
      </ul>

      <h3>Example 2: Website Images</h3>
      <ul>
        <li><strong>Original Photo:</strong> JPG 2.5MB</li>
        <li><strong>Tool:</strong> Convert to WebP at 80% quality</li>
        <li><strong>Result:</strong> 0.8MB (68% reduction)</li>
        <li><strong>Quality:</strong> Virtually identical to human eye</li>
      </ul>

      <h3>Example 3: Batch Document Processing</h3>
      <ul>
        <li><strong>Original:</strong> 10 PDFs, 200MB total</li>
        <li><strong>Tool:</strong> Batch compress with high compression</li>
        <li><strong>Result:</strong> 60MB total (70% reduction)</li>
        <li><strong>Time Saved:</strong> Hours of manual work</li>
      </ul>

      <h2>When NOT to Compress</h2>
      <ul>
        <li><strong>Professional Printing:</strong> Keep original quality</li>
        <li><strong>Legal Documents:</strong> Maintain highest quality</li>
        <li><strong>Medical Images:</strong> Preserve all details</li>
        <li><strong>Archival:</strong> Store uncompressed originals</li>
      </ul>

      <div className="doc-tip">
        💡 <strong>Pro Tip:</strong> WebP format can reduce image file sizes by up to 35% compared to JPG while maintaining superior quality!
      </div>

      <h2>Related Guides</h2>
      <ul>
        <li><a href="/docs/formats">Learn more about formats</a></li>
        <li><a href="/docs/pdf-conversion">PDF Conversion Guide</a></li>
      </ul>
    </article>
  );
}
