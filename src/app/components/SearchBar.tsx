'use client'

import { useState, useEffect, useCallback } from 'react'
import { client } from '@/sanity/client'
import { groq } from 'next-sanity'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import type { Product } from '@/sanity/types'

const productsQuery = groq`*[_type == "product"]{
  _id,
  name,
  "slug": slug.current
}`

const SearchIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-gray-400">
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
)

export default function SearchBar() {
    const [searchTerm, setSearchTerm] = useState('')
    const [products, setProducts] = useState<Pick<Product, '_id' | 'name' | 'slug'>[]>([])
    const [filteredProducts, setFilteredProducts] = useState<Pick<Product, '_id' | 'name' | 'slug'>[]>([])
    const [isFocused, setIsFocused] = useState(false)
    const pathname = usePathname()

    useEffect(() => {
        async function fetchProducts() {
            try {
                const data = await client.fetch(productsQuery)
                setProducts(data || [])
            } catch (error) {
                console.error("Failed to fetch products for search:", error)
            }
        }
        fetchProducts()
    }, [])
    
    useEffect(() => {
        setSearchTerm('')
        setIsFocused(false)
    }, [pathname])

    const handleSearch = useCallback((term: string) => {
        setSearchTerm(term)
        if (term.length > 1) {
            const lowerCaseTerm = term.toLowerCase()
            const results = products.filter(product =>
                product.name.toLowerCase().includes(lowerCaseTerm)
            )
            setFilteredProducts(results)
        } else {
            setFilteredProducts([])
        }
    }, [products])
    
    const showResults = isFocused && searchTerm.length > 1 && filteredProducts.length > 0;

    return (
        <div className="relative w-full max-w-xs">
            <div className="relative">
                <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => handleSearch(e.target.value)}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setTimeout(() => setIsFocused(false), 150)} // Delay to allow click on results
                    placeholder="Search for products..."
                    className="w-full pl-10 pr-4 py-2 text-sm border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                />
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <SearchIcon />
                </div>
            </div>

            {showResults && (
                 <div className="absolute z-10 mt-2 w-full bg-white border border-gray-200 rounded-lg shadow-xl">
                    <ul className="max-h-80 overflow-y-auto">
                        {filteredProducts.map((product) => (
                            <li key={product._id}>
                                <Link 
                                    href={`/products/${product.slug}`} 
                                    className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                >
                                    {product.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    )
} 