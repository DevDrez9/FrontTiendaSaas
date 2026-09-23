// Misma regla que el backend (AuthService.tieneSuscripcionActiva)
export function tieneSuscripcionActiva(tienda: any, rol?: string): boolean {
  if (rol === 'ADMIN') return true;
  if (!tienda?.planId || !tienda?.suscripcionFin) return false;
  return new Date(tienda.suscripcionFin) > new Date();
}
