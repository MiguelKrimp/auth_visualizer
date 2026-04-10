export function throwResponseError(response: Response): Promise<string> {
  return response
    .text()
    .then((text) => {
      return `${response.status}: ${text}`;
    })
    .catch(() => {
      return `${response.status}: ${response.statusText}`;
    })
    .then((message) => {
      throw new Error(message);
    });
}
