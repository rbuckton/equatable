import { getHashCode } from "../internal/hashCode";

const state = getHashCode.getState();

beforeEach(() => {
    getHashCode.setState({ 
        objectSeed: 0x1dc8529e,
        stringSeed: 0x6744b005,
        bigIntSeed: 0x6c9503bc,
        localSymbolSeed: 0x78819b01,
        globalSymbolSeed: 0x1875c170
    });
});

afterEach(() => {
    getHashCode.setState(state);
});

it("null", () => expect(getHashCode(null)).toBe(0));
it("undefined", () => expect(getHashCode(undefined)).toBe(0));
it("true", () => expect(getHashCode(true)).toBe(1));
it("false", () => expect(getHashCode(false)).toBe(0));
it("0", () => expect(getHashCode(0)).toBe(0));
it("1", () => expect(getHashCode(1)).toBe(1));
it("1.2", () => expect(getHashCode(1.2)).toBe(49164));
it('""', () => expect(getHashCode("")).toBe(-293397629));
it('"abc"', () => expect(getHashCode("abc")).toBe(38704718));
it("123n", () => expect(getHashCode(123n)).toBe(251));
it("{}", () => expect(getHashCode({})).toBe(-467054833));
it("same {}", () => (obj => expect(getHashCode(obj)).toBe(getHashCode(obj)))({}));
it("different {}", () => expect(getHashCode({})).not.toBe(getHashCode({})));
it("symbol", () => expect(getHashCode(Symbol())).toBe(1087209661));
it("same symbol", () => (sym => expect(getHashCode(sym)).toBe(getHashCode(sym)))(Symbol()));
it("different symbols", () => expect(getHashCode(Symbol())).not.toBe(getHashCode(Symbol())));
it("built-in symbol", () => expect(getHashCode(Symbol.iterator)).toBe(1087209661));
it("symbol.for", () => expect(getHashCode(Symbol.for("foo"))).toBe(-1197376351));