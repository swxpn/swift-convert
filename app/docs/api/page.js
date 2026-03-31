export const metadata = {
  title: 'API Documentation - Swift Convert',
  description: 'Integrate Swift Convert with your applications using our API',
};

export default function ApiDocumentation() {
  return (
    <article className="doc-article">
      <h1>API Documentation</h1>
      
      <p className="lead">
        Integrate Swift Convert into your applications with our simple REST API. Automate file conversions programmatically.
      </p>

      <h2>Base URL</h2>
      <code className="code-block">https://swift-convert.vercel.app/api</code>

      <h2>Authentication</h2>
      <p>API requests require an API key. Include it in the authorization header:</p>
      <code className="code-block">Authorization: Bearer YOUR_API_KEY</code>

      <h2>Endpoints</h2>
      <h3>1. Convert File</h3>
      <p><strong>POST</strong> <code>/convert</code></p>
      <p>Convert a file from one format to another.</p>
      <div className="code-example">
        <p><strong>Request:</strong></p>
        <pre>{`{
  "file": "base64_encoded_file_content",
  "from_format": "pdf",
  "to_format": "jpg",
  "quality": 85
}`}</pre>
      </div>
      <div className="code-example">
        <p><strong>Response (Success):</strong></p>
        <pre>{`{
  "status": "success",
  "file": "base64_encoded_file_content",
  "filename": "converted_file.jpg",
  "size_bytes": 1024,
  "processing_time_ms": 250
}`}</pre>
      </div>

      <h3>2. Batch Convert</h3>
      <p><strong>POST</strong> <code>/batch-convert</code></p>
      <p>Convert multiple files in one request.</p>
      <div className="code-example">
        <p><strong>Request:</strong></p>
        <pre>{`{
  "files": [
    {"content": "base64_content", "name": "file1.pdf"},
    {"content": "base64_content", "name": "file2.pdf"}
  ],
  "from_format": "pdf",
  "to_format": "png",
  "quality": 90
}`}</pre>
      </div>

      <h3>3. Get Supported Formats</h3>
      <p><strong>GET</strong> <code>/formats</code></p>
      <p>Retrieve list of supported formats and conversions.</p>
      <div className="code-example">
        <p><strong>Response:</strong></p>
        <pre>{`{
  "formats": ["pdf", "jpg", "png", "webp", "tiff"],
  "conversions": {
    "pdf": ["jpg", "png", "webp"],
    "jpg": ["png", "pdf", "webp"]
  }
}`}</pre>
      </div>

      <h2>Error Handling</h2>
      <p>All error responses follow this format:</p>
      <div className="code-example">
        <pre>{`{
  "status": "error",
  "code": "UNSUPPORTED_FORMAT",
  "message": "Conversion from xyz to abc is not supported"
}`}</pre>
      </div>

      <h3>Common Error Codes</h3>
      <ul>
        <li><code>INVALID_API_KEY</code> - API key missing or invalid</li>
        <li><code>UNSUPPORTED_FORMAT</code> - Format conversion not supported</li>
        <li><code>FILE_TOO_LARGE</code> - File exceeds size limit (100MB)</li>
        <li><code>INVALID_FILE</code> - File corrupted or invalid</li>
        <li><code>PROCESSING_ERROR</code> - Server error during conversion</li>
      </ul>

      <h2>Rate Limiting</h2>
      <ul>
        <li><strong>Free Tier:</strong> 100 conversions/day</li>
        <li><strong>Pro Tier:</strong> 1,000 conversions/day</li>
        <li><strong>Enterprise:</strong> Custom limits</li>
      </ul>

      <h2>Examples</h2>
      <h3>JavaScript/Node.js</h3>
      <pre className="code-block">{`const fs = require('fs');

async function convertFile() {
  const fileContent = fs.readFileSync('document.pdf');
  const base64 = fileContent.toString('base64');
  
  const response = await fetch('https://swift-convert.vercel.app/api/convert', {
    method: 'POST',
    headers: {
      'Authorization': 'Bearer YOUR_API_KEY',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      file: base64,
      from_format: 'pdf',
      to_format: 'jpg',
      quality: 85
    })
  });
  
  const result = await response.json();
  if (result.status === 'success') {
    const outputFile = Buffer.from(result.file, 'base64');
    const dir = 'output';
    const filename = result.filename;
    fs.writeFileSync(dir + '/' + filename, outputFile);
  }
}

convertFile();`}</pre>

      <h3>Python</h3>
      <pre className="code-block">{`import requests
import base64

def convert_file():
    with open('document.pdf', 'rb') as f:
        file_content = base64.b64encode(f.read()).decode()
    
    response = requests.post(
        'https://swift-convert.vercel.app/api/convert',
        headers={
            'Authorization': 'Bearer YOUR_API_KEY',
            'Content-Type': 'application/json'
        },
        json={
            &apos;file&apos;: file_content,
            &apos;from_format&apos;: &apos;pdf&apos;,
            'to_format': 'jpg',
            'quality': 85
        }
    )
    
    result = response.json()
    if result['status'] == 'success':
        output_dir = 'output'
        filename = result['filename']
        filepath = output_dir + '/' + filename
        with open(filepath, 'wb') as f:
            f.write(base64.b64decode(result['file']))

convert_file()`}</pre>

      <h2>Use Cases</h2>
      <ul>
        <li>📊 <strong>Reporting Tools:</strong> Auto-convert PDFs to images for web display</li>
        <li>🖼️ <strong>Image Galleries:</strong> Batch process and optimize images</li>
        <li>📧 <strong>Email Systems:</strong> Convert attachments automatically</li>
        <li>📱 <strong>Mobile Apps:</strong> Stream conversions on demand</li>
        <li>⚙️ <strong>Workflows:</strong> Integrate into CI/CD pipelines</li>
      </ul>

      <h2>Best Practices</h2>
      <ul>
        <li>✅ Always use HTTPS for API calls</li>
        <li>✅ Implement exponential backoff for retries</li>
        <li>✅ Cache API keys securely</li>
        <li>✅ Monitor rate limits and implement queuing</li>
        <li>✅ Handle errors gracefully</li>
        <li>❌ Don&apos;t embed API keys in frontend code</li>
        <li>❌ Don&apos;t store converted files in public directories</li>
      </ul>

      <div className="doc-tip">
        💡 <strong>Pro Tip:</strong> For high-volume conversions, implement a queue system to stay within rate limits and handle errors gracefully.
      </div>

      <h2>Support</h2>
      <p>For API questions or issues, contact our support team at <code>api@swift-convert.com</code></p>
    </article>
  );
}
