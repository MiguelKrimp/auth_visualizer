export function uploadFile(fileExtensions?: string[]): Promise<File> {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = fileExtensions?.join() || '';
  document.body.appendChild(input);

  return new Promise<File>((resolve, reject) => {
    const focusListener = (): void => {
      document.body.onfocus = null;
      setTimeout(() => {
        if (input.files?.length === 0) {
          reject();
        }
      }, 500);
    };

    input.onchange = (): void => {
      const file = input.files?.item(0);
      if (file) {
        resolve(file);
      } else {
        reject();
      }
    };
    document.body.onfocus = focusListener;

    input.click();
  }).finally(() => {
    document.body.removeChild(input);
  });
}
