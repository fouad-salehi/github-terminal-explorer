import chalk from "chalk";
import Table from "cli-table3";

export function title(value) {
  console.log(chalk.bold.cyan("\n" + value + "\n"));
}

export function info(label, value) {
  console.log(chalk.gray(label + ": ") + chalk.white(String(value ?? "N/A")));
}

export function table(headers, rows) {
  const output = new Table({ head: headers });
  rows.forEach(row => output.push(row));
  console.log(output.toString());
}

export function number(value) {
  return Number(value || 0).toLocaleString();
}

export function date(value) {
  return value ? new Date(value).toLocaleString() : "N/A";
}