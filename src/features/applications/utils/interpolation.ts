/**
 * @author : Flavio Moreno
 * @mailto : contact@flaviomoreno.fr
 * @created : 2024-01-06
 **/

export function interpolateString(
  string: string,
  data: Record<string, string>,
): string {
  if (!string) {
    return '';
  }
  return string.replace(/{{(.*?)}}/g, (_, g) => data[g] ?? '');
}
