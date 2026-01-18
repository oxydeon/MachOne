import { Injectable } from '@angular/core';
import { StorageType } from '../models/storage-type';

@Injectable({ providedIn: 'root' })
export class Storage {
  private readonly storages = {
    [StorageType.LOCAL]: localStorage,
    [StorageType.SESSION]: sessionStorage,
  };

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
  get<T>(key: string, type: StorageType = StorageType.LOCAL): T {
    const item = this.storages[type].getItem(key);

    try {
      return (item ? JSON.parse(item) : item) as T;
    } catch {
      return item as T;
    }
  }

  set(key: string, data: unknown, type: StorageType = StorageType.LOCAL): void {
    this.storages[type].setItem(key, JSON.stringify(data));
  }

  remove(key: string, type: StorageType = StorageType.LOCAL): void {
    this.storages[type].removeItem(key);
  }

  clear(type: StorageType = StorageType.LOCAL): void {
    this.storages[type].clear();
  }
}
