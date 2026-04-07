export const metadata = {
  title: 'Troubleshooting - Swift Convert',
  description: 'Solutions to common issues with Swift Convert',
};

export default function Troubleshooting() {
  return (
    <article className="doc-article">
      <h1>Troubleshooting</h1>
      
      <p className="lead">
        Having issues with conversions? Find solutions for common problems below.
      </p>

      <h2>Upload Issues</h2>
      <h3>File won&apos;t upload</h3>
      <ul>
        <li>Check file size (limits vary: PDF→Image 30MB, Image→PDF 20MB, Compress 15MB, Edit PDF 30MB)</li>
        <li>Verify file format is supported</li>
        <li>Try refreshing the page</li>
        <li>Check your internet connection</li>
        <li>Try a different browser</li>
      </ul>

      <h3>File upload is very slow</h3>
      <ul>
        <li>Check your internet connection speed</li>
        <li>Try breaking large files into smaller pieces</li>
        <li>Use wired connection instead of WiFi</li>
        <li>Try uploading during off-peak hours</li>
      </ul>

      <h2>Conversion Issues</h2>
      <h3>Conversion fails or times out</h3>
      <ul>
        <li>Try a smaller file first</li>
        <li>Check file isn&apos;t corrupted (try opening it locally)</li>
        <li>Use lower quality settings</li>
        <li>Refresh page and retry</li>
        <li>Contact support with error details</li>
      </ul>

      <h3>Quality is poor after conversion</h3>
      <ul>
        <li>Increase quality setting (85-90%)</li>
        <li>Switch to PNG for documents/text</li>
        <li>Check if original file is high quality</li>
        <li>Try different output format</li>
      </ul>

      <h3>Output file size is too large</h3>
      <ul>
        <li>Use WebP format instead of PNG/JPG</li>
        <li>Lower quality setting (70-75%)</li>
        <li>Resize image before conversion</li>
        <li>For PDFs, use high compression level</li>
      </ul>

      <h2>Download Issues</h2>
      <h3>Download doesn&apos;t start</h3>
      <ul>
        <li>Check browser pop-up blockers</li>
        <li>Allow downloads in browser settings</li>
        <li>Try using different browser</li>
        <li>Check if file is still available (files expire after 1 hour)</li>
      </ul>

      <h3>Downloaded file is corrupted</h3>
      <ul>
        <li>Try converting again</li>
        <li>Try different output format</li>
        <li>Check if download completed fully</li>
        <li>Verify file permissions</li>
      </ul>

      <h2>Format-Specific Issues</h2>
      <h3>PDF conversion produces no images</h3>
      <ul>
        <li>Check PDF isn&apos;t password protected</li>
        <li>Try opening PDF locally first</li>
        <li>Try uploading in different format</li>
        <li>Contact support if continues</li>
      </ul>

      <h3>PNG text becomes blurry</h3>
      <ul>
        <li>Increase quality to maximum</li>
        <li>Ensure original file is high quality</li>
        <li>Try different conversion quality settings</li>
        <li>Use PDF format for text documents</li>
      </ul>

      <h3>JPG quality is worse than expected</h3>
      <ul>
        <li>Set quality to 90%+</li>
        <li>Compare with original visually</li>
        <li>Try PNG format instead</li>
        <li>Consider WebP for better quality-size ratio</li>
      </ul>

      <h2>PDF Editing Issues</h2>
      <h3>Page previews not showing</h3>
      <ul>
        <li>Wait for preview generation to complete (⏳ indicator)</li>
        <li>Check PDF isn&apos;t corrupted or password-protected</li>
        <li>Try a different PDF file</li>
        <li>Refresh page and try again</li>
      </ul>

      <h3>Can&apos;t drag pages to reorder</h3>
      <ul>
        <li>Make sure you&apos;re dragging within the thumbnail grid</li>
        <li>Try a different browser (some browsers have better drag support)</li>
        <li>Check that thumbnails are fully loaded before dragging</li>
        <li>Use rotation and remove buttons if drag-and-drop isn&apos;t working</li>
      </ul>

      <h3>Pages not rotating correctly</h3>
      <ul>
        <li>Click the 🔄 button to rotate 90° each time</li>
        <li>You can rotate multiple times (0°, 90°, 180°, 270°)</li>
        <li>Refresh page if rotation doesn&apos;t appear</li>
      </ul>

      <h3>Merged PDF pages are in wrong order</h3>
      <ul>
        <li>Check upload order - files merge in the order selected</li>
        <li>Remove all files and upload again in correct order</li>
        <li>Select PDFs one at a time rather than batch selecting</li>
      </ul>

      <h3>Edited PDF looks wrong after conversion</h3>
      <ul>
        <li>Check rotation settings are correct for each page</li>
        <li>Verify page order in thumbnail view before converting</li>
        <li>For complex edits, convert to images first (PDF→Image), then create new PDF</li>
      </ul>

      <h2>Browser Compatibility</h2>
      <p>Swift Convert works best on modern browsers:</p>
      <ul>
        <li>✅ Chrome 90+</li>
        <li>✅ Firefox 88+</li>
        <li>✅ Safari 14+</li>
        <li>✅ Edge 90+</li>
        <li>⚠️ IE 11 not supported</li>
      </ul>

      <h2>Privacy & Data Issues</h2>
      <h3>Where are my files stored?</h3>
      <p>Files are never stored permanently. They are:</p>
      <ul>
        <li>✅ Processed on secure servers</li>
        <li>✅ Deleted immediately after conversion</li>
        <li>✅ Not backed up or logged</li>
        <li>✅ Never shared or analyzed</li>
      </ul>

      <h3>How long can I download my file?</h3>
      <ul>
        <li>Converted files available for 1 hour</li>
        <li>After 1 hour, files are automatically deleted</li>
        <li>Re-convert if needed after expiration</li>
        <li>Download immediately after conversion</li>
      </ul>

      <h2>Getting More Help</h2>
      <div className="help-section">
        <h3>📧 Email Support</h3>
        <p>Contact us at <code>support@swift-convert.com</code> with:</p>
        <ul>
          <li>Description of the issue</li>
          <li>File type and size</li>
          <li>Browser and operating system</li>
          <li>Error message (if any)</li>
        </ul>
      </div>

      <div className="help-section">
        <h3>💬 Live Chat</h3>
        <p>Click the chat icon in the bottom right for instant support during business hours.</p>
      </div>

      <div className="help-section">
        <h3>📚 Documentation</h3>
        <p>Check these guides for more information:</p>
        <ul>
          <li><a href="/docs/formats">Supported Formats</a></li>
          <li><a href="/docs/compression">Compression Guide</a></li>
          <li><a href="/docs/getting-started">Getting Started</a></li>
        </ul>
      </div>

      <div className="doc-tip">
        💡 <strong>Pro Tip:</strong> Clear your browser cache and cookies if you experience persistent issues.
      </div>
    </article>
  );
}
