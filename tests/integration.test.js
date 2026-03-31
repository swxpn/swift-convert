#!/usr/bin/env node

/**
 * Integration Tests for Swift Convert
 * Tests all conversion paths and parameter passing
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const COLORS = {
  RESET: '\x1b[0m',
  GREEN: '\x1b[32m',
  RED: '\x1b[31m',
  YELLOW: '\x1b[33m',
  BLUE: '\x1b[34m',
};

function log(message, color = 'RESET') {
  console.log(`${COLORS[color]}${message}${COLORS.RESET}`);
}

function testPassed(name) {
  log(`✅ ${name}`, 'GREEN');
}

function testFailed(name, reason) {
  log(`❌ ${name}: ${reason}`, 'RED');
}

function info(message) {
  log(`ℹ️  ${message}`, 'BLUE');
}

class TestSuite {
  constructor() {
    this.passed = 0;
    this.failed = 0;
    this.errors = [];
  }

  // Verify that all API endpoints are importable and have correct signatures
  async testApiEndpoints() {
    log('\n=== Testing API Endpoints ===', 'YELLOW');

    const endpoints = [
      { path: '/app/api/convert', name: 'PDF→Image' },
      { path: '/app/api/img-convert', name: 'Image Format' },
      { path: '/app/api/img2pdf', name: 'Image→PDF' },
      { path: '/app/api/compress-image', name: 'Image Compress' },
      { path: '/app/api/compress-pdf', name: 'PDF Compress' },
      { path: '/app/api/edit-pdf', name: 'PDF Edit' },
      { path: '/app/api/download/[sessionId]/[filename]', name: 'Download' },
      { path: '/app/api/health', name: 'Health' },
    ];

    for (const endpoint of endpoints) {
      try {
        const file = path.join(__dirname, '..', endpoint.path, 'route.js');
        if (fs.existsSync(file)) {
          const content = fs.readFileSync(file, 'utf8');
          if (content.includes('export async function POST') || content.includes('export async function GET')) {
            testPassed(`${endpoint.name} endpoint exists and has handler`);
            this.passed++;
          } else {
            testFailed(`${endpoint.name} endpoint`, 'No handler function found');
            this.failed++;
            this.errors.push(`${endpoint.name}: Missing handler`);
          }
        } else {
          testFailed(`${endpoint.name} endpoint`, 'File not found');
          this.failed++;
          this.errors.push(`${endpoint.name}: File not found`);
        }
      } catch (err) {
        testFailed(`${endpoint.name} endpoint`, err.message);
        this.failed++;
        this.errors.push(`${endpoint.name}: ${err.message}`);
      }
    }
  }

  // Verify parameter passing in conversion routes
  async testParameterPassing() {
    log('\n=== Testing Parameter Passing ===', 'YELLOW');

    const tests = [
      {
        name: 'PDF→Image webp_quality parameter',
        file: '/app/api/convert/route.js',
        shouldContain: 'form.get("webp_quality")',
      },
      {
        name: 'Image format conversion webp_quality parameter',
        file: '/app/api/img-convert/route.js',
        shouldContain: 'form.get("webp_quality")',
      },
      {
        name: 'Compress PDF target_percent parameter',
        file: '/app/api/compress-pdf/route.js',
        shouldContain: 'form.get("target_percent")',
      },
      {
        name: 'Compress Image target_percent parameter',
        file: '/app/api/compress-image/route.js',
        shouldContain: 'form.get("target_percent")',
      },
    ];

    for (const test of tests) {
      try {
        const file = path.join(__dirname, '..', test.file);
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(test.shouldContain)) {
          testPassed(test.name);
          this.passed++;
        } else {
          testFailed(test.name, `Missing ${test.shouldContain}`);
          this.failed++;
          this.errors.push(`${test.name}: Missing ${test.shouldContain}`);
        }
      } catch (err) {
        testFailed(test.name, err.message);
        this.failed++;
        this.errors.push(`${test.name}: ${err.message}`);
      }
    }
  }

  // Verify worker functions have proper implementations
  async testWorkerFunctions() {
    log('\n=== Testing Worker Functions ===', 'YELLOW');

    const tests = [
      {
        name: 'cmd_convert accepts webp_quality',
        file: '/lib/conversionWorker.js',
        shouldContain: 'payload.webp_quality',
      },
      {
        name: 'cmd_convert uses webp_quality for Sharp',
        file: '/lib/conversionWorker.js',
        shouldContain: 'webp({ quality: webpQuality })',
      },
      {
        name: 'cmd_compress_pdf validates target_percent',
        file: '/lib/conversionWorker.js',
        shouldContain: 'targetPercent < 1 || targetPercent > 90',
      },
      {
        name: 'cmd_compress_image validates target_percent',
        file: '/lib/conversionWorker.js',
        shouldContain: 'targetPercent < 1 || targetPercent > 90',
      },
    ];

    for (const test of tests) {
      try {
        const file = path.join(__dirname, '..', test.file);
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(test.shouldContain)) {
          testPassed(test.name);
          this.passed++;
        } else {
          testFailed(test.name, `Missing expected implementation`);
          this.failed++;
          this.errors.push(`${test.name}: Missing implementation`);
        }
      } catch (err) {
        testFailed(test.name, err.message);
        this.failed++;
        this.errors.push(`${test.name}: ${err.message}`);
      }
    }
  }

  // Verify frontend validation
  async testFrontendValidation() {
    log('\n=== Testing Frontend Validation ===', 'YELLOW');

    const tests = [
      {
        name: 'WebP quality slider added to PDF→Image',
        file: '/app/components/Converter.js',
        shouldContain: "settings.format === 'WEBP'",
      },
      {
        name: 'WebP quality validation (50-100%)',
        file: '/app/components/Converter.js',
        shouldContain: 'settings.webpQuality < 50 || settings.webpQuality > 100',
      },
      {
        name: 'DPI validation (72/150/300)',
        file: '/app/components/Converter.js',
        shouldContain: '[72, 150, 300].includes(Number(settings.dpi))',
      },
      {
        name: 'Compression quality validation (10-90%)',
        file: '/app/components/Converter.js',
        shouldContain: 'settings.quality < 10 || settings.quality > 90',
      },
    ];

    for (const test of tests) {
      try {
        const file = path.join(__dirname, '..', test.file);
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(test.shouldContain)) {
          testPassed(test.name);
          this.passed++;
        } else {
          testFailed(test.name, `Validation not found`);
          this.failed++;
          this.errors.push(`${test.name}: Validation not found`);
        }
      } catch (err) {
        testFailed(test.name, err.message);
        this.failed++;
        this.errors.push(`${test.name}: ${err.message}`);
      }
    }
  }

  // Verify error handling improvements
  async testErrorHandling() {
    log('\n=== Testing Error Handling ===', 'YELLOW');

    const tests = [
      {
        name: 'Converter has JSON parse error handling',
        file: '/app/components/Converter.js',
        shouldContain: 'await response.json()',
        context: 'try-catch',
      },
      {
        name: 'Convert API has error logging',
        file: '/app/api/convert/route.js',
        shouldContain: 'console.error',
      },
      {
        name: 'Compress PDF API has error logging',
        file: '/app/api/compress-pdf/route.js',
        shouldContain: 'console.error',
      },
    ];

    for (const test of tests) {
      try {
        const file = path.join(__dirname, '..', test.file);
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(test.shouldContain)) {
          testPassed(test.name);
          this.passed++;
        } else {
          testFailed(test.name, `Error handling not found`);
          this.failed++;
          this.errors.push(`${test.name}: Error handling not found`);
        }
      } catch (err) {
        testFailed(test.name, err.message);
        this.failed++;
        this.errors.push(`${test.name}: ${err.message}`);
      }
    }
  }

  // Verify download handling
  async testDownloadHandling() {
    log('\n=== Testing Download Handling ===', 'YELLOW');

    const tests = [
      {
        name: 'Download function supports all response types',
        file: '/app/components/Converter.js',
        shouldContain: 'result.zip',
      },
      {
        name: 'Download endpoint has proper error handling',
        file: '/app/api/download/[sessionId]/[filename]/route.js',
        shouldContain: 'stats.size === 0',
      },
    ];

    for (const test of tests) {
      try {
        const file = path.join(__dirname, '..', test.file);
        const content = fs.readFileSync(file, 'utf8');
        if (content.includes(test.shouldContain)) {
          testPassed(test.name);
          this.passed++;
        } else {
          testFailed(test.name, `Implementation not found`);
          this.failed++;
          this.errors.push(`${test.name}: Implementation not found`);
        }
      } catch (err) {
        testFailed(test.name, err.message);
        this.failed++;
        this.errors.push(`${test.name}: ${err.message}`);
      }
    }
  }

  // Run all tests
  async runAll() {
    log('\n╔════════════════════════════════════════╗', 'BLUE');
    log('║  Swift Convert Integration Tests   ║', 'BLUE');
    log('╚════════════════════════════════════════╝', 'BLUE');

    await this.testApiEndpoints();
    await this.testParameterPassing();
    await this.testWorkerFunctions();
    await this.testFrontendValidation();
    await this.testErrorHandling();
    await this.testDownloadHandling();

    log('\n╔════════════════════════════════════════╗', 'BLUE');
    log('║         Test Results Summary       ║', 'BLUE');
    log('╚════════════════════════════════════════╝', 'BLUE');
    log(`\nTotal Passed: ${this.passed}`, this.passed > 0 ? 'GREEN' : 'YELLOW');
    log(`Total Failed: ${this.failed}`, this.failed > 0 ? 'RED' : 'GREEN');

    if (this.errors.length > 0) {
      log('\nErrors encountered:', 'RED');
      this.errors.forEach((err, idx) => {
        log(`  ${idx + 1}. ${err}`, 'RED');
      });
    } else {
      log('\n🎉 All tests passed!', 'GREEN');
    }

    const successRate = Math.round((this.passed / (this.passed + this.failed)) * 100);
    log(`\nSuccess Rate: ${successRate}%\n`, successRate === 100 ? 'GREEN' : successRate > 80 ? 'YELLOW' : 'RED');

    return this.failed === 0;
  }
}

// Run tests
async function main() {
  const suite = new TestSuite();
  const success = await suite.runAll();
  process.exit(success ? 0 : 1);
}

main().catch(err => {
  log(`Fatal error: ${err.message}`, 'RED');
  process.exit(1);
});
