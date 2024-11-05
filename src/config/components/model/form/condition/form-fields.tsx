import { FormControlLabel, IconButton, Radio, RadioGroup, Tooltip } from '@mui/material';
import { produce } from 'immer';
import { FC, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { fieldDisplayModeState, fieldsState } from '../../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import { FormPlaceholder } from './form-placeholder';
import { RecoilFieldSelect, useRecoilRow } from '@konomi-app/kintone-utilities-react';
import { appFieldsState } from '@/config/states/kintone';

const Component: FC = () => {
  const fields = useRecoilValue(fieldsState);
  const displayMode = useRecoilValue(fieldDisplayModeState);
  const { addRow, deleteRow } = useRecoilRow({ state: fieldsState, getNewRow: () => '' });

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
              <RecoilFieldSelect
                state={appFieldsState}
                fieldCode={field}
                onChange={(e) => onFieldsChange(i, e)}
              />
              <Tooltip title='フィールドを追加する'>
                <IconButton size='small' onClick={() => addRow(i)}>
                  <AddIcon fontSize='small' />
                </IconButton>
              </Tooltip>
              <Tooltip title='このフィールドを削除する'>
                <IconButton size='small' onClick={() => deleteRow(i)}>
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
