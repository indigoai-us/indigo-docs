import { defineConfig } from "astro/config";
import starlight from "@astrojs/starlight";
import starlightClientMermaid from "@pasqal-io/starlight-client-mermaid";

export default defineConfig({
  site: "https://docs.hq.computer",
  redirects: {
    "/hq/architecture/2-monorepo/": "/hq/architecture/2-ecosystem/",
    "/hq/roadmap/2-v5-launch/": "/hq/roadmap/2-shipped-and-next/",
    "/hq/products/capabilities/agents-in-slack/": "/hq/products/fleet-agents/channels/",
    "/hq/guide/diy-method/": "/hq/guide/use-hq-for-free/",
    "/hq/products/hq-pro/cognito-setup/": "/hq/products/hq-pro/about/",
    "/hq/products/hq-pro/overview/": "/hq/products/hq-pro/about/",
    "/hq/products/hq-pro/quickstart/": "/hq/products/hq-pro/about/",
    "/hq/products/hq-pro/troubleshooting/": "/hq/products/hq-pro/about/",
    "/hq/products/hq-pro/github-auth/": "/hq/products/hq-pro/about/",
    "/hq/products/hq-pro/onboarding/": "/hq/products/hq-pro/access/",
    "/hq/products/hq-pro/platform/": "/hq/products/hq-pro/about/",
    "/hq/products/hq-pro/commands-v0/": "/hq/products/hq-pro/about/",
    "/hq/products/hq-packages/registry-api/": "/hq/products/hq-packages/overview/",
    "/hq/products/hq-packages/claude-merge/": "/hq/products/hq-packages/overview/",
    "/hq/products/hq-packages/cli-install/": "/hq/products/hq-packages/overview/",
    "/hq/products/hq-packages/spec-v2/": "/hq/products/hq-packages/overview/",
    "/hq/products/hq-deploy/upgrades/": "/hq/products/hq-deploy/cli/",
    "/hq/products/hq-deploy/enterprise-init/": "/hq/products/hq-deploy/cli/",
    "/hq/architecture/3-create-hq/": "/hq/products/hq-core/",
    "/hq/architecture/5-hq-cloud/": "/hq/products/hq-cloud/",
    "/hq/architecture/6-infrastructure/": "/hq/architecture/1-overview/",
    "/hq/architecture/7-pwa/": "/hq/architecture/1-overview/",
    "/hq/architecture/9-api-reference/": "/hq/architecture/1-overview/",
    "/hq/development/4-template-updates/": "/hq/development/3-publishing-packages/",
    "/hq/roadmap/3-cloud-sync-ga/": "/hq/roadmap/2-shipped-and-next/",
    "/hq/roadmap/4-pwa-improvements/": "/hq/roadmap/2-shipped-and-next/",
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
          content: `document.addEventListener('DOMContentLoaded',()=>{document.querySelectorAll('.social-icons a, header a[rel="me"]').forEach(a=>{a.setAttribute('target','_blank');a.setAttribute('rel','noopener noreferrer')});const s=document.querySelector('.social-icons');if(s){const l=document.createElement('a');l.href='https://www.hqforwork.com';l.target='_blank';l.rel='noopener noreferrer';l.textContent='hqforwork.com';l.className='site-link';s.parentNode.insertBefore(l,s)}});`,
        },
      ],
      customCss: ["./src/styles/custom.css"],
      sidebar: [
        {
          label: "Product Guide",
          autogenerate: { directory: "hq/guide" },
        },
        {
          label: "Products",
          items: [
            { label: "hq-core", link: "/hq/products/hq-core/" },
            { label: "hq-cli", link: "/hq/products/hq-cli/" },
            { label: "hq CLI reference", link: "/hq/products/hq-cli-reference/" },
            { label: "HQ anywhere", link: "/hq/products/hq-anywhere/" },
            { label: "hq-cloud", link: "/hq/products/hq-cloud/" },
            { label: "hq-sync", link: "/hq/products/hq-sync/" },
            { label: "HQ Workspace", link: "/hq/products/hq-workspace/" },
            { label: "hq-console", link: "/hq/products/hq-console/" },
            { label: "Grok Build Desktop", link: "/hq/products/grok-build-desktop/" },
            { label: "Fleet Agents", autogenerate: { directory: "hq/products/fleet-agents" } },
            { label: "hq-deploy", autogenerate: { directory: "hq/products/hq-deploy" } },
            { label: "hq-pro", autogenerate: { directory: "hq/products/hq-pro" } },
            { label: "hq-packages", autogenerate: { directory: "hq/products/hq-packages" } },
            {
              label: "Capabilities",
              items: [
                { label: "External Connections", link: "/hq/products/capabilities/external-connections/" },
                { label: "hq-share", link: "/hq/products/capabilities/hq-share/" },
                { label: "hq-secrets", link: "/hq/products/capabilities/hq-secrets/" },
                { label: "Slack Bot Factory", link: "/hq/products/capabilities/slack-bot-factory/" },
                { label: "Message forwarding", link: "/hq/products/capabilities/message-forwarding/" },
                { label: "HQ MCP", link: "/hq-in-chat/" },
              ],
            },
          ],
        },
        {
          label: "Architecture",
          autogenerate: { directory: "hq/architecture" },
        },
        {
          label: "Security",
          autogenerate: { directory: "hq/security" },
        },
        {
          label: "Development",
          autogenerate: { directory: "hq/development" },
        },
        {
          label: "Roadmap",
          autogenerate: { directory: "hq/roadmap" },
        },
        {
          label: "Reference",
          items: [
            { label: "Glossary", link: "/glossary/" },
            { label: "HQ vs. alternatives", link: "/comparison/" },
          ],
        },
      ],
    }),
  ],
});
