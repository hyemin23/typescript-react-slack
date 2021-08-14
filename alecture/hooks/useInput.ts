import { useState, useCallback, Dispatch, SetStateAction } from 'react';

type ReturnTypes<T = any> = [T, (e: any) => void, Dispatch<SetStateAction<T>>];
// 들어오는 type return type 설정
const useInput = <T = any>(initData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initData);
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  return [value, handler, setValue];
};

export default useInput;
