import * as bcrypt from 'bcrypt';

/**
 * 加密
 * @param password 密码铭文
 * @param salt 盐
 * @returns 加密后的hash
 */
export const crypt = async (password: string, salt?: string) => {
  // const saltOrRounds = 10;
  let saltOrRounds;
  if (salt) {
    saltOrRounds = salt;
  } else {
    saltOrRounds = await bcrypt.genSalt();
  }
  const hash = await bcrypt.hash(password, saltOrRounds);
  return hash;
};

/**
 * 对比密文
 * @param password 密码
 * @param hash 数据库的密文
 * @returns 是否匹配
 */
export const comparePassword = async (password: string, hash: string) => {
  const isMatch = await bcrypt.compare(password, hash);
  return isMatch;
};
