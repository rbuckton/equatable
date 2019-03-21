# `equatable`

The `equatable` package provides a low level API for defining equality.

# Installation

```sh
npm i equatable
```

# Usage

## Basic Usage

```ts
import { Equatable, Equaler, Comparable, Comparer } from "equatable"; 

class Person {
    constructor(firstName, lastName) {
        this.firstName = firstName;
        this.lastName = lastName;
    }

    toString() {
        return `${this.firstName} ${this.lastName}`;
    }

    [Equatable.equals](other) {
        return other instanceof Person
            && this.lastName === other.lastName
            && this.firstName === other.firstName;
    }

    [Equatable.hash]() {
        return Equaler.defaultEqualer.hash(this.lastName)
             ^ Equaler.defaultEqualer.hash(this.firstName);
    }

    [Comparable.compareTo](other) {
        if (!(other instanceof Person)) throw new TypeError();
        return Comparer.defaultComparer.compare(this.lastName, other.lastName)
            || Comparer.defaultComparer.compare(this.firstName, other.firstName);
    }
}

const people = [
    new Person("Alice", "Johnson")
    new Person("Bob", "Clark"),
];
people.sort(Comparer.defaultComparer.compare);
console.log(people); // Bob Clark,Alice Johnson

const obj1 = new Person("Bob", "Clark");
const obj2 = new Person("Bob", "Clark");
obj1 === obj2; // false
Equaler.defaultEqualer.equals(obj1, obj2); // true
```

## Collections

This package includes a module of collection types in `equatable/collections` that can leverage these low level APIs:

### HashSet/HashMap

```ts
import { HashSet } from "equatable/collections";

// NOTE: see definition of Person above
const obj1 = new Person("Bob", "Clark");
const obj2 = new Person("Bob", "Clark");

const set = new Set(); // native ECMAScript Set
set.add(obj1);
set.add(obj2);
set.length; // 2

const hashSet = new HashSet();
hashSet.add(obj1);
hashSet.add(obj2);
hashSet.length; // 1
```

### SortedSet/SortedMap

```ts
import { SortedSet } from "equatable/collections";

// NOTE: see definition of Person above
const obj1 = new Person("Alice", "Johnson");
const obj2 = new Person("Bob", "Clark");

// ECMAScript native set iterates in insertion order
const set = new Set(); // native ECMAScript Set
set.add(obj1);
set.add(obj2);
[...set]; // Alice Johnson,Bob Clark

// SortedSet uses Comparable.compareTo if available
const sortedSet = new SortedSet();
sortedSet.add(obj1);
sortedSet.add(obj2);
[...sortedSet]; // Bob Clark,Alice Johnson
```

## Global Shim

The global shim adds a default implementation of `Equatable` to `Object.prototype` and default implementations of 
`Comparable` to `String.prototype`, `Number.prototype`, `Boolean.prototype`, and `BigInt.prototype`.

It also adds the following values to the global scope:
- `Equatable` (from `equatable`)
- `Comparable` (from `equatable`)
- `StructuralEquatable` (from `equatable`)
- `StructuralComparable` (from `equatable`)
- `Equaler` (from `equatable`)
- `Comparer` (from `equatable`)
- `SortedSet` (from `equatable/collections`)
- `SortedMap` (from `equatable/collections`)
- `HashSet` (from `equatable/collections`)
- `HashMap` (from `equatable/collections`)

To install the global shim, import `equatable/global`:

```ts
import "equatable/global"; // triggers global-scope side effects

123[Equatable.hash]() // 123
```