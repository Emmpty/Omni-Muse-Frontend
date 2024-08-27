import React from 'react';

type IPFSImageProps = {
  cid: string;
  className?: string;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  style?: React.CSSProperties;
  [key: string]: any;
};

const IPFSImage = React.forwardRef<HTMLImageElement, IPFSImageProps>(
  ({ cid, className, onLoad, onError, style, ...imgProps }, ref) => {
    return (
      <div style={{ width: '100%', height: 'auto' }}>
        <img
          ref={ref}
          src={'https://file.omnimuse.ai/ipfs/' + cid}
          alt="IPFS Image"
          className={className}
          onLoad={onLoad}
          style={style}
          {...imgProps}
        />
      </div>
    );
  }
);

export default IPFSImage;
