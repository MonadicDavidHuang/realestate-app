import localforage from 'localforage';
import type { Property } from '../types/property';

const PROPERTIES_STORE = 'properties';

localforage.config({
  name: 'RealEstateApp',
  storeName: PROPERTIES_STORE,
  description: 'Real Estate Properties Storage'
});

export class PropertyRepository {
  static async getAll(): Promise<Property[]> {
    const properties: Property[] = [];
    
    await localforage.iterate<Property, void>((value) => {
      properties.push(value);
    });
    
    return properties;
  }

  static async getById(id: string): Promise<Property | null> {
    return await localforage.getItem<Property>(id);
  }

  static async create(property: Omit<Property, 'id'>): Promise<Property> {
    const newProperty: Property = {
      ...property,
      id: Date.now().toString()
    };
    
    await localforage.setItem(newProperty.id, newProperty);
    return newProperty;
  }

  static async update(id: string, updates: Partial<Property>): Promise<Property | null> {
    const existing = await this.getById(id);
    if (!existing) return null;
    
    const updated: Property = { ...existing, ...updates, id };
    await localforage.setItem(id, updated);
    return updated;
  }

  static async delete(id: string): Promise<boolean> {
    try {
      await localforage.removeItem(id);
      return true;
    } catch {
      return false;
    }
  }

  static async clear(): Promise<void> {
    await localforage.clear();
  }

  static async addSampleData(): Promise<Property[]> {
    const sampleProperties: Omit<Property, 'id'>[] = [
      {
        name: "Luxury Downtown Condo",
        lat: 37.7849,
        lng: -122.4094,
        price: 1200000
      },
      {
        name: "Cozy Mission District House",
        lat: 37.7599,
        lng: -122.4148,
        price: 950000
      },
      {
        name: "Modern SOMA Apartment",
        lat: 40.7749,
        lng: -121.4194,
        price: 850000
      },

    ];

    const createdProperties: Property[] = [];
    for (const property of sampleProperties) {
      const created = await this.create(property);
      createdProperties.push(created);
    }
    
    return createdProperties;
  }
}