import { type SchemaTypeDefinition } from 'sanity'
import category from '../schemas/category'
import product from '../schemas/product'
import siteSettings from '../schemas/siteSettings'
import navigationMenu from '../schemas/navigation'

export const schemaTypes = [product, category, siteSettings, navigationMenu]

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [],
}
