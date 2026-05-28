/// <reference types="astro/client" />

// Cloudflare Email Workers — cloudflare:email module types
// (available at runtime in CF Workers; no package needed)
declare module 'cloudflare:email' {
  export class EmailMessage {
    constructor(from: string, to: string, raw: ReadableStream);
  }
}
