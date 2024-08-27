import React, { useEffect, useState } from 'react';
import { create } from 'ipfs-http-client';
import { Center, Loader } from '@mantine/core';

const ipfs = create({ url: 'https://file.omnimuse.ai' });

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
    const [imageUrl, setImageUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchImageAsBase64 = async (cid: string) => {
      const chunks = [];
      for await (const chunk of ipfs.cat(cid)) {
        chunks.push(chunk);
      }
      return Buffer.concat(chunks);
    };
    const imageToBase64 = async (cid: string) => {
      const imageBuffer = await fetchImageAsBase64(cid);
      return imageBuffer.toString('base64');
    };

    useEffect(() => {
      // if (loading) return;
      setImageUrl(`https://u38213-bc4a-7f5ec89f.westc.gpuhub.com:8443/ipfs/${cid}`);
      // setImageUrl(`https://file.omnimuse.ai/ipfs/${cid}`)
      // setLoading(true);
      // imageToBase64(cid)
      //   .then((base64) => {
      //     const baseStr = `data:image/jpeg;base64,${base64}`;
      //     setImageUrl(baseStr);
      //   })
      //   .finally(() => {
      //     setLoading(false);
      //   });
    }, [cid, onError, ref]);

    return (
      <div className="size-full flex items-center justify-center" style={{ height: '100%' }}>
        {imageUrl ? (
          <img
            ref={ref}
            src={imageUrl}
            alt="IPFS Image"
            className={className}
            onLoad={onLoad}
            style={style}
            {...imgProps}
            alt=""
          />
        ) : (
          <Center p="xl" style={{ height: '100%' }}>
            <Loader />
          </Center>
        )}
      </div>
    );
  }
);

// Setting the display name for the component
IPFSImage.displayName = 'IPFSImage';

export default IPFSImage;
