'use client';
import FooterLinks from './FooterLinks';

export interface FooterLink {
  text: string;
  href: string;
}

export interface SocialLink {
  platform: string;
  href: string;
  target?: string;
}

export interface FooterData {
  columns: { links: FooterLink[] }[];
  socials: SocialLink[];
  // copyright: string;
}

// const getCurrentYear = () => new Date().getFullYear();

const footerData = {
  columns: [
    {
      links: [
        { text: 'HELP', href: '/hjalp' },
        { text: 'MY PURCHASES', href: '/mina-kop' },
        { text: 'RETURNS', href: '/returneringar' },
      ],
    },
    {
      links: [
        { text: 'COMPANY', href: '/foretag' },
        { text: 'PRESS', href: '/press' },
      ],
    },
    {
      links: [
        { text: 'NIKLAS OUTLET', href: '/niklas-outlet' },
        { text: 'SITE MAP', href: '/site-map' },
        { text: 'SUSTAINABILITY', href: '/hallbarhet' },
      ],
    },
    {
      links: [
        { text: 'GIFT CARD', href: '/presentkupong' },
        { text: 'STORES', href: '/butiker' },
      ],
    },
  ],
  socials: [
    { platform: 'INSTAGRAM', href: 'https://instagram.com' },
    { platform: 'FACEBOOK', href: 'https://facebook.com' },
    { platform: 'YOUTUBE', href: 'https://youtube.com' },
    { platform: 'X', href: 'https://x.com' },
    { platform: 'TIKTOK', href: 'https://tiktok.com' },
    { platform: 'SPOTIFY', href: 'https://spotify.com' },
    { platform: 'PINTEREST', href: 'https://pinterest.com' },
    {
      platform: 'LINKEDIN',
      href: 'https://linkedin.com/company',
    },
  ],

  // copyright: `${getCurrentYear()} - Designed by Nikas`,
};

function Footer() {
  return (
    <footer className='text-black'>
      <FooterLinks data={footerData} />
    </footer>
  );
}

export default Footer;
