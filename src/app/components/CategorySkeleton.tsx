import React from 'react'
import ProductCardSkeleton from './ProductCardSkeleton'

export default function CategorySkeleton() {
  return (
    <div className="animate-pulse">
      {/* Header */}
      <div className="relative w-full h-[300px] bg-gray-200 mb-8">
        <div className="absolute inset-0 bg-gradient-to-t from-gray-300 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full p-6">
          <div className="h-10 bg-gray-300 rounded w-1/3 mb-3"></div>
          <div className="h-5 bg-gray-300 rounded w-2/3 mb-2"></div>
          <div className="h-5 bg-gray-300 rounded w-1/2"></div>
        </div>
      </div>
      
      {/* Filtros */}
      <div className="flex items-center justify-between mb-8">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="flex gap-2">
          <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
          <div className="h-10 bg-gray-200 rounded-lg w-28"></div>
        </div>
      </div>
      
      {/* Grid de productos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array(8).fill(0).map((_, index) => (
          <div key={`skeleton-${index}`}>
            <ProductCardSkeleton />
          </div>
        ))}
      </div>
    </div>
  )
} 