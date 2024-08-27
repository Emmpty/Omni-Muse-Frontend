/* eslint-disable @next/next/no-img-element */
import { Box, BoxProps, createStyles, keyframes } from '@mantine/core';
import { useLocalStorage } from '@mantine/hooks';
import { useMemo } from 'react';

export function Logo({ ...props }: LogoProps) {
  const { classes, cx } = useStyles();
  const [showHoliday] = useLocalStorage({ key: 'showDecorations', defaultValue: true });
  const holiday = useMemo(() => {
    if (!showHoliday) return null;

    const month = new Date().getMonth();
    const day = new Date().getDate();

    // Halloween
    if (new Date().getMonth() === 9) return 'halloween';

    // Christmas
    if ((month === 10 && day >= 22) || (month === 11 && day <= 25)) return 'christmas';

    // New Year
    if (month === 11 && day >= 26) return 'newyear';
    if (month === 2 && day >= 14 && day <= 17) return 'stpatty';

    return null;
  }, [showHoliday]);

  const holidayClass = holiday ? classes[holiday] : null;

  return (
    <Box className={cx(classes.root, holidayClass)} {...props}>
      {holiday === 'halloween' && (
        <img src="/images/holiday/ghost.png" alt="ghost" className={classes.flyOver} />
      )}
      {holiday === 'christmas' && (
        <>
          <img src="/images/holiday/santa-hat.png" alt="santa hat" className={classes.hat} />
          <div className={classes.deer}>
            <img src="/images/holiday/deer.png" alt="deer" id="deer" />
            <img src="/images/holiday/deer-nose.png" alt="deer nose" id="nose" />
            <img src="/images/holiday/deer-glow.png" alt="deer glow" id="glow" />
          </div>
        </>
      )}
      <img src="/images/logo.png" alt="santa hat" className={'h-[38px]'} />
    </Box>
  );
}

type LogoProps = {
  size?: 'sm' | 'md' | 'lg' | 'xl';
} & BoxProps;

const useStyles = createStyles((theme, _, getRef) => ({
  root: {
    position: 'relative',
    [theme.fn.smallerThan('sm')]: {
      height: 45,
      width: 45,
    },
  },
  svg: {
    ref: getRef('svg'),
    height: 30,
    [theme.fn.smallerThan('sm')]: {
      height: 45,
    },
  },
  c: {
    ref: getRef('c'),
    fill: theme.colorScheme === 'dark' ? theme.colors.dark[0] : '#222',
  },

  ivit: {
    ref: getRef('ivit'),
    fill: theme.colorScheme === 'dark' ? theme.colors.dark[0] : '#222',
  },

  ai: {
    ref: getRef('ai'),
    fill: theme.colors.blue[8],
  },

  accent: {
    ref: getRef('accent'),
    fill: theme.colors.blue[8],
  },

  text: {
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  badge: {
    ref: getRef('badge'),
    [theme.fn.largerThan('sm')]: {
      display: 'none',
    },
  },

  liveNow: {
    position: 'absolute',
    bottom: -13,
    left: '50%',
    transform: 'translateX(-50%)',
    zIndex: 3,
    background: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[1],
    [theme.fn.smallerThan('sm')]: {
      bottom: -7,
    },
  },

  flyOver: {
    ref: getRef('flyOver'),
    position: 'absolute',
    height: 45,
    [theme.fn.smallerThan('sm')]: {
      height: 40,
    },
  },

  deer: {
    ref: getRef('deer'),
    position: 'absolute',
    height: 60,
    width: 60,
    zIndex: 3,

    img: {
      position: 'absolute',
      height: '100%',

      '&#deer': {},
      '&#nose': {
        zIndex: 2,
      },
      '&#glow': {
        opacity: 0,
        zIndex: 1,
        animation: `${twinkle} 1s ease infinite`,
      },
    },

    [theme.fn.smallerThan('sm')]: {
      height: 40,
      width: 40,
    },
  },

  hat: {
    position: 'absolute',
    height: 25,
    left: 0,
    top: 0,
    transform: 'rotate(-20deg) translate(-14%, -75%)',
    zIndex: 3,
    [theme.fn.smallerThan('sm')]: {
      display: 'none',
    },
  },

  halloween: {
    [`.${getRef('ai')}`]: {
      fill: theme.colors.orange[6],
    },
    [`.${getRef('accent')}`]: {
      fill: theme.colors.orange[6],
    },
    [`.${getRef('svg')}`]: {
      position: 'relative',
      zIndex: 2,
    },
    [`.${getRef('flyOver')}`]: {
      zIndex: 3,
      animation: `${flyOver} 8s 4s ease`,
      opacity: 0,
      [theme.fn.smallerThan('sm')]: {
        transform: 'rotate(20deg)',
        animation: `${peekOut} 5s ease infinite alternate`,
        zIndex: 1,
      },
    },
  },

  christmas: {
    [`.${getRef('ai')}`]: {
      fill: theme.colors.red[8],
    },
    [`.${getRef('accent')}`]: {
      fill: theme.colors.red[8],
    },
    [`.${getRef('svg')}`]: {
      position: 'relative',
      zIndex: 2,
    },
    [`.${getRef('deer')}`]: {
      zIndex: 3,
      animation: `${prance} 3s 4s linear`,
      opacity: 0,
      [theme.fn.smallerThan('sm')]: {
        transform: 'rotate(-20deg)',
        animation: `${peekOutDeer} 5s ease infinite alternate`,
        zIndex: 1,
      },
    },
  },

  newyear: {},
  stpatty: {
    [`.${getRef('ai')}`]: {
      fill: theme.colors.green[8],
    },
    [`.${getRef('accent')}`]: {
      fill: theme.colors.green[8],
    },
  },
}));

const flyOver = keyframes({
  '0%': {
    top: 5,
    left: '-10%',
    opacity: 0,
    transform: 'scale(0.5) rotate(0deg)',
  },
  '15%': {
    top: -10,
    left: '5%',
    opacity: 1,
    transform: 'scale(1) rotate(2deg)',
  },
  '30%': {
    top: 0,
    left: '70%',
    opacity: 0.8,
    transform: 'scale(1) rotate(15deg)',
  },
  ['40%, 100%']: {
    top: -5,
    left: '70%',
    opacity: 0,
    transform: 'scale(0.5) rotate(-10deg)',
  },
});

const prance = keyframes({
  '0%': {
    top: 0,
    left: '-20%',
    opacity: 0,
    transform: 'scale(0.5) rotate(-15deg)',
  },
  '15%': {
    top: -25,
    left: '0%',
    opacity: 1,
    transform: 'scale(1) rotate(-15deg)',
  },
  '50%': {
    top: -40,
    left: '30%',
    opacity: 1,
    transform: 'scale(1) rotate(0deg)',
  },
  '85%': {
    top: -25,
    left: '70%',
    opacity: 0.8,
    transform: 'scale(1) rotate(15deg)',
  },
  '100%': {
    top: 0,
    left: '80%',
    opacity: 0,
    transform: 'scale(0.5) rotate(15deg)',
  },
});

const twinkle = keyframes({
  '0%': {
    opacity: 0,
  },
  '50%': {
    opacity: 1,
  },
  '100%': {
    opacity: 0,
  },
});

const peekOut = keyframes({
  '0%': {
    top: 5,
    right: 10,
    opacity: 0,
    transform: 'scale(0.5) rotate(0deg)',
  },
  '30%': {
    top: -12,
    right: -12,
    opacity: 1,
    transform: 'scale(1) rotate(40deg)',
  },
  '60%': {
    top: -12,
    right: -12,
    opacity: 1,
    transform: 'scale(1) rotate(40deg)',
  },
  '100%': {
    top: 5,
    right: 10,
    opacity: 0,
    transform: 'scale(0.5) rotate(0deg)',
  },
});

const peekOutDeer = keyframes({
  '0%': {
    top: 0,
    right: 0,
    opacity: 0,
    transform: 'scale(0.5)',
  },
  '60%': {
    top: -10,
    right: -12,
    opacity: 1,
    transform: 'scale(1)',
  },
  '100%': {
    top: 0,
    right: 0,
    opacity: 0,
    transform: 'scale(0.5)',
  },
});
