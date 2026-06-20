import type {SVGProps} from 'react';

export default function GridIcon(props: SVGProps<SVGSVGElement>) {
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
        d='M14 14H2V2h12zM3 8.5V13h4.5V8.5zm5.5 0V13H13V8.5zM3 7.5h4.5V3H3zm5.5 0H13V3H8.5z'
        clipRule='evenodd'
      />
    </svg>
  );
}
