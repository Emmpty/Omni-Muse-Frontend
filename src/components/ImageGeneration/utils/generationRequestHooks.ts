export const useGetGenerationRequests = (
  input?: GetGenerationRequestsInput,
  options?: { enabled?: boolean; onError?: (err: unknown) => void }
) => {
  return { data: [], requests: [], images: [] };
};

export const useUpdateGenerationRequests = () => {};

export const usePollGenerationRequests = (requestsInput: Generation.Request[] = []) => {};

export const useCreateGenerationRequest = () => {};

export const useDeleteGenerationRequest = () => {};

// const bulkDeleteImagesMutation = trpc.generation.bulkDeleteImages.useMutation;
export const useDeleteGenerationRequestImages = () => {};

const unmatchedSignals: Record<string, Generation.ImageStatus> = {};

export const useImageGenStatusUpdate = () => {};
