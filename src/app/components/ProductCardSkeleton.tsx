import React from 'react'

export default function ProductCardSkeleton() {
  return (
    <div className="flex flex-col animate-pulse">
      {/* Imagen */}
      <div className="aspect-[4/3] w-full bg-gray-200 rounded-xl mb-3"></div>
      
      {/* Rating */}
      <div className="flex items-center mb-1">
        <div className="h-3.5 w-3.5 bg-gray-200 rounded-full mr-1"></div>
        <div className="h-3.5 bg-gray-200 rounded w-16"></div>
      </div>
      
      {/* Título */}
      <div className="h-5 bg-gray-200 rounded w-3/4 mb-1"></div>
      
      {/* Duración */}
      <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
      
      {/* Precio */}
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-auto"></div>
    </div>
  )
} 