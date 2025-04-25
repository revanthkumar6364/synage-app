import { SVGAttributes } from 'react';

export default function AppLogoIcon(props: SVGAttributes<SVGElement>) {
    return (
        <img src="/images/small-logo.png" alt="RadiantSynage" className="h-8 w-auto" {...props} />
    );
}
