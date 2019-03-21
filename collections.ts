/*!
   Copyright 2019 Ron Buckton

   Licensed under the Apache License, Version 2.0 (the "License");
   you may not use this file except in compliance with the License.
   You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.

   THIRD PARTY LICENSE NOTICE:

   HashMap is derived from the implementation of Dictionary<T> in .NET Core.
   HashSet is derived from the implementation of HashSet<T> in .NET Core.

   .NET Core is licensed under the MIT License:

   The MIT License (MIT)

   Copyright (c) .NET Foundation and Contributors

   All rights reserved.

   Permission is hereby granted, free of charge, to any person obtaining a copy
   of this software and associated documentation files (the "Software"), to deal
   in the Software without restriction, including without limitation the rights
   to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
   copies of the Software, and to permit persons to whom the Software is
   furnished to do so, subject to the following conditions:

   The above copyright notice and this permission notice shall be included in all
   copies or substantial portions of the Software.

   THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
   IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
   FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
   AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
   LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
   OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
   SOFTWARE.
*/

import { Comparison, Comparer, Equaler } from "./index";
import { isIterable, maxInt32 } from './internal/utils';
import { binarySearch } from './internal/binarySearch';
import { getPrime, expandPrime } from './internal/primes';

export class SortedMap<K, V> {
    private _keys: K[] = [];
    private _values: V[] = [];
    private _comparer: Comparer<K>;

    constructor(comparer?: Comparison<K> | Comparer<K>);
    constructor(iterable?: Iterable<[K, V]>, comparer?: Comparison<K> | Comparer<K>);
    constructor(...args: [(Comparison<K> | Comparer<K>)?] | [Iterable<[K, V]>?, (Comparison<K> | Comparer<K>)?]) {
        let iterable: Iterable<[K, V]> | undefined;
        let comparer: Comparison<K> | Comparer<K> | undefined;
        if (args.length > 0) {
            const arg0 = args[0];
            if (isIterable(arg0) || arg0 === undefined) {
                iterable = arg0;
                if (args.length > 1) comparer = args[1];
            }
            else {
                comparer = arg0;
            }
        }
        if (comparer === undefined) comparer = Comparer.defaultComparer;
        this._comparer = typeof comparer === "function" ? Comparer.create(comparer) : comparer;
        if (iterable) {
            for (const [key, value] of iterable) {
                this.set(key, value);
            }
        }
    }

    get size() {
        return this._keys.length;
    }

    has(key: K) {
        return binarySearch(this._keys, key, this._comparer) >= 0;
    }

    get(key: K) {
        const index = binarySearch(this._keys, key, this._comparer);
        return index >= 0 ? this._values[index] : undefined;
    }

    set(key: K, value: V) {
        const index = binarySearch(this._keys, key, this._comparer);
        if (index >= 0) {
            this._values[index] = value;
        }
        else {
            this._keys.splice(~index, 0, key);
            this._values.splice(~index, 0, value);
        }
        return this;
    }

    delete(key: K) {
        const index = binarySearch(this._keys, key, this._comparer);
        if (index >= 0) {
            this._keys.splice(index, 1);
            this._values.splice(index, 1);
            return true;
        }
        return false;
    }

    clear() {
        this._keys.length = 0;
        this._values.length = 0;
    }

    keys() {
        return this._keys.values();
    }

    values() {
        return this._values.values();
    }

    * entries() {
        for (let i = 0; i < this._keys.length; i++) {
            yield [this._keys[i], this._values[i]] as [K, V];
        }
    }

    [Symbol.iterator]() {
        return this.entries();
    }

    forEach(cb: (value: V, key: K, map: this) => void, thisArg?: unknown) {
        for (const [key, value] of this) {
            cb.call(thisArg, value, key, this);
        }
    }

    [Symbol.toStringTag]: string;
}

Object.defineProperty(SortedMap, Symbol.toStringTag, {
    enumerable: false,
    configurable: true,
    writable: true,
    value: "SortedMap"
});

export class SortedSet<T> {
    private _values: T[] = [];
    private _comparer: Comparer<T>;

    constructor(comparer?: Comparison<T> | Comparer<T>);
    constructor(iterable?: Iterable<T>, comparer?: Comparison<T> | Comparer<T>);
    constructor(...args: [(Comparison<T> | Comparer<T>)?] | [Iterable<T>?, (Comparison<T> | Comparer<T>)?]) {
        let iterable: Iterable<T> | undefined;
        let comparer: Comparison<T> | Comparer<T> | undefined;
        if (args.length > 0) {
            const arg0 = args[0];
            if (isIterable(arg0) || arg0 === undefined) {
                iterable = arg0;
                if (args.length > 1) comparer = args[1];
            }
            else {
                comparer = arg0;
            }
        }
        if (comparer === undefined) comparer = Comparer.defaultComparer;
        this._comparer = typeof comparer === "function" ? Comparer.create(comparer) : comparer;
        if (iterable) {
            for (const value of iterable) {
                this.add(value);
            }
        }
    }

    get size() {
        return this._values.length;
    }

    has(value: T) {
        return binarySearch(this._values, value, this._comparer) >= 0;
    }

    add(value: T) {
        const index = binarySearch(this._values, value, this._comparer);
        if (index >= 0) {
            this._values[index] = value;
        }
        else {
            this._values.splice(~index, 0, value);
        }
        return this;
    }

    delete(value: T) {
        const index = binarySearch(this._values, value, this._comparer);
        if (index >= 0) {
            this._values.splice(index, 1);
            return true;
        }
        return false;
    }

    clear() {
        this._values.length = 0;
    }

    keys() {
        return this._values.values();
    }

    values() {
        return this._values.values();
    }

    * entries() {
        for (let i = 0; i < this._values.length; i++) {
            yield [this._values[i], this._values[i]] as [T, T];
        }
    }

    [Symbol.iterator]() {
        return this.values();
    }

    forEach(cb: (value: T, key: T, map: this) => void, thisArg?: unknown) {
        for (const value of this) {
            cb.call(thisArg, value, value, this);
        }
    }

    [Symbol.toStringTag]: string;
}

Object.defineProperty(SortedSet, Symbol.toStringTag, {
    enumerable: false,
    configurable: true,
    writable: true,
    value: "SortedSet"
});

interface HashEntry<K, V> {
    next: number;
    prevEntry: HashEntry<K, V> | undefined;
    nextEntry: HashEntry<K, V> | undefined;
    skipNextEntry: boolean;
    hashCode: number;
    key: K;
    value: V;
}

interface HashData<K, V> {
    buckets?: Int32Array;
    entries?: HashEntry<K, V>[];
    freeSize: number;
    freeList: number;
    size: number;
    equaler: Equaler<K>;
    head: HashEntry<K, V>;
    tail: HashEntry<K, V>;
}

function createHashEntry<K, V>(): HashEntry<K, V> {
    return {
        prevEntry: undefined,
        nextEntry: undefined,
        skipNextEntry: false,
        next: 0,
        hashCode: 0,
        key: undefined!,
        value: undefined!
    };
}

function createHashData<K, V>(equaler: Equaler<K>, capacity: number) {
    const head = createHashEntry<K, V>();
    const hashData: HashData<K, V> = {
        buckets: undefined,
        entries: undefined,
        freeSize: 0,
        freeList: 0,
        size: 0,
        equaler,
        head,
        tail: head
    };
    initializeHashData(hashData, capacity);
    return hashData;
}

function initializeHashData<K, V>(hashData: HashData<K, V>, capacity: number) {
    const newCapacity = getPrime(capacity);
    hashData.freeList = -1;
    hashData.buckets = new Int32Array(newCapacity);
    hashData.entries = new Array(newCapacity);
    return newCapacity;
}

function resizeHashData<K, V>(hashData: HashData<K, V>, newSize: number) {
    const size = hashData.size;
    const buckets = new Int32Array(newSize);
    const entries = hashData.entries ? hashData.entries.slice() : [];
    entries.length = newSize;
    for (let i = 0; i < size; i++) {
        const entry = entries[i];
        if (entry && entry.hashCode >= 0) {
            const bucket = entry.hashCode % newSize;
            // Value in _buckets is 1-based
            entry.next = buckets[bucket] - 1;
            // Value in _buckets is 1-based
            buckets[bucket] = i + 1;
        }
    }
    hashData.buckets = buckets;
    hashData.entries = entries;
}

function findEntryIndex<K, V>(hashData: HashData<K, V>, key: K) {
    let i = -1;
    const { buckets, entries, equaler } = hashData;
    if (buckets && entries) {
        let hashCode = equaler.hash(key) & maxInt32;
        // Value in _buckets is 1-based
        i = buckets[hashCode % buckets.length] - 1;
        while ((i >>> 0) < entries.length && !(entries[i].hashCode === hashCode && equaler.equals(entries[i].key, key))) {
            i = entries[i].next;
        }
    }
    return i;
}

function findEntryValue<K, V>(hashData: HashData<K, V>, key: K) {
    const index = findEntryIndex(hashData, key);
    return index >= 0 ? hashData.entries![index].value : undefined;
}

function insertEntry<K, V>(hashData: HashData<K, V>, key: K, value: V) {
    if (!hashData.buckets) initializeHashData(hashData, 0);
    if (!hashData.buckets || !hashData.entries) throw new Error();

    const hashCode = hashData.equaler.hash(key) & maxInt32;
    let bucket = hashCode % hashData.buckets.length;
    // Value in _buckets is 1-based
    let i = hashData.buckets[bucket] - 1;
    while ((i >>> 0) < hashData.entries.length) {
        const entry = hashData.entries[i];
        if (entry.hashCode === hashCode && hashData.equaler.equals(entry.key, key)) {
            entry.value = value;
            return;
        }
        i = entry.next;
    }
    let updateFreeList = false;
    let index: number;
    if (hashData.freeSize > 0) {
        index = hashData.freeList;
        updateFreeList = true;
        hashData.freeSize--;
    }
    else {
        const size = hashData.size;
        if (size === hashData.entries.length) {
            resizeHashData(hashData, expandPrime(hashData.size));
            if (!hashData.buckets || !hashData.entries) throw new Error();
            bucket = hashCode % hashData.buckets.length;
        }
        index = size;
        hashData.size = size + 1;
    }
    const entry = hashData.entries[index] || (hashData.entries[index] = createHashEntry<K, V>());
    if (updateFreeList) hashData.freeList = entry.next;
    entry.hashCode = hashCode;
    // Value in _buckets is 1-based
    entry.next = hashData.buckets[bucket] - 1;
    entry.key = key;
    entry.value = value;
    entry.skipNextEntry = false;
    const tail = hashData.tail;
    tail.nextEntry = entry;
    entry.prevEntry = tail;
    hashData.tail = entry;
    // Value in _buckets is 1-based
    hashData.buckets[bucket] = index + 1;
}

function deleteEntry<K, V>(hashData: HashData<K, V>, key: K) {
    if (hashData.buckets && hashData.entries) {
        const hashCode = hashData.equaler.hash(key) & maxInt32;
        const bucket = hashCode % hashData.buckets.length;
        let last = -1;
        let entry: HashEntry<K, V> | undefined;
        // Value in _buckets is 1-based
        for (let i = hashData.buckets[bucket] - 1; i >= 0; i = entry.next) {
            entry = hashData.entries[i];
            if (entry.hashCode === hashCode && hashData.equaler.equals(entry.key, key)) {
                if (last < 0) {
                    // Value in _buckets is 1-based
                    hashData.buckets[bucket] = entry.next + 1;
                }
                else {
                    hashData.entries[last]!.next = entry.next;
                }

                const prevEntry = entry.prevEntry!;
                prevEntry.nextEntry = entry.nextEntry;
                if (prevEntry.nextEntry) {
                    prevEntry.nextEntry.prevEntry = prevEntry;
                }
                if (hashData.tail === entry) {
                    hashData.tail = prevEntry;
                }
                entry.hashCode = -1;
                entry.next = hashData.freeList;
                entry.key = undefined!;
                entry.value = undefined!;
                entry.prevEntry = undefined;
                entry.nextEntry = prevEntry;
                entry.skipNextEntry = true;
                hashData.freeList = i;
                hashData.freeSize++;
                return true;
            }
            last = i;
        }
    }
    return false;
}

function clearEntries<K, V>(hashData: HashData<K, V>) {
    const size = hashData.size;
    if (size > 0) {
        if (hashData.buckets) hashData.buckets.fill(0);
        if (hashData.entries) hashData.entries.fill(undefined!);
        let currentEntry = hashData.head.nextEntry;
        while (currentEntry) {
            const nextEntry = currentEntry.nextEntry;
            currentEntry.prevEntry = undefined;
            currentEntry.nextEntry = hashData.head;
            currentEntry.skipNextEntry = true;
            currentEntry = nextEntry;
        }
        hashData.head.nextEntry = undefined;
        hashData.tail = hashData.head;
        hashData.size = 0;
        hashData.freeList = -1;
        hashData.freeSize = 0;
    }
}

function ensureCapacity<K, V>(hashData: HashData<K, V>, capacity: number) {
    if (capacity < 0) throw new RangeError();
    const existingCapacity = hashData.entries ? hashData.entries.length : 0;
    if (existingCapacity >= capacity) return existingCapacity;
    if (!hashData.buckets) {
        initializeHashData(hashData, capacity);
        return;
    }
    const newCapacity = getPrime(capacity);
    resizeHashData(hashData, getPrime(capacity));
    return newCapacity;
}

function trimExcessEntries<K, V>(hashData: HashData<K, V>, capacity = hashData.size - hashData.freeSize) {
    if (capacity < hashData.size) throw new RangeError(); // TODO
    if (!hashData.buckets || !hashData.entries) return;
    const newCapacity = getPrime(capacity);
    const existingEntries = hashData.entries;
    if (newCapacity >= (existingEntries ? existingEntries.length : 0)) return;
    const oldSize = hashData.size;
    initializeHashData(hashData, newCapacity);
    if (!hashData.buckets || !hashData.entries) throw new Error();
    let newSize = 0;
    for (let i = 0; i < oldSize; i++) {
        const hashCode = existingEntries[i].hashCode;
        if (hashCode >= 0) {
            const bucket = hashCode % newCapacity;
            hashData.entries[newSize] = existingEntries[i];
            // Value in _buckets is 1-based
            hashData.entries[newSize].next = hashData.buckets[bucket] - 1;
            // Value in _buckets is 1-based
            hashData.buckets[bucket] = newSize + 1;
            newSize++;
        }
    }
    hashData.size = newSize;
    hashData.freeSize = 0;
}

function selectEntryKey<K, V>(entry: HashEntry<K, V>) {
    return entry.key;
}

function selectEntryValue<K, V>(entry: HashEntry<K, V>) {
    return entry.value;
}

function selectEntryEntry<K, V>(entry: HashEntry<K, V>) {
    return [entry.key, entry.value] as [K, V];
}

function * iterateEntries<K, V, R>(head: HashEntry<K, V>, selector: (entry: HashEntry<K, V>) => R) {
    let currentEntry: HashEntry<K, V> | undefined = head;
    while (currentEntry) {
        const skipNextEntry = currentEntry.skipNextEntry;
        currentEntry = currentEntry.nextEntry;
        if (skipNextEntry) continue;
        if (currentEntry) yield selector(currentEntry);
    }
}

function forEachEntry<K, V, T>(source: T, head: HashEntry<K, V>, callback: (value: V, key: K, source: T) => void, thisArg: any) {
    let currentEntry: HashEntry<K, V> | undefined = head;
    while (currentEntry) {
        const skipNextEntry = currentEntry.skipNextEntry;
        currentEntry = currentEntry.nextEntry;
        if (skipNextEntry) continue;
        if (currentEntry) callback.call(thisArg, currentEntry.value, currentEntry.key, source);
    }
}

export class HashMap<K, V> {
    private _hashData: HashData<K, V>;

    constructor(equaler?: Equaler<K>);
    constructor(iterable?: Iterable<[K, V]>, equaler?: Equaler<K>);
    constructor(capacity: number, equaler?: Equaler<K>);
    constructor(...args: [Equaler<K>?] | [number, Equaler<K>?] | [Iterable<[K, V]>?, Equaler<K>?]) {
        let capacity: number | undefined;
        let iterable: Iterable<[K, V]> | undefined;
        let equaler: Equaler<K> | undefined;
        if (args.length > 0) {
            const arg0 = args[0];
            if (typeof arg0 === "number") {
                capacity = arg0;
                if (args.length > 1) equaler = args[1];
            }
            else if (isIterable(arg0) || arg0 === undefined) {
                iterable = arg0;
                if (args.length > 1) equaler = args[1];
            }
            else {
                equaler = arg0;
            }
        }
        if (capacity === undefined) capacity = 0;
        if (equaler === undefined) equaler = Equaler.defaultEqualer;
        if (capacity < 0) throw new RangeError();

        this._hashData = createHashData(equaler, capacity);
        if (iterable) {
            for (const [key, value] of iterable) {
                this.set(key, value);
            }
        }
    }

    get equaler() {
        return this._hashData.equaler;
    }

    get size() {
        return this._hashData.size - this._hashData.freeSize;
    }

    has(key: K) {
        return findEntryIndex(this._hashData, key) >= 0;
    }

    get(key: K) {
        return findEntryValue(this._hashData, key);
    }

    set(key: K, value: V) {
        insertEntry(this._hashData, key, value);
        return this;
    }

    delete(key: K) {
        return deleteEntry(this._hashData, key);
    }

    clear() {
        clearEntries(this._hashData);
    }

    ensureCapacity(capacity: number) {
        return ensureCapacity(this._hashData, capacity);
    }

    trimExcess(capacity?: number) {
        trimExcessEntries(this._hashData, capacity);
    }

    keys() {
        return iterateEntries(this._hashData.head, selectEntryKey);
    }

    values() {
        return iterateEntries(this._hashData.head, selectEntryValue);
    }

    entries() {
        return iterateEntries(this._hashData.head, selectEntryEntry);
    }

    [Symbol.iterator]() {
        return this.entries();
    }

    forEach(callback: (value: V, key: K, map: this) => void, thisArg?: any) {
        forEachEntry(this, this._hashData.head, callback, thisArg);
    }

    [Symbol.toStringTag]: string;
}

Object.defineProperty(HashMap, Symbol.toStringTag, {
    enumerable: false,
    configurable: true,
    writable: true,
    value: "HashMap"
});

export class HashSet<T> {
    private _hashData: HashData<T,T>;

    constructor(equaler?: Equaler<T>);
    constructor(iterable?: Iterable<T>, equaler?: Equaler<T>);
    constructor(capacity: number, equaler?: Equaler<T>);
    constructor(...args: [Equaler<T>?] | [number, Equaler<T>?] | [Iterable<T>?, Equaler<T>?]) {
        let capacity: number | undefined;
        let iterable: Iterable<T> | undefined;
        let equaler: Equaler<T> | undefined;
        if (args.length > 0) {
            const arg0 = args[0];
            if (typeof arg0 === "number") {
                capacity = arg0;
                if (args.length > 1) equaler = args[1];
            }
            else if (isIterable(arg0)) {
                iterable = arg0;
                if (args.length > 1) equaler = args[1];
            }
            else {
                equaler = arg0;
            }
        }
        if (capacity === undefined) capacity = 0;
        if (equaler === undefined) equaler = Equaler.defaultEqualer;
        if (capacity < 0) throw new RangeError();

        this._hashData = createHashData(equaler, capacity);
        if (iterable) {
            for (const value of iterable) {
                this.add(value);
            }
        }
    }

    get equaler() {
        return this._hashData.equaler;
    }

    get size() {
        return this._hashData.size - this._hashData.freeSize;
    }

    has(value: T) {
        return findEntryIndex(this._hashData, value) >= 0;
    }

    add(value: T) {
        insertEntry(this._hashData, value, value);
        return this;
    }

    delete(value: T) {
        return deleteEntry(this._hashData, value);
    }

    clear() {
        clearEntries(this._hashData);
    }

    ensureCapacity(capacity: number) {
        return ensureCapacity(this._hashData, capacity);
    }

    trimExcess(capacity?: number) {
        trimExcessEntries(this._hashData, capacity);
    }

    keys() {
        return iterateEntries(this._hashData.head, selectEntryKey);
    }

    values() {
        return iterateEntries(this._hashData.head, selectEntryValue);
    }

    entries() {
        return iterateEntries(this._hashData.head, selectEntryEntry);
    }

    [Symbol.iterator](): Iterable<T> {
        return this.values();
    }

    forEach(callback: (value: T, key: T, map: this) => void, thisArg?: any) {
        forEachEntry(this, this._hashData.head, callback, thisArg);
    }

    [Symbol.toStringTag]: string;
}

Object.defineProperty(HashSet, Symbol.toStringTag, {
    enumerable: false,
    configurable: true,
    writable: true,
    value: "HashSet"
});
