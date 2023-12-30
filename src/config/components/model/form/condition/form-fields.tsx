import { FormControlLabel, IconButton, Radio, RadioGroup, Skeleton, Tooltip } from '@mui/material';
import { produce } from 'immer';
import React, { FC, FCX, memo, Suspense } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { fieldDisplayModeState, fieldsState } from '../../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import FieldPropertiesSelect from './field-properties-select';
import { useConditionIndex } from '../../../condition-index-provider';
import { FormPlaceholder } from './form-placeholder';

const Component: FCX = ({ className }) => {
  const conditionIndex = useConditionIndex();
  const fields = useRecoilValue(fieldsState(conditionIndex));
  const displayMode = useRecoilValue(fieldDisplayModeState(conditionIndex));

  const onDisplayModeChange = useRecoilCallback(
    ({ set }) =>
      (_: any, value: string) => {
        set(fieldDisplayModeState(conditionIndex), value as kintone.plugin.DisplayMode);
      },
    [conditionIndex]
  );

  const onFieldsChange = useRecoilCallback(
    ({ set }) =>
      (i: number, value: string) => {
        set(fieldsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft[i] = value;
          })
        );
      },
    [conditionIndex]
  );

  const addLabel = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(fieldsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            draft.splice(i + 1, 0, '');
          })
        ),
    [conditionIndex]
  );
  const removeLabel = useRecoilCallback(
    ({ set }) =>
      (i: number) =>
        set(fieldsState(conditionIndex), (current) =>
          produce(current, (draft) => {
            if (draft.length === 1) {
              draft[0] = '';
            } else {
              draft.splice(i, 1);
            }
          })
        ),
    [conditionIndex]
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
              <FieldPropertiesSelect fieldCode={field} onChange={(e) => onFieldsChange(i, e)} />
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
