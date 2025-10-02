import Link from 'next/link';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#F9FAFB] text-[#111827] px-4">
      {/* Ícono simple */}
      <div className="text-7xl mb-4">😕</div>

      {/* Mensaje */}
      <h1 className="text-3xl font-bold mb-2">Página no encontrada</h1>
      <p className="text-[#6B7280] mb-6">Error 404</p>

      {/* Botón volver */}
      <Link
        href="/"
        className="px-5 py-2 bg-[#6C4CFF] text-white rounded-lg shadow hover:bg-[#5033CC] transition"
      >
        Volver al inicio
      </Link>
    </div>
  );
}
