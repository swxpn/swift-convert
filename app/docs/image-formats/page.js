export const metadata = {
  title: 'Image Tools Guide - Swift Convert',
  description: 'Learn how to use image conversion and editing tools',
};

export default function ImageFormats() {
  return (
    <article className="doc-article">
      <h1>Image Tools Guide</h1>
      
      <p className="lead">
        Master image conversion with Swift Convert. Learn best practices for different image types and use cases.
      </p>

      <h2>Image Format Overview</h2>
      <p>Different image formats have different strengths. Choose based on your content and use case.</p>

      <h3>JPG Format</h3>
      <ul>
        <li>✅ Best for photographs and complex graphics</li>
        <li>✅ Uses lossy compression (smaller file size)</li>
        <li>❌ Not ideal for text or sharp edges</li>
        <li>📊 Typical file size: 30-50% of PNG</li>
        <li>💾 Supports quality adjustment: 50%-100%</li>
      </ul>

      <h3>PNG Format</h3>
      <ul>
        <li>✅ Best for documents, screenshots, and text</li>
        <li>✅ Uses lossless compression (no quality loss)</li>
        <li>✅ Supports transparency (alpha channel)</li>
        <li>❌ Larger file sizes than JPG</li>
        <li>💾 Perfect for graphics with sharp edges</li>
      </ul>

      <h3>WebP Format</h3>
      <ul>
        <li>✅ Modern format with excellent compression</li>
        <li>✅ 25-35% smaller than JPG, better quality</li>
        <li>✅ Supports transparency like PNG</li>
        <li>✅ Perfect for web use</li>
        <li>📊 Recommended for modern websites</li>
      </ul>

      <h3>TIFF Format</h3>
      <ul>
        <li>✅ Used in professional photography and printing</li>
        <li>✅ Can be lossless or lossy</li>
        <li>✅ Supports high bit-depths</li>
        <li>❌ Very large file sizes</li>
        <li>💼 Best for archival and professional work</li>
      </ul>

      <h2>Conversion Best Practices</h2>
      <h3>Converting to JPG</h3>
      <ul>
        <li>Best for: Photographs, scanned images, artwork</li>
        <li>Quality setting: 85-90% recommended</li>
        <li>Avoid for: Screenshots, diagrams, text-heavy content</li>
        <li>Tip: Run a quality comparison before finalizing</li>
      </ul>

      <h3>Converting to PNG</h3>
      <ul>
        <li>Best for: Documents, screenshots, text, logos</li>
        <li>Quality: Always lossless</li>
        <li>Transparency: Preserved if original supports it</li>
        <li>Tip: Ideal for archiving important documents</li>
      </ul>

      <h3>Converting to WebP</h3>
      <ul>
        <li>Best for: Web images, blogs, social media</li>
        <li>Quality: Can achieve 80-90% quality with 50% size reduction</li>
        <li>Compatibility: Supported in all modern browsers</li>
        <li>Tip: Use for faster website loading times</li>
      </ul>

      <h2>Common Scenarios</h2>
      <div className="scenarios">
        <div className="scenario">
          <h4>📸 Converting Phone Photos</h4>
          <p><strong>Best Format:</strong> WebP (web) or JPG (email sharing)</p>
          <p>Phone photos are typically 5-8MB. Convert to WebP for web (0.5-1MB) or JPG for sharing.</p>
        </div>
        <div className="scenario">
          <h4>📄 Converting Scanned Documents</h4>
          <p><strong>Best Format:</strong> PNG</p>
          <p>PNG preserves text sharpness. Use high quality to maintain readability.</p>
        </div>
        <div className="scenario">
          <h4>🎨 Converting Graphics/Logos</h4>
          <p><strong>Best Format:</strong> PNG</p>
          <p>PNG handles solid colors well. Transparency support makes it perfect for logos.</p>
        </div>
        <div className="scenario">
          <h4>🌐 Converting for Website</h4>
          <p><strong>Best Format:</strong> WebP (primary) or JPG (fallback)</p>
          <p>WebP offers best quality-to-size ratio for web.</p>
        </div>
      </div>

      <h2>Image Optimization Tips</h2>
      <ul>
        <li><strong>Resize before converting:</strong> Reduce dimensions for smaller files</li>
        <li><strong>Use quality sliders:</strong> 80-85% usually indistinguishable from 100%</li>
        <li><strong>Choose right format:</strong> Match format to content type</li>
        <li><strong>Test quality:</strong> Preview before finalizing conversion</li>
        <li><strong>Batch process:</strong> Convert multiple images together</li>
        <li><strong>Remove metadata:</strong> Strip EXIF data for smaller files</li>
      </ul>

      <h2>Batch Image Processing</h2>
      <p>Convert multiple images at once:</p>
      <ol>
        <li>Upload 2-50 images simultaneously</li>
        <li>Select output format and quality</li>
        <li>Apply same settings to all images</li>
        <li>Download as ZIP file</li>
        <li>Extract and use immediately</li>
      </ol>
      <p><strong>Perfect for:</strong> Website updates, social media batches, bulk scanning projects</p>

      <h2>Troubleshooting</h2>
      <h3>Image looks blurry after conversion?</h3>
      <ul>
        <li>Increase quality setting (85-90%)</li>
        <li>Try PNG format instead of JPG</li>
        <li>Check original image quality</li>
      </ul>

      <h3>File size too large?</h3>
      <ul>
        <li>Use WebP instead of JPG/PNG</li>
        <li>Lower quality setting (70-75%)</li>
        <li>Reduce image dimensions</li>
      </ul>

      <h3>Colors look wrong?</h3>
      <ul>
        <li>Check original file format</li>
        <li>Increase quality setting</li>
        <li>Try PNG format for accurate colors</li>
      </ul>

      <div className="doc-tip">
        💡 <strong>Pro Tip:</strong> For most web use, WebP at 80% quality provides imperceptible quality loss while achieving 50-70% file size reduction!
      </div>
    </article>
  );
}
