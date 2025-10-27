/**
 * Enhanced path sanitization with comprehensive security checks
 * @param rawPath - The raw path string to sanitize
 * @param options - Optional configuration
 * @returns Sanitized path string
 * @throws Error if path contains dangerous patterns after sanitization attempts
 */
interface SanitizePathOptions {
  /** Allow absolute paths (default: false) */
  allowAbsolute?: boolean;
  /** Throw error on dangerous patterns instead of sanitizing (default: false) */
  strict?: boolean;
  /** Maximum path length (default: 4096) */
  maxLength?: number;
  /** Allow Windows UNC paths like \\server\share (default: false) */
  allowUNC?: boolean;
}

// Pre-compiled regex patterns for better performance
const PATTERNS = {
  nullByte: /\0/g,
  uncPath: /^\\\\[^\\]+\\[^\\]+/,
  backslash: /\\/g,
  absolutePath: /^([a-zA-Z]:)?\/+/,
  // Fixed: More comprehensive traversal detection
  traversal: /(?:^|\/|\\)\.\.(?:\/|\\|$)|(?:^|\/|\\)\.(?:\/|\\|$)/,
  multiSlash: /\/+/g,
  trailingSlash: /\/+$/,
  reservedNames: /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\..*)?$/i,
  dangerousChars: /[^\w\s\-./]/g,
} as const;

function sanitizePath(rawPath: string, options: SanitizePathOptions = {}): string {
  const { allowAbsolute = true, strict = false, maxLength = 4096, allowUNC = false } = options;

  // Input validation
  if (typeof rawPath !== "string") {
    throw new TypeError("Path must be a string");
  }

  if (rawPath.length === 0) return "";
  if (rawPath.length > maxLength) {
    throw new Error(`Path exceeds maximum length of ${maxLength} characters`);
  }

  let path = rawPath.trim();

  // Check for null bytes (security risk)
  if (path.includes("\0")) {
    if (strict) throw new Error("Path contains null bytes");
    path = path.replace(PATTERNS.nullByte, "");
  }

  // Handle Windows UNC paths
  if (!allowUNC && PATTERNS.uncPath.test(path)) {
    if (strict) throw new Error("UNC paths are not allowed");
    path = path.replace(PATTERNS.uncPath, "");
  }

  // Normalize separators FIRST before checking for traversal
  path = path.replace(PATTERNS.backslash, "/");

  // Handle absolute paths
  const isAbsolute = PATTERNS.absolutePath.test(path);
  if (isAbsolute && !allowAbsolute) {
    if (strict) throw new Error("Absolute paths are not allowed");
    path = path.replace(PATTERNS.absolutePath, "");
  }

  // Check for traversal patterns AFTER normalization
  // This catches patterns like: /../, /../../, ../folder, folder/.., etc.
  const hasTraversal = PATTERNS.traversal.test(path);

  if (hasTraversal || path.includes("..")) {
    if (strict) throw new Error("Path contains directory traversal patterns");

    // Single pass: split, filter dangerous segments, and clean
    const segments = path.split("/");
    const cleaned: string[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i].trim();

      // Skip empty, current directory (.), and parent directory (..) references
      if (!segment || segment === "." || segment === "..") {
        continue;
      }

      // Check for reserved names and dangerous chars
      const hasReserved = PATTERNS.reservedNames.test(segment);
      const cleanSegment = segment.replace(PATTERNS.dangerousChars, "");

      if (cleanSegment) {
        cleaned.push(hasReserved && !strict ? `_${cleanSegment}` : cleanSegment);
      }
    }

    path = cleaned.join("/");
  } else {
    // Fast path when no traversal detected
    const segments = path.split("/");
    const cleaned: string[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i].trim();
      if (segment) {
        const hasReserved = PATTERNS.reservedNames.test(segment);
        const cleanSegment = segment.replace(PATTERNS.dangerousChars, "");

        if (cleanSegment) {
          if (hasReserved) {
            if (strict) throw new Error("Path contains reserved Windows filename");
            cleaned.push(`_${cleanSegment}`);
          } else {
            cleaned.push(cleanSegment);
          }
        }
      }
    }

    path = cleaned.join("/");
  }

  // Final cleanup
  if (!allowAbsolute && path.startsWith("/")) {
    path = path.substring(1);
  }

  if (path !== "/" && path.endsWith("/")) {
    path = path.slice(0, -1);
  }

  // CRITICAL: Final validation to ensure no traversal patterns remain
  if (path.includes("..")) {
    if (strict) throw new Error("Path validation failed: traversal patterns detected after sanitization");
    // Remove any remaining .. patterns
    path = path
      .split("/")
      .filter((seg) => seg !== "..")
      .join("/");
  }

  // Final check for leading slash in non-absolute mode
  if (!allowAbsolute && path.startsWith("/")) {
    if (strict) throw new Error("Path validation failed: absolute path not allowed");
    path = path.replace(/^\/+/, "");
  }

  return path;
}

/**
 * Validate if a path is safe after sanitization
 */
function isPathSafe(path: string): boolean {
  try {
    const sanitized = sanitizePath(path, { strict: true });
    return sanitized === path;
  } catch {
    return false;
  }
}

/**
 * Normalize and join path segments safely
 */
function joinPaths(...segments: string[]): string {
  // Single pass: filter empty, sanitize, and join
  const cleaned: string[] = [];

  for (let i = 0; i < segments.length; i++) {
    const sanitized = sanitizePath(segments[i]);
    if (sanitized) cleaned.push(sanitized);
  }

  return cleaned.join("/");
}

export { sanitizePath, isPathSafe, joinPaths };
export type { SanitizePathOptions };
