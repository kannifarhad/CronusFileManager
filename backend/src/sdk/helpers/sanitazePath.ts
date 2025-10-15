// Utility to sanitize file paths
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

const PATTERNS = {
  nullByte: /\0/g,
  uncPath: /^\\\\[^\\]+\\[^\\]+/,
  backslash: /\\/g,
  absolutePath: /^([a-zA-Z]:)?\/+/,
  driveLetter: /^[a-zA-Z]:/,
  traversal: /(?:^|\/)\.\.(\/|$)|^\.|\/\./g,
  multiSlash: /\/+/g,
  trailingSlash: /\/+$/,
  reservedNames: /^(CON|PRN|AUX|NUL|COM[1-9]|LPT[1-9])(?:\..*)?$/i,
  dangerousChars: /[^\w\s\-./]/g,
  emptySegments: /\/+/g,
} as const;

export function sanitizePath(rawPath: string, options: SanitizePathOptions = {}): string {
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

  // Normalize separators and handle absolute paths in one pass
  path = path.replace(PATTERNS.backslash, "/");

  const isAbsolute = PATTERNS.absolutePath.test(path);
  if (isAbsolute && !allowAbsolute) {
    if (strict) throw new Error("Absolute paths are not allowed");
    path = path.replace(PATTERNS.absolutePath, "");
  }

  // Check for traversal patterns before processing
  if (PATTERNS.traversal.test(path)) {
    if (strict) throw new Error("Path contains directory traversal patterns");

    // Single pass: split, filter, join
    const segments = path.split("/");
    const cleaned: string[] = [];

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i].trim();
      if (segment && segment !== "." && segment !== "..") {
        // Check for reserved names and dangerous chars in one go
        const hasReserved = PATTERNS.reservedNames.test(segment);
        const cleanSegment = segment.replace(PATTERNS.dangerousChars, "");

        if (cleanSegment) {
          cleaned.push(hasReserved && !strict ? `_${cleanSegment}` : cleanSegment);
        }
      }
    }

    path = cleaned.join("/");
  } else {
    // Fast path when no traversal detected
    // Still need to clean segments for reserved names and dangerous chars
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

  // Final validation
  if (!allowAbsolute && (path.includes("..") || path.startsWith("/"))) {
    if (strict) throw new Error("Path validation failed after sanitization");
    path = path.replace(/\.\./g, "").replace(/^\/+/, "");
  }

  return path;
}
