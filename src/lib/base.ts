export function withBase(pathname = "/") {
  const base = "/SaneCppLibraries";
  const path = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${base}${path}`;
}
