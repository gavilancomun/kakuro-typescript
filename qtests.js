/* jshint esnext: true */
/* jshint devel: true */

// expected and actual are swapped since the source is derived from JUnit tests.

"use strict";

QUnit.assert.cellEquals = function(expected, actual) {
  this.pushResult({
    result: expected.equals(actual),
    actual: actual,
    expected: expected,
    message: "cell equality"
  });
};

QUnit.test("DrawRow", function(assert) {
  const line = [da(3, 4), v(), v(1, 2), d(4), e(), a(5), v(4), v(1)];
  const result = drawRow(line);
  console.log(result);
  assert.equal("    3\\ 4   123456789 12.......    4\\--     -----     --\\ 5       4         1    \n", result);
});

//
QUnit.module("Transform");

QUnit.test("Permute", function(assert) {
  const vs = [v(), v(), v()];
  const results = permuteAll(vs, 6);
  console.log(results);
  assert.equal(10, results.length);
  const diff = results.filter(p => allDifferent(p));
  assert.equal(6, diff.length);
});

QUnit.test("Transpose", function(assert) {
  const ints = [[1, 2, 3, 4], [1, 2, 3, 4], [1, 2, 3, 4]];
  const tr = transpose(ints);
  console.log(ints);
  console.log(tr);
  assert.equal(ints.length, tr[0].length);
  assert.equal(ints[0].length, tr.length);
  assert.deepEqual([], transpose([]));
  assert.deepEqual([], transpose([[]]));
});

QUnit.test("TakeWhile", function(assert) {
  const result = takeWhile(n => n < 4, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
  console.log(result);
  assert.equal(4, result.length);
});

QUnit.test("Concat", function(assert) {
  const a = [1, 2, 3];
  const b = [4, 5, 6, 1, 2, 3];
  const result = concatLists(a, b);
  console.log(result);
  assert.equal(9, result.length);
});

QUnit.test("Drop", function(assert) {
  const a = [1, 2, 3, 4, 5, 6];
  const result = drop(4, a);
  console.log(result);
  assert.equal(2, result.length);
});

QUnit.test("Take", function(assert) {
  const a = [1, 2, 3, 4, 5, 6];
  const result = take(4, a);
  console.log(result);
  assert.equal(4, result.length);
});

QUnit.test("PartBy", function(assert) {
  const data = [1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 7, 8, 9];
  const result = partitionBy(n => 0 === (n % 2), data);
  console.log(result);
  assert.equal(9, result.length);
});

QUnit.test("PartAll", function(assert) {
  const data = [1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 7, 8, 9];
  const result = partitionAll(5, 3, data);
  console.log(result);
  assert.equal(5, result.length);
});

QUnit.test("PartN", function(assert) {
  const data = [1, 2, 2, 2, 3, 4, 5, 5, 6, 7, 7, 8, 9];
  const result = partitionN(5, data);
  console.log(result);
  assert.equal(3, result.length);
});

//
QUnit.module("Solve");

QUnit.test("SolveStep", function(assert) {
  const result = solveStep([v(1, 2), v()], 5);
  console.log("solve step result " + result);
  assert.cellEquals(v(1, 2), result[0]);
  assert.cellEquals(v(3, 4), result[1]);
});

//
QUnit.module("Group");

QUnit.test("GatherValues", function(assert) {
  const line = [da(3, 4), v(), v(), d(4), e(), a(4), v(), v()];
  const result = gatherValues(line);
  console.log("gather " + result);
  assert.equal(4, result.length);
  assert.deepEqual(da(3, 4), result[0][0]);
  assert.deepEqual(d(4), result[2][0]);
  assert.deepEqual(e(), result[2][1]);
  assert.deepEqual(a(4), result[2][2]);
});

QUnit.test("PairTargets", function(assert) {
  const line = [da(3, 4), v(), v(), d(4), e(), a(4), v(), v()];
  const result = pairTargetsWithValues(line);
  console.log("pair " + result);
  assert.equal(2, result.length);
  assert.deepEqual(da(3, 4), result[0][0][0]);
  assert.deepEqual(d(4), result[1][0][0]);
  assert.deepEqual(e(), result[1][0][1]);
  assert.deepEqual(a(4), result[1][0][2]);
});

//
QUnit.module("Solve");

QUnit.test("SolvePair", function(assert) {
  const line = [da(3, 4), v(), v(), d(4), e(), a(4), v(), v()];
  const pairs = pairTargetsWithValues(line);
  const pair = pairs[0];
  const result = solvePair(cell => cell.getDown(), pair);
  console.log("solvePair " + result);
  assert.equal(3, result.length);
  assert.cellEquals(v(1, 2), result[1]);
  assert.cellEquals(v(1, 2), result[2]);
});


QUnit.test("SolveLine", function(assert) {
  const line = [da(3, 4), v(), v(), d(4), e(), a(5), v(), v()];
  const result = solveLine(line, x => x.getAcross());
  console.log("solve line " + result);
  assert.equal(8, result.length);
  assert.cellEquals(v(1, 3), result[1]);
  assert.cellEquals(v(1, 3), result[2]);
  assert.cellEquals(v(1, 2, 3, 4), result[6]);
  assert.cellEquals(v(1, 2, 3, 4), result[7]);
});

QUnit.test("SolveRow", function(assert) {
  const result = solveRow([a(3), v(1, 2, 3), v(1)]);
  console.log("solve row " + result);
  assert.cellEquals(v(2), result[1]);
  assert.cellEquals(v(1), result[2]);
});

QUnit.test("SolveCol", function(assert) {
  const result = solveColumn([da(3, 12), v(1, 2, 3), v(1)]);
  console.log("solve col " + result);
  assert.cellEquals(v(2), result[1]);
  assert.cellEquals(v(1), result[2]);
});

QUnit.test("Solver", function(assert) {
  const grid1 = [
    [e(), d(4), d(22), e(), d(16), d(3)],
    [a(3), v(), v(), da(16, 6), v(), v()],
    [a(18), v(), v(), v(), v(), v()],
    [e(), da(17, 23), v(), v(), v(), d(14)],
    [a(9), v(), v(), a(6), v(), v()],
    [a(15), v(), v(), a(12), v(), v()]];
  const result = solver(grid1);
  assert.equal("   --\\ 3       1         2       16\\ 6       4         2    \n", drawRow(result[1]));
  assert.equal("   --\\18       3         5         7         2         1    \n", drawRow(result[2]));
  assert.equal("   -----     17\\23       8         9         6       14\\--  \n", drawRow(result[3]));
  assert.equal("   --\\ 9       8         1       --\\ 6       1         5    \n", drawRow(result[4]));
  assert.equal("   --\\15       9         6       --\\12       3         9    \n", drawRow(result[5]));
});

