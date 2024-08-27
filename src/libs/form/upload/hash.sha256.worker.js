import CryptoJs from 'crypto-js';
import encHex from 'crypto-js/enc-hex';

// 全量 Hash
self.postHashMsg = (fileChunkList) => {
  // const spark = new SparkMD5.ArrayBuffer();
  let count = 0;

  const loadNext = (index) => {
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileChunkList[index].chunk);

    reader.onload = (e) => {
      count++;

      const alog = CryptoJs.algo.SHA256.create(); //  CryptoJs.algo.MD5.create()),
      alog.update(CryptoJs.lib.WordArray.create(e.target.result));
      console.log('sha256 ---');
      // hashFile(e.target.result, alog);
      if (count === fileChunkList.length) {
        self.postMessage({
          hash: encHex.stringify(alog.finalize()),
        });
        self.close();
      } else {
        // 递归计算下一个切片
        loadNext(count);
      }
    };
  };
  loadNext(0);
};

self.onmessage = (e) => {
  const { fileChunkList, type } = e.data;

  if (type === 'HASH') {
    postHashMsg(fileChunkList);
  }
};
