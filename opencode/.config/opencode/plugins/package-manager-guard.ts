import fs from "node:fs"
import path from "node:path"
import type { Plugin } from "@opencode-ai/plugin"

type PackageManager = "npm" | "pnpm" | "yarn" | "bun"

interface GuardOptions {
  // OpenCode hook API has no direct confirmation prompt here. Treat this as the
  // user's explicit confirmation that lockfile inference may update package.json.
  readonly inferFromLockfile?: boolean
}

interface ProjectPackageManager {
  readonly manager: PackageManager
  readonly source: "packageManager" | "lockfile"
  readonly packageJsonPath: string
}

const MANAGER_COMMANDS: Record<PackageManager, readonly string[]> = {
  npm: ["npm", "npx"],
  pnpm: ["pnpm", "pnpx"],
  yarn: ["yarn", "yarnpkg"],
  bun: ["bun", "bunx"],
}

const LOCKFILES: Record<string, PackageManager> = {
  "package-lock.json": "npm",
  "npm-shrinkwrap.json": "npm",
  "pnpm-lock.yaml": "pnpm",
  "yarn.lock": "yarn",
  "bun.lock": "bun",
  "bun.lockb": "bun",
}

const WRAPPER_COMMANDS = new Set(["command", "sudo"])

const isPackageManager = (value: string): value is PackageManager => {
  return value === "npm" || value === "pnpm" || value === "yarn" || value === "bun"
}

const parsePackageManager = (value: unknown): PackageManager | undefined => {
  if (typeof value !== "string") return undefined
  const manager = value.split("@")[0]
  return isPackageManager(manager) ? manager : undefined
}

const managerForCommand = (command: string): PackageManager | undefined => {
  for (const [manager, commands] of Object.entries(MANAGER_COMMANDS) as Array<
    [PackageManager, readonly string[]]
  >) {
    if (commands.includes(command)) return manager
  }
}

const findPackageJson = (startDir: string, stopDir: string) => {
  let current = path.resolve(startDir)
  const stop = path.resolve(stopDir)

  while (current.startsWith(stop)) {
    const candidate = path.join(current, "package.json")
    if (fs.existsSync(candidate)) return candidate

    const next = path.dirname(current)
    if (next === current) break
    current = next
  }
}

const readPackageJson = (packageJsonPath: string) => {
  return JSON.parse(fs.readFileSync(packageJsonPath, "utf8")) as Record<string, unknown>
}

const inferManagerFromLockfiles = (projectDir: string): PackageManager | undefined => {
  const managers = new Set<PackageManager>()

  for (const [file, manager] of Object.entries(LOCKFILES)) {
    if (fs.existsSync(path.join(projectDir, file))) managers.add(manager)
  }

  return managers.size === 1 ? [...managers][0] : undefined
}

const detectIndent = (content: string) => {
  const match = content.match(/\n(\s+)\"[^\"]+\"\s*:/)
  return match?.[1] ?? "  "
}

const writePackageManager = (packageJsonPath: string, manager: PackageManager, version: string) => {
  const content = fs.readFileSync(packageJsonPath, "utf8")
  const packageJson = JSON.parse(content) as Record<string, unknown>
  const nextPackageJson: Record<string, unknown> = {}

  // Keep packageManager near identifying metadata so humans see the source of truth.
  for (const [key, value] of Object.entries(packageJson)) {
    nextPackageJson[key] = value
    if (key === "version" || (key === "name" && packageJson.version === undefined)) {
      nextPackageJson.packageManager = `${manager}@${version}`
    }
  }

  if (nextPackageJson.packageManager === undefined) {
    nextPackageJson.packageManager = `${manager}@${version}`
  }

  // Preserve normal project JSON indentation instead of forcing a new style.
  fs.writeFileSync(packageJsonPath, `${JSON.stringify(nextPackageJson, null, detectIndent(content))}\n`)
}

const tokenizeShell = (command: string) => {
  const tokens: string[] = []
  let current = ""
  let quote: "'" | '"' | undefined
  let escaped = false

  for (const char of command) {
    if (escaped) {
      current += char
      escaped = false
      continue
    }

    if (char === "\\") {
      escaped = true
      continue
    }

    if (quote) {
      if (char === quote) quote = undefined
      else current += char
      continue
    }

    if (char === "'" || char === '"') {
      quote = char
      continue
    }

    if (/\s/.test(char)) {
      if (current) tokens.push(current)
      current = ""
      continue
    }

    if (";&|()".includes(char)) {
      if (current) tokens.push(current)
      current = ""
      tokens.push(char)
      continue
    }

    current += char
  }

  if (current) tokens.push(current)
  return tokens
}

const firstPackageManagerInCommand = (command: string) => {
  const tokens = tokenizeShell(command)
  let atCommandStart = true

  for (let index = 0; index < tokens.length; index += 1) {
    const token = tokens[index]

    if (token === ";" || token === "&" || token === "|" || token === "(" || token === ")") {
      atCommandStart = true
      continue
    }

    if (!atCommandStart) continue
    if (/^[A-Za-z_][A-Za-z0-9_]*=.*/.test(token)) continue

    if (WRAPPER_COMMANDS.has(token)) continue

    if (token === "env") continue

    if (token === "corepack") {
      const next = tokens[index + 1]
      if (next === "enable" || next === "prepare") return undefined
      return next ? managerForCommand(next) : undefined
    }

    const manager = managerForCommand(token)
    if (manager) return manager

    atCommandStart = false
  }
}

const buildBlockMessage = (
  actual: PackageManager,
  expected: ProjectPackageManager,
  command: string,
) => {
  const replacement = command.replace(new RegExp(`\\b${actual}\\b`, "g"), expected.manager)
  return [
    `Blocked wrong package manager: ${actual}`,
    "",
    `Project uses ${expected.manager} (${expected.source}) at ${expected.packageJsonPath}.`,
    "",
    "Use:",
    `  ${replacement}`,
  ].join("\n")
}

const buildInferenceMessage = (manager: PackageManager, packageJsonPath: string) => {
  return [
    `Package manager appears to be ${manager}, but package.json lacks packageManager.`,
    "",
    "OpenCode plugin hooks cannot ask for confirmation from tool.execute.before.",
    "To confirm lockfile inference, configure plugin with:",
    `  ["./plugins/package-manager-guard.ts", { "inferFromLockfile": true }]`,
    "",
    `Then retry. Plugin will add packageManager to ${packageJsonPath}.`,
  ].join("\n")
}

export const PackageManagerGuardPlugin: Plugin = async ({ $, directory, worktree }, options) => {
  const guardOptions = (options ?? {}) as GuardOptions

  const resolveProjectManager = async (cwd: string): Promise<ProjectPackageManager | undefined> => {
    const packageJsonPath = findPackageJson(cwd, worktree || directory)
    if (!packageJsonPath) return undefined

    const packageJson = readPackageJson(packageJsonPath)
    const packageManager = parsePackageManager(packageJson.packageManager)
    if (packageManager) {
      return { manager: packageManager, source: "packageManager", packageJsonPath }
    }

    const projectDir = path.dirname(packageJsonPath)
    const inferred = inferManagerFromLockfiles(projectDir)
    if (!inferred) return undefined

    if (!guardOptions.inferFromLockfile) {
      throw new Error(buildInferenceMessage(inferred, packageJsonPath))
    }

    const result = await $`${inferred} --version`.quiet()
    const version = String(result.stdout).trim()
    if (!version) throw new Error(`Could not detect ${inferred} version`)

    writePackageManager(packageJsonPath, inferred, version)
    return { manager: inferred, source: "lockfile", packageJsonPath }
  }

  return {
    "tool.execute.before": async (input, output) => {
      const tool = String(input.tool ?? "").toLowerCase()
      if (tool !== "bash" && tool !== "shell") return

      const args = output.args as Record<string, unknown> | undefined
      const command = args?.command
      if (typeof command !== "string" || !command.trim()) return

      const actual = firstPackageManagerInCommand(command)
      if (!actual) return

      const cwdArg = args.cwd ?? args.workdir ?? args.workingDirectory
      const cwd = typeof cwdArg === "string" ? cwdArg : directory
      const expected = await resolveProjectManager(cwd)
      if (!expected || expected.manager === actual) return

      throw new Error(buildBlockMessage(actual, expected, command))
    },
  }
}
