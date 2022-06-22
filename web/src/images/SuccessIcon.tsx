import { SVGProps } from 'react';

export const SuccessIcon = (props: SVGProps<SVGSVGElement>) => (
    <svg width={70} height={70} fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
        <path
            d="M35 0C15.672 0 0 15.672 0 35s15.672 35 35 35 35-15.672 35-35S54.328 0 35 0Zm15.117 23.57L33.664 46.383a2.484 2.484 0 0 1-4.039 0l-9.742-13.5a.627.627 0 0 1 .508-.992h3.664c.797 0 1.554.382 2.023 1.039l5.563 7.718 12.28-17.03a2.498 2.498 0 0 1 2.024-1.04h3.664c.508 0 .805.578.508.992Z"
            fill="#1491BD"
        />
    </svg>
);
