const fs = require('fs')
const path = require('path')

const REQUIRED_ARTICLE_COLUMNS = [
  'cover',
  'cardCover',
  'description',
  'likeCount',
  'musicId',
  'musicName',
]

const SQL_TARGETS = [
  'server/db/prod_full_init.sql',
  'server/db/prod_full_import.sql',
]

function readFile(relativePath) {
  const absolutePath = path.join(process.cwd(), relativePath)
  return {
    relativePath,
    content: fs.readFileSync(absolutePath, 'utf8'),
  }
}

function hasArticleColumn(content, column) {
  const createColumn = new RegExp(String.raw`\`${column}\`\s+[a-zA-Z]`, 'i')
  const alterColumn = new RegExp(String.raw`ADD COLUMN\s+\`${column}\``, 'i')
  return createColumn.test(content) || alterColumn.test(content)
}

let hasError = false

for (const target of SQL_TARGETS) {
  const { relativePath, content } = readFile(target)
  const missing = REQUIRED_ARTICLE_COLUMNS.filter(column => !hasArticleColumn(content, column))

  if (missing.length > 0) {
    hasError = true
    console.error(`${relativePath}: missing article columns -> ${missing.join(', ')}`)
    continue
  }

  console.log(`${relativePath}: ok`)
}

process.exit(hasError ? 1 : 0)
