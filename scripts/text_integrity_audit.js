const fs = require('fs')
const path = require('path')

const ROOT = process.cwd()
const TARGET_DIRS = ['server', 'src', 'scripts']
const INCLUDED_EXTENSIONS = new Set([
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.sql',
  '.md',
  '.yaml',
  '.yml',
])

const EXCLUDED_DIRS = new Set([
  '.git',
  '.next',
  'node_modules',
  'dist',
  'coverage',
  'public',
  'uploads',
  'vendor',
  'tmp',
  'temp',
  'logs',
  'netease_api',
])

const EXCLUDED_FILES = new Set([
  'scripts/text_integrity_audit.js',
  'server/test.sql',
  'server/db/test.sql',
  'server/db/prod_full_import.sql',
])

const SUSPICIOUS_PATTERNS = [
  { type: 'replacement-character', regex: /\uFFFD/ },
  { type: 'common-mojibake-fragment', regex: /(å°|æ–|ç‚|é|å›|ç‰|æœ|é”|é¡|Ã.|Â.|ðŸ)/ },
  { type: 'comment-merged-route', regex: /\/\/.*\brouter\.(get|post|put|delete)\s*\(/ },
  { type: 'comment-merged-export', regex: /\/\/.*\bmodule\.exports\b/ },
]

const findings = []
const scannedFiles = []
const skippedRoots = []

function shouldSkipDir(dirname) {
  return EXCLUDED_DIRS.has(dirname)
}

function walk(dir) {
  const absoluteDir = path.join(ROOT, dir)
  if (!fs.existsSync(absoluteDir)) {
    skippedRoots.push(dir)
    return
  }

  const entries = fs.readdirSync(absoluteDir, { withFileTypes: true })
  for (const entry of entries) {
    const fullPath = path.join(absoluteDir, entry.name)
    const relativePath = path.relative(ROOT, fullPath).replace(/\\/g, '/')

    if (entry.isDirectory()) {
      if (shouldSkipDir(entry.name)) continue
      walk(relativePath)
      continue
    }

    if (!entry.isFile()) continue
    if (!INCLUDED_EXTENSIONS.has(path.extname(entry.name))) continue

    scannedFiles.push(relativePath)
    inspectFile(relativePath, fullPath)
  }
}

function inspectFile(relativePath, fullPath) {
  if (EXCLUDED_FILES.has(relativePath)) return

  const content = fs.readFileSync(fullPath, 'utf8')
  const lines = content.split(/\r?\n/)

  lines.forEach((line, index) => {
    for (const pattern of SUSPICIOUS_PATTERNS) {
      if (!pattern.regex.test(line)) continue

      findings.push({
        file: relativePath,
        line: index + 1,
        type: pattern.type,
        preview: line.trim().slice(0, 200),
      })
      break
    }
  })
}

for (const dir of TARGET_DIRS) {
  walk(dir)
}

if (findings.length === 0) {
  console.log(`text-integrity-audit: ok (${scannedFiles.length} files scanned)`)
  process.exit(0)
}

console.log(`text-integrity-audit: ${findings.length} suspicious line(s) in ${new Set(findings.map(item => item.file)).size} file(s)`)
console.log(`scanned roots: ${TARGET_DIRS.join(', ')}`)
if (skippedRoots.length) {
  console.log(`missing roots skipped: ${skippedRoots.join(', ')}`)
}

for (const finding of findings) {
  console.log(`${finding.file}:${finding.line} [${finding.type}] ${finding.preview}`)
}

process.exit(1)
