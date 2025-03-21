export default function injectTemplate(template: string, values: any[]) {
  return template?.replace(/{{(\d+)}}/g, (_, index) => values[index - 1] || "");
}
