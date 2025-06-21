import React from 'react'

export default function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse">
      {/* Título */}
      <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
      
      {/* Galería */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <div className="aspect-[4/3] w-full bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
          <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
          <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
          <div className="aspect-square w-full bg-gray-200 rounded-lg"></div>
        </div>
      </div>
      
      {/* Contenido principal */}
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Columna izquierda */}
        <div className="flex-1">
          {/* Descripción */}
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          </div>
          
          {/* Características */}
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            </div>
          </div>
          
          {/* Incluye / No incluye */}
          <div className="mb-8">
            <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              </div>
              <div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Columna derecha - Tarjeta de reserva */}
        <div className="w-full lg:w-[380px]">
          <div className="bg-gray-100 rounded-xl p-6">
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-5 bg-gray-200 rounded w-full mb-3"></div>
            <div className="h-5 bg-gray-200 rounded w-2/3 mb-5"></div>
            <div className="h-10 bg-gray-200 rounded-lg w-full mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-2"></div>
          </div>
        </div>
      </div>
      
      {/* Widget de reserva */}
      <div className="mt-8 pt-8 border-t">
        <div className="h-6 bg-gray-200 rounded w-1/4 mx-auto mb-6"></div>
        <div className="h-[400px] bg-gray-100 rounded-xl"></div>
      </div>
    </div>
  )
} 