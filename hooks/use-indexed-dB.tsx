'use client';

import { useState, useEffect, useCallback } from 'react';

interface IndexedDBConfig {
  dbName: string;
  storeName: string;
  version?: number;
}

interface IndexedDBHook<T> {
  data: T[];
  add: (item: T) => Promise<void>;
  get: (id: string | number) => Promise<T | undefined>;
  getAll: () => Promise<T[]>;
  update: (item: T) => Promise<void>;
  remove: (id: string | number) => Promise<void>;
  error: Error | null;
}

const getCurrentVersion = (dbName: string): Promise<number> => {
  return new Promise((resolve) => {
    const request = indexedDB.open(dbName);
    request.onsuccess = () => {
      const db = request.result;
      resolve(db.version);
      db.close();
    };
    request.onerror = () => resolve(1); // Default to version 1 if database doesn't exist
  });
};

export const useIndexedDB = <T extends { id: string | number }>({
  dbName,
  storeName,
  version = 1,
}: IndexedDBConfig): IndexedDBHook<T> => {
  const [data, setData] = useState<T[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const openDB = useCallback(async (): Promise<IDBDatabase> => {
    // Get the current database version
    const existingVersion = await getCurrentVersion(dbName);
    const dbVersion = version > existingVersion ? version : existingVersion;
  
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(dbName, dbVersion);
  
      request.onerror = () => reject(request.error);
  
      request.onsuccess = () => {
        const db = request.result;
  
        // Check if the store exists; if not, recreate the database with an upgrade
        if (!db.objectStoreNames.contains(storeName)) {
          db.close();
          const upgradeRequest = indexedDB.open(dbName, dbVersion + 1);
          upgradeRequest.onupgradeneeded = (event) => {
            const upgradedDB = (event.target as IDBOpenDBRequest).result;
            if (!upgradedDB.objectStoreNames.contains(storeName)) {
              upgradedDB.createObjectStore(storeName, { keyPath: 'id' });
            }
          };
          upgradeRequest.onsuccess = () => resolve(upgradeRequest.result);
          upgradeRequest.onerror = () => reject(upgradeRequest.error);
        } else {
          resolve(db);
        }
      };
  
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        if (!db.objectStoreNames.contains(storeName)) {
          db.createObjectStore(storeName, { keyPath: 'id' });
        }
      };
    });
  }, [dbName, version, storeName]);
  

  const add = async (item: T): Promise<void> => {
    try {
      const db = await openDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await new Promise((resolve, reject) => {
        const request = store.add(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      setData((prev) => [...prev, item]);
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to add item'));
    }
  };

  const get = async (id: string | number): Promise<T | undefined> => {
    try {
      const db = await openDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      return await new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get item'));
      return undefined;
    }
  };

  const getAll = async (): Promise<T[]> => {
    try {
      const db = await openDB();
      const tx = db.transaction(storeName, 'readonly');
      const store = tx.objectStore(storeName);
      const items = await new Promise<T[]>((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      setData(items);
      return items;
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to get items'));
      return [];
    }
  };

  const update = async (item: T): Promise<void> => {
    try {
      const db = await openDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await new Promise((resolve, reject) => {
        const request = store.put(item);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      setData((prev) => prev.map((i) => (i.id === item.id ? item : i)));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to update item'));
    }
  };

  const remove = async (id: string | number): Promise<void> => {
    try {
      const db = await openDB();
      const tx = db.transaction(storeName, 'readwrite');
      const store = tx.objectStore(storeName);
      await new Promise((resolve, reject) => {
        const request = store.delete(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
      });
      setData((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to remove item'));
    }
  };

  useEffect(() => {
    getAll();
  }, []);

//   useEffect(() => {
//     console.log(error);
//   }, [error]);

  return { data, add, get, getAll, update, remove, error };
};

/* Usage Examples:

interface Todo {
  id: string;
  title: string;
  completed: boolean;
}

// 1. Initialize the hook
const { data, add, get, getAll, update, remove, error } = useIndexedDB<Todo>({
  dbName: 'TodoApp',
  storeName: 'todos',
  version: 1
});

// 2. Add a new todo
await add({ id: '1', title: 'Learn IndexedDB', completed: false });

// 3. Get a specific todo
const todo = await get('1');

// 4. Update a todo
await update({ id: '1', title: 'Learn IndexedDB', completed: true });

// 5. Remove a todo
await remove('1');

// 6. Get all todos
const todos = await getAll();

// 7. Error handling
if (error) {
  console.error('IndexedDB operation failed:', error);
}
*/
