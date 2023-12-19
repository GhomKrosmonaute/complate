import { Command, Flags, Args } from "@oclif/core"
import Listr from "listr"

import { loadFilePaths, completeFiles } from "../app/utils"

export class Complate extends Command {
  static args = {
    paths: Args.string({
      default: "./",
    }),
  }

  static flags = {
    ignore: Flags.string({
      default: "node_modules/**",
    }),
  }

  async run() {
    const { args, flags } = await this.parse(Complate)

    let filepaths: string[]

    const tasks = new Listr([
      {
        title: "Loading files",
        task: async () => {
          filepaths = await loadFilePaths(
            args.paths.split(/[;,]/g),
            flags.ignore.split(/[;,]/g),
          )
        },
      },
      {
        title: "Complete files",
        task: () => completeFiles(filepaths),
      },
    ])

    await tasks.run()

    process.exit(0)
  }
}
