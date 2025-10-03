
export { default } from "next-auth/middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/propiedades/crear",
    "/propiedades/editar/:path*",
    "/leads/:path*",
    "/reportes/:path*",
  ]
};
