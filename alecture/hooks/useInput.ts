import { useState, useCallback, Dispatch, SetStateAction, ChangeEvent } from 'react';

type ReturnTypes<T> = [T, (e: ChangeEvent<HTMLInputElement>) => void, Dispatch<SetStateAction<T>>];
// 들어오는 type return type 설정
const useInput = <T>(initData: T): ReturnTypes<T> => {
  const [value, setValue] = useState(initData);
  const handler = useCallback((e) => {
    setValue(e.target.value);
  }, []);
  // useInput(value) : value 가 T가 되는것이고
  // return 할 때 value,handler,setValue 들을 각각 자리에 맞춰 원하는 이름으로 받으면 된다.
  return [value, handler, setValue];
};

export default useInput;
