import { Card, createStyles } from '@mantine/core';
export function HDImage({ src = '', style = {}, hover = true, ...props }: any) {
  const { classes, cx } = useStyles();
  return (
    <div
      className={cx(classes.image, { hover })}
      style={{
        backgroundImage: `url(https://u38213-bc4a-7f5ec89f.westc.gpuhub.com:8443/ipfs/${src})`,
        ...style,
      }}
      {...props}
    ></div>
    // <img
    //   className="image"
    //   style={style}
    //   src={'https://app.omnimuse.ai/ipfs/' + src}
    // />
  );
}

const useStyles = createStyles(() => ({
  image: {
    width: '100%',
    height: '100%',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    cursor: 'pointer',
    transition: 'all 0.5s',

    '&.hover:hover': {
      transition: 'all 0.5s',
      transform: 'scale(1.1)',
    },
  },
}));
