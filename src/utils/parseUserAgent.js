// utils/parseUserAgent.js

/**
 * Parses a user-agent string to extract browser, OS, and device information.
 *
 * @param {string} userAgent - The user-agent string to parse.
 * @returns {Object} An object containing browser, os, and device information.
 */
const parseUserAgent = (userAgent) => {
    const parser = {
      browser: 'Unknown',
      os: 'Unknown',
      device: 'Desktop', // Default to Desktop
    };
  
    // Define regex patterns for browsers
    const browserPatterns = [
      { name: 'Chrome', regex: /Chrome\/([0-9.]+)/ },
      { name: 'Firefox', regex: /Firefox\/([0-9.]+)/ },
      { name: 'Safari', regex: /Version\/([0-9.]+).*Safari/ },
      { name: 'Edge', regex: /Edg\/([0-9.]+)/ },
      { name: 'Opera', regex: /OPR\/([0-9.]+)/ },
      { name: 'Internet Explorer', regex: /MSIE\s([0-9.]+)/ },
      // Add more browsers as needed
    ];
  
    // Define regex patterns for operating systems
    const osPatterns = [
      { name: 'Windows', regex: /Windows NT ([0-9.]+)/ },
      { name: 'macOS', regex: /Mac OS X ([0-9_]+)/ },
      { name: 'iOS', regex: /iPhone OS ([0-9_]+)/ },
      { name: 'Android', regex: /Android ([0-9.]+)/ },
      { name: 'Linux', regex: /Linux/ },
      // Add more OS patterns as needed
    ];
  
    // Detect browser
    for (const pattern of browserPatterns) {
      const match = userAgent.match(pattern.regex);
      if (match) {
        parser.browser = `${pattern.name} ${match[1]}`;
        break;
      }
    }
  
    // Detect OS
    for (const pattern of osPatterns) {
      const match = userAgent.match(pattern.regex);
      if (match) {
        parser.os = `${pattern.name} ${match[1].replace(/_/g, '.')}`;
        break;
      }
    }
  
    // Detect device type
    if (/Mobile|Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent)) {
      parser.device = 'Mobile';
    } else if (/Tablet|iPad/i.test(userAgent)) {
      parser.device = 'Tablet';
    } else {
      parser.device = 'Desktop';
    }
  
    return parser;
  };
  
  export default parseUserAgent;
  