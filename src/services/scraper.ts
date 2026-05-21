export interface ScrapedJob {
  title: string;
  company: string;
  description: string;
  url: string;
}

/**
 * Extracts the main text from an HTML string by applying custom selectors or falling back to general text extraction.
 */
function parseJobHtml(html: string, url: string): ScrapedJob {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, 'text/html');

  // Remove styling, scripts, inputs, navigation, footers to avoid noise
  const removeElements = doc.querySelectorAll('script, style, iframe, nav, footer, header, form, input, button, noscript');
  removeElements.forEach(el => el.remove());

  let title = '';
  let company = '';
  let description = '';

  const lowerUrl = url.toLowerCase();

  if (lowerUrl.includes('greenhouse.io')) {
    // Greenhouse selectors
    title = doc.querySelector('.app-title')?.textContent?.trim() || 
            doc.querySelector('h1')?.textContent?.trim() || '';
    company = doc.querySelector('.company-name')?.textContent?.trim() || '';
    
    // Clean up "at [Company]" in title
    if (title && company && title.includes(' at ')) {
      title = title.split(' at ')[0].trim();
    }
    
    const contentArea = doc.querySelector('#content') || doc.querySelector('.job-body') || doc.querySelector('#main');
    description = contentArea ? extractTextAndFormat(contentArea) : '';

  } else if (lowerUrl.includes('lever.co')) {
    // Lever selectors
    title = doc.querySelector('.posting-header h2')?.textContent?.trim() || 
            doc.querySelector('h2')?.textContent?.trim() || '';
    company = doc.querySelector('.posting-header .company-logo')?.getAttribute('alt')?.replace('logo', '').trim() || '';
    
    const contentArea = doc.querySelector('.section-wrapper .posting-content') || doc.querySelector('.posting-container');
    description = contentArea ? extractTextAndFormat(contentArea) : '';

  } else if (lowerUrl.includes('ashbyhq.com') || lowerUrl.includes('ashby.co')) {
    // Ashby selectors
    title = doc.querySelector('h1')?.textContent?.trim() || '';
    company = doc.title.split('-')[0]?.trim() || '';
    
    const contentArea = doc.querySelector('.ashby-job-posting') || doc.querySelector('[class*="jobDescription"]');
    description = contentArea ? extractTextAndFormat(contentArea) : '';

  } else if (lowerUrl.includes('linkedin.com')) {
    // LinkedIn Public Job posting
    title = doc.querySelector('.top-card-layout__title')?.textContent?.trim() || 
            doc.querySelector('.job-search-card__title')?.textContent?.trim() || 
            doc.querySelector('h1')?.textContent?.trim() || '';
            
    company = doc.querySelector('.topcard__org-name-link')?.textContent?.trim() || 
              doc.querySelector('.top-card-layout__delegate-link')?.textContent?.trim() || '';

    const contentArea = doc.querySelector('.show-more-less-html__markup') || 
                        doc.querySelector('.description__text') || 
                        doc.querySelector('#job-details');
    description = contentArea ? extractTextAndFormat(contentArea) : '';
  }

  // General fallback parsing if specific selectors failed
  if (!title) {
    title = doc.querySelector('h1')?.textContent?.trim() || doc.title || 'Target Job Posting';
  }
  if (!company) {
    // Attempt to guess company name from title "Software Engineer at Google"
    const titleText = doc.title || '';
    if (titleText.includes(' at ')) {
      company = titleText.split(' at ')[1]?.split('|')[0]?.split('-')[0]?.trim() || '';
    } else if (titleText.includes(' | ')) {
      company = titleText.split(' | ')[0]?.trim() || '';
    }
  }
  if (!description) {
    // Grab main element or body
    const mainElement = doc.querySelector('main') || doc.querySelector('article') || doc.body;
    description = extractTextAndFormat(mainElement);
  }

  return {
    title: title || 'Job Listing',
    company: company || 'Target Company',
    description: description || 'Failed to extract text content.',
    url
  };
}

/**
 * Traverses a DOM tree and formats headings and lists into readable markdown-like plaintext
 */
function extractTextAndFormat(element: Element): string {
  let text = '';
  
  function traverse(node: Node) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent;
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const el = node as Element;
      const tagName = el.tagName.toLowerCase();
      
      // Formatting based on element types
      if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(tagName)) {
        text += '\n\n### ';
      } else if (tagName === 'p') {
        text += '\n\n';
      } else if (tagName === 'li') {
        text += '\n- ';
      } else if (tagName === 'br') {
        text += '\n';
      } else if (tagName === 'div' && el.classList.contains('job-section')) {
        text += '\n\n';
      }
      
      for (let i = 0; i < el.childNodes.length; i++) {
        traverse(el.childNodes[i]);
      }
      
      if (['h1', 'h2', 'h3', 'h4', 'h5'].includes(tagName)) {
        text += '\n';
      }
    }
  }

  traverse(element);
  
  // Clean up double newlines and trailing white space
  return text
    .replace(/\n{3,}/g, '\n\n')
    .replace(/[ \t]+/g, ' ')
    .trim();
}

/**
 * Scrapes a target job posting by proxying the request through AllOrigins CORS proxy.
 */
export async function scrapeJobDescription(url: string): Promise<ScrapedJob> {
  const cleanUrl = url.trim();
  if (!cleanUrl) {
    throw new Error('Please provide a valid URL.');
  }

  try {
    // Direct link proxying using AllOrigins API
    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(cleanUrl)}`;
    const response = await fetch(proxyUrl);
    
    if (!response.ok) {
      throw new Error(`Proxy error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data.contents) {
      throw new Error('Proxy returned empty HTML contents.');
    }

    return parseJobHtml(data.contents, cleanUrl);
  } catch (error) {
    console.error('AllOrigins Scraping error: ', error);
    
    // In case proxy falls over or fails, we can fall back to standard fetch (in case CORS is not enabled on local dev environment)
    // or return a friendly fallback error.
    throw new Error(`Scraper failed: CORS restrictions or network block. You can manually copy and paste the Job Description below.`, { cause: error });
  }
}
