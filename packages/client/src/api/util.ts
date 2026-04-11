export function throwResponseError(response: Response): Promise<string> {
  return response
    .text()
    .then((text) => {
      return [`${response.status}: ${response.statusText}`, text] as const;
    })
    .catch(() => {
      return [`${response.status}: ${response.statusText}`] as const;
    })
    .then((info) => {
      throw new ResponseError(info[0], info[1], response);
    });
}

export class ResponseError extends Error {
  constructor(
    message: string,
    public detailMsg?: string,
    public cause?: unknown,
  ) {
    super(message, { cause });
    this.detailMsg = detailMsg;
  }
}
