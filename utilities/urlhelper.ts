export const isValidHttpUrl = (incomingUrl: string) : boolean => {
  let url: URL;

  try {
    url = new URL(incomingUrl);
  } catch (_) {
    return false;
  }

  return url.protocol === "http:" || url.protocol === "https:";
};
