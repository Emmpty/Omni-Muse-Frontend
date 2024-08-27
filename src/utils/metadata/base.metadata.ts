

type MetadataProcessor = {
  canParse: (exif: Record<string, any>) => boolean;
  parse: (exif: Record<string, any>) => any;
  encode: (meta: any) => string;
};

export function createMetadataProcessor(processor: MetadataProcessor) {
  return processor;
}

export type SDResource = {
  type: string;
  name: string;
  weight?: number;
  hash?: string;
};
