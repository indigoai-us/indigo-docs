import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightClientMermaid from "@pasqal-io/starlight-client-mermaid";

export default defineConfig({
  integrations: [
    starlight({
      plugins: [starlightClientMermaid()],
      title: "Indigo Docs",
      description:
        "Documentation for Indigo Desktop, Indigo CLI, and Indigo HQ",
      logo: {
        src: "./src/assets/logo.svg",
        replacesTitle: true,
      },
      favicon: "/favicon.ico",
      social: {
        github: "https://github.com/indigoai-us",
        "x.com": "https://x.com/getindigo",
      },
      head: [
        {
          tag: "link",
          attrs: {
            rel: "apple-touch-icon",
            sizes: "180x180",
            href: "/apple-touch-icon.png",
          },
        },
        {
          tag: "script",
          content: `document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.social-icons a, header a[rel="me"]').forEach(a=>{a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer')});const s=document.querySelector('.social-icons');if(s){const l=document.createElement('a');l.href='https://getindigo.ai';l.target='_blank';l.rel='noopener noreferrer';l.textContent='getindigo.ai';l.className='site-link';s.parentNode.insertBefore(l,s)}});`,
        },
      ],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Indigo Desktop",
          items: [
            { slug: "desktop/overview" },
            { slug: "desktop/getting-started" },
            {
              label: "Features",
              items: [
                { slug: "desktop/transcription" },
                { slug: "desktop/decisions-and-actions" },
                { slug: "desktop/ai-chat" },
              ],
            },
            { slug: "desktop/pricing" },
          ],
        },
        {
          label: "Indigo CLI",
          items: [
            { slug: "cli/overview" },
            { slug: "cli/getting-started" },
            {
              label: "Commands",
              items: [
                { slug: "cli/commands/auth" },
                { slug: "cli/commands/signals" },
                { slug: "cli/commands/meetings" },
                { slug: "cli/commands/config" },
                { slug: "cli/commands/mcp" },
              ],
            },
            {
              label: "Skills",
              items: [
                { slug: "cli/skills/overview" },
                { slug: "cli/skills/authentication" },
                { slug: "cli/skills/signals" },
                { slug: "cli/skills/meetings" },
                { slug: "cli/skills/setup" },
                { slug: "cli/skills/workflows" },
              ],
            },
            { slug: "cli/automation" },
          ],
        },
        {
          label: "MCP Server",
          items: [
            { slug: "mcp/overview" },
            { slug: "mcp/collections" },
            { slug: "mcp/tools" },
            { slug: "mcp/queries" },
            { slug: "mcp/use-cases" },
            { slug: "mcp/troubleshooting" },
          ],
        },
        {
          label: "Indigo HQ",
          items: [
            {
              label: "Product Guide",
              autogenerate: { directory: "hq/guide" },
            },
            {
              label: "Architecture",
              autogenerate: { directory: "hq/architecture" },
            },
            {
              label: "Development",
              autogenerate: { directory: "hq/development" },
            },
            {
              label: "Roadmap",
              autogenerate: { directory: "hq/roadmap" },
            },
          ],
        },
      ],
    }),
  ],
});
