import { FormControlLabel, IconButton, Radio, RadioGroup, Skeleton, Tooltip } from '@mui/material';
import { produce } from 'immer';
import React, { FC, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { fieldDisplayModeState, fieldsState } from '../../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { FormPlaceholder } from './form-placeholder';
import { RecoilFieldSelect } from '@konomi-app/kintone-utilities-react';
import { appFieldsState } from '@/config/states/kintone';

const Component: FC = () => {
  const fields = useRecoilValue(fieldsState);
  const displayMode = useRecoilValue(fieldDisplayModeState);

  const onDisplayModeChange = useRecoilCallback(
    ({ set }) =>
      (_: any, value: string) => {
        set(fieldDisplayModeState, value as Plugin.DisplayMode);
      },
    []
  );

  const onFieldsChange = useRecoilCallback(
    ({ set }) =>
      (i: number, value: string) => {
        set(fieldsState, (current) =>
          produce(current, (draft) => {
            draft[i] = value;
          })
        );
      },
    []
  );

  const addLabel = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(fieldsState, (current) =>
          produce(current, (draft) => {
            draft.splice(i + 1, 0, '');
          })
        ),
    []
  );
  const removeLabel = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(fieldsState, (current) =>
          produce(current, (draft) => {
            if (draft.length === 1) {
              draft[0] = '';
            } else {
              draft.splice(i, 1);
            }
          })
        ),
    []
  );

  return (
    <div className='grid grid-cols-[300px_1fr]'>
      <div>
        <RadioGroup defaultValue='sub' value={displayMode} onChange={onDisplayModeChange}>
          <FormControlLabel value='add' control={<Radio />} label='指定したフィールドだけ表示' />
          <FormControlLabel value='sub' control={<Radio />} label='指定したフィールドを非表示' />
        </RadioGroup>
      </div>
      <div>
        <h3>{displayMode === 'add' ? '表示する' : '表示しない'}フィールド</h3>
        <div className='grid gap-4'>
          {fields.map((field, i) => (
            <div key={i} className='flex gap-2 items-center'>
              <RecoilFieldSelect
                state={appFieldsState}
                fieldCode={field}
                onChange={(e) => onFieldsChange(i, e)}
              />
              <Tooltip title='フィールドを追加する'>
                <IconButton size='small' onClick={() => addLabel(i)}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='このフィールドを削除する'>
                <IconButton size='small' onClick={() => removeLabel(i)}>
                  <DeleteIcon fontSize='small' />
                </IconButton>
              </Tooltip>
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
