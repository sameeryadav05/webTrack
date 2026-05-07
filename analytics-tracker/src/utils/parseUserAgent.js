import {UAParser} from "ua-parser-js";

const parseUserAgent = (userAgent) => {
  const parser = new UAParser(userAgent);

  return {
    browser: parser.getBrowser().name || "Unknown",

    os: parser.getOS().name || "Unknown",

    device: parser.getDevice().type || "Desktop",
  };
};

export default parseUserAgent;