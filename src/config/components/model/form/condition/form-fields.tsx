import { appFieldsAtom } from '@/config/states/kintone';
import { DisplayMode } from '@/lib/plugin';
import { JotaiFieldSelect, useArray } from '@konomi-app/kintone-utilities-jotai';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import { FormControlLabel, IconButton, Radio, RadioGroup, Tooltip } from '@mui/material';
import { produce } from 'immer';
import { useAtomValue } from 'jotai';
import { useAtomCallback } from 'jotai/utils';
import { FC, memo, Suspense, useCallback } from 'react';
import { fieldDisplayModeState, fieldsState } from '../../../../states/plugin';
import { FormPlaceholder } from './form-placeholder';

const Component: FC = () => {
  const fields = useAtomValue(fieldsState);
  const displayMode = useAtomValue(fieldDisplayModeState);
  const { addItem, deleteItem } = useArray(fieldsState);

  const onDisplayModeChange = useAtomCallback(
    useCallback((_, set, __: any, value: string) => {
      set(fieldDisplayModeState, value as DisplayMode);
    }, [])
  );

  const onFieldsChange = useAtomCallback(
    useCallback((_, set, i: number, value: string) => {
      set(fieldsState, (current) =>
        produce(current, (draft) => {
          draft[i] = value;
        })
      );
    }, [])
  );

  return (
    <div className='grid gap-2'>
      <div>
        <RadioGroup defaultValue='sub' row value={displayMode} onChange={onDisplayModeChange}>
          <FormControlLabel value='add' control={<Radio />} label='指定したフィールドだけ表示' />
          <FormControlLabel value='sub' control={<Radio />} label='指定したフィールドを非表示' />
        </RadioGroup>
      </div>
      <div>
        <h3>{displayMode === 'add' ? '表示する' : '表示しない'}フィールド</h3>
        <div className='grid gap-4'>
          {fields.map((field, i) => (
            <div key={i} className='flex gap-2 items-center'>
              <JotaiFieldSelect
                fieldPropertiesAtom={appFieldsAtom}
                fieldCode={field}
                onChange={(e) => onFieldsChange(i, e)}
              />
              <Tooltip title='フィールドを追加する'>
                <IconButton size='small' onClick={() => addItem({ index: i + 1, newItem: '' })}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              {fields.length > 1 && (
                <Tooltip title='このフィールドを削除する'>
                  <IconButton size='small' onClick={() => deleteItem(i)}>
                    <DeleteIcon fontSize='small' />
                  </IconButton>
                </Tooltip>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Container: FC = (props) => (
  <Suspense fallback={<FormPlaceholder />}>
    <Component {...props} />
  </Suspense>
);

export default memo(Container);
