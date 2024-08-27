import extractChunks from 'png-chunks-extract';
import chunkText from 'png-chunk-text';
import { asyncFileReaderAsDataURL, getStealthExif } from './utils';

export const inspectImage = async (file) => {
  return readFileInfo(file);
};

const extractMetadata = async (file) => {
  const buf = await file.arrayBuffer();
  let chunks = [];
  try {
    chunks = extractChunks(new Uint8Array(buf));
  } catch (err) {
    return chunks;
  }
  const textChunks = chunks
    .filter(function (chunk) {
      return chunk.name === 'tEXt' || chunk.name === 'iTXt';
    })
    .map(function (chunk) {
      if (chunk.name === 'iTXt') {
        let data = chunk.data.filter((x) => x != 0x0);
        let header = new TextDecoder().decode(data.slice(0, 11));
        if (header == 'Description') {
          data = data.slice(11);
          let txt = new TextDecoder().decode(data);
          return {
            keyword: 'Description',
            text: txt,
          };
        } else {
          let txt = new TextDecoder().decode(data);
          return {
            keyword: 'Unknown',
            text: txt,
          };
        }
      } else {
        return chunkText.decode(chunk.data);
      }
    });
  return textChunks;
};

async function readFileInfo(file) {
  let metadata = await extractMetadata(file);
  if (metadata.length == 0) {
    const src = await asyncFileReaderAsDataURL(file);
    let exif = await getStealthExif(src);
    if (!exif) {
      return false;
    }
  }
  return true;
}
