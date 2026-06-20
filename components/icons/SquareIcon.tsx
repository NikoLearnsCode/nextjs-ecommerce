import type {SVGProps} from 'react';

export default function SquareIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns='http://www.w3.org/2000/svg'
      fill='currentColor'
      viewBox='2 2 12 12'
      aria-hidden='true'
      {...props}
    >
      <path
        fillRule='evenodd'
        d='M14 14H2V2h12zM3 13h10V3H3z'
        clipRule='evenodd'
      />
    </svg>
  );
}
