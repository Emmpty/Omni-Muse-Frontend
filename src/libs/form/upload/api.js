// 验证文件是否存在
const VERIFY_FILE_API = 'https://u38213-bc4a-7f5ec89f.westc.gpuhub.com:8443/6060/file/prepare';
// 普通上传接口
const UPLOAD_SINGLE_FILE_API =
  'https://u38213-bc4a-7f5ec89f.westc.gpuhub.com:8443/6060/file/uploadSingle';
// 切片上传接口
const UPLOAD_CHUNK_FILE_API =
  'https://u38213-bc4a-7f5ec89f.westc.gpuhub.com:8443/6060/file/uploadChunk';

// 获取上传文件的cid
const GET_CHUNK_FILE_CID =
  'https://u38213-bc4a-7f5ec89f.westc.gpuhub.com:8443/6060/file/check_result';

export { VERIFY_FILE_API, UPLOAD_SINGLE_FILE_API, UPLOAD_CHUNK_FILE_API, GET_CHUNK_FILE_CID };
