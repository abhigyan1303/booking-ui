// Footer.tsx
import React from 'react';
import '../scss/Footer.scss';

const Footer: React.FC = () => (
  <footer className="app-footer">
    <div className="footer-content">
      <ul className="footer-links">
        <li><a href="/privacy">Privacy</a></li>
        <li><a href="/terms">Terms</a></li>
        <li><a href="/contact">Contact</a></li>
      </ul>
    </div>
  </footer>
);

export default Footer;