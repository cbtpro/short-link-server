// Copyright 2023 Peter Chen
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// 散列加密不可逆，所以建议使用bcrypt进行密码密码，
// 登录时通过bcrypt.compare进行密文对比，对比通过就可以正常登录
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
