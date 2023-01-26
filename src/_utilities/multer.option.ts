import * as multer from 'multer';
import * as path from 'path';
import * as fs from 'fs';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';

// multer reference: https://github.com/expressjs/multer
// nestjs docs reference: https://docs.nestjs.com/techniques/file-upload
const createFolder = (folder: string) => {
  try {
    // nodejs path reference: https://nodejs.org/api/path.html#pathextnamepath
    console.log('💾 Create a root uploads folder...');
    // 폴더 만들기
    fs.mkdirSync(path.join(__dirname, '..', `uploads`));
  } catch (error) {
    console.log('The folder already exists...');
  }
  try {
    console.log(`💾 Create a ${folder} to uploads folder...`);
    fs.mkdirSync(path.join(__dirname, '..', `uploads/${folder}`));
  } catch (error) {
    console.log(`The folder name:${folder} is already exists!`);
  }
};

const storage = (folder: string): multer.StorageEngine => {
  createFolder(folder);
  return multer.diskStorage({
    // 저장할 위치
    destination(req, file, cb) {
      const folderName = path.join(__dirname, '..', `uploads/${folder}`);
      cb(null, folderName);
    },
    // 저장할 파일 이름
    filename(req, file, cb) {
      // 확장자명 가지고 오기
      const ext = path.extname(file.originalname);
      // 찐 파일 이름
      const fileName = `${path.basename(
        file.originalname,
        ext,
      )}${Date.now()}${ext}`;

      cb(null, fileName);
    },
  });
};

// 파라미터 folder: 사진을 업로드할 폴더 경로를 파라미터로 받는다
export const multerOptions = (folder: string) => {
  const result: MulterOptions = {
    storage: storage(folder),
  };
  return result;
};
