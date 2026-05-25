'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { href: '/employees', label: 'Employees' },
  { href: '/insights', label: 'Salary insights' },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="site-nav">
      <Link href="/employees" className="site-nav__brand">
        Salary Management
      </Link>
      <ul className="site-nav__links">
        {links.map(({ href, label }) => (
          <li key={href}>
            <Link
              href={href}
              className={
                pathname === href || pathname.startsWith(`${href}/`)
                  ? 'site-nav__link site-nav__link--active'
                  : 'site-nav__link'
              }
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
