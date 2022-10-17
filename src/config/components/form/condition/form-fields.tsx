import styled from '@emotion/styled';
import { FormControlLabel, IconButton, Radio, RadioGroup, Tooltip } from '@mui/material';
import produce from 'immer';
import React, { FCX } from 'react';
import { useRecoilCallback, useRecoilValue } from 'recoil';
import { fieldDisplayModeState, fieldsState } from '../../../states/plugin';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

import FieldPropertiesSelect from './field-properties-select';

type Props = { conditionIndex: number };

const Component: FCX<Props> = ({ className, conditionIndex }) => {
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
    <section className={className}>
      <h3>フィールドの設定</h3>
      <div className='form'>
        <div className='left'>
          <RadioGroup defaultValue='sub' value={displayMode} onChange={onDisplayModeChange}>
            <FormControlLabel value='add' control={<Radio />} label='指定したフィールドだけ表示' />
            <FormControlLabel value='sub' control={<Radio />} label='指定したフィールドを非表示' />
          </RadioGroup>
        </div>
        <div className='right'>
          <h3>{displayMode === 'add' ? '表示する' : '表示しない'}フィールド</h3>
          <div className='rows'>
            {fields.map((field, i) => (
              <div key={i}>
                <FieldPropertiesSelect
                  label='フィールドコード'
                  value={field}
                  onChange={(e) => onFieldsChange(i, e.target.value)}
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
    </section>
  );
};

const StyledComponent = styled(Component)`
  border-left: 2px solid #0003;
  padding: 8px 8px 8px 16px;

  .form {
    display: flex;
    flex-direction: row;
    gap: 16px;

    .left {
      flex-basis: 350px;
    }
    .right {
      flex: 1;
    }
  }
`;

export default StyledComponent;
