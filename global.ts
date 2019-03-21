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
*/

import { getHashCode } from './internal/hashCode';
import { Equatable, Comparable, StructuralEquatable, StructuralComparable, Equaler, Comparer } from './index';
import { SortedSet, SortedMap, HashSet, HashMap } from './collections';

declare global {
    interface Object {
        [Equatable.equals](other: unknown): boolean;
        [Equatable.hash](): number;
    }

    interface String {
        [Comparable.compareTo](other: unknown): number;
    }

    interface Number {
        [Comparable.compareTo](other: unknown): number;
    }

    interface BigInt {
        [Comparable.compareTo](other: unknown): number;
    }

    interface Boolean {
        [Comparable.compareTo](other: unknown): number;
    }

    type Equatable = import("./index").Equatable;
    type Comparable = import("./index").Comparable;
    type StructuralEquatable = import("./index").StructuralEquatable;
    type StructuralComparable = import("./index").StructuralComparable;
    type Equaler<T> = import("./index").Equaler<T>;
    type Comparer<T> = import("./index").Comparer<T>;
    type Comparison<T> = import("./index").Comparison<T>;
    type SortedSet<T> = import("./collections").SortedSet<T>;
    type SortedMap<K, V> = import("./collections").SortedMap<K, V>;
    type HashSet<T> = import("./collections").HashSet<T>;
    type HashMap<K, V> = import("./collections").HashMap<K, V>;
    
    var Equatable: typeof import("./index").Equatable;
    var Comparable: typeof import("./index").Comparable;
    var StructuralEquatable: typeof import("./index").StructuralEquatable;
    var StructuralComparable: typeof import("./index").StructuralComparable;
    var Equaler: typeof import("./index").Equaler;
    var Comparer: typeof import("./index").Comparer;
    var SortedSet: typeof import("./collections").SortedSet;
    var SortedMap: typeof import("./collections").SortedMap;
    var HashSet: typeof import("./collections").HashSet;
    var HashMap: typeof import("./collections").HashMap;
}

(global as any).Equatable = Equatable;
(global as any).Comparable = Comparable;
(global as any).StructuralEquatable = StructuralEquatable;
(global as any).StructuralComparable = StructuralComparable;
(global as any).Equaler = Equaler;
(global as any).Comparer = Comparer;
(global as any).SortedSet = SortedSet;
(global as any).SortedMap = SortedMap;
(global as any).HashSet = HashSet;
(global as any).HashMap = HashMap;

Object.defineProperty(Object.prototype, Equatable.equals, {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (this: unknown, other: unknown) {
        return Object.is(this, other);
    }
});

Object.defineProperty(Object.prototype, Equatable.hash, {
    enumerable: false,
    configurable: true,
    writable: true,
    value: function (this: unknown) {
        return getHashCode(this);
    }
});

Object.defineProperty(String.prototype, Comparable.compareTo, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (this: string, other: unknown) {
        const s = String(other);
        if (this < s) return -1;
        if (this > s) return 1;
        return 0;
    }
});

Object.defineProperty(Number.prototype, Comparable.compareTo, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (this: number, other: unknown) {
        return this - Number(other);
    }
});

if (typeof BigInt === "function") {
    Object.defineProperty(BigInt.prototype, Comparable.compareTo, {
        enumerable: true,
        configurable: true,
        writable: true,
        value: function (this: bigint, other: unknown) {
            const i = BigInt(other);
            if (this < i) return -1;
            if (this > i) return 1;
            return 0;
        }
    });
}

Object.defineProperty(Boolean.prototype, Comparable.compareTo, {
    enumerable: true,
    configurable: true,
    writable: true,
    value: function (this: boolean, other: unknown) {
        const s = Boolean(other);
        if (this < s) return -1;
        if (this > s) return 1;
        return 0;
    }
});