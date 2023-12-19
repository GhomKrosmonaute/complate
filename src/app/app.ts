import { loadFilePaths, completeFiles } from "./utils"

export function complate(paths: string[], ignore: string[]): Promise<void> {
  return loadFilePaths(paths, ignore).then(completeFiles)
}
