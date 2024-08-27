import { AspectRatio, Card, CardProps, createStyles } from '@mantine/core';
import Link from 'next/link';
import React, { forwardRef } from 'react';

type AspectRatio = 'portrait' | 'landscape' | 'square' | 'flat' | 'listItem' | 'enterItem';
const aspectRatioValues: Record<
  AspectRatio,
  { ratio: number; height: number; cssRatio: number; stringRatio: string }
> = {
  portrait: {
    ratio: 7 / 9,
    height: 430,
    // CSS Ratio should be opposite to ratio as it will rely on width.
    cssRatio: 9 / 7,
    stringRatio: '7/9',
  },
  landscape: {
    ratio: 9 / 7,
    height: 300,
    cssRatio: 7 / 9,
    stringRatio: '9/7',
  },
  flat: {
    ratio: 15 / 7,
    height: 300,
    cssRatio: 7 / 15,
    stringRatio: '15/7',
  },
  square: {
    ratio: 1,
    height: 332,
    cssRatio: 1,
    stringRatio: '1',
  },
  listItem: {
    ratio: 1,
    height: 332,
    cssRatio: 1,
    stringRatio: 1 / 0.48,
  },
  enterItem: {
    ratio: 7 / 11.56,
    height: 516,
    cssRatio: 9 / 7,
    stringRatio: '7/ 11.56',
  },
};

const useStyles = createStyles((theme) => {
  return {
    root: {
      padding: '0 !important',
      color: 'white',
      // borderRadius: theme.radius.md,
      cursor: 'pointer',
      position: 'relative',
      overflow: 'hidden',
      backgroundColor: 'rgba(43, 45, 48, 0.50)',
      border: '1px solid #2B2D30',
      borderRadius: '8px',
    },
  };
});

export const FeedCard = forwardRef<HTMLAnchorElement, Props>(
  (
    {
      href,
      children,
      aspectRatio = 'portrait',
      className,
      useCSSAspectRatio,
      cardDecoration,
      inViewOptions,
      ...props
    },
    ref
  ) => {
    const { stringRatio } = aspectRatioValues[aspectRatio];
    const { classes, cx } = useStyles();

    // const {ref, inView} = useInView(inViewOptions)

    const card = (
      <Card<'a'>
        className={cx(classes.root, className)}
        {...props}
        component={href ? 'a' : undefined}
        ref={ref}
        style={{ aspectRatio: stringRatio }}
      >
        {children}
      </Card>
    );

    return href ? (
      <Link href={href} passHref>
        {card}
      </Link>
    ) : (
      card
    );
  }
);

FeedCard.displayName = 'FeedCard';

type Props = CardProps & {
  children: React.ReactNode;
  href?: string;
  aspectRatio?: AspectRatio;
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
  useCSSAspectRatio?: boolean;
  cardDecoration?: any;
  inViewOptions?: any;
};
