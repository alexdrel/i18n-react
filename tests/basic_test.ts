import { MDText } from '../src/i18n-react';

describe("i18n-react translate", () => {
  let T = new MDText({
    a: "A",
    aa: {
      b: {
        c: "AABC"
      }
    },
    b: "B",
    c: {
      a: "CA",
      b: "CB",
      _: "CX"
    },
    d: {
      a: "DA",
      b: "DB",
      c: "DC{val}"
    },
    plural: {
      "0": "No stars",
      "1": "A single star",
      _: "{context} stars"
    },
    self: {
      aabc: "{{aa.b.c}}",
      d: "{{d}}",
      dc: "{{d.c}}"
    }
  });

  it("empty values", () => {
    expect(T.translate(undefined)).toBe(undefined);
    expect(T.translate(null)).toBe(null);
    expect(T.translate("")).toBe("");
  });

  it("loads plain string", () => {
    expect(T.translate('a')).toBe('A');
    expect(T.translate('aa.b.c')).toBe('AABC');
    expect(T.translate('b')).toBe('B');
  });

  it("uses context (explicit default)", () => {
    expect(T.translate('c')).toBe('CX');
    expect(T.translate('c', {})).toBe('CX');

    expect(T.translate('c', { context: 'a' })).toBe('CA');
    expect(T.translate('c', { context: 'b' })).toBe('CB');
    expect(T.translate('c', { context: 'q' })).toBe('CX');
  });

  it("uses context (implicit - first as default)", () => {
    expect(T.translate('d')).toBe('DA');
    expect(T.translate('d', { context: 'a' })).toBe('DA');
    expect(T.translate('d', { context: 'b' })).toBe('DB');
    expect(T.translate('d', { context: 'q' })).toBe('DA');
  });

  it("ignores missing context", () => {
    expect(T.translate('b', { context: 'a' })).toBe('B');
  });

  it("can do basic plurals", () => {
    expect(T.translate('plural', { context: 0 })).toBe("No stars");
    expect(T.translate('plural', { context: 1 })).toBe("A single star");
    expect(T.translate('plural', { context: 2 })).toBe("2 stars");
    expect(T.translate('plural', { context: 5 })).toBe("5 stars");
  });

  it("can reference keys", () => {
    expect(T.translate('self.aabc')).toBe("AABC");
    expect(T.translate('self.d', { context: 'b' })).toBe("DB");
  });

  it("can reference keys with params", () => {
    expect(T.translate('self.dc', { val: 'X' })).toBe("DCX");
  });

  it("handles missing keys", () => {
    expect(T.translate('na.na')).toBe("na.na");
    expect(T.translate('na.na', { context: 'X' })).toBe("na.na");
    expect(T.translate('na.na', { notFound: 'NA' })).toBe("NA");
    T.notFound = 'NA';
    expect(T.translate('na.na')).toBe("NA");
    expect(T.translate('na.na', { notFound: 'NA' })).toBe("NA");
    T.notFound = null;
    expect(T.translate('na.na')).toBeNull();
    T.notFound = (key) => key + ' not found';
    expect(T.translate('na.na')).toBe('na.na not found');
    T.notFound = undefined;
    expect(T.translate('na.na')).toBe("na.na");
    let T1 = new MDText({}, { notFound: 'NA' });
    expect(T1.translate('na.na')).toBe("NA");
    expect(T1.translate('na.na', { notFound: null })).toBe(null);

    T1 = new MDText({}, { notFound: null });
    expect(T1.translate('na.na')).toBe(null);
    expect(T1.translate('na.na', { notFound: 'NA' })).toBe('NA');

    T1 = new MDText({}, { notFound: undefined }); // leaves default
    expect(T1.translate('na.na')).toBe("na.na");
    expect(T1.translate('na.na', { notFound: 'NA' })).toBe('NA');
    expect(T1.translate('na.na', { notFound: null })).toBe(null);

    T1 = new MDText({}, { notFound: (key) => key + ' not found' });
    expect(T1.translate('na.na')).toBe('na.na not found');
    T1 = new MDText({}, { notFound: (key, ctx) => key + ' not found, a:' + ctx.a });
    expect(T1.translate('na.na', { context: { a: 1 } })).toBe('na.na not found, a:1');
  });
});

describe("i18n-react format", () => {
  let T = new MDText(null, { MDFlavor: 1 });
  it("empty values", () => {
    expect(T.format(undefined)).toBe(undefined);
    expect(T.format(null)).toBe(null);
    expect(T.format("")).toBe("");
  });

  it("interpolates variable", () => {
    expect(T.format("{val}", { val: 'x' })).toBe('x');
    expect(T.format("b{val}", { val: 'x' })).toBe('bx');
    expect(T.format("{val}c", { val: 'x' })).toBe('xc');
    expect(T.format("d{val}d", { val: 'x' })).toBe('dxd');
  });

  it("leaves literal", () => {
    expect(T.format("``{val}``", { val: 'x' })).toBe('{val}');
    expect(T.format("``[*b*]``")).toBe('[*b*]');
    expect(T.format("``[``a``]``")).toBe('[a]');
    expect(T.format("``[*b*]``{val}``[*b*]``", { val: 'x' })).toBe('[*b*]x[*b*]');
    expect(T.format("{val}``[*b*]``{val}", { val: 'x' })).toBe('x[*b*]x');
  });

  it("localizes numbers", () => {
    expect(T.format("{val,l}", { val: 10000 })).toMatch(/10[,']?000/);
  });

  it("returns string type", () => {
    expect(T.format("{val}", { val: 0 })).toBe('0');
  });
});

