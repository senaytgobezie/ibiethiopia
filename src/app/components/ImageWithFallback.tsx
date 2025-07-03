'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageWithFallbackProps {
    src: string;
    fallbackSrc: string;
    alt: string;
    fill?: boolean;
    sizes?: string;
    priority?: boolean;
    style?: React.CSSProperties;
    width?: number;
    height?: number;
}

export default function ImageWithFallback({
    src,
    fallbackSrc,
    alt,
    fill = false,
    sizes,
    priority = false,
    style,
    width,
    height
}: ImageWithFallbackProps) {
    const [imgSrc, setImgSrc] = useState(src);

    return (
        <Image
            src={imgSrc}
            alt={alt}
            fill={fill}
            sizes={sizes}
            priority={priority}
            style={style}
            width={width}
            height={height}
            onError={() => {
                setImgSrc(fallbackSrc);
            }}
        />
    );
} 