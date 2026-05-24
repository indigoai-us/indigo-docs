import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightClientMermaid from "@pasqal-io/starlight-client-mermaid";

export default defineConfig({
  redirects: {
    "/hq/architecture/2-monorepo/": "/hq/architecture/2-ecosystem/",
    "/hq/roadmap/2-v5-launch/": "/hq/roadmap/2-shipped-and-next/",
  },
  integrations: [
    starlight({
      plugins: [starlightClientMermaid()],
      title: "Indigo HQ Docs",
      description:
        "Documentation for Indigo HQ — the OS for AI workers.",
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
    }),
  ],
});
