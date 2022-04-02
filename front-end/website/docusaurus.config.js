// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github');
const darkCodeTheme = require('prism-react-renderer/themes/dracula');

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Gilgamesh',
  tagline: 'The Future of Learning',
  url: 'https://your-docusaurus-test-site.com',
  baseUrl: '/',
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',
  favicon: 'img/logo.svg',
  organizationName: 'Gilgamesh-Learning', // Usually your GitHub org/user name.
  projectName: 'Learning-Platform', // Usually your repo name.

  presets: [
    [
      'classic',
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          sidebarPath: require.resolve('./sidebars.js'),
          // Please change this to your repo.
          editUrl: 'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        blog: {
          showReadingTime: true,
          // Please change this to your repo.
          editUrl:
            'https://github.com/facebook/docusaurus/tree/main/packages/create-docusaurus/templates/shared/',
        },
        theme: {
          customCss: require.resolve('./src/css/custom.css'),
        },
      }),
    ],
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      navbar: {
        title: 'Gilgamesh',
        logo: {
          alt: 'My Site Logo',
          src: 'img/logo.svg',
        },
        items: [
          {to: '/demo', label: 'Demo', position: 'left'},
          {
            href: 'https://github.com/Gilgamesh-Learning/Learning-Platform',
            label: 'GitHub',
            position: 'right',
          },
        ],
      },
      footer: {
        style: 'dark',
        links: [

         {
           title: 'Authors',
           items: [
             {
               label: 'Teodor Totev',
               href: 'https://github.com/teoet6',
             },
             {
               label: 'Liubomir Nenov',
               href: 'https://www.researchgate.net/profile/Liubomir-Nenov',
             },
             {
               label: 'Atanas Dimitrov',
               href: 'https://github.com/neNasko1',
             },
           ],
         },
         {
           title: 'Recources',
           items: [
             {
               label: 'Speech-to-text',
               href: 'https://cloud.google.com/speech-to-text',
             },
           ],
         },
         {
           title: 'More',
           items: [
             {
               label: 'GitHub',
               href: 'https://github.com/facebook/docusaurus',
             },
           ],
         },
       ],
        copyright: `Copyright © ${new Date().getFullYear()} Gilgamesh Learning, made for your last minute revisions. <3`,
      },
      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
      },
    }),
};

module.exports = config;
