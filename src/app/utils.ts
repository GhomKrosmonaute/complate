import { join, extname } from "path"
import { glob } from "glob"
import { readFile, writeFile } from "fs/promises"

export function getProjectPath(...segment: string[]) {
  return join(process.cwd(), ...segment)
}

export async function loadConfigFile(): Promise<Record<string, () => string>> {
  const configPath = getProjectPath("complate.js")
  return import(configPath)
}

export function loadFilePaths(paths: string[], ignore: string[]) {
  return glob(paths, { ignore, cwd: process.cwd() })
}

export async function completeFiles(filepaths: string[]): Promise<void> {
  let config: Record<string, () => string> | null

  try {
    config = await loadConfigFile()
  } catch (err) {
    config = null
  }

  for (const filepath of filepaths) {
    const ext = extname(filepath)

    let commentType: { start: string; end: string }

    try {
      commentType = getCommentType(ext)
    } catch (err) {
      continue
    }

    const content = await readFile(filepath, "utf-8")

    const regex = new RegExp(
      `${escapeRegExp(
        commentType.start,
      )}\\s*([a-z]+?)\\s*=\\s*(.*?)\\s*${escapeRegExp(
        commentType.end,
      )}.*?${escapeRegExp(commentType.start)}\\s*\\1\\s*${escapeRegExp(
        commentType.end,
      )}`,
      "isg",
    )

    const newContent = content.replace(regex, (_, key, exp) => {
      return `${commentType.start} ${key} = ${exp} ${commentType.end} ${
        config?.[key]?.() ?? eval(exp)
      } ${commentType.start} ${key} ${commentType.end}`
    })

    await writeFile(filepath, newContent, "utf-8")
  }
}

export function getCommentType(ext: string) {
  if (
    ext === ".ts" ||
    ext === ".tsx" ||
    ext === ".js" ||
    ext === ".jsx" ||
    ext === ".css" ||
    ext === ".scss" ||
    ext === ".sass" ||
    ext === ".c" ||
    ext === ".java" ||
    ext === ".go" ||
    ext === ".php" ||
    ext === ".kt"
  ) {
    return {
      start: "/*",
      end: "*/",
    }
  }

  if (ext === ".html" || ext === ".htmx" || ext === ".xml" || ext === ".svg") {
    return {
      start: "<!--",
      end: "-->",
    }
  }

  if (ext === ".rb" || ext === ".pl") {
    return {
      start: "=begin",
      end: "=end",
    }
  }

  if (ext === ".py") {
    return {
      start: '"""',
      end: '"""',
    }
  }

  if (ext === ".hs") {
    return {
      start: "{-",
      end: "-}",
    }
  }

  if (ext === ".lua") {
    return {
      start: "--[[",
      end: "--]]",
    }
  }

  throw new Error(`Unsupported file extension: ${ext}`)
}

export function escapeRegExp(string: string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}
