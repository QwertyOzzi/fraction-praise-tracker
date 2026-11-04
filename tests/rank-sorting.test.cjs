const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const html = fs.readFileSync("index.html", "utf8");

const begin = html.indexOf("    function rankSortValue(value) {");
const end = html.indexOf("    // Render Table Rows", begin);
assert(begin >= 0 && end > begin, "Display-only rank sorting functions must exist");
const {rankSortValue, sortedAgentEntries} = vm.runInNewContext(
  html.slice(begin, end) + "\n({rankSortValue, sortedAgentEntries})"
);
assert.equal(rankSortValue("X"), 10);
assert.equal(rankSortValue("10 (Лидер)"), 10);
assert.equal(rankSortValue("9 (Зам)"), 9);
assert.equal(rankSortValue("8"), 8);
assert.equal(rankSortValue("1-3"), 1);
assert.equal(rankSortValue("?"), 0);

const source = [
  {nick:"Last_One", rank:"4", qty:4},
  {nick:"Zeta_Eight", rank:"8", qty:8},
  {nick:"First_One", rank:"X", qty:10},
  {nick:"Alpha_Eight", rank:"8", qty:6},
  {nick:"Deputy", rank:"9", qty:9},
  {nick:"Lowest", rank:"1", qty:1},
];
const original = JSON.stringify(source);
const result = Array.from(sortedAgentEntries(source), x=>({nick:x.row.nick, index:x.index}));
assert.deepEqual(result.map(x=>x.nick), [
  "First_One", "Deputy", "Alpha_Eight", "Zeta_Eight", "Last_One", "Lowest"
]);
assert.deepEqual(result.map(x=>x.index), [2,4,3,1,0,5]);
assert.equal(JSON.stringify(source), original, "Rendering must not mutate cloud data");
assert(html.includes("sortedAgentEntries(rows).forEach(({ row, index }) => {"));
assert(html.includes('onclick="changeQty(${index}, -1)"'));
assert(html.includes('onclick="deleteRow(${index})"'));
assert(html.includes('<td class="cell-num">${visibleCount}</td>'));
console.log("Rank sorting, identity-safe edit indices and view-only ordering passed");
