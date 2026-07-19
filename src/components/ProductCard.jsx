import { Link } from 'react-router-dom'

function ProductCard({ producto }) {
  return (
    <Link
      to={`/producto/${producto.id}`}
      className="bg-white rounded-lg shadow-sm overflow-hidden hover:shadow-md transition flex flex-col"
    >
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {producto.imagen_url ? (
          <img
            src={producto.imagen_url}
            alt={producto.nombre}
            className="w-full h-full object-contain"
          />
        ) : (
          <span className="text-gray-300 text-sm">Sin foto</span>
        )}
      </div>
      <div className="p-3 flex-1 flex flex-col">
        <p className="text-sm text-gray-700 line-clamp-2 flex-1">{producto.nombre}</p>
        <p className="text-lg font-bold text-gray-900 mt-2">
          ${producto.precio.toFixed(2)}
        </p>
      </div>
    </Link>
  )
}

export default ProductCard