'use client';

import Link from 'next/link';
import Image from 'next/image';

import css from './CompanyLogo.module.css';

//===============================================================

function CompanyLogo() {
  return (
    <Link href="/" className={css.companyLogo} aria-label="Go to Home">
      <Image
        src="/company-logo.svg"
        alt="TravelTrucks"
        width={136}
        height={16}
        priority
      />
    </Link>
  );
}

export default CompanyLogo;
