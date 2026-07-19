import { Link } from 'react-router-dom'

function ProductCard({ producto }) {
  return (
    <Link
      to={`/producto/${producto.id}`}
      className="group bg-surface border border-line rounded-xl overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-200 flex flex-col"
    >
      <div className="aspect-square bg-bg flex items-center justify-center overflow-hidden">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <span className="text-ink-soft/50 text-sm">Sin foto</span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-sm text-ink line-clamp-2 flex-1">{producto.nombre}</p>
        <p className="font-display text-lg font-semibold text-accent-dark mt-2">
          ${producto.precio.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

export default ProductCard